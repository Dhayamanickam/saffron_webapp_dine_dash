import type { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
};

export function SectionPanel({ title, subtitle, actions, children, className = "", noPadding }: Props) {
  return (
    <section className={`rounded-2xl bg-card border border-card-border shadow-sm ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-5 pt-5">
          <div>
            {title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </section>
  );
}
