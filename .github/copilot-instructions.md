# Future Lens - AI Coding Agent Instructions

## Project Overview

Future Lens is a SvelteKit 5 PWA for AI-powered image transformation, featuring a split-screen comparison UI, camera integration, and node-based canvas visualization. The app is entirely client-side with no backend, deploying as static files to GitHub Pages.

## Architecture & Key Concepts

### Frontend Stack
- **SvelteKit 5** with Svelte 5 runes (`$state`, `$effect`, `$derived`)
- **Tailwind CSS v4** with custom theme (coral accent `#FF6B4A`)
- **Konva/svelte-konva** for canvas visualization
- **IndexedDB** for persistent storage (via `frontend/src/lib/db/indexedDB.js`)
- **Static adapter** for GitHub Pages deployment with `BASE_PATH` configuration

### State Management Patterns
- **Svelte runes** (`$state`, `$effect`) instead of stores in components
- **Svelte stores** for cross-component shared state:
  - `settings` - localStorage-persisted user preferences
  - `notifications` - toast notification queue
  - `promptHistory` - prompt suggestions
  - `historyDB` - IndexedDB wrapper with reactive updates
  - `storageMonitor` - storage quota tracking

### Critical Data Flow: Image Transformation
1. User captures/uploads image to canvas (1024×1024)
2. Image hash generated from downscaled pixel data for grouping variations
3. Canvas blob sent to `https://api-h34hnr2j2nm2me2d.transferscope.org/lens` via FormData
4. Response includes paths (prepend API_URL to construct full URLs)
5. Result stored in IndexedDB with input hash for history grouping
6. History component displays grouped variations by input hash

### History System Architecture
- **Migration**: Auto-migrates from old localStorage format to IndexedDB on init
- **Grouping**: Multiple variations of same input share `inputHash` (pixel-based hash)
- **Storage**: `historyDB.add(inputHash, inputImage, resultImage, prompt, denoise, seed)`
- **Views**: Grid/large toggle + grouped/standard mode (stored in settings)
- **Cleanup**: Auto-removes oldest items when exceeding MAX_HISTORY (100)

## Development Workflow

### Running Locally
```bash
cd frontend
npm install
npm run dev  # Starts Vite dev server with BASE_PATH=""
```

### Building for Production
```bash
npm run build  # Creates static build with BASE_PATH from env
# Build output: frontend/build/
# Requires BASE_PATH='/$REPO_NAME' for GitHub Pages
```

### Testing
```bash
npm run test:e2e  # Playwright tests in frontend/e2e/
```

### Deployment
- Auto-deploys to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`)
- Uses `adapter-static` with fallback: '404.html'
- Paths configured via `BASE_PATH` env var and `$app/paths` import

## Component Patterns & Conventions

### Svelte 5 Component Structure
```svelte
<script>
  import { onMount } from 'svelte';
  
  // Use $state for reactive local state (NOT stores)
  let value = $state(initialValue);
  
  // Use $effect for side effects
  $effect(() => {
    // Runs when dependencies change
  });
  
  // Import stores with $ prefix for auto-subscription
  import { settings } from '$lib/stores/settings.js';
  let denoise = $state($settings.denoise);
