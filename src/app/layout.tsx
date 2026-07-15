import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MathGenerator - 무료 수학 시험지 생성기",
    template: "%s | MathGenerator",
  },
  description:
    "초등 수학 문제를 유형별로 생성하고 풀이, 인쇄, PDF 저장을 지원하는 무료 학습 도구입니다.",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: "MathGenerator - 무료 수학 시험지 생성기",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  other: {
    "google-adsense-account": "ca-pub-5833246063718895",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5833246063718895"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}
