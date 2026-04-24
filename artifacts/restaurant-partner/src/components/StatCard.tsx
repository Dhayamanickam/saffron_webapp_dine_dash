import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  delta?: { value: string; positive: boolean; suffix?: string };
  icon?: LucideIcon;
  variant?: "default" | "primary";
  testId?: string;
};

export function StatCard({ label, value, delta, icon: Icon, variant = "default", testId }: Props) {
  const isPrimary = variant === "primary";
  return (
    <div
      className={[
        "rounded-2xl p-5 border shadow-sm flex flex-col gap-3 min-h-[148px] justify-between",
        isPrimary
          ? "bg-primary text-primary-foreground border-primary/0"
          : "bg-card text-card-foreground border-card-border",
      ].join(" ")}
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isPrimary ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
          {label}
        </span>
        {Icon ? (
          <span
            className={[
              "size-8 rounded-full flex items-center justify-center",
              isPrimary ? "bg-white/15 text-primary-foreground" : "bg-secondary text-foreground/70",
            ].join(" ")}
          >
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <div>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {delta ? (
          <div
            className={[
              "mt-1.5 inline-flex items-center gap-1 text-xs",
              delta.positive
                ? isPrimary
                  ? "text-white"
                  : "text-emerald-600"
                : isPrimary
                  ? "text-white/90"
                  : "text-destructive",
            ].join(" ")}
          >
            {delta.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            <span className="font-medium">{delta.value}</span>
            <span className={isPrimary ? "text-white/80" : "text-muted-foreground"}>
              {delta.suffix ?? "this month"}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
