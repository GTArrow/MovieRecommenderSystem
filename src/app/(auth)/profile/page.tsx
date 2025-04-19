"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import clsx from "clsx";
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const sidebarItems = ["Personal Info", "Liked Genres", "Liked Movies"];

const avatarOptions = ["Oliver", "Lucas", "Nova", "Chloe", "Leo"].map((name) => {
  return createAvatar(adventurer, {
    "seed": name
  });
});

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState("Personal Info");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].toDataUri());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed left-0 top-0 bottom-0 z-10">
        <div className="p-6 font-bold text-xl mt-10"></div>
        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item}
              className={clsx(
                "w-full text-left p-2 rounded hover:bg-gray-200",
                item === selectedSection && "bg-gray-200 font-medium"
              )}
              onClick={() => setSelectedSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 min-w-[800px]">
        {isPending ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error loading session.</p>
        ) : !user ? (
          <p>Please sign in to view your profile.</p>
        ) : (
          <div className="space-y-6">
            {/* Avatar Selection */}
            <section>
            <h2 className="text-xl font-semibold mb-2">Your Portrait</h2>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <button className="hover:opacity-80">
                    <Image
                      src={selectedAvatar}
                      alt="Selected Avatar"
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-blue-400"
                    />
                    <p className="text-sm text-blue-500 underline mt-1">Change portrait</p>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Select Your Portrait</DialogTitle>
                  </DialogHeader>
                  <div className="flex gap-4 flex-wrap pt-4">
                    {avatarOptions.map((avator) => {
                      const url = avator.toDataUri();
                    return (
                      <div
                        key={url}
                        className={clsx(
                          "p-1 rounded-full border-4 cursor-pointer",
                          selectedAvatar === url
                            ? "border-blue-500"
                            : "border-transparent"
                        )}
                        onClick={() => {
                          setSelectedAvatar(url);
                          setIsModalOpen(false);
                        }}
                      >
                        <Image
                          src={url}
                          alt="avatar"
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </section>

            {/* Info Card */}
            {selectedSection === "Personal Info" && (
              <Card className="p-6 space-y-2">
                <h2 className="text-xl font-semibold">Personal Info</h2>
                <p><strong>Name:</strong> {user.name || "N/A"}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </Card>
            )}

            {selectedSection === "Liked Genres" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold">Liked Genres</h2>
                <p>Coming soon...</p>
              </Card>
            )}

            {selectedSection === "Liked Movies" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold">Liked Movies</h2>
                <p>Coming soon...</p>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
