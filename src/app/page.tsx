"use client";

import { useEffect } from "react";
import ScrollableMovieList from "@/components/ScrollableMovieList";
import { useMovies } from "@/context/MovieContext";
import HeroSection from "./home/components/HeroSection";

export default function Home() {
  const { movies, setMovies } = useMovies();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("/api/movies"); // Fetch from our API route
        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    if (movies.length === 0) fetchMovies(); // Fetch only if movies are not stored
  }, [movies, setMovies]);

  return (
    <div className="p-6">
      <HeroSection />
      <h2 className="text-2xl font-bold mt-6 mb-4">Top 10 Popular Movies</h2>
      <ScrollableMovieList movies={movies} />
    </div>
  );
}
