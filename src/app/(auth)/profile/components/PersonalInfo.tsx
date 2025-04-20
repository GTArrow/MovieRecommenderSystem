"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AvatarSelector from "./AvatarSelector";
import { EnrichedUser } from "@/types/user";

export default function PersonalInfo({ user }: { user: EnrichedUser }) {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  useEffect(() => {
    setSelectedAvatar(user.image || "");
    setAge(user.age ?? "");
    setName(user.name || "");
  }, [user]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ age, name }),
      });

      if (res.ok) setSuccess(true);
    } catch (error) {
      console.error("Failed to update user info", error);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <AvatarSelector
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        user={user}
      />

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Personal Info</h2>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <Input
            type="email"
            value={user.email}
            readOnly
            className="max-w-md opacity-80 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Age</label>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-32"
          />
        </div>

        <div className="pt-2">
          <Button onClick={handleUpdate} disabled={saving}>
            {saving ? "Saving..." : "Update Info"}
          </Button>
          {success && <span className="ml-3 text-green-600">Saved!</span>}
        </div>
      </Card>
    </div>
  );
}
