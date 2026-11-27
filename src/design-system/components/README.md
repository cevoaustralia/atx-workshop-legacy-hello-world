# Design System Components

This directory contains shadcn/ui style components that integrate with our design token system.

## Installation Pattern

Components are **manually installed** (not via shadcn CLI) for better control and integration with our token architecture.

### Why Manual Installation?

1. **Token Integration** - Components use our design tokens directly
2. **Dependency Management** - Dependencies managed via package.json
3. **Customization** - Full control over component implementation
4. **No CLI Magic** - Transparent, understandable code

## Component Aliases

```typescript
import { Button } from "@/design-system/components";
import { cn } from "@/design-system/lib/utils";
```

Path mappings are configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["src/*"]
  }
}
```

## Available Components

### Button

Flexible button component with variants and sizes.

```tsx
import { Button } from "@/design-system/components";

<Button>Default Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>
```

**Variants:**
- `default` - Uses design system `.btn` class and tokens
- `outline` - Transparent with border
- `ghost` - Fully transparent

**Sizes:**
- `default` - Uses design system `--btn-padding-*` tokens
- `sm` - Small button
- `lg` - Large button

### Card

Container component with composition pattern.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/design-system/components";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Features:**
- Uses design system `.card` class and tokens
- Composition-based API (Header, Content, Footer)
- Typography classes (`.text-heading`, `.text-body`)

## Utilities

### cn() - Class Name Merger

Combines and deduplicates Tailwind classes with proper precedence.

```tsx
import { cn } from "@/design-system/lib/utils";

<div className={cn(
  "base-class",
  condition && "conditional-class",
  className  // Prop-based override
)} />
```

**How it works:**
1. `clsx` - Conditionally constructs className strings
2. `tailwind-merge` - Intelligently merges Tailwind classes

## Adding New Components

### Step 1: Install Dependencies

Add to `package.json`:

```bash
npm install <required-packages>
```

For example, components often need:
- `@radix-ui/react-*` - Unstyled accessible components
- `class-variance-authority` - Variant management

### Step 2: Create Component File

Create in `src/design-system/components/<component-name>.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/design-system/lib/utils";

const MyComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("my-component", className)}
    {...props}
  />
));
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

### Step 3: Add Component Tokens

Add tokens to `src/design-system/tokens/component.css`:

```css
:root {
  --my-component-bg: var(--color-surface-card);
  --my-component-border: var(--color-border-default);
  /* ... */
}
```

### Step 4: Add Component Styles

Add styles to `src/index.css`:

```css
.my-component {
  background: var(--my-component-bg);
  border: 1px solid var(--my-component-border);
  /* ... */
}
```

### Step 5: Export from Index

Add to `src/design-system/components/index.ts`:

```typescript
export { MyComponent } from "./my-component";
```

## Design Token Integration

All components use design tokens for consistency:

```tsx
// ❌ DON'T: Hard-coded values
<button style={{ background: '#ff6600', padding: '8px 14px' }}>

// ✅ DO: Design tokens via CSS classes
<button className="btn">

// ✅ DO: Design tokens via inline styles
<button style={{ 
  background: 'var(--btn-primary-bg)', 
  padding: 'var(--btn-padding-y) var(--btn-padding-x)' 
}}>
```

## TypeScript Support

All components are fully typed:

```tsx
import type { ButtonProps } from "@/design-system/components";

// Custom button with additional props
interface MyButtonProps extends ButtonProps {
  customProp?: string;
}

const MyButton: React.FC<MyButtonProps> = ({ customProp, ...props }) => (
  <Button {...props} />
);
```

## Styling Approaches

### 1. CSS Classes (Recommended for Simple Components)

```tsx
const Alert = ({ children }: { children: React.ReactNode }) => (
  <div className="alert">{children}</div>
);
```

### 2. Tailwind Utilities (For Layout/Spacing)

```tsx
const Alert = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 p-4 rounded-md bg-white">
    {children}
  </div>
);
```

### 3. CVA for Variants (For Multiple Variants)

```tsx
import { cva } from "class-variance-authority";

const alertVariants = cva("alert", {
  variants: {
    variant: {
      info: "alert-info",
      warning: "alert-warning",
      error: "alert-error",
    },
  },
});
```

### 4. Emotion Styled (For Dynamic Styles)

```tsx
import styled from '@emotion/styled';

const Alert = styled.div`
  background: var(--alert-bg);
  /* ... */
`;
```

## Best Practices

1. **Use forwardRef** - Allow ref forwarding for all components
2. **Set displayName** - Helps with debugging
3. **Use cn() utility** - Merge className props properly
4. **Follow composition pattern** - Break complex components into sub-components
5. **Use design tokens** - Never hard-code colors or spacing
6. **Type everything** - Full TypeScript support
7. **Document props** - Add JSDoc comments

## Resources

- **shadcn/ui Docs:** https://ui.shadcn.com
- **Radix UI Docs:** https://www.radix-ui.com
- **CVA Docs:** https://cva.style/docs
- **Design System Guidelines:** `docs/design-system-guidelines.md`
- **Tailwind Guidelines:** `docs/tailwind-guidelines.md`

## Questions?

For component-related questions:

1. Check this README
2. See `docs/design-system-guidelines.md`
3. Review existing component implementations
4. Check shadcn/ui documentation for patterns
