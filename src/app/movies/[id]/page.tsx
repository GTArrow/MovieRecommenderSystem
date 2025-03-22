"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct way to get params
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMovies } from "@/context/MovieContext";
import { Movie } from "@/types/movie";

export default function MovieDetail() {
  const params = useParams(); // Get params (now async)
  const { movies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function getParams() {
      if (params) {
        const movieId = await params.id; // Await params.id
        const foundMovie = movies.find((m) => m.id === movieId);
        setMovie(foundMovie || null);
      }
    }
    getParams();
  }, [params, movies]);

  if (!movie) return <p className="text-center mt-10">Movie not found</p>;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto px-6 py-10">
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
                  <Badge key={genre} variant="secondary">
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
      </div>
    </main>
  );
}
