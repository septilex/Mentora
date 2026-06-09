"use client";

import { useState } from "react";
import { Search, BookOpen, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ answer: string; sources: any[] } | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAsking(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({ answer: data.answer, sources: data.sources });
      } else {
        setError(data.error || "Failed to generate answer");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsAsking(false);
    }
  };

  const isOutOfContext = result?.answer === "I don't have enough information in the uploaded materials.";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#111827] tracking-tight flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-600" />
          Ask Mentora
        </h1>
        <p className="text-base text-[#6B7280] mt-3 font-sans">
          Ask any question. Answers are securely generated only from your uploaded materials.
        </p>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-lg shadow-gray-200/50 mb-10 max-w-2xl mx-auto">
        <form onSubmit={handleAsk} className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to know?"
              className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-[#111827] text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isAsking || !query.trim()}
            className="w-full py-4 bg-blue-600 text-white font-medium text-lg rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
          >
            {isAsking ? <Loader2 className="w-6 h-6 animate-spin" /> : "Generate Answer"}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-8 rounded-3xl border shadow-sm ${isOutOfContext ? 'bg-amber-50 border-amber-200' : 'bg-white border-[#E5E7EB]'}`}>
            <h3 className="font-serif text-xl font-medium text-[#111827] mb-4 flex items-center gap-2">
              {isOutOfContext ? <AlertCircle className="w-6 h-6 text-amber-500" /> : <Sparkles className="w-6 h-6 text-blue-600" />}
              AI Answer
            </h3>
            <div className={`text-lg leading-relaxed ${isOutOfContext ? 'text-amber-800' : 'text-[#374151]'}`}>
              {result.answer.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>

          {!isOutOfContext && result.sources.length > 0 && (
            <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E7EB]">
              <h3 className="font-serif text-lg font-medium text-[#111827] mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                Sources Used
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.sources.map((source, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        {source.materialName}
                      </span>
                      <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                        Score: {source.similarityScore.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-[#4B5563] italic leading-relaxed line-clamp-4">
                      "{source.excerpt}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
