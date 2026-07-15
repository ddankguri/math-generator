# Roadmap

## 프로젝트 비전

MathGenerator는 문제를 보관하는 자료실이 아니라 교육과정과 문제 유형을 바탕으로 새로운 문제를 만드는 학습 플랫폼입니다. 정확한 생성과 풀이 검증을 우선하고, 학습 설명은 검토된 범위부터 단계적으로 확장합니다.

## 현재 버전: 학습 콘텐츠 샘플

완료된 기능:

- Next.js 정적 사이트와 Cloudflare Pages 배포 구조
- Generator, Solver, Validator, Registry 기반 Problem Engine
- 초등 5학년 분수 덧셈 3유형
- 연습·시험 모드, 보기 5개, 해설, 인쇄와 PDF
- 학습 콘텐츠 전용 데이터 모델
- `/learn` 학년·단원 목록
- `/learn/elementary5/fraction` 단원 목록
- 세 유형의 고유 학습 상세 페이지
- 소개, 개인정보처리방침, 이용약관, 문의
- canonical, Open Graph, robots, sitemap, BreadcrumbList

## 단기 계획

1. 세 유형의 수학적 설명과 예제에 대한 교육적 검수
2. 모바일, 키보드, 스크린 리더 사용성 점검
3. 생성기 기존 React lint 부채 정리
4. 배포 환경에서 전체 경로와 검색엔진 출력 검증

## 중기 계획

1. ProblemSet 저장 및 다시 열기
2. Validator와 중복 문제 방지 강화
3. 초등 5학년의 다음 한 개 단원을 샘플로 추가
4. 단원 추가 절차를 데이터·콘텐츠·SEO 체크리스트로 표준화

## 확장 조건

새 학년이나 단원은 Curriculum, ProblemType, Generator, Solver, Validator, Registry, UI, PDF, 학습 콘텐츠와 빌드를 모두 확인한 뒤 공개합니다. 준비되지 않은 경로는 navigation과 sitemap에 넣지 않습니다.
