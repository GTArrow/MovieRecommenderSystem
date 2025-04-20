"use client";

import { useEffect, useState } from "react";
import ScrollableMovieList from "@/components/ScrollableMovieList";
import { useMovies } from "@/context/MovieContext";
import HeroSection from "./home/components/HeroSection";

const mockLikedMovieIds = ["603", "157336", "27205"];
const mockLikedGenres = ["Sci-Fi", "Comedy", "Action", "Drama"];

export default function Home() {
  const { movies, setMovies } = useMovies();
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  const gptEnabled = process.env.NEXT_PUBLIC_ENABLE_GPT === "true";

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("/api/movies");
        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    if (movies.length === 0) fetchMovies();
  }, [movies, setMovies]);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!gptEnabled) return;
      setLoadingRecs(true);
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            likedGenres: mockLikedGenres,
            likedMovieIds: mockLikedMovieIds,
            count: 10,
          }),
        });

        const data = await res.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoadingRecs(false);
      }
    }

    fetchRecommendations();
  }, [gptEnabled]);

  return (
    <div className="p-6">
      <HeroSection />

      <h2 className="text-2xl font-bold mt-10 mb-4">Top 10 Popular Movies</h2>
      <ScrollableMovieList movies={movies} />

      {gptEnabled && (
        <div>
          <h2 className="text-2xl font-bold mt-6 mb-4">
            Movies Recommended for You
          </h2>

          {loadingRecs ? (
            <p className="text-muted-foreground mb-6">
              Loading recommendations...
            </p>
          ) : (
            <ScrollableMovieList movies={recommendations} />
          )}
        </div>
      )}
    </div>
  );
}
