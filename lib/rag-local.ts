import fs from "fs/promises";
import path from "path";

interface LocalArticleDocument {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  body: string;
  url: string;
}

interface ChatSourceLike {
  id: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
  chunkIndex: number;
  topics: string[];
}

const DEFAULT_SITE_URL = "https://devverse-swe.vercel.app";
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "do",
  "does",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "what",
  "when",
  "which",
  "with",
  "yet",
]);
const QUERY_EXPANSIONS: Record<string, string[]> = {
  pros: ["advantages", "benefits", "strengths", "upsides"],
  cons: [
    "challenges",
    "limitations",
    "disadvantages",
    "drawbacks",
    "tradeoffs",
  ],
  summarize: ["summary", "overview", "takeaways", "conclusion"],
  summary: ["summarize", "overview", "takeaways", "conclusion"],
  compare: ["comparison", "differences", "versus", "vs"],
  webassembly: ["wasm"],
  wasm: ["webassembly"],
};

let cachedLocalArticles: LocalArticleDocument[] | null = null;

// TF-IDF index built once and cached
let cachedIdfMap: Map<string, number> | null = null;
let cachedChunkVectors:
  | {
      slug: string;
      title: string;
      url: string;
      topics: string[];
      chunkIndex: number;
      chunk: string;
      vector: Map<string, number>;
    }[]
  | null = null;

function buildTfVector(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
  const len = tokens.length || 1;
  Array.from(tf.entries()).forEach(([k, v]) => tf.set(k, v / len));
  return tf;
}

function buildTfIdfVector(
  tf: Map<string, number>,
  idf: Map<string, number>,
): Map<string, number> {
  const tfidf = new Map<string, number>();
  Array.from(tf.entries()).forEach(([term, tfVal]) => {
    tfidf.set(term, tfVal * (idf.get(term) || 0));
  });
  return tfidf;
}

function cosineSimilarity(
  a: Map<string, number>,
  b: Map<string, number>,
): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  Array.from(a.entries()).forEach(([term, val]) => {
    dot += val * (b.get(term) || 0);
    normA += val * val;
  });
  Array.from(b.values()).forEach((val) => {
    normB += val * val;
  });
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

function buildTfIdfIndex(articles: LocalArticleDocument[]) {
  if (cachedIdfMap && cachedChunkVectors) return;

  // Chunk all articles
  const allChunks: typeof cachedChunkVectors = [];
  for (const article of articles) {
    const chunks = chunkText(article.body);
    for (let i = 0; i < chunks.length; i++) {
      // Include title and topics in the chunk for better matching
      const enriched = `${article.title} ${article.topics.join(" ")} ${chunks[i]}`;
      const tokens = tokenize(enriched);
      allChunks.push({
        slug: article.slug,
        title: article.title,
        url: article.url,
        topics: article.topics,
        chunkIndex: i,
        chunk: chunks[i],
        vector: buildTfVector(tokens),
      });
    }
  }

  // Compute IDF: log(N / df) for each term
  const N = allChunks.length;
  const df = new Map<string, number>();
  for (const entry of allChunks) {
    const seen = new Set<string>();
    Array.from(entry.vector.keys()).forEach((term) => {
      if (!seen.has(term)) {
        df.set(term, (df.get(term) || 0) + 1);
        seen.add(term);
      }
    });
  }

  const idfMap = new Map<string, number>();
  Array.from(df.entries()).forEach(([term, count]) => {
    idfMap.set(term, Math.log(N / count));
  });

  // Convert all chunk TF vectors to TF-IDF
  for (const entry of allChunks) {
    entry.vector = buildTfIdfVector(entry.vector, idfMap);
  }

  cachedIdfMap = idfMap;
  cachedChunkVectors = allChunks;
}

