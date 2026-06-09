import fs from 'fs';

async function listModels() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const keyLine = envFile.split('\n').find(line => line.startsWith('GOOGLE_GENERATIVE_AI_API_KEY='));
  const key = keyLine ? keyLine.split('=')[1].trim() : null;
  
  if (!key) {
    console.error("No API key found in .env.");
    return;
  }
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  const data = await res.json();
  
  if (data.models) {
    const models = data.models.map(m => m.name);
    console.log("Available models:", models.filter(m => m.includes("gemini")));
  } else {
    console.log("Error listing models:", data);
  }
}

listModels();
