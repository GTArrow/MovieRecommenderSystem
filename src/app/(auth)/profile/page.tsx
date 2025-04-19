import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ProfilePage() {
  const session = await auth.api.getSession({headers: await headers()});;

  if (!session) {
    redirect("/signin");
  }

  const user = session?.user;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Your Profile</h1>
        <p><strong>Name:</strong> {user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>ID:</strong> {user?.id}</p>
      </div>
    </main>
  );
}
