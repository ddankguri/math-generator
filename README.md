# MathGenerator

MathGenerator는 교육과정과 문제 유형별 생성 규칙을 이용해 새로운 수학 문제를 만드는 Next.js 기반 학습 도구입니다. 기존 교재 문항을 저장하거나 복사하지 않으며, 현재는 초등 5학년 분수 덧셈의 세 유형을 지원합니다.

## 주요 기능

- 유형·난이도·문항 수에 따른 문제 생성
- 연습 모드와 시험 모드, 정답 및 단계별 풀이
- 인쇄와 PDF 저장
- 학년·단원·유형별 학습 설명
- 학습 콘텐츠에서 선택된 유형의 생성기로 바로 이동
- 페이지별 metadata, canonical, Open Graph, robots, sitemap
- 학습 상세 페이지의 BreadcrumbList 구조화 데이터

## 지원 범위

- 초등 5학년
  - 분수
    - `FRA_ADD_001`: 같은 분모의 분수 덧셈
    - `FRA_ADD_002`: 분모가 배수 관계인 분수 덧셈
    - `FRA_ADD_003`: 서로소 분모의 분수 덧셈

준비되지 않은 학년이나 유형은 목록과 sitemap에 표시하지 않습니다.

## 구조

```text
src/
├── app/                         # App Router 페이지와 SEO 파일
│   ├── learn/                   # 학습 목록, 단원 목록, 유형 상세
│   ├── robots.ts
│   └── sitemap.ts
├── config/site.ts              # 사이트 URL과 공통 metadata 생성기
├── data/
│   ├── learningContent/        # 학습 설명 데이터
│   ├── curriculum/             # 문제 생성용 교육과정 데이터
│   └── problemTypes/           # 문제 유형 정의
└── engine/                     # Generator, Solver, Validator, Registry
```

학습 설명 데이터는 Problem Engine 및 문제 생성 데이터와 분리합니다. UI는 문제를 직접 만들지 않고 기존 Engine Registry를 통해 생성합니다.

## 주요 URL

- `/`: 문제 생성기와 서비스 안내
- `/learn`: 실제 제공되는 학년·단원 목록
- `/learn/elementary5/fraction`: 초등 5학년 분수 유형 목록
- `/learn/elementary5/fraction/fraction-addition/FRA_ADD_001`
- `/learn/elementary5/fraction/fraction-addition/FRA_ADD_002`
- `/learn/elementary5/fraction/fraction-addition/FRA_ADD_003`
- `/about`, `/privacy`, `/terms`, `/contact`

## 개발

```bash
npm install
npm run dev
npm run build
npm run lint
```

이 프로젝트는 Next.js 정적 내보내기(`output: "export"`)를 사용합니다. 새 Next.js 코드를 작성하기 전에 설치된 `node_modules/next/dist/docs/`의 해당 버전 문서를 확인하세요.
