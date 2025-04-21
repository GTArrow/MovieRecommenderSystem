import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Genre } from "@/types/genre";
import { genreMap } from "@/lib/genres";
import { Movie } from "@/types/movie";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to batch fetch genre name by ID
export async function batchFetchGenresById(ids: number[]): Promise<Genre[]> {
  try {
    const genres: Genre[] = ids
      .filter((id) => genreMap[id] !== undefined)
      .map((id) => ({
        id,
        name: genreMap[id],
      }));

    return genres;
  } catch (error) {
    console.error("[batchFetchGenresById] Failed to map genres:", error);
    return [];
  }
}

export async function fetchMovieById(movieId: string) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing");
  }
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch movie details");
  }
  const movie = await res.json();
  const formattedMovie: Movie = {
    id: movie.id.toString(),
    title: movie.title,
    genres: movie.genres?.map((g: any) => g.name),
    description: movie.overview,
    poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  };

  return formattedMovie;
}