export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(text: string) {
  return normalizeText(text)
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function unique(tokens: string[]) {
  return Array.from(new Set(tokens));
}

function expandQueryTokens(query: string) {
  const baseTokens = unique(tokenize(query));
  const expanded = new Set(baseTokens);

  baseTokens.forEach((token) => {
    const synonyms = QUERY_EXPANSIONS[token];
    if (!synonyms) {
      return;
    }
    synonyms.forEach((synonym) => expanded.add(synonym));
  });

  return Array.from(expanded);
}

function overlapCount(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.reduce(
    (count, token) => (rightSet.has(token) ? count + 1 : count),
    0,
  );
}

export function parseMetadata(fileContent: string, filename: string) {
  const metadataMatch = fileContent.match(
    /export const metadata = \{([\s\S]*?)\};/,
  );

  if (!metadataMatch) {
    return {
      title: filename.replace(/\.mdx$/, ""),
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

  return {
    title: titleMatch ? titleMatch[2] : filename.replace(/\.mdx$/, ""),
    description: descriptionMatch ? descriptionMatch[2] : "",
    topics: topicsMatch
      ? topicsMatch[1]
          .split(",")
          .map((topic) => topic.trim().replace(/["']/g, ""))
          .filter(Boolean)
      : [],
  };
}

export function extractBody(fileContent: string) {
  const contentStart = fileContent.indexOf("#");
  const body = contentStart !== -1 ? fileContent.substring(contentStart) : "";
  return body.replace(/\r\n/g, "\n").trim();
}

function splitLongText(text: string, maxLength: number) {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
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

export function chunkText(text: string, maxLength: number = 1200) {
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
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

async function loadLocalArticles() {
  if (cachedLocalArticles) {
    return cachedLocalArticles;
  }

  const contentDir = path.join(process.cwd(), "content");
  const files = (await fs.readdir(contentDir)).filter((file) =>
    file.endsWith(".mdx"),
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

  cachedLocalArticles = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, "utf8");
      const slug = file.replace(/\.mdx$/, "");
      const metadata = parseMetadata(fileContent, file);

      return {
        slug,
        title: metadata.title,
        description: metadata.description,
        topics: metadata.topics,
        body: extractBody(fileContent),
        url: `${siteUrl}/articles/${slug}`,
      };
    }),
  );

  return cachedLocalArticles;
}

function getArticleMatchScore(query: string, article: LocalArticleDocument) {
  const queryTokens = expandQueryTokens(query);
  const normalizedQuery = normalizeText(query);
  const titleTokens = unique(tokenize(article.title));
  const slugTokens = unique(tokenize(article.slug));
  const topicTokens = unique(tokenize(article.topics.join(" ")));
  const descriptionTokens = unique(tokenize(article.description));
  const titleText = normalizeText(article.title);
  const slugText = normalizeText(article.slug);

  let score = 0;

  if (titleText && normalizedQuery.includes(titleText)) {
    score += 100;
  }

  if (slugText && normalizedQuery.includes(slugText)) {
    score += 90;
  }

  score += overlapCount(queryTokens, titleTokens) * 20;
  score += overlapCount(queryTokens, slugTokens) * 16;
  score += overlapCount(queryTokens, topicTokens) * 8;
  score += overlapCount(queryTokens, descriptionTokens) * 4;

  if (queryTokens.some((token) => titleTokens.includes(token))) {
    score += 12;
  }

  return score;
}

function getChunkMatchScore(query: string, chunk: string, chunkIndex: number) {
  const queryTokens = expandQueryTokens(query);
  const chunkTokens = unique(tokenize(chunk));
  const normalizedChunk = normalizeText(chunk);
  let score = overlapCount(queryTokens, chunkTokens) * 6;

  if (
    queryTokens.some((token) =>
      ["advantages", "benefits", "strengths", "upsides"].includes(token),
    ) &&
    /(advantages|benefits|strengths|upsides)/.test(normalizedChunk)
  ) {
    score += 16;
  }

  if (
    queryTokens.some((token) =>
      [
        "challenges",
        "limitations",
        "disadvantages",
        "drawbacks",
        "tradeoffs",
      ].includes(token),
    ) &&
    /(challenges|limitations|disadvantages|drawbacks|tradeoffs)/.test(
      normalizedChunk,
    )
  ) {
    score += 16;
  }

  if (
    queryTokens.some((token) =>
      ["summary", "summarize", "overview", "takeaways", "conclusion"].includes(
        token,
      ),
    ) &&
    /(introduction|overview|conclusion|takeaways)/.test(normalizedChunk)
  ) {
    score += 8;
  }

  if (chunkIndex === 0) {
    score += 2;
  }

  return score;
}

export function scoreSourceAgainstQuery(
  query: string,
  source: Pick<ChatSourceLike, "title" | "snippet" | "topics">,
) {
  const queryTokens = expandQueryTokens(query);
  const titleTokens = unique(tokenize(source.title));
  const snippetTokens = unique(tokenize(source.snippet));
  const topicTokens = unique(tokenize(source.topics.join(" ")));

  return (
    overlapCount(queryTokens, titleTokens) * 12 +
    overlapCount(queryTokens, topicTokens) * 6 +
    overlapCount(queryTokens, snippetTokens) * 2
  );
}

export function buildLocalSourcesFromDocuments(
  query: string,
  articles: LocalArticleDocument[],
  limit: number = 6,
): ChatSourceLike[] {
  // Build TF-IDF index if not cached
  buildTfIdfIndex(articles);

  if (!cachedIdfMap || !cachedChunkVectors || cachedChunkVectors.length === 0) {
    return [];
  }

  // Build TF-IDF query vector with expansion
  const queryTokens = expandQueryTokens(query);
  const queryTf = buildTfVector(queryTokens);
  const queryVector = buildTfIdfVector(queryTf, cachedIdfMap);

  // Score every chunk by cosine similarity
  const scored = cachedChunkVectors.map((entry) => {
    const sim = cosineSimilarity(queryVector, entry.vector);

    // Bonus for keyword matches in title/slug (helps exact matches)
    const titleTokens = unique(tokenize(entry.title));
    const keywordBonus = overlapCount(queryTokens, titleTokens) * 0.05;

    return {
      ...entry,
      score: sim + keywordBonus,
    };
  });

  // Rank by score, take top results
  scored.sort((a, b) => b.score - a.score);

  // Filter to meaningful matches (above a minimum threshold)
  const threshold = 0.01;
  const relevant = scored.filter((s) => s.score > threshold);

  if (!relevant.length) {
    // Fallback to old keyword scoring if TF-IDF finds nothing
    const rankedArticles = articles
      .map((article) => ({
        article,
        score: getArticleMatchScore(query, article),
      }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score);

    if (!rankedArticles.length) return [];

    const top = rankedArticles.slice(0, 3);
    return top
      .flatMap(({ article, score: articleScore }) =>
        chunkText(article.body)
          .slice(0, 2)
          .map((chunk, chunkIndex) => ({
            id: `${article.slug}#local-${chunkIndex}`,
            title: article.title,
            url: article.url,
            snippet: chunk.replace(/\s+/g, " ").trim().slice(0, 520),
            score: articleScore,
            chunkIndex,
            topics: article.topics,
          })),
      )
      .slice(0, limit);
  }

  // Deduplicate: take the best chunk per article, then fill
  const seen = new Map<string, number>();
  const results: ChatSourceLike[] = [];

  for (const entry of relevant) {
    if (results.length >= limit) break;
    const articleCount = seen.get(entry.slug) || 0;
    if (articleCount >= 3) continue; // max 3 chunks per article
    seen.set(entry.slug, articleCount + 1);

    results.push({
      id: `${entry.slug}#local-${entry.chunkIndex}`,
      title: entry.title,
      url: entry.url,
      snippet: entry.chunk.replace(/\s+/g, " ").trim().slice(0, 520),
      score: entry.score,
      chunkIndex: entry.chunkIndex,
      topics: entry.topics,
    });
  }

  return results;
}

export async function getLocalSourcesForQuery(
  query: string,
  limit: number = 6,
) {
  const articles = await loadLocalArticles();
  return buildLocalSourcesFromDocuments(query, articles, limit);
}
