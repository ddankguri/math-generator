import type { MathProblem, MultipleChoiceProblem } from "@/types/problem";

export function hasProblemSolution(problem: MathProblem): boolean {
  return Boolean(problem.problem.trim() && problem.answer.trim() && problem.solution.trim());
}

export function hasMultipleChoiceAnswer(problem: MultipleChoiceProblem): boolean {
  return problem.options.includes(problem.answer);
}

export function hasFiveChoices(problem: MultipleChoiceProblem): boolean {
  return problem.options.length === 5;
}

export function validateFiveChoiceProblems(problems: MultipleChoiceProblem[]): void {
  const invalidProblem = problems.find((problem) => !hasFiveChoices(problem));

  if (invalidProblem) {
    throw new Error(`Problem ${invalidProblem.id} must have exactly 5 choices.`);
  }
}
