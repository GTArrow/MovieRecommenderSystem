import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enrichPreferences, enrichPreferredGenres } from "@/lib/enrichUserData";
import { RawUser, EnrichedUser } from "@/types/user";

export async function GET() {
  try {
    const users: RawUser[] = await prisma.user.findMany({
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

    const enrichedUsers: EnrichedUser[] = await Promise.all(
      users.map(async (user) => {
        const preferences = await enrichPreferences(user.preferences);
        const genres = await enrichPreferredGenres(user.preferredGenres);

        return {
          ...user,
          preferences,
          preferredGenres: genres,
        };
      })
    );

    return NextResponse.json(enrichedUsers);
  } catch (error) {
    console.error("[GET /api/users]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  age?: number;
  email_verified?: boolean;
  provider_id?: string;
  provider_name?: string;
  access_token?: string;
  preferences?: number[];
  preferredGenres?: number[];
}

export async function POST(req: Request) {
  try {
    const body: CreateUserPayload = await req.json();
    const {
      username,
      email,
      password,
      age,
      email_verified,
      provider_id,
      provider_name,
      access_token,
      preferences = [],
      preferredGenres = [],
    } = body;

    if (!username || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        age,
        email_verified,
        provider_id,
        provider_name,
        access_token,
        preferences: {
          create: preferences.map((liked_movie_id) => ({ liked_movie_id })),
        },
        preferredGenres: {
          create: preferredGenres.map((genre_id) => ({ genre_id })),
        },
      },
      include: {
        preferences: true,
        preferredGenres: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("[POST /api/users]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
