import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found.");
    return;
  }

  // Create a mock material
  const material = await prisma.material.create({
    data: {
      userId: user.id,
      title: "Blockchain Architecture and Virtual Memory",
      status: "completed",
    }
  });

  // Create Mock Concepts
  const conceptsData = [
    { name: "Blockchain", description: "A decentralized, distributed, and public digital ledger." },
    { name: "Proof of Work", description: "A form of cryptographic proof in which one party proves to others that a certain amount of computational effort has been expended." },
    { name: "Hash Function", description: "Any function that can be used to map data of arbitrary size to fixed-size values." },
    { name: "Virtual Memory", description: "A memory management technique where secondary memory can be used as if it were a part of the main memory." },
    { name: "Paging", description: "A memory management scheme that eliminates the need for contiguous allocation of physical memory." }
  ];

  const createdConcepts = [];
  for (const c of conceptsData) {
    const created = await prisma.concept.create({
      data: {
        materialId: material.id,
        name: c.name,
        description: c.description
      }
    });
    createdConcepts.push(created);
  }

  // Create Mock Relationships
  const relations = [
    { source: "Blockchain", target: "Proof of Work", type: "secures" },
    { source: "Proof of Work", target: "Hash Function", type: "relies on" },
    { source: "Virtual Memory", target: "Paging", type: "implemented via" }
  ];

  for (const rel of relations) {
    const sourceConcept = createdConcepts.find(c => c.name === rel.source);
    const targetConcept = createdConcepts.find(c => c.name === rel.target);
    
    await prisma.conceptRelationship.create({
      data: {
        sourceConceptId: sourceConcept.id,
        targetConceptId: targetConcept.id,
        relationshipType: rel.type
      }
    });
  }

  console.log("Mock data injected successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
