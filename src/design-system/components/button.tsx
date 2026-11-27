import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/lib/utils";

/**
 * Button component variants using design tokens
 * Follows shadcn/ui patterns with CVA for variant management
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn",  // Uses design system .btn class
        outline: "border-2 border-current bg-transparent hover:opacity-80",
        ghost: "bg-transparent hover:opacity-80",
      },
      size: {
        default: "",  // Uses design system --btn-padding-* tokens
        sm: "text-xs px-3 py-1.5",
        lg: "text-base px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Button Component
 * 
 * A flexible button component that integrates with the design system.
 * Uses design tokens for consistent styling.
 * 
 * @example
 * ```tsx
 * <Button>Click me</Button>
 * <Button variant="outline">Outline Button</Button>
 * <Button size="sm">Small Button</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
