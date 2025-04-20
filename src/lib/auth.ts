import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import type { Session, User } from "better-auth";

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
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      const preferences = await prisma.userPreference.findMany({
        where: { userId: user.id },
        select: { liked_movie_id: true },
      });

      const likedMovieIds = preferences.map((p) => p.liked_movie_id);

      return {
        ...session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          likedMovieIds,
        },
      };
    },
  },
});
