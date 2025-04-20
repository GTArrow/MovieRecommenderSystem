"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heart, HeartIcon } from "lucide-react"; // Lucide icons

export default function MovieInfo({ movie }: { movie: Movie }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const { data: session } = authClient.useSession();

  const userId = session?.user?.id;
  const movieId = parseInt(movie.id);
  const endpoint = `/api/users/${userId}/preferences`;
  //const likedMovieIds = session?.user.likedMovieIds ?? [];

  const handleAddToWatchlist = () => {
    toast("Movie added to watchlist (Upcoming feature)");
  };

  useEffect(() => {
    const fetchLikedStatus = async () => {
      if (!userId) return;
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch liked movies");
        const likedIds: number[] = await res.json();
        setLiked(likedIds.includes(movieId));
      } catch (err) {
        console.error("Error loading liked status", err);
      }
    };
    fetchLikedStatus();
  }, [userId, movieId]);

  // useEffect(() => {
  //   setLiked(likedMovieIds.includes(movieId));
  // }, [likedMovieIds, movieId]);

  const handleToggleLike = async () => {
    if (!userId) {
      toast("Please log in to like movies");
      return;
    }

    try {
      if (!liked) {
        const res = await fetch(endpoint + "/single", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ liked_movie_id: movieId }),
        });

        if (!res.ok) throw new Error("Failed to like movie");
        toast("Movie added to liked list");
        setLiked(true);
      } else {
        const res = await fetch(endpoint, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ liked_movie_ids: [movieId] }),
        });

        if (!res.ok) throw new Error("Failed to unlike movie");
        toast("Removed from liked movies");
        setLiked(false);
      }
    } catch (err) {
      toast("Something went wrong");
      console.error(err);
    }
  };

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
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleLike}
              aria-label="Like movie"
            >
              {liked ? (
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              ) : (
                <HeartIcon className="w-8 h-8" />
              )}
            </Button>
          </div>

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
          <Button onClick={handleAddToWatchlist}>Add to Watchlist</Button>

          <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Share</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Movie</DialogTitle>
                <DialogDescription>
                  Upcoming feature - share functionality coming soon!
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
