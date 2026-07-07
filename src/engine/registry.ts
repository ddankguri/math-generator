import { problemTypes } from "@/data/problemTypes";
import {
  generateCoprimeDenominatorFractionAdditionProblem,
  generateMultipleDenominatorFractionAdditionProblem,
  generateSameDenominatorFractionAdditionProblem,
  type FractionAdditionGeneratorContext,
} from "@/engine/generators/fractionAdditionGenerator";
import { validateFiveChoiceProblems } from "@/engine/validators/problem";
import type {
  GeneratedProblem,
  GenerateProblemsOptions,
  GeneratorKey,
  ProblemDifficulty,
  ProblemTypeDefinition,
  ProblemTypeId,
  ProblemsPayload,
} from "@/types/problem";
import { difficultyLabels } from "@/types/problem";

const DEFAULT_DIFFICULTY: ProblemDifficulty = "normal";

type ProblemGenerator = (context: FractionAdditionGeneratorContext) => GeneratedProblem;

const generatorRegistry: Record<GeneratorKey, ProblemGenerator> = {
  "fraction.add.sameDenominator": generateSameDenominatorFractionAdditionProblem,
  "fraction.add.multipleDenominator": generateMultipleDenominatorFractionAdditionProblem,
  "fraction.add.coprimeDenominator": generateCoprimeDenominatorFractionAdditionProblem,
};

export function getProblemTypes(): ProblemTypeDefinition[] {
  return problemTypes;
}

export function getProblemType(problemTypeId: ProblemTypeId): ProblemTypeDefinition {
  const problemType = problemTypes.find((type) => type.id === problemTypeId);

  if (!problemType) {
    throw new Error(`Unknown problem type: ${problemTypeId}`);
  }

  return problemType;
}

export function generateProblems({
  problemTypeId,
  count,
  difficulty = DEFAULT_DIFFICULTY,
}: GenerateProblemsOptions): GeneratedProblem[] {
  const problemType = getProblemType(problemTypeId);
  const generator = generatorRegistry[problemType.generatorKey];

  if (!generator) {
    throw new Error(`Generator is not registered: ${problemType.generatorKey}`);
  }

  if (!problemType.difficultyLevels.includes(difficulty)) {
    throw new Error(`${problemType.id} does not support difficulty: ${difficulty}`);
  }

  const problems = Array.from({ length: count }, (_, index) =>
    generator({
      problemType,
      difficulty,
      index,
    })
  );

  validateFiveChoiceProblems(problems);
  return problems;
}

export function getExamMetadata(
  problemTypeId: ProblemTypeId,
  difficulty: ProblemDifficulty = DEFAULT_DIFFICULTY
): Pick<ProblemsPayload, "title" | "subtitle"> {
  const problemType = getProblemType(problemTypeId);

  return {
    title: `${problemType.grade} ${problemType.topic}`,
    subtitle: `${problemType.typeName} · 난이도: ${difficultyLabels[difficulty]}`,
  };
}
