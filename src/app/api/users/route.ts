import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enrichPreferences, enrichPreferredGenres } from "@/lib/enrichUserData";
import { RawUser, EnrichedUser } from "@/types/user";

export async function GET() {
  try {
    const users: RawUser[] = await prisma.user.findMany({
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
  email: string;
  password: string;
  age?: number;
  emailVerified: boolean;
  name: string;
  image?: string;
  preferences?: number[];
  preferredGenres?: number[];
}

export async function POST(req: Request) {
  try {
    const body: CreateUserPayload = await req.json();
    const {
      email,
      password,
      age,
      emailVerified,
      name,
      image,
      preferences = [],
      preferredGenres = [],
    } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { email }],
      },
    });

    if (existingUser) {
      const conflictField = existingUser.name === name ? "username" : "email";
      return new NextResponse(`${conflictField} already exists`, {
        status: 409,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        age,
        emailVerified,
        image,
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
