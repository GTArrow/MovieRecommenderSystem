"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";

export default function MovieInfo({ movie }: { movie: Movie }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        <Image
          src={movie.poster}
          alt={movie.title}
          width={300}
          height={400}
          className="rounded-xl shadow-md object-cover"
        />
      </div>

      <div className="flex flex-col justify-between space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            {movie.genres.map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
          <p className="mt-6 text-muted-foreground">{movie.description}</p>
        </div>

        <div className="flex gap-4">
          <Button>Add to Watchlist</Button>
          <Button variant="outline">Share</Button>
        </div>
      </div>
    </div>
  );
}
