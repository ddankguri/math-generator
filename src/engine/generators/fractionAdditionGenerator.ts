import { elementaryGrade5FractionAdditionTypes } from "@/data/problemTypes";
import {
  addFractions,
  formatFraction,
  simplifyFraction,
  type Fraction,
} from "@/engine/solvers/fractionAddition";
import { shuffleArray } from "@/engine/utils/array";
import { validateFiveChoiceProblems } from "@/engine/validators/problem";
import type {
  GenerateProblemsOptions,
  MultipleChoiceProblem,
  ProblemDifficulty,
  ProblemTypeCode,
  ProblemsPayload,
} from "@/types/problem";

const DEFAULT_TYPE_CODE: ProblemTypeCode = "FRA_ADD_001";
const DEFAULT_DIFFICULTY: ProblemDifficulty = "normal";
const CHOICE_COUNT = 5;
const DISTRACTOR_COUNT = CHOICE_COUNT - 1;
const MAX_PROBLEM_ATTEMPTS = 30;

interface DifficultyConfig {
  sameDenominatorRange: [number, number];
  baseDenominatorRange: [number, number];
  multiplierRange: [number, number];
  coprimeLeftRange: [number, number];
  coprimeRightRange: [number, number];
  preferCloseDistractors: boolean;
}

const DIFFICULTY_CONFIG: Record<ProblemDifficulty, DifficultyConfig> = {
  easy: {
    sameDenominatorRange: [4, 8],
    baseDenominatorRange: [2, 4],
    multiplierRange: [2, 2],
    coprimeLeftRange: [3, 5],
    coprimeRightRange: [4, 7],
    preferCloseDistractors: false,
  },
  normal: {
    sameDenominatorRange: [5, 12],
    baseDenominatorRange: [2, 6],
    multiplierRange: [2, 4],
    coprimeLeftRange: [3, 9],
    coprimeRightRange: [4, 11],
    preferCloseDistractors: true,
  },
  hard: {
    sameDenominatorRange: [8, 18],
    baseDenominatorRange: [4, 9],
    multiplierRange: [2, 5],
    coprimeLeftRange: [5, 13],
    coprimeRightRange: [7, 17],
    preferCloseDistractors: true,
  },
};

export const difficultyLabels: Record<ProblemDifficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromRange([min, max]: [number, number]): number {
  return randomInt(min, max);
}

function getProblemTypeTitle(typeCode: ProblemTypeCode): string {
  return (
    elementaryGrade5FractionAdditionTypes.find((type) => type.code === typeCode)?.title ??
    "분수 덧셈"
  );
}

function makeSameDenominatorPair(config: DifficultyConfig): [Fraction, Fraction] {
  const denominator = randomFromRange(config.sameDenominatorRange);
  const leftNumerator = randomInt(1, denominator - 2);
  const rightNumerator = randomInt(1, denominator - leftNumerator - 1);

  return [
    { numerator: leftNumerator, denominator },
    { numerator: rightNumerator, denominator },
  ];
}

function makeMultipleDenominatorPair(config: DifficultyConfig): [Fraction, Fraction] {
  const smallerDenominator = randomFromRange(config.baseDenominatorRange);
  const multiplier = randomFromRange(config.multiplierRange);
  const largerDenominator = smallerDenominator * multiplier;

  return [
    { numerator: randomInt(1, smallerDenominator - 1), denominator: smallerDenominator },
    { numerator: randomInt(1, largerDenominator - 1), denominator: largerDenominator },
  ];
}

function areCoprime(left: number, right: number): boolean {
  let a = left;
  let b = right;

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a === 1;
}

function makeCoprimeDenominatorPair(config: DifficultyConfig): [Fraction, Fraction] {
  let leftDenominator = 3;
  let rightDenominator = 5;

  do {
    leftDenominator = randomFromRange(config.coprimeLeftRange);
    rightDenominator = randomFromRange(config.coprimeRightRange);
  } while (leftDenominator === rightDenominator || !areCoprime(leftDenominator, rightDenominator));

  return [
    { numerator: randomInt(1, leftDenominator - 1), denominator: leftDenominator },
    { numerator: randomInt(1, rightDenominator - 1), denominator: rightDenominator },
  ];
}

function makeFractionPair(typeCode: ProblemTypeCode, config: DifficultyConfig): [Fraction, Fraction] {
  if (typeCode === "FRA_ADD_002") return makeMultipleDenominatorPair(config);
  if (typeCode === "FRA_ADD_003") return makeCoprimeDenominatorPair(config);
  return makeSameDenominatorPair(config);
}

function uniqueFormattedFractions(fractions: Fraction[], answerText: string): string[] {
  return Array.from(new Set(fractions.map(formatFraction))).filter((candidate) => candidate !== answerText);
}

