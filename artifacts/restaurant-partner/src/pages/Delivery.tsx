import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { StatStrip } from "@/components/StatStrip";
import { Button } from "@/components/ui/button";
import {
  Bike,
  MapPin,
  Phone,
  PackageCheck,
  Truck,
  Users,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { minutesAgoLabel, usd } from "@/lib/format";

export default function Delivery() {
  const { orders, advanceOrder, assignPartner, reportDelay, deliveryPartners } =
    useStore();
  const inFlight = orders.filter(
    (o) => o.status === "Preparing" || o.status === "Ready",
  );
  const readyToDispatch = orders.filter((o) => o.status === "Ready").length;
  const availableCouriers = deliveryPartners.filter(
    (p) => p.status === "Free",
  ).length;
  const onRun = deliveryPartners.filter((p) => p.status === "On Run").length;
  const avgDispatch =
    inFlight.length === 0
      ? "—"
      : `${Math.round(inFlight.reduce((s, o) => s + o.prepTime, 0) / inFlight.length)} min`;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Delivery"
        description="Coordinate hand-offs to your courier roster, track in-flight orders, and flag delays before customers notice."
      />

      <StatStrip
        items={[
          {
            label: "In flight",
            value: String(inFlight.length),
            icon: Truck,
            hint: `${readyToDispatch} ready`,
          },
          {
            label: "Available couriers",
            value: String(availableCouriers),
            icon: Users,
            hint: `${onRun} on a run`,
          },
          { label: "Avg dispatch", value: avgDispatch, icon: Timer },
          {
            label: "Total today",
            value: String(orders.length),
            icon: PackageCheck,
            accent: true,
          },
        ]}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8 space-y-4">
          <SectionPanel
            title="Delivery coordination"
            subtitle="Hand off ready orders to your courier partners."
          >
            {inFlight.length === 0 ? (
              <EmptyState
                icon={PackageCheck}
                title="Nothing to dispatch"
                description="Active orders will appear here."
              />
            ) : (
              <div className="space-y-3">
                {inFlight.map((o) => {
                  const partner = deliveryPartners.find(
                    (p) => p.courierId === o.courierId,
                  );
                  return (
                    <article
                      key={o.orderId}
                      className="rounded-xl border border-card-border bg-background p-4 space-y-4 transition-shadow hover:shadow-sm"
                      data-testid={`delivery-row-${o.orderId}`}
                    >
                      <header className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-medium shrink-0">
                            {o.userDetails.name
                              .split(" ")
                              .map((s) => s[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold tracking-tight">
                                {o.orderId}
                              </span>
                              <StatusPill status={o.status} />
                            </div>
                            <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="size-3 shrink-0" />
                              <span className="truncate">{o.userDetails.address}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] text-muted-foreground">
                            {minutesAgoLabel(o.orderTime.toString())}
                          </div>
                          <div className="font-semibold tabular-nums">
                            {usd(o.total)}
                          </div>
                        </div>
                      </header>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            Courier
                          </label>
                          <select
                            value={o.courierId ?? ""}
                            onChange={(e) => {
                              assignPartner(o.orderId, e.target.value);
                              toast.success("Courier assigned");
                            }}
                            className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
                            data-testid={`select-partner-${o.orderId}`}
                          >
                            <option value="">— Unassigned —</option>
                            {deliveryPartners.map((p) => (
                              <option key={p.courierId} value={p.courierId}>
                                {p.name} · ★ {p.rating.toFixed(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            Contact
                          </label>
                          <div className="h-9 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            {partner ? (
                              <>
                                <Phone className="size-3.5" />
                                <span className="tabular-nums">
                                  {partner.mobile}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs italic">
                                Assign a courier to see contact
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-card-border/60">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-muted-foreground"
                          onClick={() => {
                            reportDelay(o.orderId, 5);
                            toast.message(`+5 min added`);
                          }}
                          data-testid={`button-delay-delivery-${o.orderId}`}
                        >
                          +5 min delay
                        </Button>
                        {o.status === "Preparing" && (
                          <Button
                            size="sm"
                            className="rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                            onClick={() => {
                              advanceOrder(o.orderId);
                              toast.success(`${o.orderId} marked Ready`);
                            }}
                            data-testid={`button-mark-ready-delivery-${o.orderId}`}
                          >
                            <PackageCheck className="size-4 mr-1" /> Mark Ready
                          </Button>
                        )}
                        {o.status === "Ready" && (
                          <Button
                            size="sm"
                            className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
                            onClick={() => {
                              advanceOrder(o.orderId);
                              toast.success(`${o.orderId} handed off`);
                            }}
                            data-testid={`button-handoff-delivery-${o.orderId}`}
                          >
                            <Truck className="size-4 mr-1" /> Hand off
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </SectionPanel>
        </div>

        <div className="col-span-12 md:col-span-4">
          <SectionPanel
            title="Couriers"
            subtitle={`${deliveryPartners.length} on shift today`}
          >
            <div className="space-y-3">
              {deliveryPartners.map((p) => (
                <div
                  key={p.courierId}
                  className="flex items-center gap-3"
                  data-testid={`courier-${p.courierId}`}
                >
                  <div className="size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <Bike className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {p.mobile} · ★ {p.rating.toFixed(1)}
                    </div>
                  </div>
                  <StatusPill
                    status={
                      p.status === "Free"
                        ? "active"
                        : p.status === "On Run"
                          ? "in_progress"
                          : "inactive"
                    }
                    label={
                      p.status === "Free"
                        ? "Free"
                        : p.status === "On Run"
                          ? "On run"
                          : "Offline"
                    }
                  />
                </div>
              ))}
            </div>
          </SectionPanel>
        </div>
      </div>
    </div>
  );
}
