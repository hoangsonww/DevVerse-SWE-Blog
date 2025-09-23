export const DEFAULT_WPM = 220; // configurable baseline

export interface ReadingStats {
  words: number;
  minutes: number; // rounded up minimum 1
  label: string; // e.g., "⏱ 4 min read"
}

export function calculateReadingStats(
  text: string,
  wpm: number = DEFAULT_WPM,
  locale?: string,
): ReadingStats {
  const words = countWords(text);
  const rawMinutes = words / Math.max(100, Math.min(1000, wpm));
  const minutes = Math.max(1, Math.ceil(rawMinutes));
  const label = formatReadingLabel(minutes, locale);
  return { words, minutes, label };
}

export function formatReadingLabel(minutes: number, _locale?: string): string {
  // Ready for later i18n, singular/plural basic handling now
  return `⏱ ${minutes} min read`;
}

export function countWords(text: string): number {
  const cleaned = (text || "")
    .replace(/```[\s\S]*?```/g, " ") // strip code blocks
    .replace(/<[^>]*>/g, " ") // strip HTML tags just in case
    .replace(/\{\{[^}]*\}\}/g, " ") // strip templating
    .replace(/[#*_>`~\-\[\]();:]/g, " ") // strip common MDX/MD symbols
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}
