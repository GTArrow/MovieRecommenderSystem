import TopBar from "@/components/TopBar";
import Link from "next/link";
import { movies } from "@/lib/movies";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <TopBar />
      <section className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Top 10 Popular Movies</h2>
        <div className="space-y-4">
          {movies.map((movie, index) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer">
                <p className="text-lg font-medium">
                  {index + 1}. {movie.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
