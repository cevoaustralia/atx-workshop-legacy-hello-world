# Tailwind v4 Guidelines

This document outlines how Tailwind v4 is configured and used in this project.

## Table of Contents

1. [Configuration](#configuration)
2. [Why No Base Layer](#why-no-base-layer)
3. [Custom Theme](#custom-theme)
4. [Usage Patterns](#usage-patterns)
5. [Best Practices](#best-practices)

---

## Configuration

### Installation

Tailwind v4 is installed with PostCSS integration:

```bash
npm install --save-dev tailwindcss@next @tailwindcss/postcss postcss
```

### PostCSS Configuration

**File:** `postcss.config.js`

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### CSS Entry Point

**File:** `src/index.css`

```css
/* Tailwind v4 - Theme and Utilities only */
@import "tailwindcss/theme";
@import "tailwindcss/utilities";

@theme {
  /* Custom configuration */
}
```

---

## Why No Base Layer

The Tailwind base layer is **deliberately excluded**:

```css
/* ❌ DO NOT ADD THIS */
@import "tailwindcss/base";
```

### Reason

The base layer conflicts with component library box models (e.g., `sv-component-library`). It applies aggressive CSS resets that break third-party components.

### Alternative Base Styles

Minimal base styles are included directly in `src/index.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-family-base);
  /* ... */
}
```

---

## Custom Theme

Custom theme configuration is defined in the `@theme` block:

```css
@theme {
  /* Breakpoints */
  --breakpoint-sm: 30rem;      /* 480px */
  --breakpoint-md: 43.8125rem; /* 701px */
  --breakpoint-lg: 64.0625rem; /* 1025px */
  --breakpoint-xl: 90.0625rem; /* 1441px */

  /* Design tokens */
  --color-brand-primary: #ff6600;
  --spacing-md: 1rem;
  /* ... */
}
```

### Mobile-First Breakpoints

| Breakpoint | Value | Min-Width | Use Case |
|------------|-------|-----------|----------|
| (default)  | -     | 0px       | Mobile |
| `sm:`      | 480px | 480px     | Small mobile edge cases |
| `md:`      | 701px | 701px     | Tablet |
| `lg:`      | 1025px | 1025px   | Desktop |
| `xl:`      | 1441px | 1441px   | Large desktop |

**Usage:**

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

---

## Usage Patterns

### Utility Classes

Use Tailwind utilities for spacing, layout, and responsive design:

```tsx
<div className="flex flex-wrap gap-4 p-6">
  <Card className="w-full md:w-1/2 lg:w-1/3" />
</div>
```

### Component Classes with Tokens

Combine Tailwind utilities with custom component classes that use design tokens:

```tsx
<button className="btn hover:opacity-90">
  Click Me
</button>
```

```css
.btn {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  /* ... */
}
```

### Responsive Design

Mobile-first approach:

```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  <Card />
  <Card />
  <Card />
</div>
```

### State Variants

```tsx
<button className="
  bg-blue-500 
  hover:bg-blue-600 
  focus-visible:ring-2 
  focus-visible:ring-offset-2 
  disabled:opacity-50
">
  Button
</button>
```

---

## Best Practices

### ✅ DO

1. **Use utility classes for layout and spacing:**
   ```tsx
   <div className="flex items-center gap-4 p-6">
   ```

2. **Use design tokens for colors:**
   ```css
   .card {
     background: var(--card-bg);
     border-color: var(--card-border);
   }
   ```

3. **Use mobile-first responsive design:**
   ```tsx
   <div className="w-full md:w-1/2 lg:w-1/3">
   ```

4. **Extract repeated patterns to component classes:**
   ```css
   .btn {
     background: var(--btn-primary-bg);
     padding: var(--btn-padding-y) var(--btn-padding-x);
     border-radius: var(--btn-radius);
   }
   ```

### ❌ DON'T

1. **Don't use arbitrary values for colors:**
   ```tsx
   <div className="bg-[#ff6600]">  /* NO */
   ```
   
   Use design tokens instead:
   ```tsx
   <div style={{ background: 'var(--color-brand-primary)' }}>  /* YES */
   ```

2. **Don't use arbitrary spacing:**
   ```tsx
   <div className="p-[23px]">  /* NO */
   ```
   
   Use standard spacing scale:
   ```tsx
   <div className="p-6">  /* YES - 1.5rem / 24px */
   ```

3. **Don't add the base layer:**
   ```css
   @import "tailwindcss/base";  /* NO */
   ```

4. **Don't use arbitrary font sizes:**
   ```tsx
   <p className="text-[14px]">  /* NO */
   ```
   
   Use typography classes:
   ```tsx
   <p className="text-body">  /* YES */
   ```

---

## Extending Tailwind

### Adding Custom Utilities

Add custom utilities in the `@theme` block:

```css
@theme {
  --color-custom: #custom-color;
}
```

Then use as CSS custom properties:

```tsx
<div style={{ color: 'var(--color-custom)' }}>
```

### Custom Variants

For custom variants like `hocus:` (hover + focus), configure in `vite.config.ts` if needed.

---

## Troubleshooting

### Build Errors

If you encounter build errors:

1. **Check imports:**
   ```css
   @import "tailwindcss/theme";
   @import "tailwindcss/utilities";
   /* NOT @import "tailwindcss/base"; */
   ```

2. **Check postcss.config.js:**
   ```javascript
   export default {
     plugins: {
       '@tailwindcss/postcss': {},
     },
   };
   ```

3. **Verify package.json has `"type": "module"`**

### Styles Not Applying

1. **Check import order in src/index.css** - Token layers should load before utilities
2. **Verify CSS custom properties are defined** in `@theme`
3. **Check browser DevTools** to confirm styles are generated

---

## Migration from v3

Key differences from Tailwind v3:

1. **CSS-based configuration** instead of `tailwind.config.js`
2. **PostCSS plugin** instead of Vite plugin (for now)
3. **`@theme` block** instead of `theme` in config
4. **CSS imports** instead of `@tailwind` directives

---

## Resources

- **Tailwind v4 Documentation:** https://tailwindcss.com/docs
- **Design System Guidelines:** `docs/design-system-guidelines.md`
- **Breakpoints Reference:** `src/design-system/breakpoints.ts`
- **PostCSS Plugin:** https://www.npmjs.com/package/@tailwindcss/postcss

---

## Summary

- Tailwind v4 uses **CSS configuration** via `@theme`
- **No base layer** to avoid conflicts
- **Mobile-first breakpoints:** sm (480px), md (701px), lg (1025px), xl (1441px)
- Use **design tokens** for colors, not arbitrary values
- Use **utility classes** for layout and spacing
- Extract **component classes** for repeated patterns
