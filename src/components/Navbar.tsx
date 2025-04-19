"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMovieDetailPage = pathname.startsWith("/movies/");
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  useEffect(() => {
    const fetchSession = async () => {
      refetch(); // ensures session state is fresh on load
    };
    fetchSession();
  }, []);

  const user = session?.user;

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
        <Link href="/" className="font-bold text-lg">
          Movie Recommender
        </Link>
      </div>

      {/* Right-side session controls */}
      {isPending ? (
        <div className="w-[120px]" /> // placeholder
      ) : error ? (
        <p className="text-sm text-red-500">Error loading session</p>
      ) : user ? (
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <Link href="/profile">
              <UserCircle className="mr-1" />
              Profile
            </Link>
          </Button>
          <form action={logout}>
            <Button variant="ghost" type="submit">
              Logout
            </Button>
          </form>
        </div>
      ) : (
        <Button asChild variant="ghost">
          <Link href="/signin">
            <UserCircle className="mr-1" />
            Login
          </Link>
        </Button>
      )}
    </header>
  );
}
