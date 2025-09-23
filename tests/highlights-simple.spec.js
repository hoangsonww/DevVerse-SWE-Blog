/**
 * Tests for highlight selectors and utilities
 * @jest-environment jsdom
 */

const {
  createTextQuoteSelector,
  anchorTextQuoteSelector,
  generateHighlightAnchor,
  createDeepLink,
} = require('../lib/highlights/selectors');

// Mock DOM for testing
function createTestContainer(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

function createRange(container, startText, endText) {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let startNode = null;
  let startOffset = 0;
  let endNode = null;
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
    expect(range.toString()).toBe('highlighted text');
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

  test('creates deep links for highlights - long text uses custom anchor', () => {
    const highlight = {
      id: 'test123',
      text_quote_exact: 'test text with longer content that exceeds the one hundred character limit for text fragments because it has many words',
      user_id: 'user1',
      article_slug: 'test-article',
      color: 'yellow',
      is_public: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    
    const link = createDeepLink('test-article', highlight, 'https://example.com');
    
    // Should use custom anchor for longer text (over 100 chars)
    expect(link).toBe('https://example.com/articles/test-article#h_test123');
  });

  test('creates deep links for highlights - non-ASCII uses custom anchor', () => {
    const highlight = {
      id: 'test456',
      text_quote_exact: 'short tëxt with émojis 🚀',
      user_id: 'user1',
      article_slug: 'test-article',
      color: 'yellow',
      is_public: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    
    const link = createDeepLink('test-article', highlight, 'https://example.com');
    
    // Should use custom anchor for non-ASCII text
    expect(link).toBe('https://example.com/articles/test-article#h_test456');
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