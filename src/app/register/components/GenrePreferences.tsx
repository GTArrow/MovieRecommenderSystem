"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormData } from "@/lib/validation";

const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror"];

export default function GenrePreferences({
  form,
}: {
  form: UseFormReturn<RegisterFormData>;
}) {
  return (
    <FormField
      control={form.control}
      name="preferredGenres"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel>Select your preferred genres</FormLabel>
          <div className="flex flex-col gap-2">
            {genres.map((genre) => (
              <FormField
                key={genre}
                control={form.control}
                name="preferredGenres"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={genre}
                      className="flex flex-row items-start space-x-2 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(genre)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...field.value, genre]
                              : field.value.filter((g: string) => g !== genre);
                            field.onChange(updated);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {genre}
                      </FormLabel>
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
