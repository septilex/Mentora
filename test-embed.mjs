import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

async function run() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const keyLine = envFile.split('\n').find(line => line.startsWith('GOOGLE_GENERATIVE_AI_API_KEY='));
  const key = keyLine ? keyLine.split('=')[1].trim() : null;

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

  try {
    const text = "Hello world";
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    console.log("Success! Embedding length:", embedding.values.length);
  } catch(err) {
    console.error("Failed:", err);
  }
}

run();
