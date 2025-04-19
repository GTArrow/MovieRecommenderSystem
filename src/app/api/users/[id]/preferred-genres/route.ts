import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const userId = id;
  const { genre_ids }: { genre_ids: number[] } = await req.json();

  if (!userId || !Array.isArray(genre_ids)) {
    return new NextResponse("Missing userId or genre_ids", { status: 400 });
  }

  try {
    // 1. Delete existing preferred genres
    await prisma.userPreferredGenre.deleteMany({ where: { userId } });

    // 2. Insert new ones
    const data = genre_ids.map((genre_id) => ({ userId, genre_id }));
    if (data.length > 0) {
      await prisma.userPreferredGenre.createMany({ data });
    }

    return NextResponse.json({
      message: "Preferred genres updated successfully",
    });
  } catch (error) {
    console.error("[POST /preferred-genres bulk]", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const userId = id;
  const { genre_ids }: { genre_ids: number[] } = await req.json();

  if (!userId || !Array.isArray(genre_ids)) {
    return new NextResponse("Missing userId or genre_ids", { status: 400 });
  }

  try {
    await prisma.userPreferredGenre.deleteMany({
      where: {
        userId,
        genre_id: { in: genre_ids },
      },
    });

    return NextResponse.json({
      message: "Selected preferred genres deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /preferred-genres bulk]", error);
    return new NextResponse("Error deleting preferred genres", { status: 500 });
  }
}
