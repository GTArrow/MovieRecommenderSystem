"use client";

import Image from "next/image";
import { Movie } from "@/types/movie";

export default function MovieListContainer({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return <p className="text-muted-foreground">No movies to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 justify-between">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="flex flex-col items-center text-center gap-2"
        >
          <Image
            src={movie.poster}
            alt={movie.title}
            width={96}
            height={144}
            className="rounded"
          />
          <p className="text-sm font-medium">{movie.title}</p>
        </div>
      ))}
    </div>
  );
}
