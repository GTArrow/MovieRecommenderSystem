"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPreferredGenreDetail } from "@/types/user";
import { Genre } from "@/types/genre";

export default function GenrePreferences({
  genres,
  allGenres,
  userId,
  onUpdate,
}: {
  genres: UserPreferredGenreDetail[];
  allGenres: Genre[];
  userId: string;
  onUpdate?: (updated: UserPreferredGenreDetail[]) => void;
}) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    genres.map((g) => g.genre_id)
  );
  const [tempGenres, setTempGenres] = useState<number[]>(selectedGenres);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleGenre = (genreId: number) => {
    setTempGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const applyChanges = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/preferred-genres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genre_ids: tempGenres }),
      });

      if (!res.ok) throw new Error("Failed to update preferred genres");

      setSelectedGenres(tempGenres);
      setDialogOpen(false);

      if (onUpdate) {
        // Map back to full UserPreferredGenreDetail
        const updated: UserPreferredGenreDetail[] = tempGenres.map((id) => {
          const match = allGenres.find((g) => g.id === id);
          return {
            userId,
            genre_id: id,
            name: match?.name ?? `Genre ${id}`,
            createdAt: new Date(),
          };
        });

        onUpdate(updated);
      }
    } catch (err) {
      console.error("Failed to update genres", err);
    }
  };

  const cancelChanges = () => {
    setTempGenres(selectedGenres);
    setDialogOpen(false);
  };

  const getGenreName = (id: number) => {
    return allGenres.find((g) => g.id === id)?.name || `Genre ${id}`;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Genre Preferences</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent className="min-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Your Favorite Genres</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {allGenres.map((genre) => (
                <label
                  key={genre.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={tempGenres.includes(genre.id)}
                    onCheckedChange={() => toggleGenre(genre.id)}
                  />
                  <span>{genre.name}</span>
                </label>
              ))}
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={cancelChanges}>
                Cancel
              </Button>
              <Button onClick={applyChanges}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {selectedGenres.length > 0 ? (
          selectedGenres.map((id) => (
            <span
              key={id}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm text-center"
            >
              {getGenreName(id)}
            </span>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full">
            No genres selected yet.
          </p>
        )}
      </div>
    </Card>
  );
}
