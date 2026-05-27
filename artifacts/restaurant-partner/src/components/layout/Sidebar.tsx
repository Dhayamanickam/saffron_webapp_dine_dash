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
  Flame,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";

type NavItem = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

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
  const { logout } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <aside
      className="hidden md:flex w-16 shrink-0 flex-col items-center gap-3 py-4 sticky top-0 h-screen"
      data-testid="sidebar"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Flame className="size-5 text-primary-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">Saffron & Smoke</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="size-9 rounded-full bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2"
            onClick={() => setDark((v) => !v)}
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Toggle theme</TooltipContent>
      </Tooltip>

      <div className="my-1 h-px w-8 bg-border" />

      <nav className="flex flex-col items-center gap-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active =
            it.to === "/" ? location === "/" : location.startsWith(it.to);
          return (
            <Tooltip key={it.to}>
              <TooltipTrigger asChild>
                <Link
                  href={it.to}
                  className={[
                    "size-10 rounded-full flex items-center justify-center transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "bg-card border border-card-border text-muted-foreground hover-elevate active-elevate-2",
                  ].join(" ")}
                  data-testid={`nav-${it.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{it.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="size-9 rounded-full bg-card border border-card-border flex items-center justify-center text-muted-foreground hover-elevate active-elevate-2"
              aria-label="Help"
              data-testid="button-help"
            >
              <HelpCircle className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Help center</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={()=>{
                logout()
              }}
              className="size-9 rounded-full bg-card border border-card-border flex items-center justify-center text-muted-foreground hover-elevate active-elevate-2"
              aria-label="Sign out"
              data-testid="button-signout"
            >
              <LogOut className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Sign out</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
