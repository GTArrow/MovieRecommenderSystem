"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Sidebar from "./components/ProfileSidebar";
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
  const { data: session, isPending, error } = authClient.useSession();
  const user = session?.user;

  const renderSection = () => {
    if (!user) return null;

    switch (selectedSection) {
      case "Personal Info":
        return <PersonalInfo user={user} />;
      case "Genre Preferences":
        return <GenrePreferences />;
      case "Movie Preferences":
        return <MoviePreferences />;
      default:
        return null;
    }
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
        ) : !user ? (
          <p>Please sign in to view your profile.</p>
        ) : (
          renderSection()
        )}
      </div>
    </div>
  );
}
