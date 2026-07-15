import { createPageMetadata } from "@/config/site";
import Link from "next/link";

export const metadata = createPageMetadata({ title: "이용약관", description: "MathGenerator에서 생성한 문제의 교육 목적 사용 범위, 정확성 안내와 서비스 변경 조건을 설명합니다.", path: "/terms" });

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
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">생성 문제의 사용 범위</h2>
            <p className="mt-3">
              생성된 문제와 풀이는 개인·가정 학습, 학교 및 학원의 수업 보조 자료처럼 교육 목적으로 출력하고 활용할 수 있습니다.
              사이트 자체, 디자인, 설명 콘텐츠 또는 생성 시스템을 통째로 복제해 별도 서비스인 것처럼 배포해서는 안 됩니다.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">자료 생성 원칙</h2>
            <p className="mt-3">MathGenerator는 교재, 기출문제, 유료 학습지의 무단 복제 자료를 제공하지 않습니다. 등록된 교육과정 유형과 자체 생성 규칙을 이용해 문제를 새로 만듭니다.</p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">콘텐츠 정확성</h2>
            <p className="mt-3">
              문제와 풀이의 정확성을 높이기 위해 검증 로직을 적용하지만, 모든 학습 상황에 완전하다고 보장하지는 않습니다. 중요한
              평가 자료로 사용할 때는 교사 또는 보호자의 검토를 권장합니다.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">서비스 변경과 중단</h2>
            <p className="mt-3">교육과정 반영, 오류 수정, 운영 또는 기술상 필요에 따라 기능과 제공 범위가 변경되거나 일시 또는 영구 중단될 수 있습니다. 중요한 변경은 가능한 범위에서 사이트를 통해 안내합니다.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
