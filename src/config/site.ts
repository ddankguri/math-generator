import type { Metadata } from "next";

export const siteConfig = {
  name: "MathGenerator",
  url: "https://math-generator.pages.dev",
  description: "초등 수학 개념을 이해하고 유형별 새 문제를 만들어 연습하는 무료 학습 도구입니다.",
  locale: "ko_KR",
} as const;

export function createPageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: siteConfig.locale, url: path, siteName: siteConfig.name, title, description },
  };
}
