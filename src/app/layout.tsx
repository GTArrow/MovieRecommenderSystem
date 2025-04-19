import type { Metadata } from "next";
import Layout from "@/components/Layout";
import { MovieProvider } from "@/context/MovieContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
    <html lang="en">
      <body>
        <MovieProvider>
          {/* Layout handles Navbar & Page Structure */}
          <Layout>{children}</Layout>
        </MovieProvider>
      </body>
    </html>
    </GoogleOAuthProvider>
  );
}
