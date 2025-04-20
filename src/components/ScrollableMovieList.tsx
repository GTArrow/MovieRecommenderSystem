"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MovieBasicInfo } from "@/types/movie";
import MovieCard from "./MovieCard";

interface ScrollableMovieListProps {
  movies: MovieBasicInfo[];
}

export default function ScrollableMovieList({
  movies,
}: ScrollableMovieListProps) {
  return (
    <ScrollArea className="w-[80vw] max-w-screen-lg mx-auto">
      <div className="flex w-max p-4 pl-0">
        {movies &&
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
