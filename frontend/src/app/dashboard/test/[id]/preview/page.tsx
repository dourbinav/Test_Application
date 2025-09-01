"use client";

import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviewTestPage() {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        setQuestions(res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  if (loading) return <p className="p-6">Loading test...</p>;
  if (!questions.length) return <p className="p-6">Test not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Preview Test</h1>

      {questions.map((q, idx) => (
        <div key={q.id} className="mb-6 p-4 border rounded-lg shadow-sm">
          <p className="font-medium text-lg mb-3 text-black-600">
            {idx + 1}. {q.text}
          </p>
          <ul className="space-y-2">
            {q.options.map((opt: string, i: number) => {
              const isCorrect = opt === q.correctAnswer;
              return (
                <li
                  key={i}
                  className={`p-2 rounded border ${
                    isCorrect
                      ? "border-green-500 bg-green-50 font-semibold"
                      : "border-gray-300"
                  }`}
                >
                  {opt}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
