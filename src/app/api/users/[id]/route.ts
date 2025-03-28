// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enrichPreferences, enrichPreferredGenres } from "@/lib/enrichUserData";
import { RawUser, EnrichedUser } from "@/types/user";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return new NextResponse("Invalid user ID", { status: 400 });
  }

  try {
    const user: RawUser | null = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        email_verified: true,
        age: true,
        created_at: true,
        updated_at: true,
        provider_name: true,
        preferences: {
          select: {
            liked_movie_id: true,
            createdAt: true,
          },
        },
        preferredGenres: {
          select: {
            genre_id: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Enrich preferences with movie details
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
  username?: string;
  email?: string;
  password?: string;
  age?: number;
  email_verified?: boolean;
  provider_id?: string;
  provider_name?: string;
  access_token?: string;
  preferredGenres?: number[];
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return new NextResponse("Invalid user ID", { status: 400 });
  }

  try {
    const body: UpdateUserPayload = await req.json();
    const {
      username,
      email,
      password,
      age,
      email_verified,
      provider_id,
      provider_name,
      access_token,
      preferredGenres = [], // array of genre IDs
    } = body;

    // Step 1: Update basic user info
    await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        password,
        age,
        email_verified,
        provider_id,
        provider_name,
        access_token,
      },
    });

    // Step 2: Replace preferredGenres
    // Delete old ones
    await prisma.userPreferredGenre.deleteMany({
      where: { user_id: userId },
    });

    // Create new ones
    await prisma.userPreferredGenre.createMany({
      data: preferredGenres.map((genre_id: number) => ({
        user_id: userId,
        genre_id,
      })),
    });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("[PATCH /api/users/:id]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
