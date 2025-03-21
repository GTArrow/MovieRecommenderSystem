"use client";

import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface ScrollableMovieListProps {
  movies: Movie[];
}

export default function ScrollableMovieList({
  movies,
}: ScrollableMovieListProps) {
  return (
    <div className="relative w-[80vw] max-w-screen-lg mx-auto">
      {/* Scrollable Container (80% of window width) */}
      <div className="overflow-x-auto whitespace-nowrap flex gap-4 p-4 scrollbar-hide">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
