"use client";

import { useState } from "react";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MovieListContainer from "./MovieListContainer";

// Sample movie data
const dummyMovies: Movie[] = [
  {
    id: "1",
    title: "Interstellar",
    genres: ["Sci-Fi", "Drama"],
    description: "A team of explorers travel through a wormhole in space.",
    poster: "https://image.tmdb.org/t/p/w200/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
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

export default function MoviePreferences() {
  const [likedMovies, setLikedMovies] = useState<Movie[]>([dummyMovies[0]]);
  const [watchlist] = useState<Movie[]>([dummyMovies[1]]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleLiked = (movie: Movie) => {
    const exists = likedMovies.find((m) => m.id === movie.id);
    if (exists) {
      setLikedMovies(likedMovies.filter((m) => m.id !== movie.id));
    } else {
      setLikedMovies([...likedMovies, movie]);
    }
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
              <div className="grid grid-cols-2 gap-4 pt-4">
                {dummyMovies.map((movie) => (
                  <button
                    key={movie.id}
                    className={`flex gap-2 items-center border p-2 rounded ${
                      likedMovies.some((m) => m.id === movie.id)
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => toggleLiked(movie)}
                  >
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      width={40}
                      height={60}
                      className="rounded"
                    />
                    <p className="text-sm font-medium">{movie.title}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setDialogOpen(false)}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {likedMovies.length === 0 ? (
          <p className="text-muted-foreground">No liked movies yet.</p>
        ) : (
          <MovieListContainer movies={likedMovies} />
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
