"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Movie } from "@/types/movie";

interface MovieContextType {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <MovieContext.Provider value={{ movies, setMovies }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context)
    throw new Error("useMovies must be used within a MovieProvider");
  return context;
}
