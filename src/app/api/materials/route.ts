import { NextResponse } from "next/server";
import { auth, prisma } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbMaterials = await prisma.material.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { chunks: true }
        },
        chunks: {
          select: {
            embedding: { select: { id: true } }
          }
        }
      }
    });

    const materials = dbMaterials.map(mat => {
      const embeddingCount = mat.chunks.filter(c => c.embedding !== null).length;
      return {
        id: mat.id,
        title: mat.title,
        status: mat.status,
        createdAt: mat.createdAt,
        _count: mat._count,
        embeddingCount
      };
    });

    return NextResponse.json({ materials });
  } catch (error) {
    console.error("[Materials API] Error fetching materials:", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}
