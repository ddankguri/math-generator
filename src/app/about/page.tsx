import { createPageMetadata } from "@/config/site";
import Link from "next/link";

export const metadata = createPageMetadata({ title: "사이트 소개", description: "MathGenerator가 문제를 만드는 방식, 대상 사용자, 교육적 목표와 현재 지원 범위를 안내합니다.", path: "/about" });

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
          MathGenerator
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">소개</h1>
        <div className="mt-6 space-y-6 leading-7 text-zinc-700 dark:text-zinc-300">
          <p>
            MathGenerator는 초등 수학 학습자가 개념을 직접 연습할 수 있도록 만든 무료 시험지 생성 도구입니다. 현재는 초등 5학년
            분수 덧셈을 중심으로 같은 분모, 배수 관계 분모, 서로소 분모 유형을 제공합니다.
          </p>
          <p>
            교재나 기존 시험지의 문항을 복사해 제공하지 않습니다. 교육과정에 맞춘 문제 유형과 생성 규칙을 바탕으로 사용자가
            요청할 때마다 수, 보기, 풀이를 새로 구성합니다.
          </p>
          <p>
            각 문제는 단순 정답 확인에 그치지 않고 풀이 과정을 함께 제공하는 것을 목표로 합니다. 학생은 오답 원인을 점검하고,
            보호자와 교사는 인쇄 가능한 시험지나 PDF 자료로 반복 학습을 구성할 수 있습니다.
          </p>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">콘텐츠 원칙</h2>
            <ul className="mt-3 space-y-2">
              <li>교육과정 단원과 문제 유형을 기준으로 학습 범위를 분명히 표시합니다.</li>
              <li>문제 수보다 풀이 품질과 학습 흐름을 우선합니다.</li>
              <li>중복되거나 내용이 없는 페이지를 만들지 않습니다.</li>
              <li>광고가 학습 콘텐츠와 도구 사용을 방해하지 않도록 관리합니다.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">대상 사용자와 제공 기능</h2>
            <p className="mt-3">학생은 유형별 연습과 풀이 확인에, 보호자는 가정 학습 점검에, 교사는 수업 보조용 문제지 제작에 활용할 수 있습니다. 난이도와 문항 수 선택, 연습·시험 모드, 정답 해설, 인쇄와 PDF 저장을 제공합니다.</p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">교육적 목표와 현재 범위</h2>
            <p className="mt-3">정답 횟수를 늘리는 데 그치지 않고, 학생이 통분과 약분의 이유를 설명하고 자신의 오답 단계를 찾도록 돕는 것이 목표입니다. 현재 학습 콘텐츠와 생성기는 초등 5학년 분수 덧셈의 세 유형만 지원하며, 검증되지 않은 전체 학년 범위를 지원한다고 표시하지 않습니다.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
