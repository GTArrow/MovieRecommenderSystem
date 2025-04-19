import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { likedGenres, likedMovieIds, currentMovie } = await req.json();

  const systemPrompt = `
    You are a helpful movie recommendation assistant.
    You generate movie suggestions based on a user's taste and the current movie they are viewing.
    Respond only in valid JSON format as requested.
    `;

  const userPrompt = `
    The user is currently viewing the movie:
    
    Title: ${currentMovie.title}
    Genres: ${currentMovie.genres.join(", ")}
    Description: ${currentMovie.description}
    
    The user likes these genres: ${likedGenres.join(", ")}.
    They also liked these TMDB movie IDs: ${likedMovieIds.join(", ")}.
    
    Please recommend 5 movies that are either:
    - similar to the current movie, or
    - likely to be appreciated by the user based on their preferences.
    
    Return your response as a JSON array of 5 movie objects. Each movie object should include:
    - id (TMDB ID as a string)
    - title (string)
    - genres (array of strings)
    - description (short 1-2 sentence summary)
    - poster (full poster URL like https://image.tmdb.org/t/p/w500/{poster_path})
    
    Do not include any explanation or formatting—return only the raw JSON array.
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    let content = completion.choices[0].message.content || "";
    console.log("GPT-4o Response:\n", content);

    // Clean up GPT output if wrapped in code block
    content = content.trim();
    if (content.startsWith("```json")) {
      content = content
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error in GPT call:", error);
    return NextResponse.json(
      { error: "Failed to get movie recommendations." },
      { status: 500 }
    );
  }
}
