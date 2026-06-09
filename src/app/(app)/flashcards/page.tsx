import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, prisma } from "@/auth";
import { BookOpen, Play, Library } from "lucide-react";

export default async function FlashcardsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch materials that have flashcards
  const materialsWithCards = await prisma.material.findMany({
    where: { userId: session.user.id },
    include: {
      flashcards: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const materials = materialsWithCards.filter(m => m.flashcards.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 md:py-12 w-full">
      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#111827] tracking-tight">
          Flashcard Library
        </h1>
        <p className="text-base text-[#6B7280] mt-3 font-sans max-w-xl">
          Review all your AI-generated flashcards across different study materials.
        </p>
      </header>

      {materials.length === 0 ? (
        <div className="bg-[#F9FAFB] rounded-2xl border-2 border-dashed border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-[#E5E7EB] mx-auto mb-4 shadow-sm">
            <BookOpen className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#111827] mb-2">No flashcards found</h3>
          <p className="text-[#6B7280] mb-6 max-w-sm mx-auto">
            You haven't extracted any flashcards yet. Upload a document to generate some.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-white border border-[#E5E7EB] text-[#111827] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors shadow-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {materials.map((mat) => (
            <section key={mat.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="bg-[#F9FAFB] px-6 py-4 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600">
                    <Library className="w-5 h-5" />
                  </div>
                  <div>
                    <Link href={`/materials/${mat.id}`} className="font-medium text-[#111827] text-lg hover:underline decoration-[#E5E7EB] underline-offset-4">
                      {mat.title}
                    </Link>
                    <p className="text-xs text-[#6B7280] mt-0.5">{mat.flashcards.length} cards generated</p>
                  </div>
                </div>
                <Link
                  href={`/study?materialId=${mat.id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#111827] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm shrink-0"
                >
                  <Play className="w-4 h-4" fill="currentColor" />
                  Study Session
                </Link>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mat.flashcards.slice(0, 4).map((card) => (
                    <div key={card.id} className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-sm font-medium text-[#111827] mb-3 line-clamp-2 leading-relaxed">
                        <span className="text-[#9CA3AF] mr-2">Q:</span>{card.questionText}
                      </p>
                      <div className="w-full h-px bg-[#F3F4F6] my-3"></div>
                      <p className="text-sm text-[#6B7280] italic line-clamp-3 leading-relaxed">
                        <span className="text-[#9CA3AF] mr-2 not-italic">A:</span>{card.answerText}
                      </p>
                    </div>
                  ))}
                </div>
                {mat.flashcards.length > 4 && (
                  <div className="mt-6 text-center">
                    <Link href={`/materials/${mat.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      View all {mat.flashcards.length} flashcards &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
