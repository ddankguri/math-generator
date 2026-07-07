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
export type ProblemTypeId = ProblemTypeCode;
export type ProblemDifficulty = "easy" | "normal" | "hard";
export type GeneratorKey =
  | "fraction.add.sameDenominator"
  | "fraction.add.multipleDenominator"
  | "fraction.add.coprimeDenominator";

export const difficultyLabels: Record<ProblemDifficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

export interface CurriculumConcept {
  name: string;
}

export interface CurriculumUnit {
  name: string;
  concepts: CurriculumConcept[];
}

export interface CurriculumGrade {
  grade: string;
  units: CurriculumUnit[];
}

export interface ProblemTypeDefinition {
  id: ProblemTypeId;
  grade: string;
  unit: string;
  topic: string;
  typeName: string;
  difficultyLevels: ProblemDifficulty[];
  generatorKey: GeneratorKey;
  description: string;
  sampleProblem: MathProblem;
  constraints: string[];
  commonMistakes: string[];
}

export interface GeneratedProblem {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  solution: string;
  grade: string;
  unit: string;
  topic: string;
  problemTypeId: ProblemTypeId;
  difficulty: ProblemDifficulty;
}

export interface GenerateProblemsOptions {
  problemTypeId: ProblemTypeId;
  count: number;
  difficulty?: ProblemDifficulty;
}
