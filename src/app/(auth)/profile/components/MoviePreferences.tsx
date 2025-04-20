"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MovieCard from "@/components/MovieCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MovieListContainer from "./MovieListContainer";
import { UserPreferenceMovieDetail } from "@/types/user";

const dummyMovies: Movie[] = [
  {
    id: "1",
    title: "Interstellar",
    genres: ["Sci-Fi", "Drama"],
    description: "A team of explorers travel through a wormhole in space.",
    poster: "https://image.tmdb.org/t/p/w500/xUkUZ8eOnrOnnJAfusZUqKYZiDu.jpg",
  },
  {
    id: "2",
    title: "Inception",
    genres: ["Action", "Thriller"],
    description:
      "A thief who steals corporate secrets through dream-sharing tech.",
    poster: "https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  },
  {
    id: "3",
    title: "The Matrix",
    genres: ["Sci-Fi", "Action"],
    description: "A computer hacker learns the truth about his reality.",
    poster: "https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
];

export default function MoviePreferences({
  movies,
  userId,
  likedGenres = [],
}: {
  movies: UserPreferenceMovieDetail[];
  userId: string;
  likedGenres?: string[];
}) {
  const [likedMovies, setLikedMovies] =
    useState<UserPreferenceMovieDetail[]>(movies);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [watchlist] = useState<Movie[]>(dummyMovies);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const gptEnabled = process.env.NEXT_PUBLIC_ENABLE_GPT === "true";

  const isLiked = (movieId: string) =>
    likedMovies.some((m) => m.movie?.id === movieId);

  const toggleLiked = (movie: Movie) => {
    setLikedMovies((prev) => {
      const exists = prev.find((m) => m.movie?.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.movie?.id !== movie.id);
      } else {
        const newEntry: UserPreferenceMovieDetail = {
          liked_movie_id: parseInt(movie.id),
          createdAt: new Date(),
          userId,
          movie,
        };
        const updated = [...prev, newEntry];
        console.log("Updated liked movies:", updated);
        return updated;
      }
    });
  };

  const savePreferences = async () => {
    try {
      const liked_movie_ids = likedMovies
        .map((m) => m.movie?.id)
        .filter(Boolean)
        .map(Number);
      const res = await fetch(`/api/users/${userId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked_movie_ids }),
      });

      if (!res.ok) throw new Error("Failed to save preferences");
      setDialogOpen(false);
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  };

  const deleteLikedMovie = async (movieId: string) => {
    setLikedMovies((prev) =>
      prev.filter((m) => m.movie?.id.toString() !== movieId)
    );
    try {
      await fetch(`/api/users/${userId}/preferences`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked_movie_ids: [parseInt(movieId)] }),
      });
    } catch (err) {
      console.error("Failed to delete movie from preferences", err);
    }
  };

  const fetchRecommendations = async () => {
    if (!gptEnabled) return;
    setLoadingRecs(true);

    try {
      const likedMovieIds = movies.map((m) => m.movie?.id).filter(Boolean);
      console.log("Liked genres:", likedGenres);
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likedGenres,
          likedMovieIds,
          count: 10,
        }),
      });

      if (res.ok) {
        const recs: Movie[] = await res.json();
        const likedIds = new Set(
          likedMovies.map((m) => m.movie?.id?.toString())
        );
        const filtered = recs.filter((rec) => !likedIds.has(rec.id.toString()));
        setRecommendations(filtered);
      } else {
        console.error("Failed to fetch GPT movie recommendations");
      }
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      fetchRecommendations();
    }
  }, [dialogOpen]);

  return (
    <div className="space-y-6">
      {/* Liked Movies Section */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Liked Movies</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="min-w-6xl w-full max-h-[80vh] overflow-y-auto">
              <div className="px-4">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold"></DialogTitle>
                </DialogHeader>
                {/* Liked Movies Row */}
                <h3 className="text-xl font-semibold">Your Likes</h3>
                {likedMovies.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground italic">
                    You haven’t liked any movies yet. Start exploring
                    recommendations below!
                  </div>
                ) : (
                  <ScrollArea className="w-[80vw] max-w-screen-lg mb-4">
                    <div className="flex w-max p-4 pl-0">
                      {likedMovies.map((pref) =>
                        pref.movie ? (
                          <div key={pref.movie.id} className="relative group">
                            <MovieCard movie={pref.movie} onClick={() => {}} />
                            <button
                              onClick={() =>
                                deleteLikedMovie(pref.movie!.id.toString())
                              }
                              className="absolute top-2 right-2 bg-white text-red-600 hover:text-red-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              &times;
                            </button>
                          </div>
                        ) : null
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}

                {/* Recommendations Row */}
                <h3 className="text-xl font-semibold">Recommended For You</h3>
                {loadingRecs ? (
                  <div className="px-4 py-8 text-center text-muted-foreground italic">
                    Loading recommendations...
                  </div>
                ) : (
                  <ScrollArea className="w-[80vw] max-w-screen-lg">
                    <div className="flex w-max p-4 pl-0">
                      {recommendations.map((movie) => (
                        <MovieCard
                          movie={movie}
                          selected={isLiked(movie.id)}
                          onClick={() => toggleLiked(movie)}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={savePreferences}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {likedMovies.length === 0 ? (
          <p className="text-muted-foreground">No liked movies yet.</p>
        ) : (
          <ScrollArea className="w-[60vw] max-w-[70vw]">
            <div className="flex w-max p-4 pl-0">
              {likedMovies.map((pref) =>
                pref.movie ? (
                  <MovieCard key={pref.movie.id} movie={pref.movie} />
                ) : null
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </Card>

      {/* Watch History */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Watch History</h2>

        {watchlist.length === 0 ? (
          <p className="text-muted-foreground">Your watchlist is empty.</p>
        ) : (
          <ScrollArea className="w-[60vw] max-w-[70vw]">
            <div className="flex w-max p-4 pl-0">
              {watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
