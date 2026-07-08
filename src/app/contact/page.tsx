import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "문의",
  description: "MathGenerator 오류 제보, 개선 제안, 개인정보 문의 안내입니다.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
          MathGenerator
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">문의</h1>
        <div className="mt-6 space-y-6 leading-7 text-zinc-700 dark:text-zinc-300">
          <p>
            문제 오류, 풀이 개선, 새로운 수학 단원 제안, 개인정보 관련 문의는 GitHub 이슈를 통해 남길 수 있습니다. 제보할 때는
            문제 유형, 난이도, 발생한 상황을 함께 적어 주면 확인이 빠릅니다.
          </p>
          <p>
            <a
              href="https://github.com/ddankguri/math-generator/issues"
              className="font-bold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub 이슈로 문의하기
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
