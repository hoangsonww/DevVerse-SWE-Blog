const CITATION_GROUP_PATTERN =
  /\[((?:Source\s+\d+|\d+)(?:\s*,\s*(?:Source\s+\d+|\d+))*)\](?!\()/gi;

interface CitationReference {
  label: string;
  number: number;
}

function normalizeCitationLabel(token: string): CitationReference | null {
  const numberMatch = token.match(/\d+/);

  if (!numberMatch) {
    return null;
  }

  const number = Number(numberMatch[0]);

  if (!Number.isInteger(number) || number < 1) {
    return null;
  }

  const label = /^source\b/i.test(token.trim())
    ? `Source ${number}`
    : `${number}`;

  return { label, number };
}

export function stripSourcesSection(content: string) {
  return content.replace(/\n?Sources:[\s\S]*$/i, "").trim();
}

export function linkifyCitations(content: string, messageId: string) {
  return content.replace(
    CITATION_GROUP_PATTERN,
    (match: string, group: string) => {
      const citations: CitationReference[] = group
        .split(/\s*,\s*/)
        .map(normalizeCitationLabel)
        .filter((citation): citation is CitationReference => citation !== null);

      if (!citations.length) {
        return match;
      }

      return citations
        .map(
          ({ label, number }: CitationReference) =>
            `[${label}](#source-${messageId}-${number})`,
        )
        .join(", ");
    },
  );
}

export function getCitationNumberFromHref(href: string) {
  const match = href.match(/#source-(.+)-(\d+)$/);

  if (!match) {
    return null;
  }

  const sourceNumber = Number(match[2]);

  return Number.isInteger(sourceNumber) && sourceNumber > 0
    ? sourceNumber
    : null;
}
