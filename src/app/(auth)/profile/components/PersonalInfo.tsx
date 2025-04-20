"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import AvatarSelector from "./AvatarSelector";

export default function PersonalInfo({ user }: { user: any }) {
  const [selectedAvatar, setSelectedAvatar] = useState("");

  return (
    <div className="space-y-6">
      <AvatarSelector
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
      />

      <Card className="p-6 space-y-2">
        <h2 className="text-xl font-semibold">Personal Info</h2>
        <p>
          <strong>Name:</strong> {user.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </Card>
    </div>
  );
}
