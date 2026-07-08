import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "MathGenerator 서비스 이용 조건과 책임 범위를 안내합니다.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
          MathGenerator
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">이용약관</h1>
        <div className="mt-6 space-y-6 leading-7 text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">서비스 목적</h2>
            <p className="mt-3">
              MathGenerator는 수학 학습을 돕기 위한 문제 생성, 풀이 확인, 인쇄 및 PDF 저장 기능을 제공합니다. 생성된 자료는
              개인 학습, 가정 학습, 수업 보조 자료로 활용할 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">사용자 책임</h2>
            <p className="mt-3">
              사용자는 생성된 문제와 풀이를 학습 목적에 맞게 사용해야 합니다. 사이트를 자동화된 과도한 요청, 무단 복제,
              서비스 방해 목적으로 사용해서는 안 됩니다.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">콘텐츠 정확성</h2>
            <p className="mt-3">
              문제와 풀이의 정확성을 높이기 위해 검증 로직을 적용하지만, 모든 학습 상황에 완전하다고 보장하지는 않습니다. 중요한
              평가 자료로 사용할 때는 교사 또는 보호자의 검토를 권장합니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
