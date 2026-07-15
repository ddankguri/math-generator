import { learningGrades } from "@/data/learningContent/grades";
import { learningUnits } from "@/data/learningContent/units";
import { getLearningContentPath, problemTypeLearningContent } from "@/data/learningContent/problemTypeContent";
import { createPageMetadata } from "@/config/site";
import Link from "next/link";

export const metadata = createPageMetadata({ title: "수학 학습 콘텐츠 목록", description: "현재 제공되는 학년과 단원별 수학 개념 설명을 찾고 구현된 유형의 문제를 바로 연습할 수 있습니다.", path: "/learn" });

export default function LearnPage() {
  return (
    <main className="flex-1 bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">학습 콘텐츠</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">학년과 단원별로 개념을 익혀 보세요.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-zinc-600 dark:text-zinc-300">
          현재 실제 설명과 문제 생성 기능이 준비된 콘텐츠만 표시합니다. 개념을 읽은 뒤 같은 유형의 문제를 바로 만들어 연습할 수 있습니다.
        </p>

        {learningGrades.map((grade) => {
          const units = learningUnits.filter((unit) => unit.gradeId === grade.id && problemTypeLearningContent.some((content) => content.grade.id === grade.id && content.unit.id === unit.id));
          if (units.length === 0) return null;
          return (
            <section key={grade.id} className="mt-12" aria-labelledby={`grade-${grade.id}`}>
              <h2 id={`grade-${grade.id}`} className="text-2xl font-extrabold">{grade.name}</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {units.map((unit) => {
                  const contents = problemTypeLearningContent.filter((content) => content.grade.id === grade.id && content.unit.id === unit.id);
                  return (
                    <article key={unit.id} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">단원</p>
                      <h3 className="mt-2 text-xl font-extrabold">{unit.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">현재 {contents.length}개 유형의 학습 설명과 문제 생성을 제공합니다.</p>
                      <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                        {contents.map((content) => <li key={content.typeId}><Link href={getLearningContentPath(content)} className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-300">{content.title}</Link></li>)}
                      </ul>
                      <Link href={`/learn/${grade.id}/${unit.id}`} className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 font-bold text-white hover:bg-indigo-700">{unit.name} 단원 보기</Link>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
