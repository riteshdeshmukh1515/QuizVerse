import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useData } from "../contexts/DataContext";
import { Search, Filter, Clock, BarChart3, Tag } from "lucide-react";
import type { Category, Difficulty } from "../types";

export function BrowseQuizzes() {
  const { quizzes } = useData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  const publishedQuizzes = quizzes.filter((q) => q.published);

  const filteredQuizzes = useMemo(() => {
    let result = publishedQuizzes;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(s) ||
          q.description.toLowerCase().includes(s) ||
          q.tags.some((t) => t.toLowerCase().includes(s))
      );
    }

    if (category !== "all") {
      result = result.filter((q) => q.category === category);
    }

    if (difficulty !== "all") {
      result = result.filter((q) => q.difficulty === difficulty);
    }

    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "popular") {
      result = [...result].sort((a, b) => b.questions.length - a.questions.length);
    }

    return result;
  }, [publishedQuizzes, search, category, difficulty, sortBy]);

  const categories: (Category | "all")[] = [
    "all",
    "Programming",
    "Aptitude",
    "Mathematics",
    "Science",
    "General Knowledge",
  ];

  const difficulties: (Difficulty | "all")[] = ["all", "Easy", "Medium", "Hard"];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
            Browse Quizzes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discover {publishedQuizzes.length} quizzes across multiple categories
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search quizzes, topics, tags..."
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | "all")}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff === "all" ? "All Difficulties" : diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? "zes" : ""} found
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "popular")}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Questions</option>
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                to={`/quiz/${quiz.id}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-800"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${quiz.coverGradient} flex items-center justify-center text-6xl group-hover:scale-110 transition-transform`}
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

                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quiz.durationMinutes} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {quiz.questions.length} questions
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              No quizzes found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
