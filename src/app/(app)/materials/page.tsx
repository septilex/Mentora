import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, prisma } from "@/auth";
import { FileText, Database, Layers, Calendar, ArrowRight } from "lucide-react";

export default async function MaterialsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const materials = await prisma.material.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { chunks: true, flashcards: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate embedding count (for now, assume each chunk has an embedding if processed, or we can just query chunks)
  // Actually we need to get embedding counts per material. 
  // Let's augment materials array
  const enhancedMaterials = await Promise.all(
    materials.map(async (m) => {
      const embeddingCount = await prisma.chunkEmbedding.count({
        where: {
          chunk: {
            materialId: m.id
          }
        }
      });
      return { ...m, embeddingCount };
    })
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 md:py-12 w-full">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#111827] tracking-tight">
            Materials Library
          </h1>
          <p className="text-base text-[#6B7280] mt-3 font-sans max-w-xl">
            All your uploaded documents and their extracted knowledge base statistics.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-[#111827] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm"
        >
          Upload New PDF
        </Link>
      </header>

      {enhancedMaterials.length === 0 ? (
        <div className="bg-[#F9FAFB] rounded-2xl border-2 border-dashed border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-[#E5E7EB] mx-auto mb-4 shadow-sm">
            <FileText className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#111827] mb-2">No materials yet</h3>
          <p className="text-[#6B7280] mb-6 max-w-sm mx-auto">
            Upload your first lecture PDF to start building your personal knowledge base.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-white border border-[#E5E7EB] text-[#111827] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors shadow-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enhancedMaterials.map((mat) => (
            <Link 
              href={`/materials/${mat.id}`}
              key={mat.id}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm hover:border-blue-200 hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 pr-4">
                  <h3 className="font-medium text-[#111827] text-lg mb-1 leading-tight group-hover:text-blue-700 transition-colors">
                    {mat.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(mat.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Chunks</span>
                  </div>
                  <div className="text-xl font-serif font-medium text-[#111827]">{mat._count.chunks}</div>
                </div>
                <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
                    <Database className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Embeddings</span>
                  </div>
                  <div className="text-xl font-serif font-medium text-[#111827]">{mat.embeddingCount}</div>
                </div>
              </div>

              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
