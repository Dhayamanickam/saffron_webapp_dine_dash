import type { LucideIcon } from "lucide-react";

export type StripItem = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  accent?: boolean;
};

export function StatStrip({ items }: { items: StripItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className={[
              "rounded-2xl border shadow-sm p-4 flex items-start gap-3 min-h-[88px]",
              it.accent
                ? "bg-primary text-primary-foreground border-primary/0"
                : "bg-card text-card-foreground border-card-border",
            ].join(" ")}
            data-testid={`stat-${it.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {Icon && (
              <span
                className={[
                  "size-9 rounded-full flex items-center justify-center shrink-0",
                  it.accent ? "bg-white/15" : "bg-secondary text-foreground/70",
                ].join(" ")}
              >
                <Icon className="size-4" />
              </span>
            )}
            <div className="min-w-0">
              <div className={`text-[11px] ${it.accent ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                {it.label}
              </div>
              <div className="mt-0.5 text-xl font-semibold tabular-nums truncate">{it.value}</div>
              {it.hint && (
                <div className={`text-[11px] mt-0.5 ${it.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {it.hint}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
