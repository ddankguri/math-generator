import type { GeneratedProblem, MathProblem, MultipleChoiceProblem } from "@/types/problem";

export function hasProblemSolution(problem: MathProblem): boolean {
  return Boolean(problem.problem.trim() && problem.answer.trim() && problem.solution.trim());
}

export function hasMultipleChoiceAnswer(problem: MultipleChoiceProblem): boolean {
  return problem.options.includes(problem.answer);
}

export function hasFiveChoices(problem: MultipleChoiceProblem): boolean {
  return problem.options.length === 5;
}

export function hasFiveGeneratedChoices(problem: GeneratedProblem): boolean {
  return problem.choices.length === 5;
}

export function hasGeneratedProblemAnswer(problem: GeneratedProblem): boolean {
  return problem.choices.includes(problem.answer);
}

export function validateFiveChoiceProblems(problems: GeneratedProblem[]): void {
  const invalidProblem = problems.find((problem) => !hasFiveGeneratedChoices(problem));

  if (invalidProblem) {
    throw new Error(`Problem ${invalidProblem.id} must have exactly 5 choices.`);
  }

  const missingAnswerProblem = problems.find((problem) => !hasGeneratedProblemAnswer(problem));

  if (missingAnswerProblem) {
    throw new Error(`Problem ${missingAnswerProblem.id} must include the answer in its choices.`);
  }
}
