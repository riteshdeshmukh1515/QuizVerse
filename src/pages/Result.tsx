import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import {
  Trophy,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Download,
  Share2,
  RotateCcw,
} from "lucide-react";
import { useState, useRef } from "react";

export function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { attempts, getQuizById } = useData();
  const certRef = useRef<HTMLDivElement>(null);

  const attempt = attempts.find((a) => a.id === id);
  const quiz = attempt ? getQuizById(attempt.quizId) : undefined;

  const [showCert, setShowCert] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!attempt || !quiz || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Result not found
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

  const passed = attempt.percentage >= 60;
  const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
  const wrongCount = attempt.answers.filter((a) => !a.isCorrect && a.selected !== null).length;
  const skippedCount = attempt.answers.filter((a) => a.selected === null).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const shareUrl = `${window.location.origin}/result/${attempt.id}`;
  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
          <div
            className={`p-8 lg:p-12 text-center text-white bg-gradient-to-br ${
              passed
                ? "from-emerald-500 via-teal-500 to-cyan-500"
                : "from-rose-500 via-pink-500 to-orange-500"
            }`}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              {passed ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Award className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {passed ? "🎉 Congratulations!" : "Keep Practicing!"}
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 mb-8">
              You scored {Math.round(attempt.percentage)}%
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">{Math.round(attempt.percentage)}%</div>
                <div className="text-sm opacity-90">Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">
                  {attempt.score}/{attempt.totalMarks}
                </div>
                <div className="text-sm opacity-90">Marks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">{formatTime(attempt.durationSeconds)}</div>
                <div className="text-sm opacity-90">Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">{correctCount}</div>
                <div className="text-sm opacity-90">Correct</div>
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {correctCount}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-500">Correct</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20">
                <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">{wrongCount}</div>
                <div className="text-xs text-rose-600 dark:text-rose-500">Wrong</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                  {skippedCount}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Skipped</div>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  AI Performance Feedback
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {attempt.percentage >= 90
                  ? "🌟 Outstanding performance! You've demonstrated mastery of this topic. Your deep understanding is evident from your excellent accuracy. Consider challenging yourself with harder quizzes."
                  : attempt.percentage >= 75
                  ? "💪 Great work! You have a strong grasp of the concepts. Focus on the questions you missed to push toward perfection. Your consistency is impressive."
                  : attempt.percentage >= 60
                  ? "👍 Good effort! You've passed the quiz. Review the explanations for incorrect answers to strengthen your understanding. You're on the right track!"
                  : attempt.percentage >= 40
                  ? "📚 You're making progress, but there's room for improvement. Focus on the fundamentals and try the quiz again after some review. Every expert was once a beginner!"
                  : "💡 Don't worry — learning is a journey! Review the basic concepts, read the explanations carefully, and try again. Persistence is key to mastery."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCert(true)}
                disabled={!passed}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Award className="w-5 h-5" />
                View Certificate
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                <Share2 className="w-5 h-5" />
                {copied ? "Link Copied!" : "Share Result"}
              </button>
              <Link
                to={`/quiz/${quiz.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Retry Quiz
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Browse More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Answer Review
          </h2>
          <div className="space-y-6">
            {quiz.questions.map((q, i) => {
              const answer = attempt.answers.find((a) => a.questionId === q.id);
              if (!answer) return null;
              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-xl border-2 ${
                    answer.isCorrect
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                      : answer.selected === null
                      ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                      : "border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                      Q{i + 1}. {q.question}
                    </h3>
                    {answer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-3" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 ml-3" />
                    )}
                  </div>

                  {q.options && q.options.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, j) => {
                        const isCorrect = opt === q.correctAnswer;
                        const isUser = opt === answer.selected;
                        return (
                          <div
                            key={j}
                            className={`px-4 py-2 rounded-lg border ${
                              isCorrect
                                ? "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200"
                                : isUser
                                ? "border-rose-500 bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {opt}
                            {isCorrect && " ✓"}
                            {isUser && !isCorrect && " (your answer)"}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "fill" && (
                    <div className="mb-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Your answer:
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                        {answer.selected || "(skipped)"}
                      </div>
                      {!answer.isCorrect && (
                        <div className="mt-2 text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Correct answer: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {q.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                        💡 EXPLANATION
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{q.explanation}</p>
                    </div>
                  )}

                  <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    Marks:{" "}
                    <span
                      className={
                        answer.marksAwarded > 0
                          ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                          : answer.marksAwarded < 0
                          ? "text-rose-600 dark:text-rose-400 font-semibold"
                          : ""
                      }
                    >
                      {answer.marksAwarded > 0 ? "+" : ""}
                      {answer.marksAwarded} / {q.marks}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Modal */}
        {showCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full my-8">
              <div ref={certRef} className="certificate-print">
                <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-12 lg:p-16 border-8 border-double border-amber-400 dark:border-amber-600 rounded-lg">
                  {/* Decorative corners */}
                  <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-400 dark:border-amber-600 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-amber-400 dark:border-amber-600 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-amber-400 dark:border-amber-600 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-amber-400 dark:border-amber-600 rounded-br-lg" />

                  <div className="text-center space-y-6">
                    <div className="text-6xl">🏆</div>
                    <div className="text-sm tracking-[0.4em] text-amber-700 dark:text-amber-400 font-semibold">
                      CERTIFICATE OF ACHIEVEMENT
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      QuizVerse
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      This certificate is proudly presented to
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-slate-100 border-b-2 border-amber-400 dark:border-amber-600 pb-2 inline-block">
                      {user.name}
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                      For successfully completing the quiz{" "}
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        "{quiz.title}"
                      </span>{" "}
                      with an outstanding score of{" "}
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {Math.round(attempt.percentage)}%
                      </span>
                      .
                    </p>

                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Date</div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {new Date(attempt.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Score</div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {attempt.score}/{attempt.totalMarks}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Category</div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {quiz.category}
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 flex items-end justify-around">
                      <div className="text-center">
                        <div className="w-32 h-1 bg-slate-900 dark:bg-slate-100 mb-2" />
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          QuizVerse Director
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl">✨</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          ID: {attempt.id}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-32 h-1 bg-slate-900 dark:bg-slate-100 mb-2" />
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Quiz Instructor
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowCert(false)}
                  className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
