export interface RankedItem {
  chunkId: string;
  rank: number;
  score: number;
  [key: string]: any;
}

/**
 * Implements Reciprocal Rank Fusion
 * @param lists An array of ranked item lists. Each list should be sorted by its native score descending.
 * @param k The RRF constant, typically 60
 * @returns A fused list of items sorted by their RRF score descending.
 */
export function reciprocalRankFusion(lists: RankedItem[][], k: number = 60): any[] {
  const rrfScores: { [chunkId: string]: number } = {};
  const itemData: { [chunkId: string]: any } = {};

  lists.forEach(list => {
    list.forEach((item, index) => {
      // The rank is just the index + 1 since the list is already sorted
      const rank = index + 1;
      
      if (!rrfScores[item.chunkId]) {
        rrfScores[item.chunkId] = 0;
        itemData[item.chunkId] = item;
      }
      
      rrfScores[item.chunkId] += 1 / (k + rank);
    });
  });

  const fused = Object.keys(rrfScores).map(chunkId => ({
    ...itemData[chunkId],
    rrfScore: rrfScores[chunkId]
  }));

  // Sort descending by RRF score
  fused.sort((a, b) => b.rrfScore - a.rrfScore);

  return fused;
}
