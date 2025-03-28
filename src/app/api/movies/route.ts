import { NextResponse } from "next/server";
import { genreMap } from "@/lib/genres";
import { TMDBMovie } from "@/types/tmdb";
import { Movie } from "@/types/movie";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

export async function GET() {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  try {
    const response = await fetch(TMDB_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();
    const movies: Movie[] = data.results.slice(0, 10).map((movie: TMDBMovie): Movie => ({
      id: movie.id.toString(),
      title: movie.title,
      genres: movie.genre_ids.map((id: number) => genreMap[id] || "Unknown"),
      description: movie.overview,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    }));

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json(
      { error: error }, // "Error fetching movies"
      { status: 500 }
    );
  }
}

export async function fetchMovieById(movieId: number) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing");
  }
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
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
