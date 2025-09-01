"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Eye, Plus } from "lucide-react";

interface Test {
  id: string;
  testName: string;
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    const fetchTest = async () => {
      const res = await (await api.get("/tests")).data;
      setTests(res);
    };
    fetchTest();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Tests</h1>

        <Link href="/dashboard/test/new">
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            <Plus size={18} />
            <span>Create New Test</span>
          </button>
        </Link>
      </div>

      {tests.map((test) => (
        <div
          key={test.id}
          className="flex items-center justify-between border-b pb-2"
        >
          <span className="font-medium">{test.testName}</span>

          <div className="flex space-x-3">
            <Link href={`/dashboard/test/${test.id}/edit`}>
              <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
                <Pencil size={16} />
              </button>
            </Link>

            <Link href={`/dashboard/test/${test.id}/preview`}>
              <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center">
                <Eye size={16} />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
