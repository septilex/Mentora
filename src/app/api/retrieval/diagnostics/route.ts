import { NextRequest, NextResponse } from "next/server";
import { auth, prisma } from "@/auth";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { cosineSimilarity } from "@/lib/similarity";
import { BM25 } from "@/lib/bm25";
import { reciprocalRankFusion } from "@/lib/rrf";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    // 1. Fetch Candidates
    const userMaterials = await prisma.material.findMany({
      where: { userId: session.user.id },
      include: { chunks: { include: { embedding: true } } }
    });

    const candidates = [];
    for (const material of userMaterials) {
      for (const chunk of material.chunks) {
        if (chunk.embedding?.embedding) {
          candidates.push({
            chunkId: chunk.id,
            content: chunk.content,
            materialName: material.title,
            embeddingStr: chunk.embedding.embedding,
          });
        }
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json({ vector: [], bm25: [], rrf: [] });
    }

    // 2. Vector Search
    const { embedding: queryEmbedding } = await embed({
      model: google.textEmbeddingModel("gemini-embedding-001"),
      value: query,
    });

    const vectorResults = candidates.map(c => {
      const storedVector = JSON.parse(c.embeddingStr) as number[];
      return {
        chunkId: c.chunkId,
        content: c.content,
        materialName: c.materialName,
        score: cosineSimilarity(queryEmbedding, storedVector)
      };
    }).sort((a, b) => b.score - a.score);

    // 3. BM25 Search
    const corpus = candidates.map(c => c.content);
    const bm25 = new BM25(corpus);
    const bm25Scores = bm25.score(query);

    const bm25Results = candidates.map((c, idx) => ({
      chunkId: c.chunkId,
      content: c.content,
      materialName: c.materialName,
      score: bm25Scores[idx]
    })).sort((a, b) => b.score - a.score);

    // 4. RRF Merge
    // Format for RRF utility
    const vectorList = vectorResults.map((v, i) => ({ ...v, rank: i + 1 }));
    const bm25List = bm25Results.map((v, i) => ({ ...v, rank: i + 1 }));
    
    const rrfResults = reciprocalRankFusion([vectorList, bm25List]);

    return NextResponse.json({
      success: true,
      vector: vectorResults.slice(0, 10),
      bm25: bm25Results.slice(0, 10),
      rrf: rrfResults.slice(0, 10)
    });

  } catch (error: any) {
    console.error("[Diagnostics API]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
