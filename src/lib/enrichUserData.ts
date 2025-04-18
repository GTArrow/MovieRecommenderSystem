// lib/enrichUserData.ts
import { fetchMovieById } from "@/lib/tmdb";
import { batchFetchGenresById } from "@/app/api/genres/route";

export async function enrichPreferences(
  preferences: { liked_movie_id: number; createdAt: Date }[]
) {
  return Promise.all(
    preferences.map(async (pref) => {
      let movie = null;
      try {
        movie = await fetchMovieById(pref.liked_movie_id.toString());
      } catch (error) {
        console.error(`Error fetching movie ${pref.liked_movie_id}:`, error);
      }

      return {
        liked_movie_id: pref.liked_movie_id,
        createdAt: pref.createdAt,
        movie,
      };
    })
  );
}

export async function enrichPreferredGenres(
  preferredGenres: { genre_id: number; createdAt: Date }[]
) {
  const genreIds = preferredGenres.map((g) => g.genre_id);
  const genreDetails = await batchFetchGenresById(genreIds);

  return preferredGenres.map((pg) => {
    const match = genreDetails.find((g) => g.id === pg.genre_id);
    return {
      genre_id: pg.genre_id,
      name: match?.name || "Unknown",
      createdAt: pg.createdAt,
    };
  });
}
