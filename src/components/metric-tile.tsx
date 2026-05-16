import { Panel } from "@/components/ui/panel";

export function MetricTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Panel className="p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-normal text-foreground">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{detail}</p>
    </Panel>
  );
}
