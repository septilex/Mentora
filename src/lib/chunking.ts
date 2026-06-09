export function splitTextIntoChunks(text: string, chunkSize: number = 700, overlap: number = 100): string[] {
  if (!text || text.trim() === "") return [];
  
  const chunks: string[] = [];
  let i = 0;
  
  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  
  return chunks;
}
