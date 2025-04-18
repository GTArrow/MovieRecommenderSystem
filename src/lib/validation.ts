import { z } from "zod";

// export const basicInfoSchema = z
//   .object({
//     username: z.string().min(2, "Username is required"),
//     email: z.string().email("Enter a valid email"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

// export const preferencesSchema = z.object({
//   preferredGenres: z.array(z.string()).min(1, "Select at least one genre"),
// });

// export type PreferencesFormData = z.infer<typeof preferencesSchema>;

// export const moviePreferenceSchema = z.object({
//   favoriteMovieId: z.string().min(1, "Please select your favorite movie"),
// });

// export type MoviePreferenceFormData = z.infer<typeof moviePreferenceSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(2, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6),
    confirmPassword: z.string(),
    preferredGenres: z.array(z.string()).min(1, "Select at least one genre"),
    likedMovieIds: z.array(z.string()).min(1, "Select at least one movie"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
