"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Sidebar from "./components/ProfileSidebar";
import AvatarSelector from "./components/AvatarSelector";
import PersonalInfo from "./components/PersonalInfo";
import GenrePreferences from "./components/GenrePreferences";
import MoviePreferences from "./components/MoviePreferences";

const sidebarItems = [
  "Personal Info",
  "Genre Preferences",
  "Movie Preferences",
];

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState("Personal Info");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const { data: session, isPending, error } = authClient.useSession();
  const user = session?.user;

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
        ) : !user ? (
          <p>Please sign in to view your profile.</p>
        ) : (
          <div className="space-y-6">
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
            />

            {selectedSection === "Personal Info" && (
              <PersonalInfo user={user} />
            )}

            {selectedSection === "Genre Preferences" && <GenrePreferences />}

            {selectedSection === "Movie Preferences" && <MoviePreferences />}
          </div>
        )}
      </div>
    </div>
  );
}
