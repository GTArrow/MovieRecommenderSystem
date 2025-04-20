"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MovieBasicInfo } from "@/types/movie";

interface MovieCardProps {
  movie: MovieBasicInfo;
  onClick?: () => void; // optional toggle behavior
  selected?: boolean;
}

export default function MovieCard({
  movie,
  onClick,
  selected,
}: MovieCardProps) {
  const content = (
    <Card
      className={`w-[220px] overflow-hidden cursor-pointer rounded-none border-0 ${
        selected ? "border-blue-400 border-2" : "border-transparent"
      }`}
    >
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
  );

  return onClick ? (
    <div onClick={onClick} className="hover:opacity-90 transition">
      {content}
    </div>
  ) : (
    <Link href={`/movies/${movie.id}`} className="hover:opacity-90 transition">
      {content}
    </Link>
  );
}
