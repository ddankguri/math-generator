# Data Structure

## 목적

Math Generator는 교육과정을 기반으로 문제를 생성하는 시스템이다.

이 프로젝트는 실제 문제를 저장하지 않는다.

대신 문제를 생성하기 위한 데이터만 저장한다.

---

# 데이터 설계 철학

Math Generator가 저장하는 것은 다음뿐이다.

- 교육과정(Curriculum)
- 문제 유형(Problem Type)
- Generator 설정
- Validator 규칙
- Solver 규칙
- 난이도 규칙
- 오답 생성 규칙

실제 문제는 Generator가 요청될 때마다 새롭게 만든다.

---

# 데이터 계층

모든 데이터는 아래 계층을 따른다.

```text
교육과정

↓

학년(Grade)

↓

단원(Unit)

↓

개념(Topic)

↓

문제 유형(ProblemType)

↓

Generator

↓

Problem
```

---

# Curriculum

Curriculum은

교육과정 정보를 저장한다.

Curriculum은

문제를 생성하지 않는다.

예)

```text
초5

↓

분수

↓

분수의 덧셈
```

예시

```ts
{
    grade: "초5",

    units: [

        {
            id: "fraction",

            name: "분수",

            topics: [

                {
                    id: "fraction-add",

                    name: "분수의 덧셈"
                }

            ]

        }

    ]

}
```

---

# ProblemType

ProblemType은

실제 생성 가능한 문제 유형을 정의한다.

예)

```text
분수의 덧셈

↓

같은 분모

↓

Generator
```

ProblemType은

다음 정보를 가진다.

```ts
{
    id

    grade

    unit

    topic

    typeName

    generatorKey

    difficultyLevels

    description

    sampleProblem

    constraints

    commonMistakes
}
```

---

# GeneratorKey

ProblemType은

generatorKey를 가진다.

Generator는

registry를 통해 연결된다.

예)

```text
fraction.add.sameDenominator

↓

FractionSameDenominatorGenerator
```

---

# Problem

Problem은

Generator가 생성하는 최종 결과이다.

Problem은

화면에도 사용되고

PDF에도 사용된다.

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

# ProblemSet

ProblemSet은

문제지를 의미한다.

여러 개의 Problem을 가진다.

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

# Difficulty

난이도는

Generator의 숫자 생성 규칙과

Validator의 검증 기준에 영향을 준다.

## Easy

- 작은 숫자

- 계산 단계 단순

- 쉬운 보기

---

## Normal

- 일반적인 계산

- 헷갈리는 보기 포함

---

## Hard

- 큰 숫자

- 복합 계산

- 정답과 매우 유사한 보기 포함

---

# Constraints

ProblemType은

문제 생성 제약조건을 가진다.

예)

```text
보기는 5개

↓

정답은 보기 안에 존재

↓

답은 기약분수

↓

분모는 20 이하
```

Generator는

이 조건을 만족해야 한다.

---

# CommonMistakes

CommonMistakes는

오답 보기를 만들기 위해 존재한다.

예)

분수 덧셈

↓

분모도 더하는 실수

↓

약분하지 않는 실수

↓

통분 계산 실수

↓

분자 계산 실수

Generator는

이 데이터를 이용하여

오답 보기를 생성한다.

---

# Registry

Registry는

ProblemType과

Generator를 연결한다.

```text
ProblemType

↓

generatorKey

↓

Registry

↓

Generator
```

새로운 Generator를 추가하면

반드시 Registry에도 등록해야 한다.

---

# 데이터 추가 순서

새로운 단원을 추가할 때는

항상 아래 순서를 따른다.

```text
1.

Curriculum

↓

2.

ProblemType

↓

3.

Generator

↓

4.

Solver

↓

5.

Validator

↓

6.

Registry

↓

7.

UI

↓

8.

PDF

↓

9.

Build 확인
```

---

# 저장하지 않는 데이터

Math Generator는

다음을 저장하지 않는다.

❌ 실제 문제

❌ 문제 이미지

❌ 교재 PDF

❌ EBS 문제

❌ 교과서 문제

문제는

항상 Generator를 통해

새롭게 생성한다.

---

# 장기 목표

모든 교육과정은

동일한 데이터 구조를 사용한다.

```text
초등

↓

중등

↓

고등

↓

AI Generator

↓

학생 맞춤형 문제 생성
```

데이터 구조는

확장 가능해야 하며

기존 구조를 변경하지 않고

새로운 유형만 추가할 수 있어야 한다.