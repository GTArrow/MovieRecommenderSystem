import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { Movie } from "@/types/movie";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
    You are a helpful movie recommendation assistant.
    Your task is to suggest TMDB movies based on a user's preferences, and optionally based on a movie they are currently viewing.
    Return your response in valid JSON format as instructed.
`;

interface UserPromptProps {
  likedGenres: string[];
  likedMovieIds: string[];
  currentMovie?: Movie;
  count?: number;
}

function buildUserPrompt({
  likedGenres,
  likedMovieIds,
  currentMovie,
  count = 5,
}: UserPromptProps): string {
  const lines: string[] = [];

  // Current Movie Context
  if (currentMovie) {
    lines.push(
      `The user is currently watching a movie:`,
      ``,
      `- Title: ${currentMovie.title}`,
      `- Genres: ${currentMovie.genres.join(", ")}`,
      `- Description: ${currentMovie.description}`,
      ``,
      `Please focus your recommendations on movies that are **closely related** to this movie in theme, tone, or genre.`,
      `Prioritize movies that feel like natural follow-ups, spiritual sequels, or share stylistic similarities.`,
      `Do not include the currently viewed movie (TMDB ID: ${currentMovie.id}).`,
      ``
    );
  } else {
    lines.push(`The user is not currently watching a specific movie.`, ``);
  }

  // User Preferences
  if (likedGenres.length > 0 || likedMovieIds.length > 0) {
    if (likedGenres.length > 0) {
      lines.push(
        `The user likes the following genres: ${likedGenres.join(", ")}.`
      );
    }

    if (likedMovieIds.length > 0) {
      lines.push(
        `They also previously enjoyed the following TMDB movie IDs: ${likedMovieIds.join(
          ", "
        )}.`
      );
      lines.push(
        `Do not recommend any of these TMDB movie IDs (${likedMovieIds.join(
          ", "
        )}) again in the response.`
      );
    }

    lines.push(``);
  } else {
    lines.push(
      `The user has not provided any liked genres or previously liked movies.`,
      `Please make general movie recommendations that are widely appealing, popular, or critically acclaimed.`,
      `You may include a mix of genres and styles.`,
      ``
    );
  }

  // Output Format Instructions
  lines.push(
    `Please recommend exactly ${count} TMDB movie IDs (as strings) that the user is likely to enjoy based on their liked Genres and liked Movies.`,
    ``,
    `Return your response as a JSON array of ${count} TMDB movie IDs, like:`,
    `["603", "157336", "447332", "244786", "274857"]`,
    ``,
    `Do not include any explanations or formatting—only return the raw JSON array.`
  );

  return lines.join("\n").trim();
}

function filterOutCurrentMovie(
  ids: string[],
  currentMovieId?: string
): string[] {
  if (!currentMovieId) return ids;
  return ids.filter((id) => id !== currentMovieId.toString());
}

async function getMovieIdsFromGPT(userPrompt: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5, // balanced betwwen creative and deterministic
    top_p: 0.9, // samples from top tokens whose cumulative prob ≤ 90%
  });

  let content = response.choices[0].message.content || "";
  console.log("GPT-4o Response:\n", content);

  // Remove markdown code block markers
  content = content.trim();
  if (content.startsWith("```json")) {
    content = content
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
  } else if (content.startsWith("```")) {
    content = content.replace(/^```/, "").replace(/```$/, "").trim();
  }

  return JSON.parse(content);
}

async function fetchTMDBMovies(ids: string[]) {
  const results = await Promise.all(
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
      } catch (err: any) {
        console.warn(`Skipping TMDB movie ID ${id}:`, err.message);
        return null;
      }
    })
  );

  return results.filter((m) => m !== null);
}

export async function POST(req: Request) {
  const { likedGenres, likedMovieIds, currentMovie, count } = await req.json();

  try {
    const prompt = buildUserPrompt({
      likedGenres,
      likedMovieIds,
      currentMovie,
      count,
    });
    const ids = await getMovieIdsFromGPT(prompt);
    const filteredIds = filterOutCurrentMovie(ids, currentMovie?.id);
    const movies = await fetchTMDBMovies(filteredIds);

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error in GPT or TMDB call:", error);
    return NextResponse.json(
      { error: "Failed to get movie recommendations." },
      { status: 500 }
    );
  }
}
