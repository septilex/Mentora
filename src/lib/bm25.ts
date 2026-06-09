export class BM25 {
  private documents: string[][];
  private docLengths: number[];
  private avgdl: number;
  private documentCount: number;
  private termFrequencies: { [docIndex: number]: { [term: string]: number } };
  private documentFrequencies: { [term: string]: number };

  private k1: number = 1.5;
  private b: number = 0.75;

  constructor(corpus: string[]) {
    this.documents = corpus.map(doc => this.tokenize(doc));
    this.docLengths = this.documents.map(doc => doc.length);
    this.documentCount = this.documents.length;
    
    let totalLength = 0;
    this.docLengths.forEach(len => totalLength += len);
    this.avgdl = this.documentCount > 0 ? totalLength / this.documentCount : 0;

    this.termFrequencies = {};
    this.documentFrequencies = {};

    this.buildIndex();
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().match(/\w+/g) || [];
  }

  private buildIndex() {
    this.documents.forEach((doc, idx) => {
      this.termFrequencies[idx] = {};
      const uniqueTerms = new Set<string>();

      doc.forEach(term => {
        this.termFrequencies[idx][term] = (this.termFrequencies[idx][term] || 0) + 1;
        uniqueTerms.add(term);
      });

      uniqueTerms.forEach(term => {
        this.documentFrequencies[term] = (this.documentFrequencies[term] || 0) + 1;
      });
    });
  }

  private idf(term: string): number {
    const n = this.documentFrequencies[term] || 0;
    // Standard BM25 IDF formula
    return Math.log( (this.documentCount - n + 0.5) / (n + 0.5) + 1 );
  }

  public score(query: string): number[] {
    const queryTerms = this.tokenize(query);
    const scores = new Array(this.documentCount).fill(0);

    queryTerms.forEach(term => {
      const idfTerm = this.idf(term);
      if (idfTerm <= 0) return; // ignore common terms that have negative IDF

      for (let idx = 0; idx < this.documentCount; idx++) {
        const tf = this.termFrequencies[idx][term] || 0;
        if (tf > 0) {
          const docLength = this.docLengths[idx];
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (docLength / this.avgdl));
          scores[idx] += idfTerm * (numerator / denominator);
        }
      }
    });

    return scores;
  }
}
