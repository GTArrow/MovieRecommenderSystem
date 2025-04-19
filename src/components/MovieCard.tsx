"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Movie } from "@/types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="hover:opacity-90 transition">
      <Card className="w-[220px] overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          width={220}
          height={330}
          className="object-cover"
        />
        <CardHeader className="p-4">
          <CardTitle className="text-lg line-clamp-1 min-h-[28px]">
            {movie.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground min-h-[48px] line-clamp-2">
            {movie.genres.join(", ")}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
