import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { customSession } from "better-auth/plugins";
import { SessionUser } from "@/types/user";
import { genreMap } from "@/lib/genres";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const preferences = await prisma.userPreference.findMany({
        where: { userId: user.id },
        select: { liked_movie_id: true },
      });

      const likedMovieIds = preferences.map((p) => p.liked_movie_id);

      const genrePrefs = await prisma.userPreferredGenre.findMany({
        where: { userId: user.id },
        select: { genre_id: true },
      });

      const likedGenreIds = genrePrefs.map((g) => g.genre_id);
      const likedGenres = likedGenreIds
        .map((id) => genreMap[id])
        .filter(Boolean);

      const myUser: SessionUser = {
        ...user,
        likedMovieIds,
        likedGenres,
      };
      return {
        session,
        user: myUser,
      };
    }),
  ],
});
