import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, prisma } from "@/auth";
import { ArrowLeft, BookOpen, Layers, Database, Search, Sparkles, Share2 } from "lucide-react";

export default async function MaterialDetailsPage(props: {
  params: Promise<{ id: string }>
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await props.params;

  const material = await prisma.material.findFirst({
    where: { id, userId: session.user.id },
    include: {
      chunks: {
        include: { embedding: true },
        orderBy: { chunkIndex: 'asc' }
      },
      flashcards: true,
      concepts: {
        include: {
          sourceEdges: { include: { target: true } },
          targetEdges: { include: { source: true } }
        }
      }
    }
  });

  if (!material) {
    redirect("/materials");
  }

  const embeddingCount = material.chunks.filter(c => c.embedding).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 w-full">
      <Link 
        href="/materials" 
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
              material.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {material.status}
            </span>
            <span className="text-sm text-[#6B7280]">
              Uploaded {new Date(material.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-[#111827] tracking-tight">
            {material.title}
          </h1>
        </div>
        
        {material.flashcards.length > 0 && (
          <Link
            href={`/study?materialId=${material.id}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111827] text-white font-medium rounded-xl hover:bg-black transition-colors shadow-md shadow-black/10 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Study Session
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Flashcards */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#F9FAFB] rounded-2xl p-6 border border-[#E5E7EB]">
            <h3 className="font-serif text-xl font-medium text-[#111827] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Generated Flashcards
            </h3>
            
            {material.flashcards.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No flashcards extracted yet.</p>
            ) : (
              <div className="space-y-4">
                {material.flashcards.map((card, idx) => (
                  <div key={card.id} className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
                    <p className="text-sm font-medium text-[#111827] mb-2"><span className="text-[#9CA3AF] mr-2">Q:</span>{card.questionText}</p>
                    <p className="text-sm text-[#6B7280] italic"><span className="text-[#9CA3AF] mr-2 not-italic">A:</span>{card.answerText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Chunks & Retrieval Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Concepts</p>
                <p className="text-2xl font-serif text-[#111827]">{material.concepts.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Chunks</p>
                <p className="text-2xl font-serif text-[#111827]">{material.chunks.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Embeddings</p>
                <p className="text-2xl font-serif text-[#111827]">{embeddingCount}</p>
              </div>
            </div>
          </div>

          {material.concepts.length > 0 && (
            <div>
              <h3 className="font-serif text-xl font-medium text-[#111827] mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600" />
                Knowledge DNA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {material.concepts.map((concept) => (
                  <div key={concept.id} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                    <h4 className="font-medium text-[#111827] mb-2">{concept.name}</h4>
                    <p className="text-sm text-[#4B5563] leading-relaxed mb-3">{concept.description}</p>
                    {concept.sourceEdges.length > 0 && (
                      <div className="pt-3 border-t border-[#F3F4F6]">
                        <p className="text-xs font-semibold text-[#9CA3AF] uppercase mb-2">Relates to</p>
                        <ul className="space-y-1">
                          {concept.sourceEdges.map((edge) => (
                            <li key={edge.id} className="text-xs text-[#374151] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                              <span className="text-[#6B7280] italic">{edge.relationshipType}</span>
                              <span className="font-medium">{edge.target.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-serif text-xl font-medium text-[#111827] mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#6B7280]" />
              Knowledge Base Chunks
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {material.chunks.map((chunk) => (
                <div key={chunk.id} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded">
                      Chunk #{chunk.chunkIndex}
                    </span>
                    {chunk.embedding && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        Embedded
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#374151] leading-relaxed font-sans">{chunk.content}</p>
                </div>
              ))}
              {material.chunks.length === 0 && (
                <div className="text-center py-12 bg-[#F9FAFB] border border-dashed border-[#E5E7EB] rounded-2xl">
                  <p className="text-[#6B7280]">No text chunks extracted.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
