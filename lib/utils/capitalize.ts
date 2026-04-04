/**
 * Trims a string and capitalizes its first letter.
 * If the string is empty or undefined, returns it as is.
 */
export function capitalize(str: string | null | undefined): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (trimmed.length === 0) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
