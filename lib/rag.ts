import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type ChatRole = "user" | "assistant";

export interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}

export interface ChatSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
  chunkIndex: number;
  topics: string[];
}

let pinecone: Pinecone | null = null;
let embeddingModel: any = null;
const chatModelCache = new Map<string, any>();
let cachedModelList: string[] | null = null;
let cachedModelListAt = 0;
const modelListCacheTtlMs = 1000 * 60 * 10;

const indexName = process.env.PINECONE_INDEX || "devverse-articles";

function getPineconeClient() {
  if (!pinecone) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is not configured");
    }
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pinecone;
}

function getEmbeddingModel() {
  if (!embeddingModel) {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    embeddingModel = genAI.getGenerativeModel({
      model: "models/text-embedding-004",
    });
  }
  return embeddingModel;
}

function getChatModel(modelName: string) {
  const cached = chatModelCache.get(modelName);
  if (cached) {
    return cached;
  }
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
    },
  });
  chatModelCache.set(modelName, model);
  return model;
}

async function fetchAvailableChatModels(): Promise<string[]> {
  const now = Date.now();
  if (cachedModelList && now - cachedModelListAt < modelListCacheTtlMs) {
    return cachedModelList;
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_AI_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to list models: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    models?: { name?: string; supportedGenerationMethods?: string[] }[];
  };
  const models =
    data.models
      ?.filter((model) =>
        Array.isArray(model.supportedGenerationMethods)
          ? model.supportedGenerationMethods.includes("generateContent")
          : true,
      )
      .map((model) => model?.name)
      .filter((name): name is string => Boolean(name))
      .filter((name) => name.includes("gemini"))
      .filter((name) => !name.includes("embedding"))
      .filter((name) => !name.includes("pro")) ?? [];

  if (!models.length) {
    throw new Error("No suitable Gemini chat models found.");
  }

  cachedModelList = models;
  cachedModelListAt = now;
  return models;
}

async function generateWithModelRotation(prompt: string) {
  const models = await fetchAvailableChatModels();
  let lastError: unknown = null;

  for (const modelName of models) {
    try {
      const model = getChatModel(modelName);
      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      console.warn(`Gemini model failed (${modelName}):`, error);
      lastError = error;
    }
  }

  throw lastError ?? new Error("All Gemini models failed to generate content.");
}

async function getEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingModel();
  const embedResp = await model.embedContent(text);
  if (
    !embedResp ||
    !embedResp.embedding ||
    !Array.isArray(embedResp.embedding.values)
  ) {
    throw new Error("Invalid embedding response format.");
  }
  return embedResp.embedding.values;
}

export async function retrieveSources(
  query: string,
  limit: number = 6,
): Promise<ChatSource[]> {
  const client = getPineconeClient();
  const index = client.index(indexName);

  const queryEmbedding = await getEmbedding(query);
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: limit,
    includeMetadata: true,
  });

  return queryResponse.matches.map((match) => {
    const metadata = (match.metadata || {}) as Record<string, unknown>;
    const rawSnippet =
      typeof metadata.content === "string" ? metadata.content : "";
    const snippet = rawSnippet.replace(/\s+/g, " ").trim().slice(0, 420);

    return {
      id: String(match.id),
      score: match.score ?? 0,
      title: typeof metadata.title === "string" ? metadata.title : "Untitled",
      url: typeof metadata.url === "string" ? metadata.url : "",
      snippet,
      chunkIndex:
        typeof metadata.chunkIndex === "number"
          ? metadata.chunkIndex
          : Number(metadata.chunkIndex) || 0,
      topics: Array.isArray(metadata.topics)
        ? metadata.topics.filter((topic) => typeof topic === "string")
        : [],
    };
  });
}

function formatHistory(history: ChatHistoryMessage[]) {
  if (!history.length) {
    return "";
  }

  const lines = history.slice(-6).map((message) => {
    const roleLabel = message.role === "user" ? "User" : "Assistant";
    return `${roleLabel}: ${message.content.trim()}`;
  });

  return `Conversation:\n${lines.join("\n")}\n\n`;
}

function formatSources(sources: ChatSource[]) {
  return sources
    .map((source, index) => {
      const snippet = source.snippet || "No snippet available.";
      return `[${index + 1}] ${source.title}\nURL: ${source.url}\nSnippet: ${snippet}`;
    })
    .join("\n\n");
}

async function generateAnswer(
  question: string,
  history: ChatHistoryMessage[],
  sources: ChatSource[],
) {
  const prompt = [
    "You are a DevVerse assistant for a technical blog.",
    "Answer using only the sources provided.",
    "Cite sources with brackets like [1] after each claim.",
    "If the sources do not contain the answer, say you do not have enough information.",
    "Finish with a Sources section listing each citation as [n] Title - URL.",
    "",
    formatHistory(history),
    `Question: ${question}`,
    "",
    "Sources:",
    formatSources(sources),
  ]
    .filter(Boolean)
    .join("\n");

  return generateWithModelRotation(prompt);
}

function ensureSourcesSection(answer: string, sources: ChatSource[]) {
  if (!sources.length) {
    return answer;
  }

  const hasCitations = /\[\d+\]/.test(answer);
  const hasSourcesSection = /Sources:/i.test(answer);

  if (hasCitations && hasSourcesSection) {
    return answer;
  }

  const sourcesList = sources
    .map((source, index) => `[${index + 1}] ${source.title} - ${source.url}`)
    .join("\n");

  return `${answer}\n\nSources:\n${sourcesList}`;
}

export async function buildChatResponse(
  question: string,
  history: ChatHistoryMessage[] = [],
) {
  const sources = await retrieveSources(question);

  if (!sources.length) {
    return {
      answer:
        "I do not have enough information from the articles to answer that yet.",
      sources: [],
    };
  }

  const answer = await generateAnswer(question, history, sources);
  const finalizedAnswer = ensureSourcesSection(answer, sources);

  return {
    answer: finalizedAnswer,
    sources,
  };
}
