# Design System Guidelines

This document describes the design system architecture, token hierarchy, Tailwind v4 integration, and component conventions for this React application.

## Table of Contents

1. [Token Architecture](#token-architecture)
2. [Tailwind v4 Configuration](#tailwind-v4-configuration)
3. [Typography System](#typography-system)
4. [Breakpoints](#breakpoints)
5. [Component Styling](#component-styling)
6. [Adding New Components](#adding-new-components)
7. [Token Override System](#token-override-system)

---

## Token Architecture

The design system uses a **three-layer token hierarchy** to ensure consistent styling and enable easy theming:

```
Primitive Tokens  →  Semantic Tokens  →  Component Tokens
--primitive-orange    --brand-primary     --btn-primary-bg
```

### 1. Primitive Tokens

**Location:** `src/design-system/tokens/primitive.css`

Raw values (colors, spacing, typography). **NEVER reference these directly in application code.**

```css
:root {
  --color-primitive-orange-500: #ff6600;
  --primitive-spacing-4: 1rem;
  --primitive-font-size-base: 1rem;
}
```

### 2. Semantic Tokens

**Location:** `src/design-system/tokens/semantic.css`

Purpose-driven tokens that reference primitives. **Token names remain stable** even when values change.

```css
:root {
  --color-brand-primary: var(--color-primitive-orange-500);
  --spacing-md: var(--primitive-spacing-4);
  --font-size-base: var(--primitive-font-size-base);
}
```

### 3. Component Tokens

**Location:** `src/design-system/tokens/component.css`

Component-specific tokens that reference semantic tokens.

```css
:root {
  --btn-primary-bg: var(--color-brand-primary);
  --card-padding: var(--spacing-md);
}
```

### Token Usage Rules

✅ **DO:**
- Use semantic or component tokens in application code
- Change token values without renaming
- Keep the primitive→semantic→component flow intact

❌ **DON'T:**
- Reference primitive tokens in application code
- Use raw hex colors or pixel values
- Use arbitrary values like `p-[23px]` in Tailwind

---

## Tailwind v4 Configuration

This project uses **Tailwind v4** with **PostCSS** integration.

### Key Configuration

**Location:** `src/index.css`

```css
/* Tailwind v4 - Theme and Utilities only (NO BASE LAYER) */
@import "tailwindcss/theme";
@import "tailwindcss/utilities";

@theme {
  /* Custom breakpoints, tokens, etc. */
}
```

### Why No Base Layer?

The Tailwind base layer is **deliberately excluded** to avoid conflicts with component library box models:

```css
/* ❌ DO NOT ADD THIS */
@import "tailwindcss/base";
```

### PostCSS Configuration

**Location:** `postcss.config.js`

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

---

## Typography System

Typography tokens are defined in the semantic token layer and follow a mobile-first, accessible approach.

### Typography Tokens

```css
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...;
  --font-size-caption: 0.6875rem;  /* 11px */
  --font-size-body: 0.875rem;      /* 14px */
  --font-size-base: 1rem;          /* 16px */
  --font-size-heading: 1.625rem;   /* 26px */
}
```

### Typography Utility Classes

Use these classes instead of inline font styles:

```css
.text-caption   /* Small, uppercase labels */
.text-body      /* Body copy */
.text-heading   /* Page and section headings */
```

**Example:**

```tsx
<div className="text-caption">Language</div>
<h1 className="text-heading">Hello World</h1>
<p className="text-body">Description text</p>
```

### Rules

❌ **DON'T use arbitrary font utilities:**

```tsx
<div className="text-[11px]">...</div>  /* NO */
<div style={{ fontSize: '11px' }}>...</div>  /* NO */
```

✅ **DO use semantic classes:**

```tsx
<div className="text-caption">...</div>  /* YES */
```

---

## Breakpoints

This project uses **mobile-first** responsive design.

### Breakpoint Values

Defined in `src/design-system/breakpoints.ts` and `src/index.css`:

| Breakpoint | Value | Use Case |
|------------|-------|----------|
| `sm`       | 480px | Small mobile edge cases |
| `md`       | 701px | Tablet |
| `lg`       | 1025px | Desktop |
| `xl`       | 1441px | Large desktop |

### Usage in Tailwind

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

### Usage in CSS

```css
@media (min-width: 43.8125rem) { /* md: 701px */
  .card {
    width: 50%;
  }
}
```

### Custom Variants

The design system supports a `hocus:` variant for hover + focus-visible states (if configured).

---

## Component Styling

### Styling Approaches

1. **Tailwind Utilities** - For new/simple components
2. **CSS Modules with Tokens** - For dynamic/complex components
3. **`@emotion/styled`** - For highly dynamic style modules

### Component Token Pattern

Each major component should have its own token namespace:

```css
:root {
  --card-bg: var(--color-surface-card);
  --card-border: var(--color-border-default);
  --card-padding: var(--spacing-md);
  --card-radius: var(--radius-md);
}
```

### Example: GreetingCard Component

**Using tokens and data attributes:**

```tsx
export const GreetingCard: React.FC<GreetingCardProps> = ({ 
  greeting, 
  favourite, 
  onClick 
}) => {
  return (
    <div
      className="card"
      data-favourite={favourite}
      onClick={onClick}
    >
      <div className="text-caption">{greeting.languageName}</div>
      <div className="text-heading">{greeting.text}</div>
      {favourite && <div className="badge">★ Favourite</div>}
    </div>
  );
};
```

**CSS:**

```css
.card {
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  padding: var(--card-padding);
  border-radius: var(--card-radius);
}

.card[data-favourite="true"] {
  border-color: var(--card-border-favourite);
}
```

---

## Adding New Components

### Step 1: Define Component Tokens

Add tokens to `src/design-system/tokens/component.css`:

```css
:root {
  /* Alert component tokens */
  --alert-bg: var(--color-surface-card);
  --alert-border: var(--color-border-default);
  --alert-padding: var(--spacing-md);
  --alert-radius: var(--radius-sm);
}
```

### Step 2: Create Component Styles

**Option A: CSS with component classes**

```css
/* In src/index.css or component CSS file */
.alert {
  background: var(--alert-bg);
  border: 1px solid var(--alert-border);
  padding: var(--alert-padding);
  border-radius: var(--alert-radius);
}
```

**Option B: Tailwind utilities**

```tsx
<div className="bg-white border border-gray-200 p-4 rounded">
  Alert content
</div>
```

**Option C: Emotion styled (for dynamic styles)**

```tsx
import styled from '@emotion/styled';

const Alert = styled.div`
  background: var(--alert-bg);
  border: 1px solid var(--alert-border);
  padding: var(--alert-padding);
  border-radius: var(--alert-radius);
`;
```

### Step 3: Use Semantic Classes

Add typography and spacing utilities for consistency:

```tsx
<div className="alert">
  <h3 className="text-heading">Alert Title</h3>
  <p className="text-body">Alert message</p>
</div>
```

---

## Token Override System

The design system supports **project-specific token overrides** without modifying ATOM base files.

### ATOM Base Tokens

**Location:** `src/design-system/tokens/`

These are the foundation tokens. Do not edit these for project-specific changes.

### Project Override Tokens

**Location:** `src/app/styles/tokens/overrides.css`

Override ATOM base tokens here for project-specific customizations:

```css
:root {
  /* Override brand color */
  --color-brand-primary: #ff0000;
  
  /* Override spacing */
  --spacing-md: 1.25rem;
  
  /* Override component token */
  --btn-primary-bg: var(--color-brand-primary);
}
```

### How Overrides Work

The override file is imported after base tokens in `src/index.css`:

```css
@import "./design-system/tokens/component.css";  /* ATOM base */
@import "./app/styles/tokens/overrides.css";      /* Project overrides win */
```

Higher specificity in the cascade means overrides win.

### Guidelines

1. **Change values, not names** - Keep token names stable
2. **Document overrides** - Add comments explaining why
3. **Test thoroughly** - Overrides affect the entire application

---

## Validation Checklist

Before committing design system changes:

- [ ] Token changes made in correct layer (primitive/semantic/component)
- [ ] No new primitive-token or arbitrary-value usage in app code
- [ ] Typography uses documented classes (`.text-caption`, `.text-body`, `.text-heading`)
- [ ] Breakpoints use standard values (sm, md, lg, xl)
- [ ] No Tailwind base layer reintroduced
- [ ] Build passes: `npm run build`
- [ ] Components render correctly in browser

---

## Common Patterns

### Pattern: Conditional Styling with Data Attributes

```tsx
<div 
  className="card" 
  data-favourite={isFavourite}
  data-disabled={isDisabled}
>
```

```css
.card[data-favourite="true"] {
  border-color: var(--card-border-favourite);
}

.card[data-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}
```

### Pattern: Hover + Focus States

```css
.btn:hover {
  background: var(--btn-primary-bg-hover);
}

.btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

### Pattern: Responsive Design

```css
.card {
  width: 100%;  /* Mobile first */
}

@media (min-width: 43.8125rem) {  /* md: 701px */
  .card {
    width: 50%;
  }
}

@media (min-width: 64.0625rem) {  /* lg: 1025px */
  .card {
    width: 33.333%;
  }
}
```

---

## Resources

- **Tailwind v4 Docs:** https://tailwindcss.com/docs
- **Design Tokens Spec:** https://design-tokens.github.io/community-group/format/
- **Breakpoints Reference:** `src/design-system/breakpoints.ts`
- **Token Files:** `src/design-system/tokens/`

---

## Questions?

For design system questions or issues, check:

1. This documentation
2. Token layer files in `src/design-system/tokens/`
3. `src/index.css` for Tailwind configuration
4. Project-specific overrides in `src/app/styles/tokens/overrides.css`
