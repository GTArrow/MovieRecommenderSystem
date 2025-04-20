"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

interface TMDBMovie {
  id: number;
  title: string;
}

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) fetchResults(query);
      else setResults([]);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  async function fetchResults(query: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("TMDB search failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = (movie: TMDBMovie) => {
    router.push(`/movies/${movie.id}`);
  };

  return (
    <section
      className="h-[500px] bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/hero-image.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-xl w-full">
          <h1 className="text-4xl font-bold mb-2">Discover Popular Movies</h1>
          <p className="text-lg mb-6 text-muted-foreground">
            Search your favorite films and explore new ones
          </p>

          {/* Search with dropdown */}
          <div className="relative w-full">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search movies..."
                value={query}
                onValueChange={setQuery}
                className="text-black"
              />
              {query && (
                <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-lg rounded-md border mt-1 overflow-hidden">
                  <CommandList>
                    {results.length > 0 ? (
                      results.map((movie) => (
                        <CommandItem
                          key={movie.id}
                          value={movie.title}
                          onSelect={() => handleSelect(movie)}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {movie.title}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandEmpty>
                        {loading ? "Searching..." : "No matches found."}
                      </CommandEmpty>
                    )}
                  </CommandList>
                </div>
              )}
            </Command>
          </div>
        </div>
      </div>
    </section>
  );
}
