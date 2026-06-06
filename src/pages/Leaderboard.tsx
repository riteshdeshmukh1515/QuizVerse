import { useState, useMemo } from "react";
import { Layout } from "../components/Layout";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Trophy, Medal, Crown, Users, Clock } from "lucide-react";

export function Leaderboard() {
  const { leaderboard, quizzes, profiles } = useData();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"global" | string>("global");

  const users = profiles.length ? profiles : JSON.parse(localStorage.getItem("quizverse_users") || "[]");

  type GlobalEntry = {
    type: "global";
    userId: string;
    name: string;
    avatarColor: string;
    totalScore: number;
    totalQuizzes: number;
    avgPercentage: number;
  };

  type QuizEntry = {
    type: "quiz";
    userId: string;
    name: string;
    avatarColor: string;
    quizId: string;
    score: number;
    percentage: number;
    durationSeconds: number;
    date: string;
  };

  type LeaderboardItem = GlobalEntry | QuizEntry;

  const leaderboardData = useMemo<LeaderboardItem[]>(() => {
    const enriched = leaderboard
      .map((entry) => {
        const quizUser = users.find((u: any) => u.id === entry.userId);
        return {
          ...entry,
          name: quizUser?.name || "Unknown",
          avatarColor:
            quizUser?.avatarColor ||
            entry.avatarColor ||
            "bg-gradient-to-br from-slate-500 to-slate-600",
        };
      })
      .filter((entry) => {
        if (filter === "global") return true;
        return entry.quizId === filter;
      });

    if (filter === "global") {
      const userBest = new Map<
        string,
        { userId: string; name: string; avatarColor: string; totalScore: number; totalQuizzes: number; avgPercentage: number }
      >();
      enriched.forEach((e) => {
        const existing = userBest.get(e.userId);
        if (!existing) {
          userBest.set(e.userId, {
            userId: e.userId,
            name: e.name,
            avatarColor: e.avatarColor,
            totalScore: e.score,
            totalQuizzes: 1,
            avgPercentage: e.percentage,
          });
        } else {
          existing.totalScore += e.score;
          existing.totalQuizzes += 1;
          existing.avgPercentage =
            (existing.avgPercentage * (existing.totalQuizzes - 1) + e.percentage) /
            existing.totalQuizzes;
        }
      });
      return Array.from(userBest.values()).map((e) => ({ type: "global" as const, ...e })).sort((a, b) => b.totalScore - a.totalScore);
    }

    return enriched.map((e) => ({ type: "quiz" as const, ...e })).sort((a, b) => b.percentage - a.percentage);
  }, [leaderboard, users, filter]);

  const myRank =
    filter === "global"
      ? leaderboardData.findIndex((e) => e.userId === user?.id) + 1
      : leaderboardData.findIndex((e) => e.userId === user?.id) + 1;

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getMedalBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-amber-400 to-orange-500";
    if (rank === 2) return "bg-gradient-to-br from-slate-300 to-slate-500";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-orange-600";
    return "bg-slate-100 dark:bg-slate-800";
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-slate-100 mb-3">
            Leaderboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Compete with learners worldwide
          </p>
        </div>

        {/* My rank card */}
        {user && myRank > 0 && (
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">Your Rank</div>
                <div className="text-5xl font-display font-bold">#{myRank}</div>
                <div className="text-sm opacity-90 mt-2">
                  Out of {leaderboardData.length} participants
                </div>
              </div>
              <Users className="w-16 h-16 opacity-30" />
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("global")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === "global"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              🌍 Global
            </button>
            {quizzes
              .filter((q) => q.published)
              .map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => setFilter(quiz.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === quiz.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {quiz.coverEmoji} {quiz.title}
                </button>
              ))}
          </div>
        </div>

        {/* Top 3 */}
        {leaderboardData.length >= 3 && filter === "global" && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 0, 2].map((idx) => {
              const entry = leaderboardData[idx];
              if (!entry) return <div key={idx} />;
              const rank = idx + 1;
                return (
                  <div
                    key={entry.userId}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border-2 ${
                      rank === 1
                        ? "border-amber-400 dark:border-amber-600 lg:scale-110 lg:z-10"
                        : "border-slate-200 dark:border-slate-800"
                    } text-center`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full ${entry.avatarColor} mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="mb-2">{getMedalIcon(rank)}</div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {entry.name}
                    </div>
                    <div className="text-2xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {entry.type === "global"
                        ? entry.totalScore
                        : Math.round(entry.percentage) + "%"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.type === "global"
                        ? `${entry.totalQuizzes} quizzes`
                        : `Score: ${entry.score}`}
                    </div>
                  </div>
                );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {filter === "global" ? "Global Rankings" : "Quiz Leaderboard"}
            </h2>
          </div>
          {leaderboardData.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No participants yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {leaderboardData.map((entry, i) => {
                const rank = i + 1;
                const isMe = entry.userId === user?.id;
                return (
                  <div
                    key={`${entry.userId}-${i}`}
                    className={`flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isMe ? "bg-indigo-50 dark:bg-indigo-900/10" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${getMedalBg(
                        rank
                      )} flex items-center justify-center font-bold ${
                        rank <= 3 ? "text-white" : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {rank}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full ${entry.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {entry.name}
                        {isMe && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.type === "global"
                          ? `${entry.totalQuizzes} quizzes completed`
                          : new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {entry.type === "global"
                          ? entry.totalScore
                          : Math.round(entry.percentage) + "%"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.type === "global" ? "total points" : `score ${entry.score}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
