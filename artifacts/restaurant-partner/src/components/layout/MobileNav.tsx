import { Link, useLocation } from "wouter";
import {
  LayoutGrid,
  ClipboardList,
  Utensils,
  Bike,
  MoreHorizontal,
  Zap,
  Tag,
  BarChart3,
  LifeBuoy,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Power,
  Pause,
  Flame,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";

type NavItem = { to: string; icon: React.ComponentType<{ className?: string }>; label: string };

const primary: NavItem[] = [
  { to: "/", icon: LayoutGrid, label: "Home" },
  { to: "/orders", icon: ClipboardList, label: "Orders" },
  { to: "/menu", icon: Utensils, label: "Menu" },
  { to: "/delivery", icon: Bike, label: "Delivery" },
];

const moreItems: NavItem[] = [
  { to: "/flash-food", icon: Zap, label: "Flash Food" },
  { to: "/offers", icon: Tag, label: "Offers" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/support", icon: LifeBuoy, label: "Support" },
  { to: "/settings", icon: SettingsIcon, label: "Settings" },
];

export function MobileNav() {
  const [location] = useLocation();
  const { status, setStatus } = useStore();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const moreActive = moreItems.some((m) => location.startsWith(m.to));

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-card-border pb-[env(safe-area-inset-bottom)]"
      data-testid="mobile-nav"
    >
      <div className="flex items-stretch justify-around px-1 pt-1 pb-1">
        {primary.map((it) => {
          const Icon = it.icon;
          const active = it.to === "/" ? location === "/" : location.startsWith(it.to);
          return (
            <Link
              key={it.to}
              href={it.to}
              className={[
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-colors",
                active ? "text-primary" : "text-muted-foreground hover-elevate active-elevate-2",
              ].join(" ")}
              data-testid={`mobile-nav-${it.label.toLowerCase()}`}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{it.label}</span>
            </Link>
          );
        })}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={[
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-colors",
                moreActive ? "text-primary" : "text-muted-foreground hover-elevate active-elevate-2",
              ].join(" ")}
              data-testid="mobile-nav-more"
            >
              <MoreHorizontal className="size-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:max-w-sm p-0 flex flex-col">
            <SheetHeader className="px-5 pt-5 pb-3 border-b border-card-border">
              <SheetTitle className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                  <Flame className="size-4 text-primary-foreground" />
                </div>
                Saffron & Smoke
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              <section>
                <p className="px-2 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground">More pages</p>
                <div className="grid grid-cols-1 gap-1">
                  {moreItems.map((it) => {
                    const Icon = it.icon;
                    const active = location.startsWith(it.to);
                    return (
                      <Link
                        key={it.to}
                        href={it.to}
                        onClick={() => setOpen(false)}
                        className={[
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                          active
                            ? "bg-foreground text-background"
                            : "text-foreground hover-elevate active-elevate-2",
                        ].join(" ")}
                        data-testid={`mobile-more-${it.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Icon className="size-4" />
                        {it.label}
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className="px-2 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Restaurant status</p>
                <div className="rounded-xl border border-card-border bg-card divide-y divide-card-border">
                  <Row icon={<Power className="size-4 text-emerald-500" />} label="Open">
                    <Switch
                      checked={status.open}
                      onCheckedChange={(v) => setStatus({ open: v })}
                      data-testid="mobile-switch-open"
                    />
                  </Row>
                  <Row icon={<Flame className="size-4 text-primary" />} label="Busy mode">
                    <Switch
                      checked={status.busy}
                      onCheckedChange={(v) => setStatus({ busy: v })}
                      data-testid="mobile-switch-busy"
                    />
                  </Row>
                  <Row icon={<Pause className="size-4 text-destructive" />} label="Pause new orders">
                    <Switch
                      checked={status.paused}
                      onCheckedChange={(v) => setStatus({ paused: v })}
                      data-testid="mobile-switch-paused"
                    />
                  </Row>
                </div>
              </section>

              <section>
                <p className="px-2 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Preferences</p>
                <div className="rounded-xl border border-card-border bg-card divide-y divide-card-border">
                  <Row icon={dark ? <Moon className="size-4" /> : <Sun className="size-4" />} label="Dark mode">
                    <Switch checked={dark} onCheckedChange={setDark} data-testid="mobile-switch-dark" />
                  </Row>
                </div>
              </section>

              <section className="space-y-1">
                <button
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover-elevate active-elevate-2"
                  data-testid="mobile-help"
                >
                  <HelpCircle className="size-4" />
                  Help center
                </button>
                <button
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover-elevate active-elevate-2"
                  data-testid="mobile-signout"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </section>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2.5">
      <div className="flex items-center gap-2.5 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}
