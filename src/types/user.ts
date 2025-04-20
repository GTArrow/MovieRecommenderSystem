// types/user.ts
import { Movie } from "./movie";
import { Prisma } from "@prisma/client";
import { UserPreferredGenre, UserPreference } from "@prisma/client";

export interface UserPreferenceMovieDetail extends UserPreference {
  movie: Movie | null;
}

export interface UserPreferredGenreDetail extends UserPreferredGenre {
  name: string;
}

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
        userId: true;
        liked_movie_id: true;
        createdAt: true;
      };
    };
    preferredGenres: {
      select: {
        userId: true;
        genre_id: true;
        createdAt: true;
      };
    };
  };
}>;

export type EnrichedUser = Omit<RawUser, "preferences" | "preferredGenres"> & {
  preferences: UserPreferenceMovieDetail[];
  preferredGenres: UserPreferredGenreDetail[];
};
