import { Link, useLocation } from "wouter";
import {
  LayoutGrid,
  ClipboardList,
  Utensils,
  Zap,
  Tag,
  Bike,
  BarChart3,
  LifeBuoy,
  Settings,
  Sun,
  Moon,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = { to: string; icon: React.ComponentType<{ className?: string }>; label: string };

const items: NavItem[] = [
  { to: "/", icon: LayoutGrid, label: "Dashboard" },
  { to: "/orders", icon: ClipboardList, label: "Orders" },
  { to: "/menu", icon: Utensils, label: "Menu" },
  { to: "/flash-food", icon: Zap, label: "Flash Food" },
  { to: "/offers", icon: Tag, label: "Offers" },
  { to: "/delivery", icon: Bike, label: "Delivery" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/support", icon: LifeBuoy, label: "Support" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <aside
      className="hidden md:flex w-16 shrink-0 flex-col items-center gap-3 py-4"
      data-testid="sidebar"
    >
      <div className="flex flex-col items-center gap-2">
        <button
          className="size-9 rounded-full bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2"
          onClick={() => setDark((v) => !v)}
          aria-label="Toggle theme"
          data-testid="button-theme-toggle"
        >
          {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>
      </div>

      <div className="my-2 h-px w-8 bg-border" />

      <nav className="flex flex-col items-center gap-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.to === "/" ? location === "/" : location.startsWith(it.to);
          return (
            <Link
              key={it.to}
              href={it.to}
              className={[
                "size-10 rounded-full flex items-center justify-center transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "bg-card border border-card-border text-muted-foreground hover-elevate active-elevate-2",
              ].join(" ")}
              data-testid={`nav-${it.label.toLowerCase().replace(/\s+/g, "-")}`}
              title={it.label}
            >
              <Icon className="size-4" />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-2">
        <button
          className="size-9 rounded-full bg-card border border-card-border flex items-center justify-center text-muted-foreground hover-elevate active-elevate-2"
          aria-label="Help"
          data-testid="button-help"
        >
          <HelpCircle className="size-4" />
        </button>
        <button
          className="size-9 rounded-full bg-card border border-card-border flex items-center justify-center text-muted-foreground hover-elevate active-elevate-2"
          aria-label="Sign out"
          data-testid="button-signout"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  );
}
