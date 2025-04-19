"use client";

import { useState } from "react";
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

const allGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

export default function GenrePreferences() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Drama",
    "Sci-Fi",
  ]);
  const [tempGenres, setTempGenres] = useState<string[]>(selectedGenres);
  const [dialogOpen, setDialogOpen] = useState(false); // 👈 Dialog open state

  const toggleGenre = (genre: string) => {
    setTempGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const applyChanges = () => {
    setSelectedGenres(tempGenres);
    setDialogOpen(false); // 👈 Close dialog
  };

  const cancelChanges = () => {
    setTempGenres(selectedGenres); // Reset edits
    setDialogOpen(false); // 👈 Close dialog
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Genre Preferences</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Your Favorite Genres</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {allGenres.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={tempGenres.includes(genre)}
                    onCheckedChange={() => toggleGenre(genre)}
                  />
                  <span>{genre}</span>
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

      <div className="flex flex-wrap gap-2">
        {selectedGenres.length > 0 ? (
          selectedGenres.map((genre) => (
            <span
              key={genre}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {genre}
            </span>
          ))
        ) : (
          <p className="text-muted-foreground">No genres selected yet.</p>
        )}
      </div>
    </Card>
  );
}
