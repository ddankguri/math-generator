# Problem Engine

## 목적

Problem Engine은 Math Generator의 핵심 모듈이다.

이 엔진의 목적은 교육과정과 문제 유형을 기반으로 새로운 문제를 생성하는 것이다.

이 프로젝트는 문제를 저장하지 않는다.

문제 유형과 생성 규칙을 저장하여 요청될 때마다 새로운 문제를 생성한다.

---

# 핵심 철학

## 1. 문제를 저장하지 않는다.

문제를 데이터베이스에 저장하지 않는다.

저장하는 것은

- 교육과정
- 문제 유형
- Generator
- Validator
- Solver
- 난이도 규칙
- 오답 생성 규칙

뿐이다.

---

## 2. 문제 생성은 항상 Engine을 통해 이루어진다.

UI가 Generator를 직접 호출하면 안 된다.

반드시

```text
UI

↓

Problem Engine

↓

Generator

↓

Validator

↓

Solver
```

순서로 실행한다.

---

## 3. Generator는 문제만 생성한다.

Generator는

- 숫자 생성
- 조건 생성
- 문제 생성

만 담당한다.

Generator는

- PDF
- localStorage
- UI

를 알면 안 된다.

---

## 4. Validator는 품질만 검사한다.

Validator는

문제를 수정하지 않는다.

검사만 한다.

예)

- 보기 개수

- 중복 여부

- 정답 존재

- 교육과정 범위

- 난이도 적합성

---

## 5. Solver는 정답과 풀이만 만든다.

Solver는

- 정답 계산

- 풀이 생성

- 단계별 풀이 생성

만 담당한다.

---

# 문제 생성 순서

```text
ProblemType 선택

↓

Generator 실행

↓

Solver 실행

↓

보기 생성

↓

Validator 검사

↓

Problem 반환
```

---

# Generator 구조

모든 Generator는

ProblemType을 입력받아

Problem을 반환한다.

예)

```text
FractionSameDenominatorGenerator

↓

Problem
```

---

# Validator 구조

Validator는 다음을 검사해야 한다.

- question 존재

- 보기 개수 == 5

- 보기 중복 없음

- answer 존재

- answer가 choices 안에 존재

- 정답 유일

- 교육과정 범위

- 난이도 조건

- 문제 중복 여부

Validator는 조건을 만족하지 않으면

문제를 폐기하고

Generator를 다시 호출하도록 한다.

---

# Solver 구조

Solver는

정답과 풀이를 생성한다.

반드시

solutionSteps를 생성한다.

예)

```text
1. 분모를 통분한다.

2. 분자를 더한다.

3. 약분한다.

4. 정답을 구한다.
```

---

# Problem 객체

모든 문제는 Problem 타입을 사용한다.

```ts
type Problem = {
  id: string;

  question: string;

  choices: string[];

  answer: string;

  solution: string;

  solutionSteps: string[];

  grade: string;

  unit: string;

  topic: string;

  problemTypeId: string;

  difficulty: "easy" | "normal" | "hard";
}
```

---

# ProblemSet 객체

문제지는 ProblemSet 단위로 관리한다.

```ts
type ProblemSet = {
  id: string;

  title: string;

  createdAt: string;

  grade: string;

  unit: string;

  topic: string;

  problemTypeId: string;

  difficulty: "easy" | "normal" | "hard";

  count: number;

  problems: Problem[];
}
```

---

# Generator Registry

ProblemType은

generatorKey를 가진다.

Engine은

registry에서

generatorKey를 찾아

해당 Generator를 실행한다.

```text
ProblemType

↓

generatorKey

↓

Registry

↓

Generator
```

예)

```text
fraction.add.sameDenominator

↓

FractionSameDenominatorGenerator
```

---

# ProblemType 추가 순서

새로운 문제 유형은 반드시 아래 순서를 따른다.

1. Curriculum 추가

2. ProblemType 정의

3. Generator 구현

4. Solver 구현

5. Validator 연결

6. Registry 등록

7. UI 연결

8. PDF 출력 확인

9. Build 확인

---

# Engine의 책임

Engine은 다음을 보장해야 한다.

- 문제 생성

- 정답 생성

- 풀이 생성

- 보기 5개

- 중복 문제 제거

- 난이도 적용

- ProblemSet 생성

Engine은

UI를 알면 안 된다.

---

# 향후 확장 방향

Problem Engine은

초등

↓

중등

↓

고등

↓

AI 생성기

↓

학생 맞춤형 문제 추천

까지 동일한 구조를 유지하도록 설계한다.

새로운 기능은 기존 구조를 변경하지 않고 확장 가능한 형태로 추가한다.