import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const materials = await prisma.material.findMany({
    include: { _count: { select: { chunks: true } }, chunks: true },
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  
  if (materials.length > 0) {
    console.log("Most recent material ID:", materials[0].id);
    console.log("Chunk count:", materials[0]._count.chunks);
    console.log("First chunk snippet:", materials[0].chunks[0]?.content.substring(0, 100));
  } else {
    console.log("No materials found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
