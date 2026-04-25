import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { StatStrip } from "@/components/StatStrip";
import { Button } from "@/components/ui/button";
import { deliveryPartners } from "@/lib/mockData";
import { Bike, MapPin, Phone, PackageCheck, Truck, Users, Timer } from "lucide-react";
import { toast } from "sonner";
import { minutesAgoLabel, usd } from "@/lib/format";

export default function Delivery() {
  const { orders, advanceOrder, assignPartner, reportDelay } = useStore();
  const inFlight = orders.filter((o) => o.status === "preparing" || o.status === "ready");
  const readyToDispatch = orders.filter((o) => o.status === "ready").length;
  const availableCouriers = deliveryPartners.filter((p) => p.status === "available").length;
  const onRun = deliveryPartners.filter((p) => p.status === "busy").length;
  const avgDispatch =
    inFlight.length === 0 ? "—" : `${Math.round(inFlight.reduce((s, o) => s + o.prepMinutes, 0) / inFlight.length)} min`;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Delivery"
        description="Coordinate hand-offs to your courier roster, track in-flight orders, and flag delays before customers notice."
      />

      <StatStrip
        items={[
          { label: "In flight", value: String(inFlight.length), icon: Truck, hint: `${readyToDispatch} ready` },
          { label: "Available couriers", value: String(availableCouriers), icon: Users, hint: `${onRun} on a run` },
          { label: "Avg dispatch", value: avgDispatch, icon: Timer },
          { label: "Total today", value: String(orders.length), icon: PackageCheck, accent: true },
        ]}
      />

      <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-8 space-y-4">
        <SectionPanel title="Delivery coordination" subtitle="Hand off ready orders to your courier partners.">
          {inFlight.length === 0 ? (
            <EmptyState icon={PackageCheck} title="Nothing to dispatch" description="Active orders will appear here." />
          ) : (
            <div className="space-y-3">
              {inFlight.map((o) => {
                const partner = deliveryPartners.find((p) => p.id === o.partnerId);
                return (
                  <article
                    key={o.id}
                    className="rounded-xl border border-card-border bg-background p-4 flex flex-col md:flex-row md:items-center gap-4"
                    data-testid={`delivery-row-${o.id}`}
                  >
                    <div className="flex items-center gap-3 md:w-1/3">
                      <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-medium">
                        {o.customerName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{o.id}</div>
                        <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <MapPin className="size-3" /> {o.address}
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/3">
                      <div className="text-xs text-muted-foreground">Courier</div>
                      <select
                        value={o.partnerId ?? ""}
                        onChange={(e) => {
                          assignPartner(o.id, e.target.value);
                          toast.success("Courier assigned");
                        }}
                        className="mt-1 h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
                        data-testid={`select-partner-${o.id}`}
                      >
                        <option value="">— Unassigned —</option>
                        {deliveryPartners.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} · ★ {p.rating.toFixed(1)}
                          </option>
                        ))}
                      </select>
                      {partner && (
                        <div className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <Phone className="size-3" /> {partner.phone}
                        </div>
                      )}
                    </div>

                    <div className="md:w-1/3 flex items-center justify-between md:justify-end gap-2">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{minutesAgoLabel(o.placedAt)}</div>
                        <div className="font-semibold tabular-nums">{usd(o.total)}</div>
                      </div>
                      <StatusPill status={o.status} />
                      {o.status === "preparing" && (
                        <Button
                          className="rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                          onClick={() => {
                            advanceOrder(o.id);
                            toast.success(`${o.id} marked Ready`);
                          }}
                          data-testid={`button-mark-ready-delivery-${o.id}`}
                        >
                          <PackageCheck className="size-4 mr-1" /> Ready
                        </Button>
                      )}
                      {o.status === "ready" && (
                        <Button
                          className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
                          onClick={() => {
                            advanceOrder(o.id);
                            toast.success(`${o.id} handed off`);
                          }}
                          data-testid={`button-handoff-delivery-${o.id}`}
                        >
                          <Truck className="size-4 mr-1" /> Hand off
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          reportDelay(o.id, 5);
                          toast.message(`+5 min added`);
                        }}
                        data-testid={`button-delay-delivery-${o.id}`}
                      >
                        +5 min
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </SectionPanel>
      </div>

      <div className="col-span-12 md:col-span-4">
        <SectionPanel title="Couriers" subtitle={`${deliveryPartners.length} on shift today`}>
          <div className="space-y-3">
            {deliveryPartners.map((p) => (
              <div key={p.id} className="flex items-center gap-3" data-testid={`courier-${p.id}`}>
                <div className="size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <Bike className="size-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.phone} · ★ {p.rating.toFixed(1)}</div>
                </div>
                <StatusPill
                  status={p.status === "available" ? "active" : p.status === "busy" ? "in_progress" : "inactive"}
                  label={p.status === "available" ? "Free" : p.status === "busy" ? "On run" : "Offline"}
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
