import { Badge } from "@/components/ui/badge";

export function ProductVisual() {
  return (
    <div className="relative overflow-hidden rounded-ui border border-border bg-card p-4 shadow-panel">
      <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-ui border border-border bg-muted/70 p-3">
          <div className="mb-3 flex items-center justify-between">
            <Badge>Before</Badge>
            <span className="text-xs font-bold text-muted-foreground">HP photo</span>
          </div>
          <div className="grid aspect-[4/5] place-items-center rounded-ui bg-background/45">
            <div className="h-32 w-24 rotate-[-4deg] rounded-[22px] border border-foreground/10 bg-muted shadow-soft" />
          </div>
        </div>
        <div className="rounded-ui border border-border bg-muted/40 p-3">
          <div className="mb-3 flex items-center justify-between">
            <Badge tone="success">After</Badge>
            <span className="text-xs font-bold text-muted-foreground">AI studio</span>
          </div>
          <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-ui bg-[linear-gradient(160deg,hsl(var(--background))_0%,hsl(var(--muted))_100%)]">
            <div className="absolute bottom-10 h-8 w-40 rounded-[50%] bg-foreground/18 blur-md" />
            <div className="relative h-36 w-28 rounded-[26px] border border-foreground/20 bg-foreground/18 shadow-[0_32px_60px_-30px_hsl(var(--primary)/.72)]">
              <div className="absolute left-5 top-6 h-16 w-10 rounded-full bg-white/18 blur-sm" />
              <div className="absolute bottom-5 left-1/2 h-5 w-12 -translate-x-1/2 rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
