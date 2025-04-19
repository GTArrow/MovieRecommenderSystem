import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const userId = id;
  const { liked_movie_ids }: { liked_movie_ids: number[] } = await req.json();

  if (!userId || !Array.isArray(liked_movie_ids)) {
    return new NextResponse("Missing userId or liked_movie_ids", {
      status: 400,
    });
  }

  try {
    // 1. Remove existing preferences for user
    await prisma.userPreference.deleteMany({
      where: { userId },
    });

    // 2. Bulk insert new preferences
    const data = liked_movie_ids.map((movieId) => ({
      userId,
      liked_movie_id: movieId,
    }));

    if (data.length > 0) {
      await prisma.userPreference.createMany({ data });
    }

    return NextResponse.json({ message: "User preferences updated" });
  } catch (error) {
    console.error("[POST /preferences bulk]", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const userId = id;
  const { liked_movie_ids }: { liked_movie_ids: number[] } = await req.json();

  if (!userId || !Array.isArray(liked_movie_ids)) {
    return new NextResponse("Missing userId or liked_movie_ids", {
      status: 400,
    });
  }

  try {
    await prisma.userPreference.deleteMany({
      where: {
        userId,
        liked_movie_id: { in: liked_movie_ids },
      },
    });

    return NextResponse.json({
      message: "Movie preference deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /preferences bulk]", error);
    return new NextResponse("Error deleting movie preference", { status: 500 });
  }
}
