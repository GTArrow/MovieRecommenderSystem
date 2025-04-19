"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signInWithEmail } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    setLoading(true);
    const result = await signInWithEmail(formData);
    setMessage(result.message);
    setSuccess(result.success);

    if (result.success) {
      setEmail("");
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } else {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setMessage("Google login failed.");
      setSuccess(false);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md min-w-[400px] space-y-6 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-center">Login</h1>

      <form
        action={(formData) => {
          handleSignIn(formData);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signin-password">Password</Label>
          <Input
            id="signin-password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="text-sm text-center">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/signup")}
          disabled={loading}
          className="text-blue-600 hover:underline disabled:opacity-50"
        >
          Sign up here
        </button>
      </p>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#4285F4] text-white hover:bg-[#357AE8]"
      >
        <FcGoogle className="w-5 h-5 bg-white rounded-full" />
        Continue with Google
      </Button>

      {message && (
        <p
          className={`text-center text-sm ${
            success ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
