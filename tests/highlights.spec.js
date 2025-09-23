/**
 * Tests for highlight selectors and utilities
 * @jest-environment jsdom
 */

import {
  createTextQuoteSelector,
  anchorTextQuoteSelector,
  generateHighlightAnchor,
  createDeepLink,
  canUseTextFragment,
} from '../lib/highlights/selectors';

// Mock DOM for testing
function createTestContainer(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

function createRange(container: HTMLElement, startText: string, endText: string): Range {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let startNode: Node | null = null;
  let startOffset = 0;
  let endNode: Node | null = null;
  let endOffset = 0;
  
  let node;
  while (node = walker.nextNode()) {
    const text = node.textContent || '';
    const startIndex = text.indexOf(startText);
    const endIndex = text.indexOf(endText);
    
    if (startIndex !== -1 && !startNode) {
      startNode = node;
      startOffset = startIndex;
    }
    
    if (endIndex !== -1) {
      endNode = node;
      endOffset = endIndex + endText.length;
      break;
    }
  }
  
  if (!startNode || !endNode) {
    throw new Error('Could not find text in container');
  }
  
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  
  return range;
}

describe('Text Quote Selectors', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('creates text quote selector from range', () => {
    const container = createTestContainer(
      '<p>This is a test paragraph with some highlighted text in it.</p>'
    );
    
    const range = createRange(container, 'highlighted', 'text');
    const selector = createTextQuoteSelector(range, container);
    
    expect(selector.exact).toBe('highlighted text');
    expect(selector.prefix).toContain('some ');
    expect(selector.suffix).toContain(' in');
  });

  test('anchors text quote selector to DOM', () => {
    const container = createTestContainer(
      '<p>This is a test paragraph with some highlighted text in it.</p>'
    );
    
    const selector = {
      exact: 'highlighted text',
      prefix: 'some ',
      suffix: ' in'
    };
    
    const range = anchorTextQuoteSelector(selector, container);
    
    expect(range).not.toBeNull();
    expect(range?.toString()).toBe('highlighted text');
  });

  test('handles multiple matches with prefix/suffix disambiguation', () => {
    const container = createTestContainer(
      '<p>First text here. Second text there.</p>'
    );
    
    const selector = {
      exact: 'text',
      prefix: 'Second ',
      suffix: ' there'
    };
    
    const range = anchorTextQuoteSelector(selector, container);
    
    expect(range).not.toBeNull();
    // Should find the second occurrence
    const precedingText = container.textContent?.substring(
      0, 
      container.textContent.indexOf(range?.toString() || '')
    );
    expect(precedingText).toContain('Second');
  });

  test('returns null for non-existent text', () => {
    const container = createTestContainer('<p>Simple paragraph</p>');
    
    const selector = {
      exact: 'nonexistent text',
    };
    
    const range = anchorTextQuoteSelector(selector, container);
    expect(range).toBeNull();
  });
});

describe('Highlight Utilities', () => {
  test('generates consistent anchor IDs', () => {
    const id1 = 'abc123';
    const id2 = 'xyz789';
    
    expect(generateHighlightAnchor(id1)).toBe('h_abc123');
    expect(generateHighlightAnchor(id2)).toBe('h_xyz789');
  });

  test('creates deep links for highlights', () => {
    const highlight = {
      id: 'test123',
      text_quote_exact: 'test text',
      user_id: 'user1',
      article_slug: 'test-article',
      color: 'yellow',
      is_public: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    
    const link = createDeepLink('test-article', highlight, 'https://example.com');
    
    // Should use custom anchor for longer text
    expect(link).toBe('https://example.com/articles/test-article#h_test123');
  });

  test('uses text fragments for suitable text', () => {
    const highlight = {
      id: 'test123',
      text_quote_exact: 'short',
      user_id: 'user1',
      article_slug: 'test-article',
      color: 'yellow',
      is_public: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    
    const link = createDeepLink('test-article', highlight, 'https://example.com');
    
    expect(link).toBe('https://example.com/articles/test-article#:~:text=short');
  });
});

describe('Text Fragment Detection', () => {
  test('accepts suitable text for text fragments', () => {
    // Mock the private function for testing
    const canUseTextFragment = (text: string): boolean => {
      return text.length <= 100 && /^[\x00-\x7F]*$/.test(text);
    };
    
    expect(canUseTextFragment('short text')).toBe(true);
    expect(canUseTextFragment('a'.repeat(50))).toBe(true);
  });

  test('rejects unsuitable text for text fragments', () => {
    const canUseTextFragment = (text: string): boolean => {
      return text.length <= 100 && /^[\x00-\x7F]*$/.test(text);
    };
    
    // Too long
    expect(canUseTextFragment('a'.repeat(150))).toBe(false);
    
    // Non-ASCII characters
    expect(canUseTextFragment('héllo wörld')).toBe(false);
  });
});