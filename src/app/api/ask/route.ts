import { NextRequest, NextResponse } from "next/server";
import { auth, prisma } from "@/auth";
import { embed, generateText } from "ai";
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

    // 1. Generate query embedding
    const { embedding: queryEmbedding } = await embed({
      model: google.textEmbeddingModel("gemini-embedding-001"),
      value: query,
    });

    // 2. Fetch all chunk embeddings for the user
    const userMaterials = await prisma.material.findMany({
      where: { userId: session.user.id },
      include: {
        chunks: {
          include: { embedding: true }
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

    // 3. Compute similarity and get top 5
    const results = candidateChunks.map(c => {
      const storedVector = JSON.parse(c.embeddingStr) as number[];
      const score = cosineSimilarity(queryEmbedding, storedVector);
      return {
        chunkId: c.chunkId,
        score,
        content: c.content,
        materialName: c.materialName
      };
    });

    results.sort((a, b) => b.score - a.score);
    const top5 = results.slice(0, 5);

    if (top5.length === 0) {
      return NextResponse.json({
        answer: "I don't have enough information in the uploaded materials.",
        sources: []
      });
    }

    // 4. Build Context
    let contextBlock = "Context from uploaded documents:\\n\\n";
    top5.forEach((chunk, idx) => {
      contextBlock += `[Document: ${chunk.materialName}] [Chunk ${idx + 1}]\\n${chunk.content}\\n\\n`;
    });

    const systemPrompt = `You are a helpful AI assistant answering questions based on user-uploaded documents.
Answer only using the provided context.
If the answer cannot be found in the context, respond strictly with exactly:
"I don't have enough information in the uploaded materials."`;

    const userPrompt = `${contextBlock}\nQuestion: ${query}`;

    // 5. Generate Answer via Gemini
    const { text: answer } = await generateText({
      model: google("gemini-3.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    const totalTime = Date.now() - startTime;
    console.log(`[Ask API] Answer generated in ${totalTime}ms`);

    // 6. Return payload
    const sources = top5.map(c => ({
      chunkId: c.chunkId,
      materialName: c.materialName,
      similarityScore: c.score,
      excerpt: c.content.substring(0, 200) + "..."
    }));

    return NextResponse.json({
      success: true,
      answer: answer.trim(),
      sources
    });

  } catch (error: any) {
    console.error("[Ask API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate answer" }, { status: 500 });
  }
}
