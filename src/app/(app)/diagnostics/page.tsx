"use client";

import { useState } from "react";
import { Search, Loader2, Database, Layers, Sparkles } from "lucide-react";
import { calculateMRR, calculateHitRate, calculateRecallAtK } from "@/lib/evaluation";

export default function DiagnosticsPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{vector: any[], bm25: any[], rrf: any[]} | null>(null);
  
  // Scaffolded Evaluation
  const [expectedChunkIds, setExpectedChunkIds] = useState("");
  const [evalMetrics, setEvalMetrics] = useState<{mrr: number, hitRate: number, recall: number} | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults(null);
    setEvalMetrics(null);

    try {
      const res = await fetch("/api/retrieval/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) {
        setResults({ vector: data.vector, bm25: data.bm25, rrf: data.rrf });
        
        // Compute eval if expected chunks are provided
        const expected = expectedChunkIds.split(",").map(id => id.trim()).filter(id => id);
        if (expected.length > 0) {
          const rrfIds = data.rrf.map((r: any) => r.chunkId);
          setEvalMetrics({
            mrr: calculateMRR(rrfIds, expected),
            hitRate: calculateHitRate(rrfIds, expected),
            recall: calculateRecallAtK(rrfIds, expected, 5)
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ResultColumn = ({ title, icon: Icon, items, scoreKey }: { title: string, icon: any, items: any[], scoreKey: string }) => (
    <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E7EB]">
        <Icon className="w-5 h-5 text-indigo-600" />
        <h3 className="font-serif font-medium text-[#111827]">{title}</h3>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto">
        {items.map((item, idx) => (
          <div key={`${item.chunkId}-${idx}`} className="bg-white p-3 rounded-lg border border-[#E5E7EB] shadow-sm text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-xs text-[#9CA3AF]">Rank {idx + 1}</span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Score: {item[scoreKey]?.toFixed(4)}
              </span>
            </div>
            <p className="text-[#374151] line-clamp-4 leading-relaxed mb-2">{item.content}</p>
            <div className="text-xs text-[#6B7280] font-medium truncate">
              Source: {item.materialName}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-[#6B7280] text-center mt-8">No results found.</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full flex flex-col h-[calc(100vh-64px)]">
      <header className="mb-6 shrink-0">
        <h1 className="font-serif text-3xl font-medium text-[#111827] flex items-center gap-2">
          <Database className="w-7 h-7 text-indigo-600" />
          Retrieval Diagnostics
        </h1>
        <p className="text-[#6B7280] mt-1 text-sm">Compare Vector Search, BM25 Keyword Search, and RRF Hybrid Fusion.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="lg:col-span-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a test query..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Search className="w-5 h-5 text-[#9CA3AF] absolute left-3 top-3.5" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex-1 bg-[#111827] text-white font-medium rounded-xl hover:bg-black transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run Search"}
          </button>
        </div>
      </div>

      {/* Scaffolded Eval Setup */}
      <div className="mb-6 shrink-0 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-indigo-800 uppercase tracking-wide mb-1">Expected Chunk IDs (Optional Eval)</label>
          <input 
            type="text" 
            placeholder="Comma separated chunk IDs..." 
            value={expectedChunkIds}
            onChange={(e) => setExpectedChunkIds(e.target.value)}
            className="w-full text-sm py-1.5 px-3 bg-white border border-indigo-200 rounded focus:outline-none"
          />
        </div>
        {evalMetrics && (
          <div className="flex gap-4 items-center pl-4 border-l border-indigo-200">
            <div><p className="text-xs text-indigo-600 font-medium">MRR</p><p className="font-mono text-lg text-indigo-900">{evalMetrics.mrr.toFixed(2)}</p></div>
            <div><p className="text-xs text-indigo-600 font-medium">Hit Rate</p><p className="font-mono text-lg text-indigo-900">{evalMetrics.hitRate}</p></div>
            <div><p className="text-xs text-indigo-600 font-medium">Recall@5</p><p className="font-mono text-lg text-indigo-900">{evalMetrics.recall.toFixed(2)}</p></div>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        <ResultColumn title="BM25 (Keyword)" icon={Layers} items={results?.bm25 || []} scoreKey="score" />
        <ResultColumn title="Vector (Semantic)" icon={Database} items={results?.vector || []} scoreKey="score" />
        <ResultColumn title="RRF (Hybrid Merge)" icon={Sparkles} items={results?.rrf || []} scoreKey="rrfScore" />
      </div>
    </div>
  );
}
