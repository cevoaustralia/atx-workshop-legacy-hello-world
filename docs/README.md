# Design System

A modern, token-based design system built with Tailwind v4 and shadcn/ui patterns.

## Overview

This design system provides:

- **Three-layer token hierarchy** (primitive → semantic → component)
- **Tailwind v4** CSS configuration (without base layer)
- **shadcn/ui style components** with manual installation
- **Mobile-first responsive design** with standard breakpoints
- **Typography system** with semantic classes
- **Full TypeScript support**

## Quick Start

### Using Design Tokens

```tsx
// ✅ Use semantic or component tokens
<button style={{ background: 'var(--btn-primary-bg)' }}>

// ❌ Don't use primitives or raw values
<button style={{ background: '#ff6600' }}>
```

### Using Components

```tsx
import { Button, Card } from '@/design-system/components';

<Button>Click me</Button>
<Button variant="outline">Outline</Button>

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Using Tailwind Utilities

```tsx
<div className="flex items-center gap-4 p-6 md:p-8">
  Responsive spacing
</div>
```

## Documentation

### Core Guides

- **[Design System Guidelines](./design-system-guidelines.md)** - Complete design system documentation
- **[Tailwind Guidelines](./tailwind-guidelines.md)** - Tailwind v4 usage and configuration
- **[Visual Regression](./visual-regression-docker.md)** - Visual testing approach (planned)

### Tech Debt Tracking

- **[Color Palette Tech Debt](./tech-debt/colour-palette-tech-debt.md)** - ✅ Resolved
- **[Breakpoints Tech Debt](./tech-debt/breakpoints-tech-debt.md)** - ✅ Resolved
- **[Margin Props Tech Debt](./tech-debt/margin-props-tech-debt.md)** - ✅ Resolved
- **[Hover/Focus States Tech Debt](./tech-debt/active-fill-hover-tech-debt.md)** - ✅ Resolved

## Architecture

### Token Hierarchy

```
Primitive Tokens (src/design-system/tokens/primitive.css)
    ↓
Semantic Tokens (src/design-system/tokens/semantic.css)
    ↓
Component Tokens (src/design-system/tokens/component.css)
    ↓
App Overrides (src/app/styles/tokens/overrides.css)
```

### File Structure

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── primitive.css      # Raw values
│   │   ├── semantic.css       # Purpose-driven tokens
│   │   └── component.css      # Component-specific tokens
│   ├── components/
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── index.ts           # Component exports
│   │   └── README.md          # Component documentation
│   ├── lib/
│   │   └── utils.ts           # cn() utility
│   └── breakpoints.ts         # Breakpoint definitions
├── app/
│   └── styles/
│       └── tokens/
│           └── overrides.css  # Project-specific overrides
└── index.css                   # Main stylesheet with Tailwind v4
```

## Token System

### Primitive Tokens

Raw values - **never reference directly in app code**:

```css
--color-primitive-orange-500: #ff6600;
--primitive-spacing-4: 1rem;
```

### Semantic Tokens

Purpose-driven - **use these in app code**:

```css
--color-brand-primary: var(--color-primitive-orange-500);
--spacing-md: var(--primitive-spacing-4);
```

### Component Tokens

Component-specific - **use for component styling**:

```css
--btn-primary-bg: var(--color-brand-primary);
--card-padding: var(--spacing-md);
```

## Breakpoints

Mobile-first responsive design:

| Breakpoint | Value | Use Case |
|------------|-------|----------|
| (default)  | 0px   | Mobile |
| `sm`       | 480px | Small mobile edge cases |
| `md`       | 701px | Tablet |
| `lg`       | 1025px | Desktop |
| `xl`       | 1441px | Large desktop |

**Usage:**

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
```

## Typography

Semantic typography classes:

```tsx
<div className="text-caption">Small label text</div>
<p className="text-body">Body copy</p>
<h1 className="text-heading">Heading</h1>
```

## Components

### Button

```tsx
import { Button } from '@/design-system/components';

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/design-system/components';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Best Practices

### ✅ DO

- Use semantic or component tokens for colors
- Use design tokens for spacing
- Use Tailwind utilities for layout
- Use typography classes for text
- Use mobile-first responsive design
- Extract repeated patterns to components

### ❌ DON'T

- Reference primitive tokens in app code
- Use arbitrary values (`bg-[#ff6600]`, `p-[23px]`)
- Use inline styles for colors or spacing
- Use hard-coded pixel values
- Add Tailwind base layer

## Adding New Tokens

1. **Add primitive token** (if needed):
   ```css
   /* src/design-system/tokens/primitive.css */
   --color-primitive-blue-500: #0066ff;
   ```

2. **Add semantic token**:
   ```css
   /* src/design-system/tokens/semantic.css */
   --color-brand-secondary: var(--color-primitive-blue-500);
   ```

3. **Add component token** (if needed):
   ```css
   /* src/design-system/tokens/component.css */
   --btn-secondary-bg: var(--color-brand-secondary);
   ```

4. **Use in components**:
   ```tsx
   <button style={{ background: 'var(--btn-secondary-bg)' }}>
   ```

## Project Overrides

For project-specific customizations, use the override file:

```css
/* src/app/styles/tokens/overrides.css */
:root {
  --color-brand-primary: #custom-color;
}
```

This overrides ATOM base tokens without modifying the design system.

## Utilities

### cn() - Class Name Merger

Intelligently merges Tailwind classes:

```tsx
import { cn } from '@/design-system/lib/utils';

<div className={cn(
  "base-class",
  condition && "conditional-class",
  className  // Prop-based override
)} />
```

## Validation

Before committing:

- [ ] No primitive tokens in app code
- [ ] No arbitrary values in Tailwind classes
- [ ] No hard-coded colors or spacing
- [ ] Typography uses semantic classes
- [ ] Responsive design uses standard breakpoints
- [ ] Build passes: `npm run build`

## Resources

- **[Design System Guidelines](./design-system-guidelines.md)** - Full documentation
- **[Tailwind Guidelines](./tailwind-guidelines.md)** - Tailwind v4 patterns
- **[Component README](../src/design-system/components/README.md)** - Component docs
- **Tailwind v4 Docs:** https://tailwindcss.com/docs
- **shadcn/ui Docs:** https://ui.shadcn.com

---

## Status

✅ **Complete** - Design system fully implemented with:
- Three-layer token architecture
- Tailwind v4 integration
- shadcn/ui foundation components
- Comprehensive documentation
- Zero tech debt

---

Built with ❤️ using modern web standards and accessibility best practices.
