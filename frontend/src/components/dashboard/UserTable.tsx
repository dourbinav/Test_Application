"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import AddUser from "./AddToUser";
import api from "@/lib/axios";

export default function UsersTable() {
  const [users, setUsers] = useState([
    {
      number: 1,
      email: "john@example.com",
      joinDate: "2024-01-01",
      Techstack: "Nodejs",
      certified: true,
    },
    {
      number: 2,
      email: "jane@example.com",
      joinDate: "2024-03-15",
      Techstack: "Nodejs",
      certified: false,
    },
  ]);

  // Function to add new user
  const handleAddUser = async (newUser: {
    name: string;
    email: string;
    joinDate: string;
    Techstack: string;
  }) => {
    //calls api to add user to db
    await api.post("/users/create", newUser).then((response) => {
      console.log("User added:", response.data);
    }).catch((error) => {
      console.error("Error adding user:", error);
    });
    setUsers((prev) => [
      ...prev,
      {
        number: prev.length + 1,
        email: newUser.email,
        joinDate: newUser.joinDate,
        Techstack: newUser.Techstack, // Store Techstack in endDate for now, or add a new field if needed
        certified: false,
      },
    ]);
  };

  return (
    <Card className="shadow-lg h-screen rounded-2xl">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Users</CardTitle>
        {/* Pass callback to AddUser */}
        <AddUser onAdd={handleAddUser} />
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse border rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border p-2">Number</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Date of Joining</th>
              <th className="border p-2">Tech Stack</th>
              <th className="border p-2">Certified</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.number}>
                <td className="border p-2">{u.number}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.joinDate}</td>
                <td className="border p-2">{u.Techstack}</td>
                <td className="border p-2">
                  {u.certified ? "✅ Yes" : "❌ No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
