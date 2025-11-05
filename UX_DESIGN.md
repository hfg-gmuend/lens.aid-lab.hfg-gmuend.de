# Futures Lens - UX Design Documentation

## Overview

Futures Lens is a web application featuring a split-screen comparison interface with a dark mode aesthetic. The design emphasizes a clean, modern look with coral/orange accent colors for interactive elements.

## Design Philosophy

- **Minimalist & Modern**: Clean lines, rounded corners, and simple typography
- **Dark Mode First**: Black background with light/dark grey panels for content
- **Accent-Driven Interactions**: All interactive elements use the signature coral/orange color

## Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Accent Orange** | `#FF6B4A` | Interactive elements, buttons, handles |
| **Background Black** | `#000000` | Main page background |
| **Panel Light** | `#E5E5E5` | Left panel (input) background |
| **Panel Dark** | `#4A4A4A` | Right panel (output) background |
| **White** | `#FFFFFF` | Text, icons, slider thumb |

## Layout Structure

### Desktop Layout (> 600px)

```
┌─────────────────────────────────────────┐
│          futures lens (title)           │
├──────────────────┬──────────────────────┤
│                  │                      │
│   Left Panel     │    Right Panel       │
│   (Light Grey)   │    (Dark Grey)       │
│                  │                      │
│   [🔼] [📷]      │        [✓] [⬇️]      │
│                  │                      │
│      1:1         │       1:1            │
│    Square        │     Square           │
│                  │                      │
│    [←]           │                      │
│                  │                      │
│           [🔄→]  │                      │
└──────────────────┴──────────────────────┘
│  [Your prompt here...] [Familiar ●─────── Unfamiliar] │
└─────────────────────────────────────────┘
```

### Mobile Layout (< 600px)

```
┌─────────────────────────┐
│   futures lens (title)  │
├─────────────────────────┤
│                         │
│      Left Panel         │
│    (Light Grey)         │
│                         │
│   [🔼] [📷]             │
│                         │
│        1:1              │
│      Square             │
│                         │
├─────────────────────────┤
│                         │
│      Right Panel        │
│    (Dark Grey)          │
│                         │
│              [✓] [⬇️]   │
│                         │
│        1:1              │
│      Square             │
│                         │
└─────────────────────────┘
│ [Your prompt here...]   │
│ [Familiar ●─ Unfamiliar]│
└─────────────────────────┘
```

## Core Components

### 1. Title
- **Text**: "futures lens" (lowercase)
- **Style**: Italic, lightweight (300), sans-serif
- **Size**: 1.875rem (30px)
- **Position**: Centered at top

### 2. Split-Screen Panels

#### Left Panel (Input)
- **Background**: Light grey (`#E5E5E5`)
- **Aspect Ratio**: 1:1 (square)
- **Width**: 50% (desktop) / 100% (mobile)
- **Controls**: Upload and Camera icons (top-left)

#### Right Panel (Output)
- **Background**: Dark grey (`#4A4A4A`)
- **Aspect Ratio**: 1:1 (square)
- **Width**: 50% (desktop) / 100% (mobile)
- **Controls**: Check and Download icons (bottom-right)

### 3. Icon Buttons

**Specifications:**
- **Size**: 3.5rem diameter (56px)
- **Border**: 2px solid accent orange
- **Background**: Transparent
- **Shape**: Circular
- **Icon Color**: Accent orange
- **Hover Effect**:
  - Background fills with accent orange
  - Icon color changes to white
  - Scale: 1.05

**Button Locations:**
- **Left Panel**: Upload (top-left), Camera (top-left)
- **Right Panel**: Check (bottom-right), Download (bottom-right)
- **Spacing**: 1.5rem from edges, 1rem gap between buttons

### 4. Decorative Handles

**Purpose**: Visual design elements at the panel junction

**Specifications:**
- **Shape**: Pill-shaped (rounded rectangle)
- **Width**: 10em
- **Background**: Accent orange (`#FF6B4A`)
- **Border Radius**: 999px (fully rounded)
- **Icon Color**: White
- **Position**: Absolutely positioned over panel divider
  - Top handle: 2em from top
  - Bottom handle: 2em from bottom
