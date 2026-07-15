import { getLearningContent, getLearningContentPath, problemTypeLearningContent } from "@/data/learningContent/problemTypeContent";
import MathText from "@/components/MathText";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata, siteConfig } from "@/config/site";

type Params = { grade: string; unit: string; topic: string; typeId: string };

export function generateStaticParams(): Params[] {
  return problemTypeLearningContent.map((item) => ({ grade: item.grade.id, unit: item.unit.id, topic: item.topic.id, typeId: item.typeId }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { typeId } = await params;
  const content = getLearningContent(typeId);
  return content
    ? createPageMetadata({ title: `${content.title} 학습`, description: content.learningGoal, path: getLearningContentPath(content) })
    : { title: "찾을 수 없는 학습 콘텐츠", robots: { index: false, follow: false } };
}

export default async function LearningContentPage({ params }: { params: Promise<Params> }) {
  const route = await params;
  const content = getLearningContent(route.typeId);
  if (!content || route.grade !== content.grade.id || route.unit !== content.unit.id || route.topic !== content.topic.id) notFound();
  const generatorHref = `/?grade=${content.grade.id}&unit=${content.unit.id}&topic=${content.topic.id}&type=${content.typeId}#generator`;
  const contentPath = getLearningContentPath(content);
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "학습 콘텐츠", item: `${siteConfig.url}/learn` },
      { "@type": "ListItem", position: 3, name: `${content.grade.name} ${content.unit.name}`, item: `${siteConfig.url}/learn/${content.grade.id}/${content.unit.id}` },
      { "@type": "ListItem", position: 4, name: content.title, item: `${siteConfig.url}${contentPath}` },
    ],
  };
  const sections = [{ title: "이 유형에서 배우는 내용", paragraphs: [content.learningGoal] }, { title: "핵심 개념", paragraphs: content.coreConcept }];
  return <main className="flex-1 bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }} /><article className="mx-auto max-w-3xl"><nav aria-label="현재 위치" className="flex flex-wrap gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400"><Link href="/" className="hover:text-indigo-600">홈</Link><span aria-hidden="true">/</span><Link href="/learn" className="hover:text-indigo-600">학습 콘텐츠</Link><span aria-hidden="true">/</span><Link href={`/learn/${content.grade.id}/${content.unit.id}`} className="hover:text-indigo-600">{content.grade.name} {content.unit.name}</Link><span aria-hidden="true">/</span><span aria-current="page">{content.title}</span></nav><p className="mt-8 text-sm font-semibold text-zinc-500 dark:text-zinc-400">{content.grade.name} / {content.unit.name} / {content.topic.name}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{content.title}</h1><p className="mt-2 font-mono text-sm text-indigo-600 dark:text-indigo-300">{content.typeId}</p>
  {sections.map((section) => <section key={section.title} className="mt-10"><h2 className="text-2xl font-extrabold">{section.title}</h2><div className="mt-4 space-y-3 leading-7 text-zinc-700 dark:text-zinc-300">{section.paragraphs.map((p) => <p key={p}>{p}</p>)}</div></section>)}
  <section className="mt-10"><h2 className="text-2xl font-extrabold">계산 방법</h2><ol className="mt-4 space-y-3">{content.method.map((step, index) => <li key={step} className="flex gap-3 leading-7"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{index + 1}</span><span className="text-zinc-700 dark:text-zinc-300">{step}</span></li>)}</ol></section>
  <section className="mt-10"><h2 className="text-2xl font-extrabold">단계별 예제</h2><div className="mt-4 space-y-5">{content.examples.map((example, index) => <div key={example.question} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"><h3 className="font-extrabold">예제 {index + 1}: <MathText text={example.question} /></h3><ol className="mt-4 list-inside list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">{example.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className="mt-4 font-bold text-indigo-600 dark:text-indigo-300">답: <MathText text={example.answer} /></p></div>)}</div></section>
  {[{ title: "학생들이 자주 하는 실수", items: content.commonMistakes }, { title: "지도할 때 확인할 점", items: content.teachingChecks }, { title: "공부 팁", items: content.studyTips }].map((section) => <section key={section.title} className="mt-10"><h2 className="text-2xl font-extrabold">{section.title}</h2><ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-zinc-700 dark:text-zinc-300">{section.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}
  <section className="mt-10"><h2 className="text-2xl font-extrabold">관련 유형</h2><div className="mt-4 flex flex-wrap gap-3">{content.relatedTypeIds.map((id) => { const related = getLearningContent(id)!; return <Link key={id} href={getLearningContentPath(related)} className="rounded-lg border border-zinc-300 bg-white px-4 py-3 font-bold hover:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950">{related.title}</Link>; })}</div></section>
  <div className="mt-12 rounded-xl bg-indigo-50 p-6 dark:bg-indigo-950/40"><h2 className="text-xl font-extrabold">설명한 방법을 문제에 적용해 보세요.</h2><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">이 유형이 미리 선택된 문제 생성기로 이동합니다.</p><Link href={generatorHref} className="mt-5 inline-flex rounded-lg bg-indigo-600 px-5 py-3 font-extrabold text-white hover:bg-indigo-700">이 유형으로 문제 만들기</Link></div></article></main>;
}
