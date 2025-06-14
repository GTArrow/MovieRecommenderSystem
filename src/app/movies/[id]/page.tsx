"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ScrollableMovieList from "@/components/ScrollableMovieList";
import { useMovies } from "@/context/MovieContext";
import { MovieBasicInfo, Movie } from "@/types/movie";
import MovieInfo from "./components/MovieInfo";
import { SessionUser } from "@/types/user";
import { authClient } from "@/lib/auth-client";

function Loading() {
  return <p className="text-center mt-10">Loading movie...</p>;
}

// const mockLikedMovieIds = ["603", "157336", "27205"];
// const mockLikedGenres = ["Sci-Fi", "Comedy", "Action", "Drama"];

export default function MovieDetail() {
  const params = useParams();
  const { movies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<MovieBasicInfo[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  const gptEnabled = process.env.NEXT_PUBLIC_ENABLE_GPT === "true";
  const user = session?.user as SessionUser;
  //console.log("User", user);

  // Track if we've already fetched recommendations
  const hasFetchedRecs = useRef(false);

  useEffect(() => {
    async function loadMovie() {
      setIsLoading(true);
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
      setIsLoading(false);
    }

    loadMovie();
  }, [params, movies]);

  useEffect(() => {
    async function fetchRecommendations() {
      console.log("Fetching recommendations with GPT...: ", gptEnabled);
      if (!movie || hasFetchedRecs.current) return;

      setLoadingRecs(true);
      hasFetchedRecs.current = true;

      try {
        console.log("recommendations", {
          likedGenres: user?.likedGenres ?? [],
          likedMovieIds: user?.likedMovieIds ?? [],
          count: 10,
        });
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentMovie: movie,
            likedGenres: user?.likedGenres ?? [],
            likedMovieIds: user?.likedMovieIds ?? [],
            count: 10,
          }),
        });

        const data = await res.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoadingRecs(false);
      }
    }

    if (!isPending) {
      fetchRecommendations();
    }
  }, [movie, gptEnabled, user, isPending]);

  if (isLoading) return <Loading />;
  if (!movie) return <p className="text-center mt-10">Movie not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {!movie ? <Loading /> : <MovieInfo movie={movie} />}

      {gptEnabled && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">You Might Also Like</h2>
          {loadingRecs ? (
            <p>Loading recommendations...</p>
          ) : (
            <ScrollableMovieList movies={recommendations} />
          )}
        </div>
      )}
    </div>
  );
}
