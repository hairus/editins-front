import { Panel } from "@/components/ui/panel";

type MetricTone = "credit" | "activity" | "success" | "cost";

const toneClass: Record<MetricTone, string> = {
  credit:
    "border-emerald-400/35 bg-[linear-gradient(135deg,rgba(16,185,129,.24),rgba(20,184,166,.10)_44%,rgba(255,255,255,.04))]",
  activity:
    "border-sky-400/35 bg-[linear-gradient(135deg,rgba(56,189,248,.22),rgba(14,165,233,.08)_48%,rgba(255,255,255,.04))]",
  success:
    "border-lime-400/35 bg-[linear-gradient(135deg,rgba(132,204,22,.22),rgba(34,197,94,.08)_48%,rgba(255,255,255,.04))]",
  cost:
    "border-amber-400/35 bg-[linear-gradient(135deg,rgba(251,191,36,.24),rgba(249,115,22,.08)_48%,rgba(255,255,255,.04))]",
};

const accentClass: Record<MetricTone, string> = {
  credit: "bg-emerald-400",
  activity: "bg-sky-400",
  success: "bg-lime-400",
  cost: "bg-amber-400",
};

export function MetricTile({
  label,
  value,
  detail,
  tone = "credit",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: MetricTone;
}) {
  return (
    <Panel className={`relative overflow-hidden p-3.5 shadow-soft ${toneClass[tone]}`}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:12px_12px] text-foreground" />
      <div className="pointer-events-none absolute -right-8 top-0 h-16 w-24 rotate-12 border-l border-white/25 bg-white/10" />
      <div className={`pointer-events-none absolute left-0 top-0 h-1 w-16 ${accentClass[tone]}`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          <span className={`mt-0.5 h-2 w-7 rounded-full ${accentClass[tone]}`} />
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-normal text-foreground">{value}</p>
        <p className="mt-1 text-[11px] font-medium leading-5 text-muted-foreground">{detail}</p>
      </div>
    </Panel>
  );
}
