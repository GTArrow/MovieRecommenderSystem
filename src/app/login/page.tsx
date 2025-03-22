"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Add login logic
    console.log("Logging in with:", email, password);
  };

  const handleRegister = () => {
    // TODO: Navigate to register page
    console.log("Go to Register");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="outline" className="w-full" onClick={handleRegister}>
            Register
          </Button>
        </div>
      </div>
    </main>
  );
}
