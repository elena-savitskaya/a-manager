/**
 * Returns the correct Ukrainian word form based on the quantity.
 * @param n The number to check
 * @param forms The [singular, paucal, plural] forms (e.g., ['слово', 'слова', 'слів'])
 */
export function getUkrainianPlural(n: number, [singular, paucal, plural]: [string, string, string]) {
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return singular;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
    return paucal;
  }

  return plural;
}
