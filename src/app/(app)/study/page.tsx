import { redirect } from "next/navigation";
import { auth, prisma } from "@/auth";
import StudySessionClient from "./StudySessionClient";

export default async function StudyPage(props: {
  searchParams: Promise<{ materialId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const materialId = searchParams.materialId;

  if (!materialId) {
    redirect("/dashboard");
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const material = await prisma.material.findFirst({
    where: { id: materialId, userId: session.user.id },
    include: { flashcards: true },
  });

  if (!material || material.flashcards.length === 0) {
    redirect("/dashboard");
  }

  return <StudySessionClient materialTitle={material.title} flashcards={material.flashcards} />;
}
