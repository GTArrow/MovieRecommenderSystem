"use client";

import { Movie } from "@/types/movie";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="w-60 rounded-lg shadow-md bg-white overflow-hidden"
    >
      <Image
        src={movie.poster}
        alt={movie.title}
        width={240}
        height={360}
        className="object-cover"
      />
      <div className="p-3">
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        <p className="text-sm text-gray-600">{movie.genres.join(", ")}</p>
      </div>
    </Link>
  );
}
