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
          className="w-full h-[330px] object-cover"
        />
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{movie.title}</CardTitle>
          <CardDescription>{movie.genres.join(", ")}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
