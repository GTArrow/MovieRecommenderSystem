// types/user.ts
import { Movie } from "./movie";
import { Prisma } from "@prisma/client";

export type RawUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    emailVerified: true;
    age: true;
    createdAt: true;
    updatedAt: true;
    name: true;
    image: true;
    preferences: {
      select: {
        liked_movie_id: true;
        createdAt: true;
      };
    };
    preferredGenres: {
      select: {
        genre_id: true;
        createdAt: true;
      };
    };
  };
}>;

export type EnrichedUser = Omit<RawUser, "preferences" | "preferredGenres"> & {
  preferences: {
    liked_movie_id: number;
    createdAt: Date;
    movie: Movie | null;
  }[];
  preferredGenres: {
    genre_id: number;
    name: string;
    createdAt: Date;
  }[];
};
