"use client";

import { useState } from "react";
import { Search, FileText, Loader2 } from "lucide-react";

export default function TestRetrievalPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/retrieval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#111827] tracking-tight">
          Semantic Search Test
        </h1>
        <p className="text-base text-[#6B7280] mt-3 font-sans">
          Test the retrieval pipeline. Embeds your query and uses cosine similarity to find the top 5 chunks.
        </p>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm mb-10">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What is virtual memory?"
              className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-[#111827]"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="px-6 py-3 bg-[#111827] text-white font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Retrieve"}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}
      </div>

      <div className="space-y-6">
        {results.length > 0 && <h3 className="font-serif text-xl font-medium text-[#111827] mb-4">Top Matches</h3>}
        {results.map((result, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm flex flex-col gap-3 hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-[#111827]">{result.materialName}</span>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                Score: {result.score.toFixed(4)}
              </span>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed bg-[#F9FAFB] p-4 rounded-lg border border-[#F3F4F6] italic">
              "{result.preview}"
            </p>
            <div className="text-xs text-[#9CA3AF]">Chunk ID: {result.chunkId}</div>
          </div>
        ))}
        {results.length === 0 && !isSearching && !error && (
          <div className="text-center py-12 text-[#6B7280]">
            Enter a question to search across your uploaded documents.
          </div>
        )}
      </div>
    </div>
  );
}
