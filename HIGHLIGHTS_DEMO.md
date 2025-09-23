# Text Highlights & Annotations Demo

This document describes the text highlighting and annotation feature for the DevVerse blog.

## Features

### Text Selection & Highlighting
- Select any text in an article to reveal the highlighting toolbar
- Choose from 5 color options: yellow, green, blue, pink, orange
- Add optional personal notes to your highlights
- Highlights persist across devices and sessions

### Sidebar Panel
- Collapsible "Notes" panel on the right side of articles
- View all highlights for the current article
- Filter by color or notes
- Edit or delete existing highlights
- Jump to any highlight with smooth scrolling

### Global Notes Page
- Visit `/notes` to see all highlights across all articles
- Search through highlight text and notes
- Filter by article or color
- Organized by article with timestamps
- Direct links to jump back to highlighted text

### Deep Linking
- Share specific quotes with others
- Automatic text fragment support for short, ASCII text
- Custom anchor fallback for longer or special text
- Smooth scrolling with visual pulse animation

### Database Integration
- Built on Supabase with Row Level Security
- W3C Web Annotation-style selectors for robust text anchoring
- Optimistic UI updates with React Query
- Real-time sync across devices

## Implementation Details

### Text Selector Algorithm
The highlighting system uses W3C Web Annotation TextQuoteSelector pattern:
- `exact`: The highlighted text
- `prefix`: Text before the selection for disambiguation
- `suffix`: Text after the selection for disambiguation
- Fallback to position-based selectors when needed

### Performance
- Efficient DOM manipulation with minimal re-renders
- Lazy loading of highlights
- Client-side caching with React Query
- Debounced search and filtering

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus management for toolbar and panels

## Usage

1. **Creating Highlights**: Select text → Choose color → Add note (optional) → Click "Highlight"
2. **Managing**: Use sidebar panel to view, edit, filter, and delete highlights
3. **Searching**: Global `/notes` page with full-text search
4. **Sharing**: Copy quote links to share specific passages

This feature enhances the reading experience by allowing users to create their own personalized study notes and annotations directly within articles.