import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enrichPreferences, enrichPreferredGenres } from "@/lib/enrichUserData";
import { RawUser, EnrichedUser } from "@/types/user";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { id } = await params;
  const userId = id;

  if (!userId) {
    return new NextResponse("Missing user ID", { status: 400 });
  }

  try {
    const user: RawUser | null = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        age: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        preferences: {
          select: {
            userId: true,
            liked_movie_id: true,
            createdAt: true,
          },
        },
        preferredGenres: {
          select: {
            userId: true,
            genre_id: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const preferences = await enrichPreferences(user.preferences);
    const genres = await enrichPreferredGenres(user.preferredGenres);

    const enrichedUser: EnrichedUser = {
      ...user,
      preferences,
      preferredGenres: genres,
    };

    return NextResponse.json(enrichedUser);
  } catch (error) {
    console.error("[GET /api/users/:id]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

interface UpdateUserPayload {
  email?: string;
  password?: string;
  age?: number;
  emailVerified?: boolean;
  name?: string;
  image?: string;
  preferredGenres?: number[];
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { id } = await params;
  const userId = id;

  if (!userId) {
    return new NextResponse("Missing user ID", { status: 400 });
  }

  try {
    const body: UpdateUserPayload = await request.json();
    const { email, age, name, image } = body;

    // Step 1: Update user data
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        age,
        image,
      },
    });

    // // Step 2: Replace preferredGenres
    // await prisma.userPreferredGenre.deleteMany({
    //   where: { userId },
    // });

    // await prisma.userPreferredGenre.createMany({
    //   data: preferredGenres.map((genre_id) => ({
    //     userId,
    //     genre_id,
    //   })),
    // });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("[PATCH /api/users/:id]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
