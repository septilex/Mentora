import { PrismaClient } from '@prisma/client';
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log("No user");

  const material = await prisma.material.create({
    data: {
      userId: user.id,
      title: "Computer Architecture: Memory Management",
      status: "completed"
    }
  });

  const texts = [
    "A Translation Lookaside Buffer (TLB) is a memory cache that stores the recent translations of virtual memory to physical memory. It is used to reduce the time taken to access a user memory location.",
    "Virtual memory is a memory management technique that provides an idealized abstraction of the storage resources that are actually available on a given machine which creates the illusion to users of a very large main memory.",
    "When a virtual memory address is required, the processor first checks the TLB. If the translation is present, it's a TLB hit, improving performance significantly by avoiding a slow page table walk.",
    "Random text about bananas and apples. Bananas are yellow and apples are red. They are fruits.",
    "The CPU cache is a hardware cache used by the central processing unit of a computer to reduce the average cost to access data from the main memory."
  ];

  console.log("Generating embeddings...");
  try {
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel("gemini-embedding-001"),
      values: texts,
    });

    console.log("Embeddings generated successfully. Inserting to DB...");

    for (let i = 0; i < texts.length; i++) {
      const chunk = await prisma.chunk.create({
        data: {
          materialId: material.id,
          content: texts[i],
          chunkIndex: i
        }
      });

      await prisma.chunkEmbedding.create({
        data: {
          chunkId: chunk.id,
          embedding: JSON.stringify(embeddings[i])
        }
      });
    }

    console.log("Success!");
  } catch (err) {
    console.error("Embedding failed:", err.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
