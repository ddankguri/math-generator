import ExamPaper from "@/components/ExamPaper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "수학 시험지 - 중등 수학 기초 평가",
  description: "일차방정식과 연산 기초를 학습, 풀이하고 인쇄할 수 있는 웹 수학 시험지 서비스입니다.",
  keywords: ["수학", "일차방정식", "연산 기초", "수학 시험지", "수학 문제", "중등 수학"],
};

export default function Home() {
  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-200">
      {/* Background Decorative Gradient Elements */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/20 to-transparent pointer-events-none -z-10" />
      
      <header className="no-print w-full max-w-7xl mx-auto px-4 pt-8 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/30">
            ∑
          </div>
          <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
            MathGenerator
          </span>
        </div>
        <div className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
          v1.0.0
        </div>
      </header>

      <ExamPaper />
    </div>
  );
}
