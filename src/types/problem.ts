export type ProblemId = number | string;

export interface MathProblem {
  id: ProblemId;
  problem: string;
  answer: string;
  solution: string;
}

export interface MultipleChoiceProblem {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ProblemsPayload {
  title: string;
  subtitle: string;
  problems: MultipleChoiceProblem[];
}

export type ProblemTypeCode = "FRA_ADD_001" | "FRA_ADD_002" | "FRA_ADD_003";
export type ProblemDifficulty = "easy" | "normal" | "hard";

export interface ProblemTypeDefinition {
  code: ProblemTypeCode;
  title: string;
  grade: 5;
  domain: "fractions";
  skill: "fraction-addition";
  description: string;
  examples: MathProblem[];
}

export interface GenerateProblemsOptions {
  typeCode: ProblemTypeCode;
  count: number;
  difficulty?: ProblemDifficulty;
}
