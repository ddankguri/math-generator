import type { ProblemTypeDefinition } from "@/types/problem";

export const elementaryGrade5FractionAdditionTypes: ProblemTypeDefinition[] = [
  {
    code: "FRA_ADD_001",
    title: "같은 분모의 분수 덧셈",
    grade: 5,
    domain: "fractions",
    skill: "fraction-addition",
    description: "분모가 같은 두 분수의 분자를 더하고 약분합니다.",
    examples: [
      {
        id: "FRA_ADD_001_EX_001",
        problem: "\\( \\frac{2}{7} + \\frac{3}{7} \\)을 계산하세요.",
        answer: "\\( \\frac{5}{7} \\)",
        solution: "분모가 같으므로 분자끼리 더합니다. \\( \\frac{2+3}{7} = \\frac{5}{7} \\)입니다.",
      },
    ],
  },
  {
    code: "FRA_ADD_002",
    title: "분모가 배수 관계인 분수 덧셈",
    grade: 5,
    domain: "fractions",
    skill: "fraction-addition",
    description: "큰 분모를 공통분모로 삼아 통분한 뒤 더합니다.",
    examples: [
      {
        id: "FRA_ADD_002_EX_001",
        problem: "\\( \\frac{1}{4} + \\frac{3}{8} \\)을 계산하세요.",
        answer: "\\( \\frac{5}{8} \\)",
        solution: "\\( \\frac{1}{4} = \\frac{2}{8} \\)이므로 \\( \\frac{2}{8} + \\frac{3}{8} = \\frac{5}{8} \\)입니다.",
      },
    ],
  },
  {
    code: "FRA_ADD_003",
    title: "서로소 분모의 분수 덧셈",
    grade: 5,
    domain: "fractions",
    skill: "fraction-addition",
    description: "두 분모의 곱을 공통분모로 삼아 통분한 뒤 더합니다.",
    examples: [
      {
        id: "FRA_ADD_003_EX_001",
        problem: "\\( \\frac{2}{3} + \\frac{1}{5} \\)을 계산하세요.",
        answer: "\\( \\frac{13}{15} \\)",
        solution: "\\( \\frac{2}{3} = \\frac{10}{15} \\), \\( \\frac{1}{5} = \\frac{3}{15} \\)이므로 \\( \\frac{13}{15} \\)입니다.",
      },
    ],
  },
];
