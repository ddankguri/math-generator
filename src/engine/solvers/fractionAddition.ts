export interface Fraction {
  numerator: number;
  denominator: number;
}

function greatestCommonDivisor(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    [x, y] = [y, x % y];
  }

  return x || 1;
}

export function simplifyFraction({ numerator, denominator }: Fraction): Fraction {
  const divisor = greatestCommonDivisor(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

export function addFractions(left: Fraction, right: Fraction): Fraction {
  return simplifyFraction({
    numerator: left.numerator * right.denominator + right.numerator * left.denominator,
    denominator: left.denominator * right.denominator,
  });
}

export function formatFraction({ numerator, denominator }: Fraction): string {
  return `\\( \\frac{${numerator}}{${denominator}} \\)`;
}
