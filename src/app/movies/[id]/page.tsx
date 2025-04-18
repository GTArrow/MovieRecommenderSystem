"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMovies } from "@/context/MovieContext";
import { Movie } from "@/types/movie";
import dynamic from "next/dynamic";

function Loading() {
  return <p className="text-center mt-10">Loading movie...</p>;
}

const MovieInfo = dynamic<{ movie: Movie }>(
  () => import("./components/MovieInfo"),
  { suspense: true }
);

const Recommendation = dynamic(() => import("./components/Recommendation"), {
  suspense: true,
});

export default function MovieDetail() {
  const params = useParams();
  const { movies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      setIsLoading(true); // start loading

      if (!params?.id) return;

      const movieId = Array.isArray(params.id) ? params.id[0] : params.id;
      let foundMovie = movies.find((m) => m.id === movieId);

      if (!foundMovie) {
        try {
          const res = await fetch(`/api/movies/${movieId}`);
          if (res.ok) {
            const data = await res.json();
            foundMovie = data;
          }
        } catch (error) {
          console.error("Error fetching movie:", error);
        }
      }

      setMovie(foundMovie || null);
      setIsLoading(false); // done loading
    }

    loadMovie();
  }, [params, movies]);

  if (isLoading) return <Loading />;
  if (!movie) return <p className="text-center mt-10">Movie not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Suspense fallback={<Loading />}>
        <MovieInfo movie={movie} />
        <Recommendation />
      </Suspense>
    </div>
  );
}
