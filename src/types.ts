export type Role = "student" | "admin";

export type QuestionType = "mcq" | "tf" | "fill";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Category =
  | "Programming"
  | "Aptitude"
  | "Mathematics"
  | "Science"
  | "General Knowledge";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // for MCQ / TF
  correctAnswer: string; // correct option text or value
  marks: number;
  negativeMarks: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  durationMinutes: number;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  published: boolean;
  tags: string[];
  coverEmoji: string;
  coverGradient: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatarColor: string;
  createdAt: string;
}

export interface AttemptAnswer {
  questionId: string;
  selected: string | null; // null means unanswered
  isCorrect: boolean;
  marksAwarded: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  submittedAt: string;
  durationSeconds: number;
  answers: AttemptAnswer[];
  totalMarks: number;
  score: number;
  percentage: number;
  status: "submitted" | "timed-out";
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarColor: string;
  quizId: string;
  score: number;
  percentage: number;
  durationSeconds: number;
  date: string;
}