</script>
```

### Icon System
- SVG icons imported as `?raw` strings: `import iconName from '$lib/assets/icons/icon.svg?raw';`
- Rendered via `<Icon src={iconName} size={24} />` component
- Uses `vite-plugin-svgr` plugin

### UI Component Conventions
- **Panel controls**: Positioned via `position` prop ('top-left', 'bottom-right')
- **Button style**: 3.5rem circular, 2px coral border, transparent→filled on hover
- **Modals**: Full-screen overlays with `{#if showModal}` conditional rendering
- **Loading states**: Use `loading` boolean + `loadingProgress` object with `stage` and `progress`

### Error Handling Pattern
```javascript
try {
  // operation
  notifySuccess('Operation completed');
} catch (error) {
  console.error('Context:', error);
  notifyError('User-friendly message');
}
```

## API Integration

### Image Upload Pattern
```javascript
import { uploadImage } from '$lib/api/client.js';

const data = await uploadImage(
  API_URL,
  imageBlob,
  { client_id, text, seed, denoise, redirect },
  (progress) => {
    // Handle progress updates
    loadingProgress = progress;
  },
  (attempt, error, delay) => {
    // Handle retries
  }
);
```

### Retry Logic
- `frontend/src/lib/api/client.js` implements exponential backoff (3 retries)
- Retryable errors: network errors, 408, 429, 5xx
- Request timeout: 30 seconds
- Provides detailed progress callbacks: 'preparing', 'uploading', 'requesting', 'retrying', 'complete'

## Canvas Visualization (Konva)

### Node Structure
- **Input nodes**: 120×120px with variation count badge
- **Variation nodes**: 100×100px with prompt text below
- **Connectors**: Arrows from input to variations
- **Tools**: 'cursor' (drag nodes) vs 'hand' (pan canvas)

### Important: SSR Handling
Canvas page uses Konva which requires `window`. The `onMount` lifecycle ensures Konva only runs client-side.

### Pan/Zoom Implementation
- Wheel event with `evt.ctrlKey` = zoom (pinch gesture)
- Wheel without ctrl = pan (two-finger scroll)
- `scale`, `stageX`, `stageY` control view transform
- Min scale: 0.1, max scale: 5

## Validation & User Input

### Prompt Validation
```javascript
import { validatePrompt, sanitizePrompt } from '$lib/utils/validation.js';

const validation = validatePrompt(promptValue);
if (!validation.valid) {
  notifyError(validation.error);
  return;
}
const cleanPrompt = sanitizePrompt(promptValue);
```

- Min length: 3 chars
- Max length: 500 chars
- Sanitization: trims whitespace, removes special chars

### Image Validation
```javascript
import { validateImage, compressImage } from '$lib/utils/imageUtils.js';

const validation = validateImage(file);
if (!validation.valid) {
  notifyError(validation.error);
  return;
}

// Compress if >2MB
if (file.size > 2 * 1024 * 1024) {
  processedFile = await compressImage(file, 1024, 1024, 0.85);
}
```

## Keyboard Shortcuts

Register shortcuts in `onMount`:
```javascript
import { registerShortcut, initKeyboardShortcuts, clearAllShortcuts } from '$lib/utils/keyboard.js';

onMount(() => {
  const cleanup = initKeyboardShortcuts();
  
  registerShortcut('ctrl+enter', handleTransfer, { preventDefault: true });
  registerShortcut('ctrl+k', handleOpenLibrary, { preventDefault: true });
  registerShortcut('escape', () => closeModals());
  
  return cleanup;
});
```

## Storage Management

### Settings Persistence
- Auto-saves to localStorage on updates via `settings.updateSetting(key, value)`
- Merges with defaults on load for backward compatibility
- Reset individual settings: `settings.resetSetting(key)`

### IndexedDB Schema
```javascript
// Stores: HISTORY, SETTINGS, CACHE
// History item: { inputHash, inputImage, resultImage, prompt, denoise, seed, timestamp, id }
// Access via historyDB store methods: add, removeVariation, removeGroup, clear
```

### Storage Monitoring
```javascript
import { storageMonitor } from '$lib/stores/storageMonitor.js';

onMount(() => {
  storageMonitor.start(); // Checks quota every 30s
  return () => storageMonitor.stop();
});
```

## Styling Conventions

### Tailwind + Custom CSS
- Use Tailwind utilities for spacing, flexbox, grid
- Custom CSS for complex animations, transitions, aspect-ratios
- CSS custom properties in `app.css`:
  - `--color-accent: #ff6b4a`
  - `--color-panel-light: #e5e5e5`
  - `--color-panel-dark: #4a4a4a`

### Responsive Breakpoint
- Desktop: `>600px` (side-by-side panels)
- Mobile: `≤600px` (stacked panels, hidden handles)
- Media query: `@media (max-width: 600px)`

### Dark Mode Aesthetic
- Black background (`#000000`)
- White text with opacity for secondary content
- Coral accent for all interactive elements
- Panel gradients for depth

## Common Pitfalls & Solutions

### Problem: Canvas tainted by CORS
**Solution**: Always set `image.crossOrigin = 'anonymous'` before loading external images

### Problem: Svelte 5 store subscription not updating
**Solution**: Use `$` prefix for auto-subscription: `let value = $state($store.value)`

### Problem: History not loading after refresh
**Solution**: Call `await historyDB.init()` in `onMount` before accessing history

### Problem: GitHub Pages 404 on refresh
**Solution**: `adapter-static` with `fallback: '404.html'` handles this. Ensure `BASE_PATH` is set correctly.

### Problem: Konva SSR error
**Solution**: All Konva code must be in `onMount` or client-side only components

## File Organization

```
frontend/src/
  lib/
    api/          # API client with retry logic
    assets/       # SVG icons (imported as ?raw)
    components/   # Reusable Svelte components
    data/         # Static JSON data (prompt presets)
    db/           # IndexedDB wrapper + historyDB store
    stores/       # Svelte stores (settings, notifications, prompts, etc.)
    utils/        # Pure utility functions (validation, keyboard, cache, etc.)
  routes/
    +page.svelte           # Main split-screen app
    +layout.svelte         # Toast notifications, network status
    canvas/+page.svelte    # Konva node visualization
    about/+page.svelte     # Help page
```

## Testing Approach

- **E2E tests**: Playwright in `frontend/e2e/`
- **Test pattern**: User-centric flows (upload → transform → history)
- **No unit tests yet** (consider Vitest for utils)

## Planned Features (See DEVELOPMENT_PLAN.md)

Reference the comprehensive development roadmap for:
- Upcoming features (prompt library, PWA, analytics)
- Priority ordering (UX enhancements first)
- Technical debt items

## When Adding Features

1. **Validation**: Always validate user input with `$lib/utils/validation.js`
2. **Error handling**: Use `notifyError/Success/Warning` for user feedback
3. **Loading states**: Provide visual feedback during async operations
4. **Accessibility**: Add ARIA labels to new interactive elements
5. **Mobile**: Test responsive behavior at 600px breakpoint
6. **Persistence**: Store user preferences in `settings` store
7. **Documentation**: Update DEVELOPMENT_PLAN.md if scope changes

## Performance Considerations

- **Image compression**: Compress uploads >2MB before sending
- **Lazy loading**: Use `$lib/utils/lazyload.js` for history thumbnails
- **IndexedDB over localStorage**: Better for large datasets (images)
- **Canvas caching**: Reuse canvas contexts, avoid recreating
- **Debounce**: Use for search/filter inputs (not yet implemented)
