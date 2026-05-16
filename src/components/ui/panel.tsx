import * as React from "react";

import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-ui border border-border/35 bg-card/92 text-card-foreground shadow-panel backdrop-blur", className)}
      {...props}
    />
  );
}