function makeDistractors(answer: Fraction, difficulty: ProblemDifficulty): string[] {
  const answerText = formatFraction(answer);
  const config = DIFFICULTY_CONFIG[difficulty];
  const nearMisses: Fraction[] = [
    { numerator: Math.max(1, answer.numerator + 1), denominator: answer.denominator },
    { numerator: Math.max(1, answer.numerator - 1), denominator: answer.denominator },
    { numerator: answer.numerator, denominator: answer.denominator + 1 },
    { numerator: answer.numerator + 1, denominator: answer.denominator + 1 },
    { numerator: Math.max(1, answer.numerator - 1), denominator: Math.max(2, answer.denominator - 1) },
  ].map(simplifyFraction);
  const widerMisses: Fraction[] = [
    { numerator: answer.numerator + 2, denominator: answer.denominator + 3 },
    { numerator: Math.max(1, answer.numerator - 2), denominator: answer.denominator + 2 },
    { numerator: answer.numerator + 3, denominator: answer.denominator + 1 },
    { numerator: Math.max(1, answer.numerator + 1), denominator: Math.max(2, answer.denominator + 4) },
  ].map(simplifyFraction);
  const candidates = config.preferCloseDistractors
    ? [...nearMisses, ...widerMisses]
    : [...widerMisses, ...nearMisses];

  let offset = 2;
  while (uniqueFormattedFractions(candidates, answerText).length < DISTRACTOR_COUNT) {
    candidates.push(
      simplifyFraction({
        numerator: Math.max(1, answer.numerator + offset),
        denominator: answer.denominator + offset + 1,
      }),
      simplifyFraction({
        numerator: Math.max(1, answer.numerator + offset + 1),
        denominator: Math.max(2, answer.denominator + offset),
      })
    );
    offset += 1;
  }

  return uniqueFormattedFractions(candidates, answerText).slice(0, DISTRACTOR_COUNT);
}

function makeFiveChoices(answer: Fraction, difficulty: ProblemDifficulty): string[] {
  const answerText = formatFraction(answer);
  const choices = shuffleArray([answerText, ...makeDistractors(answer, difficulty)]).slice(0, CHOICE_COUNT);

  if (!choices.includes(answerText)) {
    choices[0] = answerText;
  }

  if (choices.length !== CHOICE_COUNT) {
    throw new Error(`Expected ${CHOICE_COUNT} choices, received ${choices.length}.`);
  }

  return shuffleArray(choices);
}

function createProblemOnce(
  typeCode: ProblemTypeCode,
  difficulty: ProblemDifficulty,
  index: number
): MultipleChoiceProblem {
  const config = DIFFICULTY_CONFIG[difficulty];
  const [left, right] = makeFractionPair(typeCode, config);
  const answer = addFractions(left, right);
  const answerText = formatFraction(answer);
  const commonDenominator = left.denominator * right.denominator;
  const convertedLeft = {
    numerator: left.numerator * right.denominator,
    denominator: commonDenominator,
  };
  const convertedRight = {
    numerator: right.numerator * left.denominator,
    denominator: commonDenominator,
  };

  return {
    id: index + 1,
    question: `${getProblemTypeTitle(typeCode)}: ${formatFraction(left)} + ${formatFraction(right)}을 계산하세요.`,
    options: makeFiveChoices(answer, difficulty),
    answer: answerText,
    explanation: `통분하면 ${formatFraction(convertedLeft)} + ${formatFraction(convertedRight)}입니다. 분자를 더해 ${formatFraction({
      numerator: convertedLeft.numerator + convertedRight.numerator,
      denominator: commonDenominator,
    })}을 만들고, 약분하면 ${answerText}입니다.`,
  };
}

function createProblem(
  typeCode: ProblemTypeCode,
  difficulty: ProblemDifficulty,
  index: number
): MultipleChoiceProblem {
  for (let attempt = 0; attempt < MAX_PROBLEM_ATTEMPTS; attempt += 1) {
    const problem = createProblemOnce(typeCode, difficulty, index);
    if (problem.options.length === CHOICE_COUNT) {
      return problem;
    }
  }

  throw new Error(`Failed to generate a ${CHOICE_COUNT}-choice problem for ${typeCode}.`);
}

export function getFractionAdditionProblemTypes() {
  return elementaryGrade5FractionAdditionTypes;
}

export function getFractionAdditionExamMetadata(
  typeCode: ProblemTypeCode,
  difficulty: ProblemDifficulty = DEFAULT_DIFFICULTY
): Pick<ProblemsPayload, "title" | "subtitle"> {
  return {
    title: "초등 5학년 분수 덧셈",
    subtitle: `${getProblemTypeTitle(typeCode)} · 난이도: ${difficultyLabels[difficulty]}`,
  };
}

export function generateFractionAdditionProblems({
  typeCode = DEFAULT_TYPE_CODE,
  count,
  difficulty = DEFAULT_DIFFICULTY,
}: GenerateProblemsOptions): MultipleChoiceProblem[] {
  const problems = Array.from({ length: count }, (_, index) => createProblem(typeCode, difficulty, index));
  validateFiveChoiceProblems(problems);
  return problems;
}
