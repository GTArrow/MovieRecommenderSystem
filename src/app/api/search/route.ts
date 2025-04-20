import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB API key is missing" },
      { status: 500 }
    );
  }

  const query = req.nextUrl.searchParams.get("query");

  if (!query) return NextResponse.json([]);

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&api_key=${TMDB_API_KEY}&language=en-US`
  );

  console.log(res);

  if (!res.ok) {
    return NextResponse.json([], { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data.results.slice(0, 8)); // Top 8 results
}
