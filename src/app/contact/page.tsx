import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의",
  description: "MathGenerator 오류 제보, 개선 제안, 개인정보 문의 안내입니다.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">MathGenerator</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">문의</h1>
        <div className="mt-6 space-y-6 leading-7 text-zinc-700 dark:text-zinc-300">
          <p>
            문제 오류, 풀이 개선, 새로운 수학 단원 제안, 개인정보 관련 문의는 이메일로 보내 주세요. 제보할 때는 문제 유형,
            난이도, 발생한 상황을 함께 적어 주면 확인이 빠릅니다.
          </p>
          <p>
            <a
              href="mailto:selpa5407@gmail.com"
              className="font-bold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300"
            >
              selpa5407@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
