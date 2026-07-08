import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "MathGenerator의 개인정보 처리와 광고 관련 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
          MathGenerator
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">개인정보처리방침</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">최종 업데이트: 2026년 7월 8일</p>
        <div className="mt-6 space-y-6 leading-7 text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">수집하는 정보</h2>
            <p className="mt-3">
              MathGenerator는 회원가입을 받지 않으며 이름, 연락처, 결제 정보 같은 개인정보를 직접 요구하지 않습니다. 시험지에
              입력하는 수험번호와 이름은 사용자의 브라우저 화면에서만 사용되며 별도 서버로 저장하지 않습니다.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">광고와 쿠키</h2>
            <p className="mt-3">
              이 사이트는 Google AdSense를 사용할 수 있습니다. Google과 파트너는 광고 제공과 광고 품질 측정을 위해 쿠키 또는
              유사 기술을 사용할 수 있으며, 사용자는 브라우저 설정 또는 Google 광고 설정에서 맞춤 광고를 관리할 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">외부 서비스</h2>
            <p className="mt-3">
              사이트 배포와 정적 파일 제공에는 호스팅 제공자의 인프라가 사용될 수 있습니다. 외부 서비스는 보안, 트래픽 처리,
              장애 분석을 위해 일반적인 접속 로그를 처리할 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">문의</h2>
            <p className="mt-3">
              개인정보 처리와 관련한 문의는 <Link href="/contact" className="font-bold text-indigo-600 dark:text-indigo-300">문의 페이지</Link>를
              통해 남길 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
