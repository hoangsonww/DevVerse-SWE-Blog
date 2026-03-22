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
const EMBEDDING_DIMENSION = 768;

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
      model: "models/gemini-embedding-001",
    });
  }
  return embeddingModel;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryDelay(error) {
  // Try to extract retryDelay from error details (e.g. "22s" or "22.991730528s")
  const details = error?.errorDetails || [];
  for (const detail of details) {
    if (detail?.retryDelay) {
      const match = String(detail.retryDelay).match(/([\d.]+)/);
      if (match) return Math.ceil(parseFloat(match[1]) * 1000);
    }
  }
  // Try to extract from error message
  const msgMatch = String(error?.message || "").match(/retry in ([\d.]+)s/i);
  if (msgMatch) return Math.ceil(parseFloat(msgMatch[1]) * 1000);
  return 0;
}

async function getEmbedding(text) {
  const model = getEmbeddingModel();
  let attempt = 0;

  while (true) {
    try {
      const embedResp = await model.embedContent({
        content: {
          role: "user",
          parts: [{ text }],
        },
        outputDimensionality: EMBEDDING_DIMENSION,
      });
      if (
        !embedResp ||
        !embedResp.embedding ||
        !Array.isArray(embedResp.embedding.values)
      ) {
        throw new Error("Invalid embedding response format.");
      }
      const values = embedResp.embedding.values;
      const magnitude = Math.hypot(...values);
      if (!Number.isFinite(magnitude) || magnitude === 0) {
        throw new Error("Embedding normalization failed.");
      }
      if (embedDelayMs > 0) {
        await sleep(embedDelayMs);
      }
      return values.map((value) => value / magnitude);
    } catch (error) {
      const status = Number(error?.status || error?.response?.status);
      const message = String(error?.message || "").toLowerCase();
      const isRateLimit = status === 429 || message.includes("quota") || message.includes("too many requests") || message.includes("rate limit");
      const isServerError = status >= 500;

      if (!isRateLimit && !isServerError) {
        // Non-retryable error (bad request, auth, etc.) — throw
        throw error;
      }

      attempt += 1;

      // Use server-provided retry delay if available, otherwise exponential backoff
      let delay = parseRetryDelay(error);
      if (delay <= 0) {
        // Exponential backoff: 2s, 4s, 8s, 16s, 32s, 60s, 60s, 60s...
        delay = Math.min(60000, retryBaseMs * Math.pow(2, Math.min(attempt, 6))) + Math.floor(Math.random() * 1000);
      } else {
        // Add a small buffer to server-provided delay
        delay += 2000;
      }

      console.log(
        `Rate limited (attempt ${attempt}). Waiting ${Math.round(delay / 1000)}s before retry...`,
      );
      await sleep(delay);
    }
  }
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
      author: "Son Nguyen",
      date: "",
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

  // Extract author from ### Author: ...
  const authorMatch = fileContent.match(/###\s*Author:\s*(.+)/);
  const author = authorMatch ? authorMatch[1].trim() : "Son Nguyen";

  // Extract date from > Date: YYYY-MM-DD
  const dateMatch = fileContent.match(/>\s*Date:\s*(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : "";

  return { title, description, topics, author, date };
}

function countWords(text) {
  const cleaned = (text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\{\{[^}]*\}\}/g, " ")
    .replace(/[#*_>`~\-\[\]();:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
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

  // --skip=N: skip the first N articles (for resuming after rate limit)
  // --from=slug: skip all articles alphabetically before this slug
  const args = process.argv.slice(2);
  let skipCount = 0;
  let fromSlug = null;
  for (const arg of args) {
    if (arg.startsWith("--skip=")) skipCount = parseInt(arg.split("=")[1]) || 0;
    if (arg.startsWith("--from=")) fromSlug = arg.split("=")[1];
  }

  const contentDir = path.join(process.cwd(), "content");
  let files = (await fs.readdir(contentDir))
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  if (fromSlug) {
    const idx = files.findIndex((f) => f.replace(/\.mdx$/, "") === fromSlug);
    if (idx > 0) {
      console.log(`Skipping ${idx} articles, resuming from ${fromSlug}`);
      files = files.slice(idx);
    }
  } else if (skipCount > 0) {
    console.log(`Skipping first ${skipCount} articles`);
    files = files.slice(skipCount);
  }

  if (!files.length) {
    console.log("No MDX files found to vectorize.");
    return;
  }

  const client = getPineconeClient();
  const index = client.index(indexName);
  const vectors = [];

  // Fetch view counts from Supabase if available
  let viewCounts = {};
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const resp = await fetch(`${supabaseUrl}/rest/v1/article_views?select=slug,view_count`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      if (resp.ok) {
        const rows = await resp.json();
        for (const row of rows) {
          viewCounts[row.slug] = row.view_count;
        }
        console.log(`Fetched view counts for ${Object.keys(viewCounts).length} articles`);
      }
    } catch (err) {
      console.warn("Could not fetch view counts from Supabase:", err.message);
    }
  }

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = await fs.readFile(filePath, "utf8");
    const slug = file.replace(/\.mdx$/, "");
    const { title, description, topics, author, date } = parseMetadata(fileContent, file);
    const body = extractContent(fileContent);
    const words = countWords(body);
    const readingMinutes = Math.max(1, Math.ceil(words / 220));
    const views = viewCounts[slug] || 0;
    const chunks = chunkText(body);

    // Delete old vectors for this slug to remove orphan chunks from previous runs
    try {
      const oldIds = Array.from({ length: 200 }, (_, i) => `${slug}#${i}`);
      await index.deleteMany(oldIds);
    } catch (err) {
      // Pinecone may throw if IDs don't exist — that's fine
    }

    console.log(`Processing ${slug} (${chunks.length} chunks, ${readingMinutes} min read, ${views} views)`);

    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      const embedText = `${title}\n${description}\nAuthor: ${author}\nDate: ${date}\nTopics: ${topics.join(", ")}\n\n${chunk}`;
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
          author,
          date,
          readingMinutes,
          views,
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
