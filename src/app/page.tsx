import ExamPaper from "@/components/ExamPaper";
import { getLearningContentPath, problemTypeLearningContent } from "@/data/learningContent/problemTypeContent";
import { createPageMetadata } from "@/config/site";
import Link from "next/link";

export const metadata = {
  ...createPageMetadata({ title: "초등 5학년 분수 덧셈 문제 생성기", description: "초등 5학년 분수 덧셈 문제를 난이도별로 새로 생성하고 풀이, 인쇄, PDF 저장까지 이용할 수 있습니다.", path: "/" }),
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

const usageSteps = [
  { title: "유형과 난이도 선택", body: "같은 분모, 배수 관계, 서로소 분모 중 연습할 유형과 알맞은 난이도를 고릅니다." },
  { title: "문제 생성 및 풀이", body: "필요한 문항 수를 선택해 새 문제를 만들고 연습 모드 또는 시험 모드로 풉니다." },
  { title: "해설 확인과 출력", body: "단계별 풀이로 오답 원인을 점검하고 필요하면 시험지를 인쇄하거나 PDF로 저장합니다." },
];

const generatorBenefits = [
  "기존 문제를 복사하지 않고 유형별 생성 규칙으로 새 문제를 구성합니다.",
  "다섯 개의 보기와 정답, 단계별 풀이를 함께 제공해 오답을 점검할 수 있습니다.",
  "난이도와 문항 수를 바꾸며 같은 개념을 여러 조건으로 반복 연습할 수 있습니다.",
  "브라우저에서 바로 풀거나 인쇄·PDF 자료로 활용할 수 있습니다.",
];

export default function Home() {
  return (
    <main className="flex-1 bg-zinc-50 text-zinc-950 transition-colors duration-200 dark:bg-zinc-900 dark:text-zinc-50">
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
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#generator-controls" className="rounded-lg bg-indigo-600 px-5 py-3 font-extrabold text-white hover:bg-indigo-700">문제 만들기</a>
            <Link href="/learn" className="rounded-lg border border-zinc-300 bg-white px-5 py-3 font-extrabold hover:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950">개념부터 학습하기</Link>
          </div>
        </div>
        <ExamPaper />
      </section>

      <section className="no-print bg-white py-12 dark:bg-zinc-950" aria-labelledby="usage-title">
        <div className="mx-auto w-full max-w-7xl px-4">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">사용 방법</p>
          <h2 id="usage-title" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">세 단계로 학습지를 만들고 복습하세요.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{usageSteps.map((step, index) => <article key={step.title} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-extrabold text-white">{index + 1}</span><h3 className="mt-4 text-lg font-extrabold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{step.body}</p></article>)}</div>
        </div>
      </section>

      <section className="no-print bg-zinc-50 py-12 dark:bg-zinc-900" aria-labelledby="support-title">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.3fr]">
          <div><p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">현재 지원 단원</p><h2 id="support-title" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">초등 5학년 분수의 덧셈</h2><p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">현재는 검증된 세 가지 분수 덧셈 유형만 제공합니다. 준비되지 않은 학년이나 단원을 있는 것처럼 표시하지 않습니다.</p><Link href="/learn/elementary5/fraction" className="mt-5 inline-block font-extrabold text-indigo-600 hover:underline dark:text-indigo-300">분수 단원 전체 보기 →</Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{problemTypeLearningContent.map((content) => <article key={content.typeId} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"><p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">{content.typeId}</p><h3 className="mt-2 font-extrabold">{content.title}</h3><p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{content.learningGoal}</p><Link href={getLearningContentPath(content)} className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-300">학습하기 →</Link></article>)}</div>
        </div>
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

      <section className="no-print bg-zinc-50 py-12 dark:bg-zinc-900" aria-labelledby="benefits-title"><div className="mx-auto w-full max-w-7xl px-4"><p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">문제 생성기의 장점</p><h2 id="benefits-title" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">개념 설명과 반복 연습을 한곳에서 연결합니다.</h2><ul className="mt-7 grid gap-4 md:grid-cols-2">{generatorBenefits.map((benefit) => <li key={benefit} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-5 leading-7 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"><span className="font-extrabold text-indigo-600 dark:text-indigo-300">✓</span><span>{benefit}</span></li>)}</ul></div></section>
    </main>
  );
}
