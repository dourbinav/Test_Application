"use client";

import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("testID");
  if (!testId) {
    return <div>the link has been used or expired try to generate a new one</div>
  }
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [questions, setQuestions] = useState<{
    id: number;
    text: string;
    options: string[];
  }[]>([]);
  useEffect(() => {
    // Fetch questions from backend
    const fetchQuestions = async () => {
      const res = await(await api.get(`/tests/${testId}`)).data;
      setQuestions(res);
    };
    fetchQuestions();
  }, []);


  const handleAnswer = (qid: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: answer }));
  };

  const handleSubmit = () => {
    api.post("/tests/submit", {
      attemptId: "attempt123", // This would be dynamic in a real app
      answers: Object.entries(answers).map(([questionId, selectedChoiceId]) => ({
        questionId,
        selectedChoiceId,
      })),
    });
    alert("Test submitted! Check console for answers.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Sample Test</h1>

        {questions.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="text-lg font-medium mb-3">
              {q.id}. {q.text}
            </p>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswer(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
