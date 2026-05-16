import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-ui text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary)/.92)_0%,hsl(var(--primary)/.82)_48%,hsl(var(--accent)/.62)_100%)] text-primary-foreground shadow-[0_12px_24px_-20px_hsl(var(--primary))] hover:brightness-[1.04]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/82",
        outline: "border border-border/55 bg-background/25 hover:bg-muted/55",
        ghost: "hover:bg-muted/55",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "min-h-8 px-3",
        md: "px-4 py-2",
        lg: "min-h-11 px-5",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
