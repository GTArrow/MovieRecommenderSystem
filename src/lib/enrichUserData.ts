// lib/enrichUserData.ts
import { fetchMovieById } from "@/lib/utils";
import { batchFetchGenresById } from "@/lib/utils";
import {
  UserPreferenceMovieDetail,
  UserPreferredGenreDetail,
} from "@/types/user";

export async function enrichPreferences(
  preferences: { userId: string; liked_movie_id: number; createdAt: Date }[]
): Promise<UserPreferenceMovieDetail[]> {
  return Promise.all(
    preferences.map(async (pref) => {
      let movie = null;
      try {
        movie = await fetchMovieById(pref.liked_movie_id.toString());
      } catch (error) {
        console.error(`Error fetching movie ${pref.liked_movie_id}:`, error);
      }

      const enriched: UserPreferenceMovieDetail = {
        userId: pref.userId,
        liked_movie_id: pref.liked_movie_id,
        createdAt: pref.createdAt,
        movie,
      };

      return enriched;
    })
  );
}

export async function enrichPreferredGenres(
  preferredGenres: { userId: string; genre_id: number; createdAt: Date }[]
) {
  const genreIds = preferredGenres.map((g) => g.genre_id);
  const genreDetails = await batchFetchGenresById(genreIds);

  return preferredGenres.map((pg) => {
    const match = genreDetails.find((g) => g.id === pg.genre_id);
    const enriched: UserPreferredGenreDetail = {
      userId: pg.userId,
      genre_id: pg.genre_id,
      name: match?.name || "Unknown",
      createdAt: pg.createdAt,
    };
    return enriched;
  });
}
