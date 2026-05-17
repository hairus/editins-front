import { Loader2 } from "lucide-react";

import { Panel } from "@/components/ui/panel";

export function AdminPageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export function AdminLoadingState({ label = "Memuat data admin..." }: { label?: string }) {
  return (
    <Panel className="grid min-h-44 place-items-center p-6">
      <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
    </Panel>
  );
}

export function AdminEmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <Panel className="p-6 text-center">
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">{detail}</p>
    </Panel>
  );
}

export function AdminErrorState({ message }: { message: string }) {
  return <div className="rounded-ui border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{message}</div>;
}
