"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
 
    api.post("/auth/signup", {
      email: (e.target as any).email.value,
      password: (e.target as any).password.value,
    })
    .then((res: { data: any; }) => {
      console.log("Signup successful:", res.data);
      alert("Signup successful! Please log in.");
      window.location.href = "/login"; // Redirect to login page
    })
     
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>

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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <p className="text-sm mt-2">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600">
          Login 
        </a>
      </p>
    </Card>
  );
}
