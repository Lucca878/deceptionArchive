/** Capitalize only the first letter of the string, lowercase the rest. */
export function toSentenceCase(str: string | null | undefined): string {
  if (!str) return ''
  const trimmed = str.trim().toLowerCase()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
