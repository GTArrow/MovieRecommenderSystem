import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { customSession } from "better-auth/plugins";
import { SessionUser } from "@/types/user";

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
      const myUser: SessionUser = {
        ...user,
        likedMovieIds,
      };
      return {
        session,
        user: myUser,
      };
    }),
  ],
});
