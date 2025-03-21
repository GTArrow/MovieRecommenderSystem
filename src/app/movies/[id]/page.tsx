import { movies } from "@/lib/movies";
import { Movie } from "@/types/movie";
import { notFound } from "next/navigation";

export default function MovieDetail({ params }: { params: { id: string } }) {
  const movie: Movie | undefined = movies.find((m) => m.id === params.id);

  if (!movie) return notFound();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <p className="text-sm text-gray-600 mb-2">
          Genres: {movie.genres.join(", ")}
        </p>
        <p className="text-gray-800">{movie.description}</p>
      </div>
    </main>
  );
}
