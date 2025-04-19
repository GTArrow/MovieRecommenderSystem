"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signInWithEmail} from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleSignInButton } from "@/components/GoogleBtn";

export default function SignInPage() {
  const [message, setMessage] = useState("");
   const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    const result = await signInWithEmail(formData);
    setMessage(result.message);
    setSuccess(result.success);

    if (result.success) {
      setEmail("");
      setTimeout(() => router.push("/"), 2000);
    }
  }

  return (
       <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md min-w-[400px] space-y-6 bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center">Login</h1>


        <form action={(formData) => {
    startTransition(() => handleSignIn(formData));
  }} className="space-y-4">
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
              
            />
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Button variant="outline" className="w-full" onClick={() => router.push("/signup")} disabled={isPending}>
            Register
          </Button>

          <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        {/* Google sign-in button */}
          <GoogleSignInButton onSuccess={() => {
            router.push("/");
          }}
          onError={(errMsg) => {
            setMessage(errMsg);
            setSuccess(false);
          }}/>

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
    </main>
  );
}