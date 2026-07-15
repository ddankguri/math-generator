import type { ProblemTypeId } from "@/types/problem";

export interface WorkedExample {
  question: string;
  steps: string[];
  answer: string;
}

export interface ProblemTypeLearningContent {
  typeId: ProblemTypeId;
  title: string;
  grade: { id: string; name: string };
  unit: { id: string; name: string };
  topic: { id: string; name: string };
  learningGoal: string;
  coreConcept: string[];
  method: string[];
  examples: WorkedExample[];
  commonMistakes: string[];
  teachingChecks: string[];
  studyTips: string[];
  relatedTypeIds: ProblemTypeId[];
}

export const problemTypeLearningContent: ProblemTypeLearningContent[] = [
  {
    typeId: "FRA_ADD_001",
    title: "같은 분모의 분수 덧셈",
    grade: { id: "elementary5", name: "초등 5학년" },
    unit: { id: "fraction", name: "분수" },
    topic: { id: "fraction-addition", name: "분수의 덧셈" },
    learningGoal: "분모가 같은 두 분수는 같은 크기의 조각을 세는 상황임을 이해하고, 분모는 그대로 둔 채 분자를 더할 수 있습니다.",
    coreConcept: [
      "분모는 전체를 몇 등분했는지 나타냅니다. 두 분수의 분모가 같다면 조각 하나의 크기도 같습니다.",
      "크기가 같은 조각끼리 더할 때에는 조각의 개수인 분자만 더합니다. 분모까지 더하면 조각의 크기가 바뀌므로 올바른 합이 아닙니다.",
    ],
    method: ["두 분수의 분모가 같은지 확인합니다.", "분모는 그대로 쓰고 분자끼리 더합니다.", "합을 약분할 수 있는지 확인하고, 가분수라면 필요에 따라 대분수로 나타냅니다."],
    examples: [
      { question: "2/9 + 4/9", steps: ["분모 9가 같으므로 9등분한 조각끼리 더합니다.", "분자만 계산하면 2 + 4 = 6이므로 6/9입니다.", "6과 9를 3으로 나누어 2/3으로 약분합니다."], answer: "2/3" },
      { question: "5/8 + 2/8", steps: ["두 분수 모두 한 조각의 크기가 1/8입니다.", "5개와 2개를 합하면 7개이므로 7/8입니다.", "7과 8의 공약수는 1뿐이므로 더 약분하지 않습니다."], answer: "7/8" },
    ],
    commonMistakes: ["2/7 + 3/7을 5/14로 계산하며 분모까지 더합니다.", "6/10처럼 약분할 수 있는 답을 그대로 두고 계산을 끝냅니다.", "분자 합이 분모보다 커졌는데 대분수로 나타내라는 조건을 확인하지 않습니다."],
    teachingChecks: ["학생이 분모를 '조각의 크기', 분자를 '조각의 수'로 설명하는지 확인합니다.", "그림이나 수직선에서 같은 단위분수끼리 합치는 모습을 식과 연결하게 합니다.", "계산 후 약분 가능 여부를 스스로 점검하는 순서가 자리 잡았는지 봅니다."],
    studyTips: ["원을 똑같이 나눈 그림에 2/8와 3/8을 색칠해 합을 직접 세어 보세요.", "답을 낸 뒤 '분모를 왜 그대로 두었는가'를 한 문장으로 설명하면 개념이 단단해집니다."],
    relatedTypeIds: ["FRA_ADD_002", "FRA_ADD_003"],
  },
  {
    typeId: "FRA_ADD_002",
    title: "분모가 배수 관계인 분수 덧셈",
    grade: { id: "elementary5", name: "초등 5학년" },
    unit: { id: "fraction", name: "분수" },
    topic: { id: "fraction-addition", name: "분수의 덧셈" },
    learningGoal: "한 분모가 다른 분모의 배수일 때 큰 분모를 공통분모로 정하고, 한쪽 분수만 효율적으로 통분해 더할 수 있습니다.",
    coreConcept: [
      "1/4과 1/8은 조각의 크기가 다르므로 바로 더할 수 없습니다. 1/4을 2/8로 바꾸면 같은 크기의 조각끼리 계산할 수 있습니다.",
      "한 분모가 다른 분모로 나누어떨어진다면 큰 분모가 이미 최소공배수입니다. 두 분모를 무조건 곱할 필요가 없습니다.",
    ],
    method: ["큰 분모가 작은 분모의 몇 배인지 구합니다.", "작은 분모 쪽의 분자와 분모에 그 배수를 똑같이 곱합니다.", "분모가 같아지면 분자끼리 더하고 마지막에 약분합니다."],
    examples: [
      { question: "1/3 + 5/6", steps: ["6은 3의 2배이므로 공통분모를 6으로 정합니다.", "1/3의 분자와 분모에 2를 곱해 2/6으로 바꿉니다.", "2/6 + 5/6 = 7/6이므로 1과 1/6입니다."], answer: "7/6 (또는 1과 1/6)" },
      { question: "3/4 + 1/12", steps: ["12는 4의 3배이므로 3/4을 9/12로 통분합니다.", "9/12 + 1/12 = 10/12입니다.", "10과 12를 2로 나누어 5/6으로 약분합니다."], answer: "5/6" },
    ],
    commonMistakes: ["분모 4에만 2를 곱하고 분자에는 곱하지 않아 분수의 크기를 바꿉니다.", "4와 8의 공통분모를 32로 잡아 계산을 불필요하게 복잡하게 만듭니다.", "통분한 뒤에도 원래 분자를 사용해 더합니다."],
    teachingChecks: ["큰 분모가 작은 분모의 몇 배인지 학생이 나눗셈으로 확인하는지 봅니다.", "분자와 분모에 같은 수를 곱해도 분수의 크기가 같다는 점을 그림이나 등식으로 설명하게 합니다.", "효율적인 공통분모와 단순히 가능한 공통분모의 차이를 구별하는지 확인합니다."],
    studyTips: ["분모를 본 뒤 먼저 '몇 배 관계인가?'를 묻는 습관을 들이세요.", "통분 전후의 분수를 등호로 이어 쓰면 분자에 곱하는 수를 빠뜨리는 실수가 줄어듭니다."],
    relatedTypeIds: ["FRA_ADD_001", "FRA_ADD_003"],
  },
  {
    typeId: "FRA_ADD_003",
    title: "서로소 분모의 분수 덧셈",
    grade: { id: "elementary5", name: "초등 5학년" },
    unit: { id: "fraction", name: "분수" },
    topic: { id: "fraction-addition", name: "분수의 덧셈" },
    learningGoal: "두 분모의 공약수가 1뿐인 경우 최소공배수가 두 분모의 곱임을 이용해 양쪽 분수를 통분하고 더할 수 있습니다.",
    coreConcept: [
      "서로소인 두 수는 1 이외의 공약수가 없습니다. 따라서 두 분모의 최소공배수는 두 수를 곱한 값입니다.",
      "양쪽 분수 모두 공통분모로 바꾸어야 합니다. 각 분자는 자기 분모에 곱한 것과 같은 수를 곱해야 분수의 크기가 유지됩니다.",
    ],
    method: ["두 분모가 서로소인지 공약수를 살펴 확인합니다.", "두 분모를 곱해 공통분모를 구합니다.", "각 분수의 분자와 분모에 상대편 분모를 곱한 뒤 분자끼리 더하고 약분합니다."],
    examples: [
      { question: "2/3 + 1/5", steps: ["3과 5는 서로소이므로 공통분모는 3 × 5 = 15입니다.", "2/3은 10/15, 1/5는 3/15로 통분합니다.", "10/15 + 3/15 = 13/15이고 더 약분되지 않습니다."], answer: "13/15" },
      { question: "3/7 + 2/5", steps: ["7과 5의 최소공배수는 35입니다.", "3/7은 15/35, 2/5는 14/35로 바꿉니다.", "15/35 + 14/35 = 29/35입니다."], answer: "29/35" },
    ],
    commonMistakes: ["공통분모를 두 분모의 합으로 정합니다.", "3/7을 통분하며 분자 3에 자기 분모 7을 다시 곱합니다.", "한쪽만 통분한 뒤 분모가 다른 상태에서 분자를 더합니다."],
    teachingChecks: ["학생이 서로소와 단순히 서로 다른 수를 구별하는지 확인합니다.", "교차해 곱하는 절차를 외우기 전에 등가분수의 원리로 각 곱셈을 설명하게 합니다.", "분모의 곱이 커져도 마지막 답의 약분 여부를 차분히 검사하는지 봅니다."],
    studyTips: ["2, 3, 5, 7처럼 작은 분모의 배수를 빠르게 말하는 연습은 통분 속도를 높여 줍니다.", "통분식을 두 줄로 나란히 적어 각 분자에 어떤 수를 곱했는지 표시하세요."],
    relatedTypeIds: ["FRA_ADD_001", "FRA_ADD_002"],
  },
];

export function getLearningContent(typeId: string) {
  return problemTypeLearningContent.find((content) => content.typeId === typeId);
}

export function getLearningContentPath(content: ProblemTypeLearningContent) {
  return `/learn/${content.grade.id}/${content.unit.id}/${content.topic.id}/${content.typeId}`;
}
