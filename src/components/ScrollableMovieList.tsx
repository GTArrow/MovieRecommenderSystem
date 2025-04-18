"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface ScrollableMovieListProps {
  movies: Movie[];
}

export default function ScrollableMovieList({
  movies,
}: ScrollableMovieListProps) {
  return (
    <ScrollArea className="w-[80vw] max-w-screen-lg mx-auto rounded-md">
      <div className="flex w-max space-x-4 p-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
