"use client";

import { useEffect, useState, useRef } from "react";
import ScrollableMovieList from "@/components/ScrollableMovieList";
import { useMovies } from "@/context/MovieContext";
import HeroSection from "./home/components/HeroSection";
import { SessionUser } from "@/types/user";
import { authClient } from "@/lib/auth-client";

// const mockLikedMovieIds = ["603", "157336", "27205"];
// const mockLikedGenres = ["Sci-Fi", "Comedy", "Action", "Drama"];

export default function Home() {
  const { movies, setMovies } = useMovies();
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const { data: session, isPending } = authClient.useSession();

  const gptEnabled = process.env.NEXT_PUBLIC_ENABLE_GPT === "true";
  const user = session?.user as SessionUser;
  //console.log("User", user);

  // Track if we've already fetched recommendations
  const hasFetchedRecs = useRef(false);

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
      if (!gptEnabled || hasFetchedRecs.current) return;

      setLoadingRecs(true);
      hasFetchedRecs.current = true;

      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            likedGenres: user?.likedGenres ?? [],
            likedMovieIds: user?.likedMovieIds ?? [],
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

    if (!isPending) {
      fetchRecommendations();
    }
  }, [gptEnabled, user, isPending]);

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
