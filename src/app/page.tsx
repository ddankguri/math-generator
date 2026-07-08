import ExamPaper from "@/components/ExamPaper";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MathGenerator - 초등 5학년 분수 덧셈 시험지",
  description:
    "초등 5학년 분수 덧셈 문제를 난이도별로 생성하고 풀이, 인쇄, PDF 저장까지 지원하는 무료 수학 학습 도구입니다.",
  keywords: [
    "초등 5학년 수학",
    "분수 덧셈",
    "수학 시험지",
    "수학 문제 생성기",
    "분수 문제",
    "무료 학습지",
  ],
};

const guideSections = [
  {
    title: "같은 분모의 분수 덧셈",
    body: "분모가 같을 때는 분모를 그대로 두고 분자만 더합니다. 계산 뒤에는 분자가 분모보다 크거나 같은지 확인하고, 필요하면 대분수로 바꾼 뒤 약분합니다.",
  },
  {
    title: "분모가 배수 관계인 덧셈",
    body: "한 분모가 다른 분모의 배수라면 더 큰 분모를 공통분모로 잡는 것이 효율적입니다. 통분 과정에서 분자와 분모에 같은 수를 곱했는지 확인하는 습관이 중요합니다.",
  },
  {
    title: "서로소 분모의 덧셈",
    body: "두 분모가 서로소라면 두 분모의 곱을 공통분모로 사용할 수 있습니다. 다만 계산 수가 커질 수 있으므로 마지막 약분 여부를 반드시 점검해야 합니다.",
  },
];

const learningChecks = [
  "정답만 맞히는 대신 통분식과 약분 과정을 말로 설명할 수 있는지 확인합니다.",
  "오답은 분모 통일, 분자 계산, 약분 누락 중 어디에서 생겼는지 분류합니다.",
  "쉬움 문제로 개념을 확인한 뒤 보통, 어려움 순서로 난이도를 올립니다.",
  "인쇄한 시험지는 같은 유형을 반복하기보다 오답 유형을 바꿔 다시 풉니다.",
];

function SiteHeader() {
  return (
    <header className="no-print w-full border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="MathGenerator 홈">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-extrabold text-white shadow-md shadow-indigo-600/20">
            ∑
          </div>
          <span className="text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white">
            MathGenerator
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          <a href="#generator" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            시험지 생성
          </a>
          <a href="#guide" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            학습 가이드
          </a>
          <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            소개
          </Link>
          <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            개인정보처리방침
          </Link>
          <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            문의
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="no-print border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-bold text-zinc-950 dark:text-white">MathGenerator</p>
          <p className="mt-2 max-w-2xl leading-6">
            초등 수학 개념을 직접 연습할 수 있도록 문제 생성, 풀이 확인, 인쇄용 시험지 제작을 제공하는 무료 학습 도구입니다.
            콘텐츠와 기능은 학습 편의성을 기준으로 개선합니다.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 font-semibold">
          <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            소개
          </Link>
          <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            이용약관
          </Link>
          <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            문의
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex-1 bg-zinc-50 text-zinc-950 transition-colors duration-200 dark:bg-zinc-900 dark:text-zinc-50">
      <SiteHeader />

      <main>
        <section id="generator" aria-labelledby="generator-title">
          <div className="no-print mx-auto w-full max-w-7xl px-4 pb-2 pt-8">
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">초등 5학년 분수 학습</p>
            <h1 id="generator-title" className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl">
              분수 덧셈을 유형별로 연습하고 바로 시험지로 출력하세요.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
              MathGenerator는 같은 분모, 배수 관계 분모, 서로소 분모의 덧셈을 난이도별로 생성합니다. 각 문제는 정답과 풀이를 함께
              제공해 학생이 계산 과정을 점검할 수 있고, 교사와 보호자는 인쇄용 시험지로 활용할 수 있습니다.
            </p>
          </div>
          <ExamPaper />
        </section>

        <section id="guide" className="no-print bg-white py-12 dark:bg-zinc-950" aria-labelledby="guide-title">
          <div className="mx-auto w-full max-w-7xl px-4">
            <div className="max-w-3xl">
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">학습 가이드</p>
              <h2 id="guide-title" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                분수 덧셈은 통분, 계산, 약분 순서로 점검합니다.
              </h2>
              <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">
                분수 덧셈에서 자주 발생하는 실수는 계산 자체보다 분모를 통일하는 과정에서 생깁니다. 아래 기준을 따라 문제를
                분류하면 학생의 약점을 빠르게 찾을 수 있습니다.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {guideSections.map((section) => (
                <article key={section.title} className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-lg font-extrabold">{section.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{section.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1fr]">
              <section aria-labelledby="checks-title">
                <h3 id="checks-title" className="text-xl font-extrabold">
                  풀이 후 확인할 기준
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {learningChecks.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="quality-title" className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
                <h3 id="quality-title" className="text-xl font-extrabold">
                  사이트 운영 기준
                </h3>
                <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  이 사이트는 사용자가 실제로 찾는 학습 도구와 설명을 함께 제공하는 것을 목표로 합니다. 광고는 학습 콘텐츠를
                  가리거나 문제 풀이보다 더 눈에 띄는 위치에 배치하지 않으며, 콘텐츠가 없는 페이지에는 광고 영역을 만들지 않습니다.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
