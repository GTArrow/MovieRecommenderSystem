"use client";

// import { useEffect } from "react";
import { createContext, useContext, useState, ReactNode } from "react";
import { Movie } from "@/types/movie";

interface MovieContextType {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);

  //   useEffect(() => {
  //     async function fetchMovies() {
  //       try {
  //         const res = await fetch("/api/movies"); // Fetch from your API
  //         if (!res.ok) throw new Error("Failed to fetch movies");

  //         const data = await res.json();
  //         setMovies(data);
  //       } catch (error) {
  //         console.error("Error fetching movies:", error);
  //       }
  //     }

  //     if (movies.length === 0) {
  //       fetchMovies();
  //     }

  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []); // empty dependency array — run only once on mount

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
