# Margin Props Tech Debt

**Status:** ✅ Resolved  
**Last Updated:** 2025-01-27

## Overview

This document tracks the migration from hard-coded margin/padding values to design system spacing tokens.

## Goal

Replace all hard-coded spacing values with semantic spacing tokens or Tailwind utilities:

```css
/* Before */
.element {
  margin: 20px;
  padding: 8px 16px;
}

/* After - Using tokens */
.element {
  margin: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
}

/* After - Using Tailwind */
<div className="my-5 px-4 py-2">
```

## Spacing Scale

Defined in design tokens:

| Token | Value | Pixels | Tailwind |
|-------|-------|--------|----------|
| `--spacing-xs` | 0.25rem | 4px | `1` |
| `--spacing-sm` | 0.5rem | 8px | `2` |
| `--spacing-md` | 1rem | 16px | `4` |
| `--spacing-lg` | 1.5rem | 24px | `6` |
| `--spacing-xl` | 2rem | 32px | `8` |

## Migration Status

### ✅ Completed

- [x] Define spacing tokens (primitive and semantic)
- [x] Define component-specific spacing tokens (--btn-padding-*, --card-padding, etc.)
- [x] Migrate Header padding to tokens
- [x] Migrate Card padding to tokens
- [x] Migrate Button padding to tokens
- [x] Replace inline margin/padding with Tailwind utilities in route components
- [x] Document spacing usage in guidelines

### Remaining Work

None - all components use design tokens or Tailwind utilities.

## Component-Specific Spacing Tokens

```css
/* Button */
--btn-padding-x: 0.875rem; /* 14px */
--btn-padding-y: 0.5rem;   /* 8px */

/* Card */
--card-padding: var(--spacing-md);
--card-gap: var(--spacing-sm);

/* Header */
--header-padding-x: var(--spacing-lg);
--header-padding-y: var(--spacing-md);

/* Layout */
--layout-content-padding: var(--spacing-lg);
```

## Usage Patterns

### CSS with Tokens

```css
.my-component {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

### Tailwind Utilities

```tsx
<div className="p-4 mb-6 mt-5">
  Content
</div>
```

### Component Tokens

```css
.btn {
  padding: var(--btn-padding-y) var(--btn-padding-x);
}
```

## Validation

All components checked for:

- ✅ No hard-coded pixel margins/padding
- ✅ All spacing uses tokens or Tailwind utilities
- ✅ Component-specific spacing uses component tokens
- ✅ Consistent spacing scale throughout

## References

- **Design System Guidelines:** `docs/design-system-guidelines.md`
- **Token Files:** `src/design-system/tokens/`
- **Tailwind Guidelines:** `docs/tailwind-guidelines.md`

---

**Migration Complete** ✅
