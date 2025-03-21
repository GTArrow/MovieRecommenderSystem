"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct way to get params
import Image from "next/image";
import TopBar from "@/components/TopBar";
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
      <TopBar />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Image
            src={movie.poster}
            alt={movie.title}
            width={300}
            height={400}
            className="rounded-md object-cover max-h-[400px]"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Genres: </span>
            {movie.genres.join(", ")}
          </p>
          <p className="text-gray-800">{movie.description}</p>
        </div>
      </div>
    </main>
  );
}
