"use client";

import ScrollableMovieList from "@/components/ScrollableMovieList";
import { Movie } from "@/types/movie";

const recommendations: Movie[] = [
  {
    id: "872585",
    title: "Oppenheimer",
    genres: ["Drama", "History", "Thriller"],
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
  },
  {
    id: "634492",
    title: "Mad Max: Fury Road",
    genres: ["Action", "Adventure", "Sci-Fi"],
    description:
      "In a post-apocalyptic wasteland, Max teams up with a mysterious woman to flee from a cult leader and his army.",
    poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
  },
  {
    id: "787699",
    title: "Wonka",
    genres: ["Fantasy", "Comedy", "Adventure"],
    description:
      "A young Willy Wonka embarks on a magical adventure to open his chocolate factory to the world.",
    poster: "https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg",
  },
  {
    id: "502356",
    title: "The Super Mario Bros. Movie",
    genres: ["Animation", "Action", "Comedy"],
    description:
      "While working underground to fix a water main, Brooklyn plumbers Mario and Luigi are transported to a magical new world.",
    poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
  },
  {
    id: "565770",
    title: "Blue Beetle",
    genres: ["Action", "Sci-Fi", "Adventure"],
    description:
      "Recent college grad Jaime Reyes gains superpowers when a mysterious scarab binds to his spine and gives him a suit of armor.",
    poster: "https://image.tmdb.org/t/p/w500/mXLOHHc1Zeuwsl4xYKjKh2280oL.jpg",
  },
];

export default function Recommendation() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Guess You May Like</h2>
      <ScrollableMovieList movies={recommendations} />
    </div>
  );
}
