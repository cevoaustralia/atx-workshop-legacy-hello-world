# Color Palette Tech Debt

**Status:** ✅ Resolved  
**GitHub Issue:** TL-3908  
**Last Updated:** 2025-01-27

## Overview

This document tracks the migration of color values from hard-coded hex literals to the design token system.

## Goal

Replace all hard-coded color values with semantic design tokens:

```css
/* Before */
.element {
  color: #ff6600;
  background: #f7f7f7;
}

/* After */
.element {
  color: var(--color-brand-primary);
  background: var(--color-surface-background);
}
```

## Migration Status

### ✅ Completed

- [x] Define primitive color tokens
- [x] Define semantic color tokens (brand, surface, text, border)
- [x] Define component-specific color tokens
- [x] Migrate Header component
- [x] Migrate GreetingCard component
- [x] Migrate Button component
- [x] Migrate all route pages (Home, Greeting Detail, About)
- [x] Remove inline hex colors from components
- [x] Document token usage in guidelines

### Remaining Work

None - all components now use design tokens.

## Token Categories

### Brand Colors

```css
--color-brand-primary: var(--color-primitive-orange-500);
--color-brand-primary-hover: var(--color-primitive-orange-600);
```

### Surface Colors

```css
--color-surface-background: var(--color-primitive-grey-50);
--color-surface-card: var(--color-primitive-white);
--color-surface-header: var(--color-primitive-grey-900);
```

### Text Colors

```css
--color-text-primary: var(--color-primitive-grey-700);
--color-text-secondary: var(--color-primitive-grey-600);
--color-text-tertiary: var(--color-primitive-grey-500);
--color-text-muted: var(--color-primitive-grey-300);
--color-text-on-dark: var(--color-primitive-white);
```

### Border Colors

```css
--color-border-default: var(--color-primitive-grey-100);
--color-border-hover: var(--color-primitive-grey-300);
--color-border-focus: var(--color-brand-primary);
```

## Validation

All components checked for:

- ✅ No hard-coded hex colors in JSX
- ✅ No hard-coded hex colors in CSS
- ✅ All colors use semantic tokens
- ✅ Hover/focus states use token variants

## Exception

One color remains hard-coded intentionally:

```tsx
// Hello count badge in Header - yellow accent color
<span style={{ color: '#ffcc00' }}>Hellos: {helloCount}</span>
```

This is a special accent color not part of the core palette. If this becomes reused, it should be added as a semantic token.

## References

- **Design System Guidelines:** `docs/design-system-guidelines.md`
- **Token Files:** `src/design-system/tokens/`
- **Implementation PR:** [Link to PR when available]

---

**Migration Complete** ✅
