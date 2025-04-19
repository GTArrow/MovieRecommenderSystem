"use client";

import { Card } from "@/components/ui/card";

export default function PersonalInfo({ user }: { user: any }) {
  return (
    <Card className="p-6 space-y-2">
      <h2 className="text-xl font-semibold">Personal Info</h2>
      <p>
        <strong>Name:</strong> {user.name || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
    </Card>
  );
}
