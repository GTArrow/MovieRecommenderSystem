import type { Metadata } from "next";
import { Toaster } from "sonner";
import Layout from "@/components/Layout";
import { MovieProvider } from "@/context/MovieContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Recommender",
  description: "Recommend movies based on preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MovieProvider>
          {/* Layout handles Navbar & Page Structure */}
          <Layout>{children}</Layout>
          <Toaster richColors closeButton />
        </MovieProvider>
      </body>
    </html>
  );
}
