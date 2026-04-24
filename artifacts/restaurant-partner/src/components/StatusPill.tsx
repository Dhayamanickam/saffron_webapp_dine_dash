import type { OrderStatus } from "@/lib/mockData";

const map: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  new: { label: "New", dot: "bg-primary", text: "text-primary", bg: "bg-primary/10" },
  preparing: { label: "Preparing", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-500/10" },
  ready: { label: "Ready", dot: "bg-sky-500", text: "text-sky-600", bg: "bg-sky-500/10" },
  picked: { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10" },
  rejected: { label: "Rejected", dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10" },
  open: { label: "Open", dot: "bg-primary", text: "text-primary", bg: "bg-primary/10" },
  in_progress: { label: "In Progress", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-500/10" },
  resolved: { label: "Resolved", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10" },
  active: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10" },
  inactive: { label: "Inactive", dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted" },
  pending: { label: "Pending", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-500/10" },
};

export function StatusPill({ status, label }: { status: OrderStatus | string; label?: string }) {
  const m = map[status] ?? map.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${m.bg} ${m.text}`}>
      <span className={`size-1.5 rounded-full ${m.dot}`} />
      {label ?? m.label}
    </span>
  );
}
