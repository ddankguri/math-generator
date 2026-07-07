import problemsData from "@/data/templates/legacyExamProblems.json";
import type { MultipleChoiceProblem, ProblemsPayload } from "@/types/problem";
import { shuffleArray } from "@/engine/utils/array";

const typedProblemsData = problemsData as ProblemsPayload;

export function getStaticExamMetadata(): Pick<ProblemsPayload, "title" | "subtitle"> {
  return {
    title: typedProblemsData.title,
    subtitle: typedProblemsData.subtitle,
  };
}

export function generateStaticExamProblems(count: number): MultipleChoiceProblem[] {
  const resolvedCount = Math.min(count, typedProblemsData.problems.length);
  const selectedProblems = shuffleArray(typedProblemsData.problems).slice(0, resolvedCount);

  selectedProblems.sort((a, b) => a.id - b.id);

  return selectedProblems.map((problem, index) => ({
    ...problem,
    id: index + 1,
  }));
}
