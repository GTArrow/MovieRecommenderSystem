import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { likedGenres, likedMovieIds, currentMovie } = await req.json();

  const systemPrompt = `
    You are a helpful movie recommendation assistant.
    Your task is to suggest TMDB movies based on the user's preferences and the movie they're currently viewing.
    `;

  const userPrompt = `
    Current movie:
    - Title: ${currentMovie.title}
    - Genres: ${currentMovie.genres.join(", ")}
    - Description: ${currentMovie.description}

    User liked genres: ${likedGenres.join(", ")}
    User liked TMDB movie IDs: ${likedMovieIds.join(", ")}

    Return only a JSON array of 5 recommended TMDB movie IDs as strings.
    Example: ["603", "157336", "447332", "244786", "274857"]
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    let content = completion.choices[0].message.content || "";
    console.log("GPT-4o Response:\n", content);

    content = content.trim();
    if (content.startsWith("```json")) {
      content = content
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const ids: string[] = JSON.parse(content);

    const movies = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
          );
          if (!res.ok)
            throw new Error(`TMDB fetch failed with status ${res.status}`);

          const movie = await res.json();
          return {
            id: movie.id.toString(),
            title: movie.title,
            description: movie.overview,
            genres: movie.genres.map((g: any) => g.name),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          };
        } catch (err) {
          console.warn(`Skipping TMDB movie ID ${id}:`, err.message);
          return null; // fallback: exclude failed movie
        }
      })
    );

    // Filter out any nulls
    const validMovies = movies.filter((movie) => movie !== null);

    return NextResponse.json(validMovies);
  } catch (error) {
    console.error("Error in GPT or TMDB call:", error);
    return NextResponse.json(
      { error: "Failed to get movie recommendations." },
      { status: 500 }
    );
  }
}
