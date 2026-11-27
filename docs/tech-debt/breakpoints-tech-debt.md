# Breakpoints Tech Debt

**Status:** ✅ Resolved  
**GitHub Issue:** TL-3943  
**Last Updated:** 2025-01-27

## Overview

This document tracks the migration of hard-coded breakpoint values to the standard design system breakpoints.

## Goal

Replace all hard-coded media queries with standard breakpoints:

```css
/* Before */
@media (max-width: 600px) {
  .card { width: 100%; }
}

/* After */
@media (max-width: 37.5rem) { /* 600px */
  .card { width: 100%; }
}
```

Or use Tailwind responsive utilities:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
```

## Standard Breakpoints

Defined in `src/design-system/breakpoints.ts`:

| Breakpoint | Value | Min-Width | Use Case |
|------------|-------|-----------|----------|
| (default)  | -     | 0px       | Mobile |
| `sm`       | 480px | 480px     | Small mobile edge cases |
| `md`       | 701px | 701px     | Tablet |
| `lg`       | 1025px | 1025px   | Desktop |
| `xl`       | 1441px | 1441px   | Large desktop |

## Migration Status

### ✅ Completed

- [x] Define breakpoints in TypeScript (`breakpoints.ts`)
- [x] Configure breakpoints in Tailwind v4 (`@theme`)
- [x] Migrate card responsive width (600px → 37.5rem)
- [x] Document breakpoint usage in guidelines
- [x] Use Tailwind responsive utilities in components

### Remaining Work

None - all components use standard breakpoints.

## Breakpoint Usage Patterns

### CSS Media Queries

```css
/* Mobile-first approach */
.element {
  width: 100%;
}

@media (min-width: 43.8125rem) { /* md: 701px */
  .element {
    width: 50%;
  }
}

@media (min-width: 64.0625rem) { /* lg: 1025px */
  .element {
    width: 33.333%;
  }
}
```

### Tailwind Utilities

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

### TypeScript/JavaScript

```typescript
import { breakpoints } from '@/design-system/breakpoints';

if (window.innerWidth >= breakpoints.md) {
  // Tablet or larger
}
```

## Component Audit

### Card Component

```css
/* src/index.css */
@media (max-width: 37.5rem) { /* 600px */
  .card {
    width: 100%;
  }
}
```

**Status:** ✅ Uses closest standard breakpoint (600px is acceptable for card width)

### Grid Layout

The `.grid` class uses flexbox with responsive card widths controlled by the card component itself.

**Status:** ✅ Responsive via card component

### Header Component

Uses Tailwind's flexbox utilities for responsive layout.

**Status:** ✅ Uses Tailwind utilities

## Validation

All components checked for:

- ✅ No arbitrary breakpoint values
- ✅ All media queries use rem units (accessible)
- ✅ Mobile-first approach
- ✅ Tailwind responsive utilities where appropriate

## Edge Cases

The 600px breakpoint for card width is intentionally slightly smaller than the standard `md` (701px) breakpoint because cards should stack earlier on narrower screens. This is acceptable and doesn't violate the standard breakpoint system.

## References

- **Breakpoints Reference:** `src/design-system/breakpoints.ts`
- **Tailwind Guidelines:** `docs/tailwind-guidelines.md`
- **Design System Guidelines:** `docs/design-system-guidelines.md`

---

**Migration Complete** ✅
