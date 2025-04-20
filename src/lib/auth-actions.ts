"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/signin"); // server-side redirect
}

export async function updatePortrait(newAvatar: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: newAvatar },
  });
}
