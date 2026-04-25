import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { StatStrip } from "@/components/StatStrip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Clock,
  PackageCheck,
  Truck,
  Phone,
  MapPin,
  Search,
  AlertTriangle,
  Inbox,
  Bike,
  ShoppingBag,
  Flame,
  Wallet,
  Download,
} from "lucide-react";
import { minutesAgoLabel, usd } from "@/lib/format";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "active", label: "Active" },
  { id: "new", label: "New" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function Orders() {
  const { orders, acceptOrder, rejectOrder, advanceOrder, setOrderPrep, reportDelay } = useStore();
  const [tab, setTab] = useState<Tab>("active");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (tab === "active") {
        if (!["new", "preparing", "ready"].includes(o.status)) return false;
      } else if (tab === "completed") {
        if (o.status !== "picked") return false;
      } else if (o.status !== tab) return false;

      if (q && !`${o.id} ${o.customerName}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [orders, tab, q]);

  const newCount = orders.filter((o) => o.status === "new").length;
  const prepCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const todayRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Orders"
        description="Live queue — accept new orders, monitor prep, and hand off to couriers without losing context."
        actions={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="rounded-full" data-testid="button-export-orders">
                  <Download className="size-4 mr-1" /> Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export today's queue (CSV)</TooltipContent>
            </Tooltip>
          </>
        }
      />

      <StatStrip
        items={[
          { label: "New", value: String(newCount), icon: Inbox, hint: "Awaiting accept" },
          { label: "Preparing", value: String(prepCount), icon: Flame, hint: "In the kitchen" },
          { label: "Ready", value: String(readyCount), icon: PackageCheck, hint: "For courier pickup" },
          { label: "Revenue today", value: usd(todayRevenue), icon: Wallet, accent: true },
        ]}
      />

      <SectionPanel
        title="Queue"
        subtitle="Switch tabs to filter the queue."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search orders"
                className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-44"
                data-testid="input-search-orders"
              />
            </div>
          </div>
        }
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="bg-secondary rounded-full p-1">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-foreground data-[state=active]:text-background"
                data-testid={`tab-${t.id}`}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </SectionPanel>

      {filtered.length === 0 ? (
        <SectionPanel>
          <EmptyState
            icon={Inbox}
            title="No orders here"
            description="When new orders land in this bucket, they'll appear here."
          />
        </SectionPanel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((o) => (
              <motion.div
                key={o.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={[
                    "rounded-2xl bg-card border shadow-sm p-5 flex flex-col gap-4 relative overflow-hidden",
                    o.isUrgent && o.status !== "picked" ? "border-primary/40 ring-1 ring-primary/30" : "border-card-border",
                  ].join(" ")}
                  data-testid={`order-card-${o.id}`}
                >
                  {o.isUrgent && o.status !== "picked" && (
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5">
                      <AlertTriangle className="size-3" /> Urgent
                    </div>
                  )}

                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-muted-foreground">{o.channel} · {minutesAgoLabel(o.placedAt)}</div>
                      <div className="text-base font-semibold mt-0.5">{o.id}</div>
                    </div>
                    <StatusPill status={o.status} />
                  </header>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="size-9 rounded-full bg-secondary flex items-center justify-center font-medium">
                      {o.customerName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{o.customerName}</div>
                      <div className="text-xs text-muted-foreground inline-flex items-center gap-3">
                        <span className="inline-flex items-center gap-1"><Phone className="size-3" /> {o.customerPhone}</span>
                        <span className="inline-flex items-center gap-1 truncate"><MapPin className="size-3" /> {o.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-secondary p-3 space-y-2">
                    {o.items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground mr-2">{it.qty}×</span>
                          <span className="font-medium">{it.name}</span>
                          {it.notes && <span className="ml-2 text-xs text-muted-foreground">— {it.notes}</span>}
                        </div>
                        <span className="tabular-nums text-muted-foreground">{usd(it.price * it.qty)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-card-border">
                      <span className="text-xs text-muted-foreground">Total</span>
                      <span className="font-semibold tabular-nums">{usd(o.total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-sm">Prep</span>
                      <Input
                        type="number"
                        value={o.prepMinutes}
                        onChange={(e) => setOrderPrep(o.id, Number(e.target.value))}
                        className="w-16 h-8"
                        data-testid={`input-prep-${o.id}`}
                      />
                      <span className="text-sm text-muted-foreground">min</span>
                    </div>
                    {o.partnerId && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Bike className="size-3.5" />
                        Partner assigned
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {o.status === "new" && (
                      <>
                        <Button
                          className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
                          onClick={() => {
                            acceptOrder(o.id);
                            toast.success(`Accepted ${o.id}`);
                          }}
                          data-testid={`button-accept-${o.id}`}
                        >
                          <Check className="size-4 mr-1" /> Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            rejectOrder(o.id);
                            toast.error(`Rejected ${o.id}`);
                          }}
                          data-testid={`button-reject-${o.id}`}
                        >
                          <X className="size-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {o.status === "preparing" && (
                      <Button
                        className="rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                        onClick={() => {
                          advanceOrder(o.id);
                          toast.success(`${o.id} marked Ready`);
                        }}
                        data-testid={`button-mark-ready-${o.id}`}
                      >
                        <PackageCheck className="size-4 mr-1" /> Mark Ready
                      </Button>
                    )}
                    {o.status === "ready" && (
                      <Button
                        className="rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                        onClick={() => {
                          advanceOrder(o.id);
                          toast.success(`${o.id} handed to courier`);
                        }}
                        data-testid={`button-handoff-${o.id}`}
                      >
                        <Truck className="size-4 mr-1" /> Hand off
                      </Button>
                    )}
                    {o.status !== "picked" && o.status !== "rejected" && (
                      <Button
                        variant="ghost"
                        className="rounded-full text-muted-foreground"
                        onClick={() => {
                          reportDelay(o.id, 10);
                          toast.message(`+10 min added to ${o.id}`);
                        }}
                        data-testid={`button-delay-${o.id}`}
                      >
                        Report delay +10
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
