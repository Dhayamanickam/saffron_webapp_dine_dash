import { Link, useLocation } from "wouter";
import { Bell, Search, Info, ChevronDown, Power, Pause, Flame } from "lucide-react";
import { useStore } from "@/lib/store";
import { restaurantProfile } from "@/lib/mockData";
import { Switch } from "@/components/ui/switch";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/orders", label: "Orders" },
  { to: "/menu", label: "Menu" },
  { to: "/flash-food", label: "Flash Food" },
  { to: "/offers", label: "Offers" },
  { to: "/delivery", label: "Delivery" },
  { to: "/reports", label: "Reports" },
];

export function TopNav() {
  const [location] = useLocation();
  const { status, setStatus } = useStore();

  return (
    <header className="flex items-center gap-3 px-2" data-testid="top-nav">
      <div className="flex items-center gap-2 rounded-full bg-card border border-card-border px-2 py-1.5 shadow-sm">
        <div className="size-8 rounded-full bg-primary flex items-center justify-center">
          <Flame className="size-4 text-primary-foreground" />
        </div>
        <span className="hidden lg:inline pr-2 text-sm font-semibold tracking-tight">Saffron</span>
      </div>

      <nav className="hidden lg:flex items-center gap-1 rounded-full bg-card border border-card-border px-1.5 py-1.5 shadow-sm">
        {links.map((l) => {
          const active = l.to === "/" ? location === "/" : location.startsWith(l.to);
          return (
            <Link
              key={l.to}
              href={l.to}
              className={[
                "px-3.5 py-1.5 rounded-full text-sm transition-colors",
                active
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover-elevate active-elevate-2",
              ].join(" ")}
              data-testid={`topnav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-3 rounded-full bg-card border border-card-border px-3 py-1.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Power className={`size-3.5 ${status.open ? "text-emerald-500" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">Open</span>
            <Switch
              checked={status.open}
              onCheckedChange={(v) => setStatus({ open: v })}
              data-testid="switch-open"
            />
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Flame className={`size-3.5 ${status.busy ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">Busy</span>
            <Switch
              checked={status.busy}
              onCheckedChange={(v) => setStatus({ busy: v })}
              data-testid="switch-busy"
            />
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Pause className={`size-3.5 ${status.paused ? "text-destructive" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">Pause</span>
            <Switch
              checked={status.paused}
              onCheckedChange={(v) => setStatus({ paused: v })}
              data-testid="switch-paused"
            />
          </div>
        </div>

        <button
          className="size-10 rounded-full bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2"
          aria-label="Search"
          data-testid="button-search"
        >
          <Search className="size-4" />
        </button>
        <button
          className="relative size-10 rounded-full bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2"
          aria-label="Notifications"
          data-testid="button-notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
        </button>
        <button
          className="size-10 rounded-full bg-card border border-card-border flex items-center justify-center hover-elevate active-elevate-2"
          aria-label="Info"
          data-testid="button-info"
        >
          <Info className="size-4" />
        </button>

        <button
          className="flex items-center gap-2 rounded-full bg-card border border-card-border pl-1 pr-3 py-1 shadow-sm hover-elevate active-elevate-2"
          data-testid="button-profile"
        >
          <div className="size-8 rounded-full bg-gradient-to-br from-primary to-amber-400 text-primary-foreground flex items-center justify-center text-sm font-semibold">
            SR
          </div>
          <div className="text-left leading-tight">
            <div className="text-sm font-medium">{restaurantProfile.ownerName}</div>
            <div className="text-[11px] text-muted-foreground">{restaurantProfile.ownerEmail}</div>
          </div>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
