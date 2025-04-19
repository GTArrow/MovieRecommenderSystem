"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isMovieDetailPage = pathname.startsWith("/movies/");

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-white shadow-md z-50">
      {isMovieDetailPage ? (
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft />
          Previous
        </Button>
      ) : (
        <div className="w-[120px]" /> // Reserve space for symmetry
      )}

      {/* Centered Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/" className="font-bold">
          Movie Recommender
        </Link>
      </div>

      <Button asChild variant="ghost" className="flex items-center">
        <Link href="/signin">
          <UserCircle />
          Login
        </Link>
      </Button>
    </header>
  );
}
