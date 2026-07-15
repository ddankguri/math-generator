import Link from "next/link";

export function SiteHeader() {
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
          <Link href="/#generator" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            시험지 생성
          </Link>
          <Link href="/#guide" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            학습 가이드
          </Link>
          <Link href="/learn" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            개념 학습
          </Link>
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
    </header>
  );
}

export function SiteFooter() {
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
          <Link href="/learn" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            개념 학습
          </Link>
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
        <p className="md:col-span-2 border-t border-zinc-200 pt-5 text-xs dark:border-zinc-800">© {new Date().getFullYear()} MathGenerator. 교육 목적의 학습 도구입니다.</p>
      </div>
    </footer>
  );
}
