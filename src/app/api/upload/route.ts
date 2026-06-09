import { NextRequest, NextResponse } from "next/server";
import { auth, prisma } from "@/auth";
import PDFParser from "pdf2json";
import { splitTextIntoChunks } from "@/lib/chunking";
import { generateObject, embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 60; // Allow 60s for PDF parsing and LLM generation

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Read PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 2. Parse PDF
    console.log("[Upload API] Starting PDF parsing...");
    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, true);
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(buffer);
    });
    console.log("[Upload API] PDF parsing completed successfully.");

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // Ensure we don't blow up the context window (take first 15000 chars roughly)
    const truncatedText = text.substring(0, 15000);

    // 3. Generate Flashcards using Gemini
    console.log("[Upload API] Starting Gemini generation...");
    const { object } = await generateObject({
      model: google("gemini-3.5-flash"), // supported production model
      schema: z.object({
        flashcards: z.array(
          z.object({
            questionText: z.string(),
            answerText: z.string(),
          })
        ).length(5), // strictly 5 flashcards
      }),
      prompt: `Extract exactly 5 core concepts from the following text and turn them into Q&A flashcards. Keep the answers concise and strictly accurate based on the text.
      
      Text to analyze:
      ${truncatedText}`,
    });
    console.log("[Upload API] Gemini generation completed successfully.");

    // 4. Save to Database
    console.log("[Upload API] Starting Database writes...");
    // Create the Material
    const material = await prisma.material.create({
      data: {
        userId: session.user.id,
        title: file.name,
        status: "completed",
      }
    });

    // Create the Flashcards
    await prisma.flashcard.createMany({
      data: object.flashcards.map(fc => ({
        materialId: material.id,
        questionText: fc.questionText,
        answerText: fc.answerText,
      }))
    });

    // Create the Chunks
    const chunks = splitTextIntoChunks(text);
    await prisma.chunk.createMany({
      data: chunks.map((content, index) => ({
        materialId: material.id,
        content: content,
        chunkIndex: index,
      }))
    });

    // Fetch chunks to get their generated IDs
    const savedChunks = await prisma.chunk.findMany({
      where: { materialId: material.id },
      orderBy: { chunkIndex: 'asc' }
    });

    // Generate Embeddings using Gemini
    console.log(`[Upload API] Generating embeddings for ${savedChunks.length} chunks...`);
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel("gemini-embedding-001"),
      values: savedChunks.map(c => c.content),
    });
    console.log(`[Upload API] Successfully generated ${embeddings.length} embeddings.`);

    // Store ChunkEmbeddings
    await prisma.chunkEmbedding.createMany({
      data: embeddings.map((emb, index) => ({
        chunkId: savedChunks[index].id,
        embedding: JSON.stringify(emb),
      }))
    });

    console.log("[Upload API] Database writes completed successfully.");
    const savedFlashcards = await prisma.flashcard.findMany({
      where: { materialId: material.id }
    });
    console.log("[Upload API] Database writes completed successfully.");

    return NextResponse.json({ 
      success: true, 
      materialId: material.id,
      flashcards: savedFlashcards 
    });

  } catch (error: unknown) {
    console.error("[Upload API] Catch Block Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
