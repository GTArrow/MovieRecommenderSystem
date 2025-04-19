"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function MovieInfo({ movie }: { movie: Movie }) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleAddToWatchlist = () => {
    toast.success("Movie added to watchlist (Upcoming feature)");
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
