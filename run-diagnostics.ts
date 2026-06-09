import { PrismaClient } from '@prisma/client';
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { cosineSimilarity } from "./src/lib/similarity.ts";
import { BM25 } from "./src/lib/bm25.ts";
import { reciprocalRankFusion } from "./src/lib/rrf.ts";

const prisma = new PrismaClient();

async function testQuery(query) {
  console.log(`\n======================================`);
  console.log(`QUERY: "${query}"`);
  console.log(`======================================\n`);

  const chunks = await prisma.chunk.findMany({ include: { embedding: true, material: true } });
  const candidates = chunks.filter(c => c.embedding?.embedding).map(c => ({
    chunkId: c.id,
    content: c.content,
    materialName: c.material?.title,
    embeddingStr: c.embedding.embedding,
  }));

  const { embedding: queryEmbedding } = await embed({
    model: google.textEmbeddingModel("gemini-embedding-001"),
    value: query,
  });

  const vectorResults = candidates.map(c => ({
    chunkId: c.chunkId,
    content: c.content,
    materialName: c.materialName,
    score: cosineSimilarity(queryEmbedding, JSON.parse(c.embeddingStr))
  })).sort((a, b) => b.score - a.score);

  const bm25 = new BM25(candidates.map(c => c.content));
  const bm25Scores = bm25.score(query);
  const bm25Results = candidates.map((c, idx) => ({
    chunkId: c.chunkId,
    content: c.content,
    materialName: c.materialName,
    score: bm25Scores[idx]
  })).sort((a, b) => b.score - a.score);

  const rrfResults = reciprocalRankFusion([
    vectorResults.map((v, i) => ({ ...v, rank: i + 1 })),
    bm25Results.map((v, i) => ({ ...v, rank: i + 1 }))
  ]);

  console.log("--- BM25 Top 2 ---");
  bm25Results.slice(0, 2).forEach((r, i) => console.log(`${i+1}. [${r.score.toFixed(2)}] ${r.content}`));

  console.log("\n--- Vector Top 2 ---");
  vectorResults.slice(0, 2).forEach((r, i) => console.log(`${i+1}. [${r.score.toFixed(2)}] ${r.content}`));

  console.log("\n--- RRF Top 2 ---");
  rrfResults.slice(0, 2).forEach((r, i) => console.log(`${i+1}. [${r.rrfScore.toFixed(4)}] ${r.content}`));
}

async function main() {
  await testQuery("TLB");
  await testQuery("What is virtual memory?");
  await testQuery("How does TLB improve virtual memory performance?");
}

main().catch(console.error).finally(() => prisma.$disconnect());
