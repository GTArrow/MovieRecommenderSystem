"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import { useMovies } from "@/context/MovieContext";

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
    <main className="min-h-screen bg-gray-100">
      <TopBar />
      <section className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Top 10 Popular Movies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} prefetch={false}>
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-500">
                  {movie.genres.join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
