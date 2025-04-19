"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleSignUp(formData: FormData) {
    setLoading(true);

    const result = await signUpWithEmail(formData);
    setMessage(result.message);
    setSuccess(result.success);

    if (result.success) {
      // Clear fields and redirect after short delay
      setName("");
      setEmail("");
      setAge("");
      setTimeout(() => {
        router.push("/signin");
      }, 500);
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md min-w-[400px] space-y-6 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-center">Register</h1>

      <form action={handleSignUp} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Name</Label>
          <Input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-age">
            Age <span className="text-xs text-gray-400">(Optional)</span>
          </Label>
          <Input
            id="signup-age"
            name="age"
            type="number"
            placeholder="Your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min={0}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signin")}
            disabled={loading}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            Log in here
          </button>
        </p>
      </form>

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
