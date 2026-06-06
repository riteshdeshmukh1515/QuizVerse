import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useData } from "../contexts/DataContext";
import {
  BookOpen,
  Users,
  Trophy,
  TrendingUp,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export function AdminDashboard() {
  const { quizzes, attempts, profiles } = useData();
  const users = profiles.length ? profiles : JSON.parse(localStorage.getItem("quizverse_users") || "[]");

  // Stats
  const totalQuizzes = quizzes.length;
  const totalUsers = users.length;
  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts
      : 0;

  // Category distribution
  const categoryMap = new Map<string, number>();
  quizzes.forEach((q) => {
    categoryMap.set(q.category, (categoryMap.get(q.category) || 0) + 1);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  // Recent activity (last 10 attempts)
  const recentActivity = attempts.slice(-10).reverse().map((a) => {
    const quiz = quizzes.find((q) => q.id === a.quizId);
    const user = users.find((u: any) => u.id === a.userId);
    return {
      quiz: quiz?.title || "Unknown",
      user: user?.name || "Unknown",
      score: Math.round(a.percentage),
      date: new Date(a.submittedAt).toLocaleDateString(),
    };
  });

  // Performance trend (last 10 attempts)
  const performanceTrend = attempts.slice(-10).map((a, i) => ({
    name: `Attempt ${i + 1}`,
    score: Math.round(a.percentage),
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage quizzes, users, and analytics
            </p>
          </div>
          <Link
            to="/admin/manage"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
          >
            <Plus className="w-5 h-5" />
            Manage Quizzes
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
              {totalQuizzes}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Quizzes</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
              {totalUsers}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Users</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
              {totalAttempts}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Attempts</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
              {Math.round(avgScore)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Quizzes by Category
              </h3>
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                No data yet
              </div>
            )}
          </div>

          {/* Performance Trend */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Recent Performance
              </h3>
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            {performanceTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceTrend}>
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
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                No attempts yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Recent Activity
            </h3>
            <Link
              to="/admin/manage"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {activity.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {activity.user}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {activity.quiz}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        activity.score >= 80
                          ? "text-emerald-600 dark:text-emerald-400"
                          : activity.score >= 60
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {activity.score}%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No activity yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
