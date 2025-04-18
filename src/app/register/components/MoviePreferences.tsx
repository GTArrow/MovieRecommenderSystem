import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormData } from "@/lib/validation";

const movies = [
  { id: "278", title: "The Shawshank Redemption", year: 1994 },
  { id: "238", title: "The Godfather", year: 1972 },
  { id: "155", title: "The Dark Knight", year: 2008 },
  { id: "550", title: "Fight Club", year: 1999 },
  { id: "680", title: "Pulp Fiction", year: 1994 },
];

export default function MoviePreferences({
  form,
}: {
  form: UseFormReturn<RegisterFormData>;
}) {
  return (
    <FormField
      control={form.control}
      name="likedMovieIds"
      render={() => (
        <FormItem className="gap-3">
          <FormLabel>Select movies you like</FormLabel>
          <div className="grid grid-cols-1 gap-3">
            {movies.map((movie) => (
              <FormField
                key={movie.id}
                control={form.control}
                name="likedMovieIds"
                render={({ field }) => {
                  const selected = field.value?.includes(movie.id);
                  return (
                    <FormItem
                      key={movie.id}
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={() => {
                        const updated = selected
                          ? field.value.filter((id: string) => id !== movie.id)
                          : [...field.value, movie.id];
                        field.onChange(updated);
                      }}
                    >
                      <FormControl>
                        <div
                          className={`w-full border rounded-lg px-4 py-3 text-sm transition ${
                            selected
                              ? "ring-2 ring-primary bg-muted"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          {movie.title} ({movie.year})
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
