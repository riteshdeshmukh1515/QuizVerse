import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Send,
} from "lucide-react";
import type { AttemptAnswer, QuizAttempt } from "../types";

export function QuizAttempt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuizById, addAttempt } = useData();

  const quiz = id ? getQuizById(id) : undefined;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [timeLeft, setTimeLeft] = useState(quiz ? quiz.durationMinutes * 60 : 0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && quiz) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  if (!quiz || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Quiz not found
          </h2>
          <button
            onClick={() => navigate("/browse")}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Browse Quizzes
          </button>
        </div>
      </Layout>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.size;
  const allAnswered = answeredCount === quiz.questions.length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(new Map(answers).set(questionId, answer));
  };

  const handleSubmit = (timedOut = false) => {
    if (!quiz || !user) return;

    const startedAt = new Date(Date.now() - (quiz.durationMinutes * 60 - timeLeft) * 1000).toISOString();
    const submittedAt = new Date().toISOString();
    const durationSeconds = quiz.durationMinutes * 60 - timeLeft;

    const attemptAnswers: AttemptAnswer[] = quiz.questions.map((q) => {
      const selected = answers.get(q.id) || null;
      const isCorrect = selected === q.correctAnswer;
      let marksAwarded = 0;
      
      if (isCorrect) {
        marksAwarded = q.marks;
      } else if (selected !== null) {
        marksAwarded = -q.negativeMarks;
      }

      return {
        questionId: q.id,
        selected,
        isCorrect,
        marksAwarded,
      };
    });

    const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
    const score = attemptAnswers.reduce((sum, a) => sum + a.marksAwarded, 0);
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      userId: user.id,
      startedAt,
      submittedAt,
      durationSeconds,
      answers: attemptAnswers,
      totalMarks,
      score: Math.max(0, score),
      percentage: Math.max(0, percentage),
      status: timedOut ? "timed-out" : "submitted",
    };

    addAttempt(attempt);
    navigate(`/result/${attempt.id}`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {quiz.title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                timeLeft < 60
                  ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                  : timeLeft < 180
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{answeredCount} answered</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
              {currentQuestion.type === "mcq"
                ? "Multiple Choice"
                : currentQuestion.type === "tf"
                ? "True / False"
                : "Fill in the Blank"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentQuestion.marks} marks
            </span>
            {currentQuestion.negativeMarks > 0 && (
              <span className="text-xs text-rose-600 dark:text-rose-400">
                -{currentQuestion.negativeMarks} for wrong
              </span>
            )}
          </div>

          <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.type === "fill" ? (
              <input
                type="text"
                value={answers.get(currentQuestion.id) || ""}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            ) : (
              currentQuestion.options?.map((option, i) => {
                const selected = answers.get(currentQuestion.id) === option;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selected
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {selected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-slate-900 dark:text-slate-100">{option}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <Send className="w-5 h-5" />
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Question Navigator
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map((q, i) => {
              const answered = answers.has(q.id);
              const isCurrent = i === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    isCurrent
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                      : answered
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Submit Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Submit Quiz?
                </h3>
              </div>

              {!allAnswered && (
                <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    You have {quiz.questions.length - answeredCount} unanswered question
                    {quiz.questions.length - answeredCount !== 1 ? "s" : ""}. Unanswered questions
                    will receive 0 marks.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
