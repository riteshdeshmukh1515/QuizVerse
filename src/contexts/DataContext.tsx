import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Quiz, QuizAttempt, LeaderboardEntry, User } from "../types";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useStorage } from "../utils/storage";
import { seedQuizzes } from "../data/seedQuizzes";

interface DataContextType {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  leaderboard: LeaderboardEntry[];
  profiles: User[];
  loading: boolean;
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  addAttempt: (attempt: QuizAttempt) => void;
  getQuizById: (id: string) => Quiz | undefined;
  getAttemptsByUserId: (userId: string) => QuizAttempt[];
  getAttemptsByQuizId: (quizId: string) => QuizAttempt[];
}

const DataContext = createContext<DataContextType | null>(null);

function fromQuizRow(row: any): Quiz {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    durationMinutes: row.duration_minutes,
    questions: Array.isArray(row.questions) ? row.questions : [],
    createdBy: row.created_by || "system",
    createdAt: row.created_at || new Date().toISOString(),
    published: Boolean(row.published),
    tags: Array.isArray(row.tags) ? row.tags : [],
    coverEmoji: row.cover_emoji || "📚",
    coverGradient: row.cover_gradient || "from-indigo-500 via-purple-500 to-pink-500",
  };
}

function toQuizRow(quiz: Quiz, userId?: string) {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    duration_minutes: quiz.durationMinutes,
    questions: quiz.questions,
    created_by: userId || null,
    published: quiz.published,
    tags: quiz.tags || [],
    cover_emoji: quiz.coverEmoji,
    cover_gradient: quiz.coverGradient,
  };
}

function fromAttemptRow(row: any): QuizAttempt {
  return {
    id: row.id,
    quizId: row.quiz_id,
    userId: row.user_id,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
    durationSeconds: row.duration_seconds,
    answers: Array.isArray(row.answers) ? row.answers : [],
    totalMarks: row.total_marks,
    score: row.score,
    percentage: row.percentage,
    status: row.status,
  };
}

function toAttemptRow(attempt: QuizAttempt, userId: string) {
  return {
    id: attempt.id,
    quiz_id: attempt.quizId,
    user_id: userId,
    started_at: attempt.startedAt,
    submitted_at: attempt.submittedAt,
    duration_seconds: attempt.durationSeconds,
    answers: attempt.answers,
    total_marks: attempt.totalMarks,
    score: attempt.score,
    percentage: attempt.percentage,
    status: attempt.status,
  };
}

function fromProfileRow(row: any): User {
  return {
    id: row.id,
    name: row.name || row.email || "User",
    email: row.email || "",
    role: row.role || "student",
    avatarColor: row.avatar_color || "bg-gradient-to-br from-indigo-500 to-purple-600",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useStorage<Quiz[]>("quizverse_quizzes", seedQuizzes);
  const [attempts, setAttempts] = useStorage<QuizAttempt[]>("quizverse_attempts", []);
  const [leaderboard, setLeaderboard] = useStorage<LeaderboardEntry[]>(
    "quizverse_leaderboard",
    []
  );
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));

  const refreshSupabaseData = async () => {
    if (!supabase || !user) return;

    setLoading(true);

    const { data: profileRows } = await supabase
      .from("profiles")
      .select("id,name,email,role,avatar_color,created_at")
      .order("created_at", { ascending: false });
    setProfiles((profileRows || []).map(fromProfileRow));

    let { data: quizRows } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!quizRows || quizRows.length === 0) {
      await supabase.from("quizzes").upsert(
        seedQuizzes.map((quiz) => toQuizRow({ ...quiz, createdBy: user.id }, user.id)),
        { onConflict: "id" }
      );
      const seeded = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });
      quizRows = seeded.data || [];
    }

    const { data: attemptRows } = await supabase
      .from("quiz_attempts")
      .select("*")
      .order("submitted_at", { ascending: false });

    const { data: leaderboardRows } = await supabase
      .from("leaderboards")
      .select("*, profiles(name, avatar_color)")
      .order("percentage", { ascending: false });

    setQuizzes((quizRows || []).map(fromQuizRow));
    setAttempts((attemptRows || []).map(fromAttemptRow));
    setLeaderboard(
      (leaderboardRows || []).map((row: any) => ({
        userId: row.user_id,
        name: row.profiles?.name || "Unknown",
        avatarColor: row.profiles?.avatar_color || "bg-gradient-to-br from-slate-500 to-slate-600",
        quizId: row.quiz_id,
        score: row.score,
        percentage: row.percentage,
        durationSeconds: row.duration_seconds,
        date: row.date,
      }))
    );

    setLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    if (user) {
      refreshSupabaseData();
    } else {
      setProfiles([]);
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  const addQuiz = (quiz: Quiz) => {
    setQuizzes((prev) => [...prev, quiz]);

    if (supabase && user) {
      supabase
        .from("quizzes")
        .upsert(toQuizRow({ ...quiz, createdBy: user.id }, user.id), { onConflict: "id" })
        .then(() => refreshSupabaseData());
    }
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    const currentQuiz = quizzes.find((quiz) => quiz.id === id);
    const nextQuiz = currentQuiz ? { ...currentQuiz, ...updates } : undefined;
    setQuizzes(quizzes.map((quiz) => (quiz.id === id ? { ...quiz, ...updates } : quiz)));

    if (supabase && user && nextQuiz) {
      supabase
        .from("quizzes")
        .update(toQuizRow(nextQuiz, user.id))
        .eq("id", id)
        .then(() => refreshSupabaseData());
    }
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    setAttempts(attempts.filter((attempt) => attempt.quizId !== id));
    setLeaderboard(leaderboard.filter((entry) => entry.quizId !== id));

    if (supabase) {
      supabase
        .from("quizzes")
        .delete()
        .eq("id", id)
        .then(() => refreshSupabaseData());
    }
  };

  const addAttempt = (attempt: QuizAttempt) => {
    setAttempts((prev) => [...prev, attempt]);
    const entry: LeaderboardEntry = {
      userId: attempt.userId,
      name: user?.name || "",
      avatarColor: user?.avatarColor || "",
      quizId: attempt.quizId,
      score: attempt.score,
      percentage: attempt.percentage,
      durationSeconds: attempt.durationSeconds,
      date: attempt.submittedAt,
    };
    setLeaderboard((prev) => [...prev, entry]);

    if (supabase && user) {
      const client = supabase;
      client
        .from("quiz_attempts")
        .insert(toAttemptRow({ ...attempt, userId: user.id }, user.id))
        .then(async () => {
          await client.from("leaderboards").insert({
            user_id: user.id,
            quiz_id: attempt.quizId,
            score: attempt.score,
            percentage: attempt.percentage,
            duration_seconds: attempt.durationSeconds,
            date: attempt.submittedAt,
          });
          refreshSupabaseData();
        });
    }
  };

  const getQuizById = (id: string) => quizzes.find((quiz) => quiz.id === id);
  const getAttemptsByUserId = (userId: string) =>
    attempts.filter((attempt) => attempt.userId === userId);
  const getAttemptsByQuizId = (quizId: string) =>
    attempts.filter((attempt) => attempt.quizId === quizId);

  return (
    <DataContext.Provider
      value={{
        quizzes,
        attempts,
        leaderboard,
        profiles,
        loading,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        addAttempt,
        getQuizById,
        getAttemptsByUserId,
        getAttemptsByQuizId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}