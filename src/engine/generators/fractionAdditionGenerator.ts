import {
  addFractions,
  formatFraction,
  simplifyFraction,
  type Fraction,
} from "@/engine/solvers/fractionAddition";
import { shuffleArray } from "@/engine/utils/array";
import type {
  GeneratedProblem,
  ProblemDifficulty,
  ProblemTypeDefinition,
} from "@/types/problem";

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

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromRange([min, max]: [number, number]): number {
  return randomInt(min, max);
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a || 1;
}

function leastCommonMultiple(left: number, right: number): number {
  return (left * right) / greatestCommonDivisor(left, right);
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

export interface FractionAdditionGeneratorContext {
  problemType: ProblemTypeDefinition;
  difficulty: ProblemDifficulty;
  index: number;
}

function createProblemOnce(
  context: FractionAdditionGeneratorContext,
  makeFractionPair: (config: DifficultyConfig) => [Fraction, Fraction]
): GeneratedProblem {
  const { problemType, difficulty, index } = context;
  const config = DIFFICULTY_CONFIG[difficulty];
  const [left, right] = makeFractionPair(config);
  const answer = addFractions(left, right);
  const answerText = formatFraction(answer);
  const commonDenominator = leastCommonMultiple(left.denominator, right.denominator);
  const convertedLeft = {
    numerator: left.numerator * (commonDenominator / left.denominator),
    denominator: commonDenominator,
  };
  const convertedRight = {
    numerator: right.numerator * (commonDenominator / right.denominator),
    denominator: commonDenominator,
  };
  const addedFraction = {
    numerator: convertedLeft.numerator + convertedRight.numerator,
    denominator: commonDenominator,
  };
  const addedFractionText = formatFraction(addedFraction);
  const choices = makeFiveChoices(answer, difficulty);
  const answerChoiceIndex = choices.indexOf(answerText);
  const isAlreadySimplified =
    addedFraction.numerator === answer.numerator && addedFraction.denominator === answer.denominator;
  const solutionSteps = [
    left.denominator === right.denominator
      ? `분모가 이미 같으므로 ${formatFraction(left)} + ${formatFraction(right)}로 바로 분자끼리 더할 수 있습니다.`
      : `분모를 ${commonDenominator}로 통분하면 ${formatFraction(left)} = ${formatFraction(convertedLeft)}, ${formatFraction(right)} = ${formatFraction(convertedRight)}입니다.`,
    `분자를 더하면 ${formatFraction(convertedLeft)} + ${formatFraction(convertedRight)} = ${addedFractionText}입니다.`,
    isAlreadySimplified
      ? `${addedFractionText}는 더 이상 약분할 수 없으므로 정답은 ${answerText}입니다.`
      : `${addedFractionText}를 약분하면 ${answerText}이므로 정답은 ${answerText}입니다.`,
  ];

  return {
    id: String(index + 1),
    question: `${problemType.typeName}: ${formatFraction(left)} + ${formatFraction(right)}을 계산하세요.`,
    choices,
    answer: answerText,
    answerChoiceIndex,
    solution: solutionSteps.join(" "),
    solutionSteps,
    grade: problemType.grade,
    unit: problemType.unit,
    topic: problemType.topic,
    problemTypeId: problemType.id,
    difficulty,
  };
}

function createProblem(
  context: FractionAdditionGeneratorContext,
  makeFractionPair: (config: DifficultyConfig) => [Fraction, Fraction]
): GeneratedProblem {
  for (let attempt = 0; attempt < MAX_PROBLEM_ATTEMPTS; attempt += 1) {
    const problem = createProblemOnce(context, makeFractionPair);
    if (problem.choices.length === CHOICE_COUNT && problem.choices[problem.answerChoiceIndex] === problem.answer) {
      return problem;
    }
  }

  throw new Error(`Failed to generate a ${CHOICE_COUNT}-choice problem for ${context.problemType.id}.`);
}

export function generateSameDenominatorFractionAdditionProblem(
  context: FractionAdditionGeneratorContext
): GeneratedProblem {
  return createProblem(context, makeSameDenominatorPair);
}

export function generateMultipleDenominatorFractionAdditionProblem(
  context: FractionAdditionGeneratorContext
): GeneratedProblem {
  return createProblem(context, makeMultipleDenominatorPair);
}

export function generateCoprimeDenominatorFractionAdditionProblem(
  context: FractionAdditionGeneratorContext
): GeneratedProblem {
  return createProblem(context, makeCoprimeDenominatorPair);
}
