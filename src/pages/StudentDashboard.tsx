import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  BarChart3,
  ArrowRight,
  Flame,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function StudentDashboard() {
  const { user } = useAuth();
  const { quizzes, getAttemptsByUserId } = useData();

  if (!user) return null;

  const attempts = getAttemptsByUserId(user.id);
  const publishedQuizzes = quizzes.filter((q) => q.published);

  // Calculate stats
  const totalQuizzes = attempts.length;
  const avgScore =
    totalQuizzes > 0
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes
      : 0;
  const bestScore = totalQuizzes > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const correctAnswers = attempts.reduce(
    (sum, a) => sum + a.answers.filter((ans) => ans.isCorrect).length,
    0
  );
  const totalQuestions = attempts.reduce((sum, a) => sum + a.answers.length, 0);
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Category performance
  const categoryMap = new Map<string, { total: number; count: number }>();
  attempts.forEach((attempt) => {
    const quiz = quizzes.find((q) => q.id === attempt.quizId);
    if (quiz) {
      const existing = categoryMap.get(quiz.category) || { total: 0, count: 0 };
      categoryMap.set(quiz.category, {
        total: existing.total + attempt.percentage,
        count: existing.count + 1,
      });
    }
  });

  const categoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
    name: category,
    value: Math.round(data.total / data.count),
  }));

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"];

  // Recent attempts for chart
  const recentAttempts = attempts.slice(-10).map((a, i) => ({
    name: `Quiz ${i + 1}`,
    score: Math.round(a.percentage),
  }));

  // Recent quizzes
  const recentAttemptsList = attempts.slice(-5).reverse();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="Quizzes Taken"
            value={totalQuizzes}
            color="from-indigo-500 to-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Average Score"
            value={`${Math.round(avgScore)}%`}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={Trophy}
            label="Best Score"
            value={`${Math.round(bestScore)}%`}
            color="from-amber-500 to-orange-600"
          />
          <StatCard
            icon={Target}
            label="Accuracy"
            value={`${Math.round(accuracy)}%`}
            color="from-pink-500 to-rose-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Performance Trend
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your last {recentAttempts.length} quizzes
                </p>
              </div>
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            {recentAttempts.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={recentAttempts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                No data yet. Take your first quiz!
              </div>
            )}
          </div>

          {/* Category Performance */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Category Performance
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Average score by subject
                </p>
              </div>
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            {categoryData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {categoryData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/browse"
            className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <BookOpen className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Browse Quizzes</h3>
            <p className="text-indigo-100 mb-4">Explore {publishedQuizzes.length} available quizzes</p>
            <div className="flex items-center gap-2 font-medium">
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Trophy className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
            <p className="text-amber-100 mb-4">See how you rank globally</p>
            <div className="flex items-center gap-2 font-medium">
              View Rankings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ai"
            className="group bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Flame className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Generator</h3>
            <p className="text-pink-100 mb-4">Create custom quizzes with AI</p>
            <div className="flex items-center gap-2 font-medium">
              Try AI
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recent Attempts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Attempts</h3>
            <Clock className="w-6 h-6 text-slate-400" />
          </div>
          {recentAttemptsList.length > 0 ? (
            <div className="space-y-3">
              {recentAttemptsList.map((attempt) => {
                const quiz = quizzes.find((q) => q.id === attempt.quizId);
                if (!quiz) return null;
                return (
                  <Link
                    key={attempt.id}
                    to={`/result/${attempt.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quiz.coverGradient} flex items-center justify-center text-2xl`}
                      >
                        {quiz.coverEmoji}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {quiz.title}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(attempt.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          attempt.percentage >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : attempt.percentage >= 60
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {Math.round(attempt.percentage)}%
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {attempt.score}/{attempt.totalMarks}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">No attempts yet</p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                Take Your First Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
        {value}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
    </div>
  );
}
