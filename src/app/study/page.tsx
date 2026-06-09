import { redirect } from "next/navigation";
import { prisma } from "@/auth";
import StudySessionClient from "./StudySessionClient";

export default async function StudyPage(props: {
  searchParams: Promise<{ materialId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const materialId = searchParams.materialId;

  if (!materialId) {
    redirect("/dashboard");
  }

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: { flashcards: true },
  });

  if (!material || material.flashcards.length === 0) {
    redirect("/dashboard");
  }

  return <StudySessionClient materialTitle={material.title} flashcards={material.flashcards} />;
}
