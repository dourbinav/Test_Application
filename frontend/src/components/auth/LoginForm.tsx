"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";


export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    api.post("/auth/login",
      {
      email: (e.target as any).email.value,
      password: (e.target as any).password.value,
    })
    .then((res) => {
      console.log("Login successful:", res.data);
      router.push("/dashboard"); 
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit"  className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <p className="text-sm mt-2">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600">
          Sign Up
        </a>
      </p>
    </Card>
  );
}
