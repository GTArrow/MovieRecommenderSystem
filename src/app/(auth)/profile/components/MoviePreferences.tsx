"use client";

import { useState } from "react";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
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

// Sample movie data
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

export default function MoviePreferences({movies}: {movies: UserPreferenceMovieDetail[]}) {
  const [likedMovies, setLikedMovies] = useState<UserPreferenceMovieDetail[]>(movies);
  const [watchlist] = useState<Movie[]>([dummyMovies[1]]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleLiked = (movieId: string) => {
    setLikedMovies((prev) =>
      prev.some((m) => m.movie?.id === movieId)
        ? prev.filter((m) => m.movie?.id !== movieId)
        : [...prev, movies.find((m) => m.movie?.id === movieId)!]
    );
  };

  return (
    <div className="space-y-6">
      {/* Liked Movies */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Liked Movies</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Select Your Liked Movies</DialogTitle>
              </DialogHeader>
              <ScrollArea className="w-full">
                <div className="flex w-max space-x-4 p-2">
                  {likedMovies.map((pref) =>
                    pref.movie ? (
                      <MovieCard
                        key={pref.movie.id}
                        movie={pref.movie}
                        onClick={() => toggleLiked(pref.movie!.id)}
                      />
                    ) : null
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setDialogOpen(false)}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {likedMovies.length === 0 ? (
          <p className="text-muted-foreground">No liked movies yet.</p>
        ) : (
            <div className="flex w-max space-x-4 p-2">
              {likedMovies.map((pref) =>
                pref.movie ? (
                  <Image
                    key={pref.movie.id}
                    src={pref.movie.poster}
                    alt={pref.movie.title}
                    width={100}
                    height={150}
                    className="rounded shadow"
                  />
                ) : null
              )}
            </div>
        )}
      </Card>

      {/* Watch History */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Watch History</h2>
        {watchlist.length === 0 ? (
          <p className="text-muted-foreground">Your watchlist is empty.</p>
        ) : (
          <MovieListContainer movies={watchlist} />
        )}
      </Card>
    </div>
  );
}
