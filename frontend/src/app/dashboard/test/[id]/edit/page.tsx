"use client";

import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestEditorPage() {
  const { id } = useParams<{ id: string }>(); // ✅ works in client components

  const [questions, setQuestions] = useState<
    { id: number; text: string; options: string[] }[]
  >([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await (await api.get(`/tests/${id}`)).data;
      setQuestions(res);
    };
    fetchQuestions();
  }, [id]);

  const addQuestion = () => {
    const newId = Date.now(); // temporary ID
    setQuestions([
      ...questions,
      { id: newId, text: "New Question", options: ["Option 1"] },
    ]);
  };

  const updateQuestion = (qid: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qid ? { ...q, question: text } : q))
    );
  };

  const deleteQuestion = (qid: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qid));
  };

  const addOption = (qid: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    );
  };

  const updateOption = (qid: number, idx: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === idx ? text : opt)),
            }
          : q
      )
    );
  };

  const deleteOption = (qid: number, idx: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    );
  };

  const handleUpdateTest = async () => {
    await api.put(`/tests/${id}`, { questions });
    alert("Test updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Test Paper</h1>

        {questions.map((q) => (
          <div key={q.id} className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <button
                onClick={() => deleteQuestion(q.id)}
                className="ml-3 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(q.id, idx, e.target.value)}
                    className="flex-1 border px-3 py-2 rounded-lg"
                  />
                  <button
                    onClick={() => deleteOption(q.id, idx)}
                    className="ml-3 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(q.id)}
                className="mt-2 text-blue-600 hover:underline"
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 mt-4"
        >
          + Add Question
        </button>

        <button
          onClick={handleUpdateTest}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mt-6"
        >
          Update Test Paper
        </button>
      </div>
    </div>
  );
}
