import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Movie } from "@/types/movie";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB API key is missing" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const movie = await res.json();

    const formattedMovie: Movie = {
      id: movie.id.toString(),
      title: movie.title,
      description: movie.overview,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      genres: movie.genres.map((g: any) => g.name),
    };

    return NextResponse.json(formattedMovie);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}
