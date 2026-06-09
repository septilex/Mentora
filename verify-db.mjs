import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const concepts = await prisma.concept.findMany({
    include: {
      sourceEdges: true,
      targetEdges: true,
      material: true
    }
  });

  console.log(`Found ${concepts.length} concepts in the database.`);
  
  if (concepts.length > 0) {
    console.log("\nSample Concepts:");
    concepts.slice(0, 3).forEach(c => {
      console.log(`- ${c.name}: ${c.description} (Material: ${c.material.title})`);
      c.sourceEdges.forEach(e => {
        const target = concepts.find(x => x.id === e.targetConceptId);
        if (target) {
          console.log(`    -> ${e.relationshipType} -> ${target.name}`);
        }
      });
    });
  } else {
    console.log("No concepts found yet. Did the upload finish?");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
