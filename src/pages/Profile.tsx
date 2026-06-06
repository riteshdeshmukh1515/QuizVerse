import { useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import {
  User,
  Mail,
  Calendar,
  Award,
  Target,
  TrendingUp,
  Save,
  CheckCircle,
} from "lucide-react";

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { getAttemptsByUserId } = useData();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const attempts = getAttemptsByUserId(user.id);
  const totalQuizzes = attempts.length;
  const avgScore =
    totalQuizzes > 0
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes
      : 0;
  const bestScore = totalQuizzes > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;

  const handleSave = () => {
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-slate-100 mb-8">
          Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div
                className={`w-24 h-24 rounded-2xl ${user.avatarColor} flex items-center justify-center text-4xl font-bold text-white shadow-xl -mt-16 border-4 border-white dark:border-slate-900`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {user.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{user.email}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium capitalize">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 text-center">
            <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">
              {totalQuizzes}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Quizzes Taken</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">
              {Math.round(avgScore)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 text-center">
            <Award className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">
              {Math.round(bestScore)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Best Score</div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Edit Profile
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
