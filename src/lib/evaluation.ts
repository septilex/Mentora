/**
 * Scaffolding for Evaluation Metrics
 * These metrics expect a list of retrieved chunks and a list of expected (ground truth) chunk IDs.
 */

export function calculateHitRate(retrievedChunkIds: string[], expectedChunkIds: string[]): number {
  if (expectedChunkIds.length === 0) return 0;
  // Hit Rate is 1 if ANY of the expected chunks are in the retrieved list, else 0
  const hasHit = expectedChunkIds.some(id => retrievedChunkIds.includes(id));
  return hasHit ? 1 : 0;
}

export function calculateRecallAtK(retrievedChunkIds: string[], expectedChunkIds: string[], k: number): number {
  if (expectedChunkIds.length === 0) return 0;
  const topK = retrievedChunkIds.slice(0, k);
  const hits = expectedChunkIds.filter(id => topK.includes(id)).length;
  return hits / expectedChunkIds.length;
}

export function calculateMRR(retrievedChunkIds: string[], expectedChunkIds: string[]): number {
  if (expectedChunkIds.length === 0) return 0;
  // MRR is 1/rank of the *first* relevant chunk found
  for (let i = 0; i < retrievedChunkIds.length; i++) {
    if (expectedChunkIds.includes(retrievedChunkIds[i])) {
      return 1 / (i + 1);
    }
  }
  return 0; // Not found
}
