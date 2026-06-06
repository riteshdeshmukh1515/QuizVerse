import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © 2026 QuizVerse. Crafted with 💜 for lifelong learners.
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
    </div>
  );
}
