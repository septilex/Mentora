import { NextRequest, NextResponse } from "next/server";
import { auth, prisma } from "@/auth";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { cosineSimilarity } from "@/lib/similarity";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    // 1. Generate embedding for user question
    // Note: We use gemini-embedding-001 as implemented previously to match stored chunk model
    const { embedding: queryEmbedding } = await embed({
      model: google.textEmbeddingModel("gemini-embedding-001"),
      value: query,
    });

    console.log(`[Retrieval API] Query embedding length: ${queryEmbedding.length}`);

    // 2. Fetch all chunk embeddings belonging to the authenticated user
    const userMaterials = await prisma.material.findMany({
      where: { userId: session.user.id },
      include: {
        chunks: {
          include: {
            embedding: true
          }
        }
      }
    });

    const candidateChunks = [];
    for (const material of userMaterials) {
      for (const chunk of material.chunks) {
        if (chunk.embedding?.embedding) {
          candidateChunks.push({
            chunkId: chunk.id,
            content: chunk.content,
            materialName: material.title,
            embeddingStr: chunk.embedding.embedding,
          });
        }
      }
    }

    console.log(`[Retrieval API] Chunks searched: ${candidateChunks.length}`);

    // 3. Compute cosine similarity
    const results = candidateChunks.map(c => {
      const storedVector = JSON.parse(c.embeddingStr) as number[];
      const score = cosineSimilarity(queryEmbedding, storedVector);
      return {
        chunkId: c.chunkId,
        similarityScore: score,
        excerpt: c.content,
        materialName: c.materialName
      };
    });

    // 4. Sort and return top 5
    results.sort((a, b) => b.similarityScore - a.similarityScore);
    const top5 = results.slice(0, 5);
    
    const topScore = top5.length > 0 ? top5[0].similarityScore : 0;
    console.log(`[Retrieval API] Top similarity score: ${topScore.toFixed(4)}`);

    const retrievalTime = Date.now() - startTime;
    console.log(`[Retrieval API] Retrieval time: ${retrievalTime}ms`);

    return NextResponse.json({
      success: true,
      results: top5,
    });

  } catch (error: any) {
    console.error("[Retrieval API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to search" }, { status: 500 });
  }
}
