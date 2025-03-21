import { NextResponse } from "next/server";
import { genreMap } from "@/lib/genres";
import { TMDBMovie } from "@/types/tmdb";

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
    const movies = data.results.slice(0, 10).map((movie: TMDBMovie) => ({
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
