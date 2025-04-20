import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const userId = id;
  const { liked_movie_id }: { liked_movie_id: number } = await req.json();

  if (!userId || !liked_movie_id) {
    return new NextResponse("Missing userId or liked_movie_id", {
      status: 400,
    });
  }

  try {
    await prisma.userPreference.create({
      data: {
        userId,
        liked_movie_id,
      },
    });

    return NextResponse.json({ message: "Single movie preference added" });
  } catch (error) {
    console.error("[POST /users/:id/preferences/single]", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
