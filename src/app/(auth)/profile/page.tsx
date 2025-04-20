"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Sidebar from "./components/ProfileSidebar";
import PersonalInfo from "./components/PersonalInfo";
import GenrePreferences from "./components/GenrePreferences";
import MoviePreferences from "./components/MoviePreferences";
import { EnrichedUser, UserPreferredGenreDetail } from "@/types/user";
import { Genre } from "@/types/genre";

const sidebarItems = [
  "Personal Info",
  "Genre Preferences",
  "Movie Preferences",
];

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState("Personal Info");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [enrichedUser, setEnrichedUser] = useState<EnrichedUser | null>(null);
  const [preferredGenres, setPreferredGenres] = useState<UserPreferredGenreDetail[]>([]);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);

  const { data: session, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!session?.user?.id) return;
  
    const fetchData = async () => {
      try {
        const [userRes, genresRes] = await Promise.all([
          fetch(`/api/users/${session.user.id}`),
          fetch("/api/genres"),
        ]);
  
        if (!userRes.ok || !genresRes.ok) {
          console.error("Failed to fetch user or genres");
          return;
        }
  
        const userData: EnrichedUser = await userRes.json();
        const genreData = await genresRes.json();
  
        setEnrichedUser(userData);
        setPreferredGenres(userData.preferredGenres);
        setSelectedAvatar(userData.image || "");
        setAllGenres(genreData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
  
    fetchData();
  }, [session]);
  

  const handleGenresUpdate = (updated: UserPreferredGenreDetail[]) => {
    setPreferredGenres(updated);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        items={sidebarItems}
        selected={selectedSection}
        onSelect={setSelectedSection}
      />

      <div className="flex-1 p-8 min-w-[900px]">
        {isPending ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error loading session.</p>
        ) : !session?.user ? (
          <p>Please sign in to view your profile.</p>
        ) : !enrichedUser ? (
          <p>Loading user details...</p>
        ) : (
          <div className="space-y-6">
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
              user={enrichedUser}
            />

            {selectedSection === "Personal Info" && (
              <PersonalInfo user={enrichedUser} />
            )}

            {selectedSection === "Genre Preferences" && (
              <GenrePreferences
                genres={preferredGenres}
                allGenres={allGenres}
                userId={enrichedUser.id}
                onUpdate={handleGenresUpdate}
              />
            )}

            {selectedSection === "Movie Preferences" && (
              <MoviePreferences movies={enrichedUser.preferences} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
