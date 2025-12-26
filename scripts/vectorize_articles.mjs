import fs from "fs/promises";
import path from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

let indexName = "devverse-articles";
let siteUrl = "https://devverse-swe.vercel.app";
let batchSize = 40;
let maxRetries = 6;
let retryBaseMs = 1000;
let embedDelayMs = 250;

let pinecone = null;
let embeddingModel = null;

async function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        return;
      }
      const [key, ...rest] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
      }
    });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isQuotaError(error) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("quota") || message.includes("billing");
}

function isRetryable(error) {
  const status = Number(error?.status || error?.response?.status);
  const message = String(error?.message || "").toLowerCase();
  if (Number.isFinite(status)) {
    return status === 429 || status >= 500;
  }
  return (
    message.includes("too many requests") ||
    message.includes("rate limit") ||
    message.includes("temporarily")
  );
}

async function getEmbedding(text) {
  const model = getEmbeddingModel();
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const embedResp = await model.embedContent(text);
      if (
        !embedResp ||
        !embedResp.embedding ||
        !Array.isArray(embedResp.embedding.values)
      ) {
        throw new Error("Invalid embedding response format.");
      }
      if (embedDelayMs > 0) {
        await sleep(embedDelayMs);
      }
      return embedResp.embedding.values;
    } catch (error) {
      if (isQuotaError(error)) {
        throw error;
      }
      if (attempt >= maxRetries || !isRetryable(error)) {
        throw error;
      }
      const delay =
        retryBaseMs * Math.pow(2, attempt) + Math.floor(Math.random() * 250);
      console.log(
        `Embedding rate limited. Retrying in ${Math.round(delay)}ms (attempt ${
          attempt + 1
        }/${maxRetries}).`,
      );
      await sleep(delay);
    }
  }

  throw new Error("Embedding retry loop exhausted.");
}

function parseMetadata(fileContent, filename) {
  const metadataMatch = fileContent.match(
    /export const metadata = \{([\s\S]*?)\};/,
  );

  if (!metadataMatch) {
    return {
      title: filename.replace(".mdx", ""),
      description: "",
      topics: [],
    };
  }

  const metadataString = metadataMatch[1];
  const titleMatch = metadataString.match(/title:\s*(['"])([\s\S]*?)\1/);
  const descriptionMatch = metadataString.match(
    /description:\s*(['"])([\s\S]*?)\1/,
  );
  const topicsMatch = metadataString.match(/topics:\s*\[([\s\S]*?)\]/);

  const title = titleMatch ? titleMatch[2] : filename.replace(".mdx", "");
  const description = descriptionMatch ? descriptionMatch[2] : "";

  let topics = [];
  if (topicsMatch) {
    topics = topicsMatch[1]
      .split(",")
      .map((topic) => topic.trim().replace(/["']/g, ""))
      .filter((topic) => topic.length > 0);
  }

  return { title, description, topics };
}

function extractContent(fileContent) {
  const contentStart = fileContent.indexOf("#");
  const body = contentStart !== -1 ? fileContent.substring(contentStart) : "";
  return body.replace(/\r\n/g, "\n").trim();
}

function splitLongText(text, maxLength) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength) {
      if (current) {
        chunks.push(current);
      }
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function chunkText(text, maxLength = 1200) {
  const paragraphs = text.split(/\n{2,}/);
  const chunks = [];
  let current = "";

  paragraphs.forEach((paragraph) => {
    const cleaned = paragraph.trim();
    if (!cleaned) {
      return;
    }

    const next = current ? `${current}\n\n${cleaned}` : cleaned;
    if (next.length <= maxLength) {
      current = next;
      return;
    }

    if (current) {
      chunks.push(current);
      current = "";
    }

    if (cleaned.length > maxLength) {
      splitLongText(cleaned, maxLength).forEach((chunk) => chunks.push(chunk));
    } else {
      current = cleaned;
    }
  });

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

async function main() {
  await loadEnvFile(".env.local");
  await loadEnvFile(".env");

  indexName = process.env.PINECONE_INDEX || indexName;
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteUrl;
  const parsedBatch = Number(process.env.VECTORIZE_BATCH_SIZE || batchSize);
  batchSize = Number.isFinite(parsedBatch) ? parsedBatch : batchSize;
  const parsedDelay = Number(
    process.env.VECTORIZE_EMBED_DELAY_MS || embedDelayMs,
  );
  embedDelayMs = Number.isFinite(parsedDelay) ? parsedDelay : embedDelayMs;
  const parsedRetries = Number(
    process.env.VECTORIZE_MAX_RETRIES || maxRetries,
  );
  maxRetries = Number.isFinite(parsedRetries) ? parsedRetries : maxRetries;
  const parsedRetryBase = Number(
    process.env.VECTORIZE_RETRY_BASE_MS || retryBaseMs,
  );
  retryBaseMs = Number.isFinite(parsedRetryBase)
    ? parsedRetryBase
    : retryBaseMs;

  if (!process.env.PINECONE_API_KEY || !process.env.GOOGLE_AI_API_KEY) {
    throw new Error(
      "Missing required environment variables: PINECONE_API_KEY, GOOGLE_AI_API_KEY",
    );
  }

  const contentDir = path.join(process.cwd(), "content");
  const files = (await fs.readdir(contentDir)).filter((file) =>
    file.endsWith(".mdx"),
  );

  if (!files.length) {
    console.log("No MDX files found to vectorize.");
    return;
  }

  const client = getPineconeClient();
  const index = client.index(indexName);
  const vectors = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = await fs.readFile(filePath, "utf8");
    const slug = file.replace(/\.mdx$/, "");
    const { title, description, topics } = parseMetadata(fileContent, file);
    const body = extractContent(fileContent);
    const chunks = chunkText(body);

    console.log(`Processing ${slug} (${chunks.length} chunks)`);

    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      const embedText = `${title}\n${description}\n\n${chunk}`;
      const embedding = await getEmbedding(embedText);
      const id = `${slug}#${i}`;

      vectors.push({
        id,
        values: embedding,
        metadata: {
          slug,
          title,
          description,
          topics,
          url: `${siteUrl}/articles/${slug}`,
          chunkIndex: i,
          content: chunk,
        },
      });

      if (vectors.length >= batchSize) {
        await index.upsert(vectors);
        console.log(`Upserted ${vectors.length} vectors so far`);
        vectors.length = 0;
      }
    }
  }

  if (vectors.length) {
    await index.upsert(vectors);
    console.log(`Upserted final ${vectors.length} vectors`);
  }

  console.log("Vectorization complete.");
}

main().catch((error) => {
  console.error("Vectorization failed:", error);
  process.exit(1);
});
