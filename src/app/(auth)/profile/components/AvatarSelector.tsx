"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import { updatePortrait } from "@/lib/auth-actions";
import { EnrichedUser } from "@/types/user";
import { avatarNames } from "@/lib/portrait";

const avatarOptions = avatarNames.map((name) =>
  createAvatar(adventurer, { seed: name })
);

export default function AvatarSelector({
  selectedAvatar,
  setSelectedAvatar,
  user,
}: {
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
  user: EnrichedUser;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Your Portrait</h2>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="hover:opacity-80">
            {selectedAvatar ? (
              <Image
                src={selectedAvatar}
                alt="Selected Avatar"
                width={96}
                height={96}
                className="rounded-full border-4 border-blue-400"
              />
            ) : (
              <div className="w-[96px] h-[96px] rounded-full border-4 border-dashed border-blue-300 bg-gray-200 flex items-center justify-center text-sm text-blue-400">
                No Avatar
              </div>
            )}
            <p className="text-sm text-blue-500 underline mt-1">
              Select a new portrait
            </p>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Your Portrait</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 flex-wrap pt-4">
            {avatarOptions.map((avatar) => {
              const url = avatar.toDataUri();
              return (
                <div
                  key={url}
                  className={clsx(
                    "p-1 rounded-full border-4 cursor-pointer",
                    selectedAvatar === url
                      ? "border-blue-500"
                      : "border-transparent"
                  )}
                  onClick={async () => {
                    user.image = url;
                    setSelectedAvatar(url);
                    setIsOpen(false);
                    await updatePortrait(url);
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
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
