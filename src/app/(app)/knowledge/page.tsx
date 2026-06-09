import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, prisma } from "@/auth";
import { Share2, FileText, ArrowRight, BookOpen } from "lucide-react";

export default async function KnowledgePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch all concepts for the user's materials, including their edges
  const concepts = await prisma.concept.findMany({
    where: {
      material: {
        userId: session.user.id
      }
    },
    include: {
      material: true,
      sourceEdges: {
        include: { target: true }
      },
      targetEdges: {
        include: { source: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 w-full">
      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#111827] tracking-tight flex items-center gap-3">
          <Share2 className="w-8 h-8 text-indigo-600" />
          Knowledge DNA
        </h1>
        <p className="text-base text-[#6B7280] mt-3 font-sans max-w-xl">
          Mentora's understanding of the core concepts across your documents, and how they connect to one another.
        </p>
      </header>

      {concepts.length === 0 ? (
        <div className="bg-[#F9FAFB] rounded-2xl border-2 border-dashed border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-[#E5E7EB] mx-auto mb-4 shadow-sm">
            <Share2 className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#111827] mb-2">No concepts extracted</h3>
          <p className="text-[#6B7280] mb-6 max-w-sm mx-auto">
            Upload a document to extract its underlying knowledge DNA.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-white border border-[#E5E7EB] text-[#111827] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors shadow-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept) => (
            <div key={concept.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all">
              
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 flex items-center gap-1.5 w-max">
                    Concept
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#111827] mb-2 leading-tight">
                  {concept.name}
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                  {concept.description}
                </p>
              </div>

              {/* Related Concepts */}
              {concept.sourceEdges.length > 0 && (
                <div className="px-5 py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
                    Relates to
                  </p>
                  <ul className="space-y-2">
                    {concept.sourceEdges.map((edge) => (
                      <li key={edge.id} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-[#374151]">
                          <span className="text-[#6B7280] italic mr-1">{edge.relationshipType}</span>
                          <span className="font-medium">{edge.target.name}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source Material */}
              <div className="px-5 py-3 border-t border-[#F3F4F6] bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                  <Link href={`/materials/${concept.materialId}`} className="text-xs text-[#6B7280] truncate hover:text-[#111827] hover:underline">
                    {concept.material.title}
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
