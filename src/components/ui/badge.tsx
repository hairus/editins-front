import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "accent" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border/35 bg-muted/55 text-muted-foreground",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  accent: "border-accent/25 bg-accent/10 text-accent",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-ui border px-2.5 text-[11px] font-bold uppercase tracking-normal",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
