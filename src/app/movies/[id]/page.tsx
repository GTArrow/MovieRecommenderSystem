"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct way to get params
import { useMovies } from "@/context/MovieContext";
import { Movie } from "@/types/movie";
import MovieInfo from "./components/MovieInfo";
import Recommendation from "./components/Recommendation";

export default function MovieDetail() {
  const params = useParams(); // Get params (now async)
  const { movies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function loadMovie() {
      if (!params?.id) return;

      // Normalize ID from dynamic route (in case it's an array)
      const movieId = Array.isArray(params.id) ? params.id[0] : params.id;

      // Try finding the movie in the context first
      let foundMovie = movies.find((m) => m.id === movieId);

      if (!foundMovie) {
        try {
          const res = await fetch(`/api/movies/${movieId}`);
          if (!res.ok) throw new Error("Failed to fetch movie from API");

          const data = await res.json();
          foundMovie = data;
        } catch (error) {
          console.error("Error fetching movie:", error);
        }
      }

      setMovie(foundMovie || null);
    }

    loadMovie();
  }, [params, movies]);

  if (!movie) return <p className="text-center mt-10">Movie not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <MovieInfo movie={movie} />
      <Recommendation />
    </div>
  );
}
