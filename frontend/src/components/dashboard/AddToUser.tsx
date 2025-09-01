"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Test = {
  id: number;
  testName: string;
};

type AddUserProps = {
  onAdd: (user: {
    name: string;
    email: string;
    joinDate: string;
    Techstack: string;
    testId: number | null;
  }) => void;
};

export default function AddUser({ onAdd }: AddUserProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    joinDate: "",
    Techstack: "",
    testId: null as number | null,
  });

  const [tests, setTests] = useState<Test[]>([]);

  // Fetch test papers from backend
  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch("http://localhost:3001/api/tests");
        const data = await res.json();
        setTests(data);
      } catch (err) {
        console.error("Failed to fetch tests", err);
      }
    }
    fetchTests();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      email: "",
      joinDate: "",
      Techstack: "",
      testId: null,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new user</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new user and assign a test.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="joinDate">Date of Joining</Label>
            <Input
              id="joinDate"
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="Techstack">Tech Stack</Label>
            <Input
              id="Techstack"
              name="Techstack"
              type="text"
              value={formData.Techstack}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Assign Test</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, testId: Number(value) })
              }
              value={formData.testId ? String(formData.testId) : ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                {tests.map((test) => (
                  <SelectItem key={test.id} value={String(test.id)}>
                    {test.testName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Save User
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
