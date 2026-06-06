import { useState } from "react";
import { Layout } from "../components/Layout";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  AlertTriangle,
} from "lucide-react";
import type { Quiz, Category, Difficulty, Question } from "../types";

const gradients = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-cyan-500 via-blue-500 to-indigo-600",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-sky-500 via-blue-500 to-purple-500",
  "from-lime-500 via-emerald-500 to-teal-500",
];

const emojis = ["📚", "🧠", "💡", "🎯", "🔥", "⚡", "🌟", "🏆", "📐", "🔬", "🎨", "🌍"];

export function ManageQuizzes() {
  const { quizzes, addQuiz, updateQuiz, deleteQuiz } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteQuiz(id);
    setDeleteConfirm(null);
  };

  const handleTogglePublish = (id: string, current: boolean) => {
    updateQuiz(id, { published: !current });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
              Manage Quizzes
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Create, edit, and publish quizzes
            </p>
          </div>
          <button
            onClick={() => {
              setEditingQuiz(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Quiz
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-slate-800 text-center">
            <Filter className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              No quizzes found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {search ? "Try a different search" : "Create your first quiz to get started"}
            </p>
            {!search && (
              <button
                onClick={() => {
                  setEditingQuiz(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Quiz
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow"
              >
                <div
                  className={`h-24 bg-gradient-to-br ${quiz.coverGradient} flex items-center justify-center text-5xl`}
                >
                  {quiz.coverEmoji}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                      {quiz.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        quiz.difficulty === "Easy"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : quiz.difficulty === "Medium"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                          : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div>{quiz.questions.length} questions</div>
                    <div>{quiz.durationMinutes} min</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingQuiz(quiz);
                        setShowForm(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePublish(quiz.id, quiz.published)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                        quiz.published
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {quiz.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {quiz.published ? "Published" : "Draft"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(quiz.id)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiz Form Modal */}
        {showForm && (
          <QuizForm
            quiz={editingQuiz}
            onClose={() => setShowForm(false)}
            onSave={(quiz) => {
              if (editingQuiz) {
                updateQuiz(editingQuiz.id, quiz);
              } else {
                addQuiz({
                  ...(quiz as Quiz),
                  id: `quiz-${Date.now()}`,
                  createdBy: user?.id || "admin",
                  createdAt: new Date().toISOString(),
                  tags: [quiz.category?.toLowerCase() || "quiz"],
                  published: quiz.published ?? false,
                });
              }
              setShowForm(false);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Delete Quiz?
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                This action cannot be undone. All quiz data and attempts will be permanently deleted.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-rose-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function QuizForm({
  quiz,
  onClose,
  onSave,
}: {
  quiz: Quiz | null;
  onClose: () => void;
  onSave: (quiz: Partial<Quiz>) => void;
}) {
  const [title, setTitle] = useState(quiz?.title || "");
  const [description, setDescription] = useState(quiz?.description || "");
  const [category, setCategory] = useState<Category>(quiz?.category || "Programming");
  const [difficulty, setDifficulty] = useState<Difficulty>(quiz?.difficulty || "Easy");
  const [durationMinutes, setDurationMinutes] = useState(quiz?.durationMinutes || 10);
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [coverEmoji, setCoverEmoji] = useState(quiz?.coverEmoji || "📚");
  const coverGradient = quiz?.coverGradient || gradients[Math.floor(Math.random() * gradients.length)];

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 5,
        negativeMarks: 1,
        explanation: "",
      },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSave({
      title,
      description,
      category,
      difficulty,
      durationMinutes,
      questions,
      coverEmoji,
      coverGradient,
      published: quiz?.published || false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {quiz ? "Edit Quiz" : "Create Quiz"}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Quiz title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Quiz description"
              />
            </div>

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
                Duration (minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Cover Emoji
              </label>
              <select
                value={coverEmoji}
                onChange={(e) => setCoverEmoji(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {emojis.map((emoji) => (
                  <option key={emoji} value={emoji}>
                    {emoji}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Questions ({questions.length})
              </h3>
              <button
                onClick={addQuestion}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Question {i + 1}
                    </h4>
                    <button
                      onClick={() => removeQuestion(i)}
                      className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(i, { question: e.target.value })}
                      placeholder="Question text"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={q.type}
                        onChange={(e) =>
                          updateQuestion(i, {
                            type: e.target.value as "mcq" | "tf" | "fill",
                            options:
                              e.target.value === "mcq"
                                ? ["", "", "", ""]
                                : e.target.value === "tf"
                                ? ["True", "False"]
                                : [],
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="tf">True/False</option>
                        <option value="fill">Fill in the Blank</option>
                      </select>

                      <input
                        type="number"
                        value={q.marks}
                        onChange={(e) => updateQuestion(i, { marks: Number(e.target.value) })}
                        placeholder="Marks"
                        min={1}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    {q.type !== "fill" && (
                      <div className="space-y-2">
                        {q.options?.map((opt, j) => (
                          <input
                            key={j}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(q.options || [])];
                              newOpts[j] = e.target.value;
                              updateQuestion(i, { options: newOpts });
                            }}
                            placeholder={`Option ${j + 1}`}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                        ))}
                      </div>
                    )}

                    <input
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(i, { correctAnswer: e.target.value })}
                      placeholder="Correct answer"
                      className="w-full px-4 py-2 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-slate-900 dark:text-slate-100"
                    />

                    <input
                      type="text"
                      value={q.explanation || ""}
                      onChange={(e) => updateQuestion(i, { explanation: e.target.value })}
                      placeholder="Explanation (optional)"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
          >
            {quiz ? "Update Quiz" : "Create Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