- **Visibility**: Hidden on mobile (< 600px)
- **Interaction**: Clickable buttons with hover scale effect (1.05)

**Icons:**
- Top handle: Arrow left
- Bottom handle: Refresh + Arrow right

### 5. Prompt Input Field

**Specifications:**
- **Type**: Text input
- **Placeholder**: "Your prompt here"
- **Style**:
  - Rounded (2rem border-radius)
  - Transparent background
  - White text
  - 1px border (rgba white 20% opacity)
- **Focus State**: Border color changes to accent orange
- **Layout**: Flex item, min-width 300px

### 6. Familiar/Unfamiliar Slider

**Specifications:**
- **Type**: Range input (0-100)
- **Default Value**: 80 (near "Unfamiliar")
- **Track**:
  - Height: 4px
  - Background: rgba white 30% opacity
  - Border radius: 2px
- **Thumb**:
  - Size: 1.5rem diameter
  - Background: White
  - Shape: Circular
- **Labels**: "Familiar" (left) / "Unfamiliar" (right)
- **Layout**: Flex item with 1rem gaps

## Responsive Behavior

### Breakpoint: 600px

**Desktop (> 600px):**
- Panels side-by-side (50% width each)
- Handles visible and horizontally positioned
- Control bar horizontal with prompt + slider

**Mobile (≤ 600px):**
- Panels stacked vertically (100% width each)
- Handles hidden (`display: none`)
- Control bar stacks vertically
- Prompt and slider full width

## Interactions

### Button States
1. **Default**: Transparent background, orange border/icon
2. **Hover**: Orange background, white icon, scale 1.05
3. **Active/Focus**: Standard browser behavior

### Handle States
1. **Default**: Orange pill shape, white icons
2. **Hover**: Scale 1.05
3. **Click**: Executes callback function (via props)

### Slider States
1. **Default**: White thumb on semi-transparent track
2. **Drag**: Standard browser slider interaction
3. **Focus**: Standard browser outline

## Typography

- **Font Family**: System UI sans-serif stack
  ```css
  font-family: ui-sans-serif, system-ui, sans-serif;
  ```
- **Title**: 1.875rem, weight 300, italic
- **Labels**: 1rem, white color
- **Input**: 1rem, white color

## Spacing System

- **Container Padding**: 2rem vertical, 1rem horizontal
- **Component Gaps**: 2rem (large), 1rem (medium), 0.5rem (small)
- **Icon Position**: 1.5rem from panel edges
- **Handle Position**: 2em from top/bottom edges
- **Max Width**: 1400px (centered)

## Technical Implementation

### Technology Stack
- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS v4 with custom theme
- **Icons**: SVG files loaded with vite-plugin-svgr
- **Build Tool**: Vite 7
- **Deployment**: Static adapter

### Key Files
- `frontend/src/routes/+page.svelte` - Main UI layout
- `frontend/src/lib/components/SplitScreenDivider.svelte` - Handle buttons
- `frontend/src/lib/components/Icon.svelte` - SVG icon wrapper
- `frontend/src/lib/assets/icons/*.svg` - Icon assets
- `frontend/src/app.css` - Global styles and theme

### Custom CSS Properties
```css
--color-accent: #ff6b4a;
--color-panel-light: #e5e5e5;
--color-panel-dark: #4a4a4a;
--color-bg-black: #000000;
--font-sans: ui-sans-serif, system-ui, sans-serif;
```

### Aspect Ratio Implementation
Both panels use CSS `aspect-ratio: 1 / 1` to maintain square shapes regardless of viewport width.

### State Management
- Prompt value: Reactive state (`$state`)
- Slider value: Reactive state (`$state`, default 80)
- Click handlers: Callback functions passed via props

## Accessibility

- **ARIA Labels**: All icon buttons have descriptive labels
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus States**: Standard browser focus indicators
- **Color Contrast**: Meets WCAG AA standards for text and interactive elements

## Future Considerations

- Handle positioning on mobile (currently hidden, needs redesign)
- Image upload/camera functionality implementation
- Output generation and display logic
- Animation transitions between states
- Loading states and feedback
- Error handling UI

---

**Last Updated**: November 5, 2025
**Version**: 1.0
