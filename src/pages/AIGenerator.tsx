import { useState } from "react";
import { Layout } from "../components/Layout";
import { useData } from "../contexts/DataContext";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  Wand2,
  Brain,
  Zap,
  BookOpen,
} from "lucide-react";
import type { Question, Category, Difficulty } from "../types";
import { generateOpenRouterQuestions } from "../lib/openrouter";

export function AIGenerator() {
  const { addQuiz } = useData();
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<Category>("Programming");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setGenerated(false);
    setError("");

    try {
      const generatedQuestions = await generateOpenRouterQuestions({
        topic: topic || category,
        category,
        difficulty,
        count: numQuestions,
      });

      if (generatedQuestions.length === 0) {
        throw new Error("AI returned no questions. Try a more specific topic.");
      }

      setQuestions(generatedQuestions);
      setGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const emojis = ["🤖", "🧠", "💡", "🎯", "✨", "⚡"];
    const gradients = [
      "from-indigo-500 via-purple-500 to-pink-500",
      "from-cyan-500 via-blue-500 to-indigo-600",
      "from-emerald-500 via-teal-500 to-cyan-500",
    ];

    addQuiz({
      id: `quiz-ai-${Date.now()}`,
      title: `AI Generated: ${topic || category}`,
      description: `AI-powered quiz about ${topic || category} with ${questions.length} questions.`,
      category,
      difficulty,
      durationMinutes: questions.length * 2,
      createdBy: "ai",
      createdAt: new Date().toISOString(),
      published: true,
      tags: ["ai-generated", category.toLowerCase()],
      coverEmoji: emojis[Math.floor(Math.random() * emojis.length)],
      coverGradient: gradients[Math.floor(Math.random() * gradients.length)],
      questions,
    });

    alert("Quiz saved successfully! Check the Browse Quizzes page.");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl shadow-purple-500/30 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-slate-100 mb-4">
            AI Question Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate intelligent quiz questions instantly with AI. Powered by advanced language models.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Smart Generation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AI understands context and generates relevant, challenging questions
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Instant Results</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Generate complete quizzes in seconds, not hours
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 mb-4">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Customizable</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Control difficulty, category, and number of questions
            </p>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Topic / Subject
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., JavaScript closures, World War II, Organic Chemistry..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Programming">Programming</option>
                  <option value="Aptitude">Aptitude</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold text-lg shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate with AI
                </>
              )}
            </button>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Generated Questions */}
        {generated && questions.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Generated Questions
              </h2>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Save as Quiz
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                      {q.question}
                    </h3>
                  </div>

                  <div className="ml-11 space-y-2">
                    {q.options?.map((opt, j) => (
                      <div
                        key={j}
                        className={`px-4 py-2 rounded-lg ${
                          opt === q.correctAnswer
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 font-medium"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {opt}
                        {opt === q.correctAnswer && " ✓"}
                      </div>
                    ))}
                    {q.explanation && (
                      <div className="mt-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm text-indigo-800 dark:text-indigo-300">
                          💡 {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
