import { createAuthClient } from "better-auth/react";
import prisma from "@/lib/prisma";

export const authClient = createAuthClient({
  /** the base url of auth server (optional if you're using the same domain) */
});

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const age = Number(formData.get("age"));

  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: "/signin",
  });

  console.log("Sign-up response:", { data, error });

  if (error) {
    return {
      success: false,
      message: `Error: ${error.message || "Sign-up failed"}`,
    };
  }

  if (data?.user?.id && age) {
    try {
      await prisma.user.update({
        where: { id: data.user.id },
        data: { age },
      });
    } catch (e) {
      console.error("Failed to update user with age:", e);
    }
  }

  return {
    success: true,
    message: "Sign-up successful!",
  };
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackURL = "/profile";

  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL,
  });

  console.log("Sign-in response:", { data, error });

  if (error) {
    return {
      success: false,
      message: `Error: ${error.message || "An unexpected error occurred"}`,
    };
  }

  return {
    success: true,
    message: "Sign-in successful!",
  };
}
