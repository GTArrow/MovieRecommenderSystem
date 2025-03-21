"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function NavBar() {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // For navigating back

  const isMovieDetailPage = pathname.startsWith("/movies/");

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-white shadow-md z-50">
      {/* "Go Back" button on the left (only in movie detail pages) */}
      {isMovieDetailPage ? (
        <button
          onClick={() => router.back()}
          className="text-gray-700 hover:text-gray-900 transition cursor-pointer"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-6" /> /* Placeholder to balance flex spacing */
      )}

      {/* Centered Clickable Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-gray-900 transition cursor-pointer"
        >
          MovieRecommender
        </Link>
      </div>

      {/* User Login Icon on the Right */}
      <Link href="/login">
        <UserCircleIcon className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900 transition" />
      </Link>
    </header>
  );
}
