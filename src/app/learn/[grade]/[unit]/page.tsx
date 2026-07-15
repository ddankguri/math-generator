import { difficultyLabels } from "@/types/problem";
import { getLearningContentPath, problemTypeLearningContent } from "@/data/learningContent/problemTypeContent";
import { learningGrades } from "@/data/learningContent/grades";
import { learningUnits } from "@/data/learningContent/units";
import { fractionAdditionProblemTypes } from "@/data/problemTypes/fractionAddition";
import { createPageMetadata } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { grade: string; unit: string };

export function generateStaticParams(): Params[] {
  return learningUnits.filter((unit) => problemTypeLearningContent.some((content) => content.grade.id === unit.gradeId && content.unit.id === unit.id)).map((unit) => ({ grade: unit.gradeId, unit: unit.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const route = await params;
  const grade = learningGrades.find((item) => item.id === route.grade);
  const unit = learningUnits.find((item) => item.id === route.unit && item.gradeId === route.grade);
  return grade && unit
    ? createPageMetadata({ title: `${grade.name} ${unit.name} 단원 학습`, description: `${grade.name} ${unit.name} 단원에서 현재 제공하는 개념 설명, 난이도와 문제 생성 링크를 확인합니다.`, path: `/learn/${grade.id}/${unit.id}` })
    : { title: "찾을 수 없는 단원", robots: { index: false, follow: false } };
}

export default async function UnitLearningPage({ params }: { params: Promise<Params> }) {
  const route = await params;
  const grade = learningGrades.find((item) => item.id === route.grade);
  const unit = learningUnits.find((item) => item.id === route.unit && item.gradeId === route.grade);
  const contents = problemTypeLearningContent.filter((content) => content.grade.id === route.grade && content.unit.id === route.unit);
  if (!grade || !unit || contents.length === 0) notFound();

  return (
    <main className="flex-1 bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl">
        <Link href="/learn" className="text-sm font-bold text-indigo-600 dark:text-indigo-300">← 전체 학습 콘텐츠</Link>
        <p className="mt-8 text-sm font-semibold text-zinc-500 dark:text-zinc-400">{grade.name}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{unit.name} 단원 학습</h1>
        <p className="mt-4 max-w-3xl leading-7 text-zinc-600 dark:text-zinc-300">분모의 관계를 먼저 살펴보고 알맞은 통분 방법을 선택하는 연습을 합니다. 아래 목록은 설명과 생성기가 모두 구현된 유형입니다.</p>
        <div className="mt-8 space-y-5">
          {contents.map((content) => {
            const definition = fractionAdditionProblemTypes.find((item) => item.id === content.typeId)!;
            const generatorHref = `/?grade=${content.grade.id}&unit=${content.unit.id}&topic=${content.topic.id}&type=${content.typeId}#generator`;
            return (
              <article key={content.typeId} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-7">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl"><p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">{content.typeId}</p><h2 className="mt-2 text-xl font-extrabold">{content.title}</h2><p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{definition.description}</p><p className="mt-3 text-sm font-semibold">난이도: {definition.difficultyLevels.map((level) => difficultyLabels[level]).join(" · ")}</p></div>
                  <div className="flex shrink-0 flex-wrap gap-2"><Link href={getLearningContentPath(content)} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">학습하기</Link><Link href={generatorHref} className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-bold hover:border-indigo-500 dark:border-zinc-700">문제 만들기</Link></div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
