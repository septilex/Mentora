import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const chunks = await prisma.chunk.findMany({
    include: { embedding: true }
  });
  console.log(`Found ${chunks.length} total chunks in DB.`);
  const embeddedChunks = chunks.filter(c => c.embedding !== null);
  console.log(`Found ${embeddedChunks.length} chunks with embeddings.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
