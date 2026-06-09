import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const chunks = await prisma.chunk.findMany({ take: 1 });
  if (chunks.length > 0) {
    const chunk = chunks[0];
    
    // Create a mock embedding array (3072 dimensions for Gemini embedding model)
    const mockEmbedding = Array(3072).fill(0.1234);
    
    await prisma.chunkEmbedding.upsert({
      where: { chunkId: chunk.id },
      update: { embedding: JSON.stringify(mockEmbedding) },
      create: {
        chunkId: chunk.id,
        embedding: JSON.stringify(mockEmbedding)
      }
    });

    console.log("Successfully inserted a mock embedding for chunk ID:", chunk.id);
    
    const count = await prisma.chunkEmbedding.count();
    console.log("Total embeddings in DB:", count);
  } else {
    console.log("No chunks found to embed.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
