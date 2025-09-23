/**
 * Text highlighting utilities based on W3C Web Annotation selectors
 * Provides text selection, anchor creation, and re-anchoring functionality
 */

export interface TextQuoteSelector {
  exact: string;
  prefix?: string;
  suffix?: string;
}

export interface TextPositionSelector {
  start: number;
  end: number;
}

export interface Highlight {
  id: string;
  user_id: string;
  article_slug: string;
  text_quote_exact: string;
  text_quote_prefix?: string;
  text_quote_suffix?: string;
  text_position_start?: number;
  text_position_end?: number;
  note?: string;
  color: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Extract text selector from a Range object
 */
export function createTextQuoteSelector(range: Range, container: Element): TextQuoteSelector {
  const selectedText = range.toString();
  const containerText = container.textContent || '';
  
  // Find the exact position in container text
  const startOffset = getTextOffset(range.startContainer, range.startOffset, container);
  const endOffset = getTextOffset(range.endContainer, range.endOffset, container);
  
  // Extract prefix and suffix for disambiguation
  const prefixLength = Math.min(32, startOffset);
  const suffixStart = endOffset;
  const suffixLength = Math.min(32, containerText.length - suffixStart);
  
  const prefix = startOffset > 0 ? containerText.slice(startOffset - prefixLength, startOffset) : undefined;
  const suffix = suffixStart < containerText.length ? containerText.slice(suffixStart, suffixStart + suffixLength) : undefined;
  
  return {
    exact: selectedText,
    prefix,
    suffix
  };
}

/**
 * Get text offset from node and offset within container
 */
function getTextOffset(node: Node, offset: number, container: Element): number {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let totalOffset = 0;
  let currentNode;
  
  while (currentNode = walker.nextNode()) {
    if (currentNode === node) {
      return totalOffset + offset;
    }
    totalOffset += currentNode.textContent?.length || 0;
  }
  
  return totalOffset;
}

/**
 * Find and anchor a text quote selector in the DOM
 */
export function anchorTextQuoteSelector(
  selector: TextQuoteSelector,
  container: Element
): Range | null {
  const containerText = container.textContent || '';
  
  // First, try to find exact match
  let matchIndex = containerText.indexOf(selector.exact);
  
  // If there are multiple matches, use prefix/suffix for disambiguation
  if (matchIndex !== -1 && selector.prefix && selector.suffix) {
    const possibleMatches: number[] = [];
    let searchIndex = 0;
    
    while ((matchIndex = containerText.indexOf(selector.exact, searchIndex)) !== -1) {
      possibleMatches.push(matchIndex);
      searchIndex = matchIndex + 1;
    }
    
    // Find best match using prefix/suffix
    for (const index of possibleMatches) {
      const actualPrefix = containerText.slice(Math.max(0, index - 32), index);
      const actualSuffix = containerText.slice(index + selector.exact.length, index + selector.exact.length + 32);
      
      if (actualPrefix.includes(selector.prefix) && actualSuffix.includes(selector.suffix)) {
        matchIndex = index;
        break;
      }
    }
  }
  
  if (matchIndex === -1) return null;
  
  // Convert text offset back to DOM range
  return createRangeFromTextOffset(
    container,
    matchIndex,
    matchIndex + selector.exact.length
  );
}

/**
 * Create DOM Range from text offsets
 */
function createRangeFromTextOffset(
  container: Element,
  startOffset: number,
  endOffset: number
): Range | null {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let currentOffset = 0;
  let startNode: Node | null = null;
  let startNodeOffset = 0;
  let endNode: Node | null = null;
  let endNodeOffset = 0;
  let currentNode;
  
  while (currentNode = walker.nextNode()) {
    const nodeLength = currentNode.textContent?.length || 0;
    
    if (!startNode && currentOffset + nodeLength >= startOffset) {
      startNode = currentNode;
      startNodeOffset = startOffset - currentOffset;
    }
    
    if (!endNode && currentOffset + nodeLength >= endOffset) {
      endNode = currentNode;
      endNodeOffset = endOffset - currentOffset;
      break;
    }
    
    currentOffset += nodeLength;
  }
  
  if (!startNode || !endNode) return null;
  
  const range = document.createRange();
  range.setStart(startNode, startNodeOffset);
  range.setEnd(endNode, endNodeOffset);
  
  return range;
}

/**
 * Generate a unique anchor ID for a highlight
 */
export function generateHighlightAnchor(highlightId: string): string {
  return `h_${highlightId}`;
}

/**
 * Create deep link URL for a highlight
 */
export function createDeepLink(
  articleSlug: string,
  highlight: Highlight,
  baseUrl: string = ''
): string {
  const url = `${baseUrl}/articles/${articleSlug}`;
  
  // Try to use native text fragment if text is suitable
  if (canUseTextFragment(highlight.text_quote_exact)) {
    return `${url}#:~:text=${encodeURIComponent(highlight.text_quote_exact)}`;
  }
  
  // Fallback to custom anchor
  return `${url}#${generateHighlightAnchor(highlight.id)}`;
}

/**
 * Check if text is suitable for native text fragments
 */
function canUseTextFragment(text: string): boolean {
  // Text fragments work best with short, ASCII text
  return text.length <= 100 && /^[\x00-\x7F]*$/.test(text);
}

/**
 * Color schemes for highlights
 */
export const HIGHLIGHT_COLORS = {
  yellow: { background: '#fff3cd', border: '#ffeaa7' },
  green: { background: '#d4edda', border: '#a3d977' },
  blue: { background: '#cce5ff', border: '#66b3ff' },
  pink: { background: '#f8d7da', border: '#f5a3a8' },
  orange: { background: '#ffe8cc', border: '#ffb366' },
} as const;

export type HighlightColor = keyof typeof HIGHLIGHT_COLORS;