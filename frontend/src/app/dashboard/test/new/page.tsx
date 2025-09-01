"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // for redirect
import { Plus, Trash, Check } from "lucide-react";
import api from "@/lib/axios";

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  choices: Choice[];
}

export default function NewTestPage() {
  const router = useRouter();
  const [testName, setTestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "Sample Question?",
      choices: [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false },
      ],
    },
  ]);

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: "New Question?",
        choices: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
        ],
      },
    ]);
  };

  // Remove a question
  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update question text
  const updateQuestionText = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  // Update choice text
  const updateChoiceText = (qId: number, cIndex: number, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              choices: q.choices.map((c, i) =>
                i === cIndex ? { ...c, text } : c
              ),
            }
          : q
      )
    );
  };

  // Mark correct choice
  const markCorrectChoice = (qId: number, cIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              choices: q.choices.map((c, i) => ({
                ...c,
                isCorrect: i === cIndex,
              })),
            }
          : q
      )
    );
  };

  // Add new option to a question
  const addChoice = (qId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              choices: [
                ...q.choices,
                { text: `Option ${q.choices.length + 1}`, isCorrect: false },
              ],
            }
          : q
      )
    );
  };

  // Save test
  const saveTest = async () => {
    if (!testName.trim()) {
      alert("Please enter a test name.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/tests", {
        name: testName,
        questions,
      });

      if (res.status === 201 || res.status === 200) {
        router.push("/dashboard/test");
      } else {
        alert("Failed to save test");
      }
    } catch (error: any) {
      console.error(error);
      alert("Something went wrong! " + (error.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
      
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create New Test</h1>

      {/* Test Name */}
      <input
        type="text"
        placeholder="Enter Test Name"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {/* Questions */}
      {questions.map((q) => (
        <div key={q.id} className="border p-4 rounded space-y-3">
          {/* Question text */}
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={q.text}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
              className="border p-2 flex-1 rounded"
            />
            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(q.id)}
                className="ml-3 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                <Trash size={16} />
              </button>
            )}
          </div>

          {/* Choices */}
          <div className="space-y-2">
            {q.choices.map((c, cIndex) => (
              <div key={cIndex} className="flex items-center space-x-3">
                {/* Green radio when selected */}
                <input
                  type="radio"
                  checked={c.isCorrect}
                  onChange={() => markCorrectChoice(q.id, cIndex)}
                  className="accent-green-500 h-4 w-4"
                />

                {/* Choice text */}
                <input
                  type="text"
                  value={c.text}
                  onChange={(e) =>
                    updateChoiceText(q.id, cIndex, e.target.value)
                  }
                  className="border p-2 flex-1 rounded"
                />

                {/* Correct label */}
                {c.isCorrect && (
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <Check size={14} className="mr-1" />
                    Correct
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add Option Button */}
          <button
            onClick={() => addChoice(q.id)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:underline mt-2"
          >
            <Plus size={14} />
            <span>Add Option</span>
          </button>
        </div>
      ))}

      {/* Add Question Button */}
      <button
        onClick={addQuestion}
        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <Plus size={18} />
        <span>Add Question</span>
      </button>

      {/* Save Test Button */}
      <button
        onClick={saveTest}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-4 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Test"}
      </button>
    </div>
  );
}
