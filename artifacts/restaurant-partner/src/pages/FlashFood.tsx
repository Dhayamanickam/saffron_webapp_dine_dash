import { useState } from "react";
import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DishVisual } from "@/components/DishVisual";
import { Zap, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usd2 } from "@/lib/format";

export default function FlashFood() {
  const { flashEnabled, setFlashEnabled, flashDeals, upsertFlashDeal, toggleFlashDeal, deleteFlashDeal, menu } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <SectionPanel
        title="Flash Food Control"
        subtitle="Run lightning-fast deals. Limit by quantity or duration."
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Master switch</span>
            <Switch checked={flashEnabled} onCheckedChange={setFlashEnabled} data-testid="switch-flash-master" />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2" data-testid="button-new-flash">
                  <Plus className="size-4 mr-1" /> New flash deal
                </Button>
              </DialogTrigger>
              <NewFlashDialog
                onCreate={(d) => {
                  upsertFlashDeal(d);
                  toast.success("Flash deal scheduled");
                  setOpen(false);
                }}
              />
            </Dialog>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Stat label="Active deals" value={String(flashDeals.filter((d) => d.active).length)} />
          <Stat label="Units sold" value={String(flashDeals.reduce((s, d) => s + d.sold, 0))} />
          <Stat
            label="Revenue"
            value={usd2(
              flashDeals.reduce((s, d) => {
                const item = menu.find((m) => m.id === d.itemId);
                const unit = item ? item.price * (1 - d.discountPct / 100) : 0;
                return s + unit * d.sold;
              }, 0),
            )}
            accent
          />
        </div>
      </SectionPanel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashDeals.map((d) => {
          const item = menu.find((m) => m.id === d.itemId);
          if (!item) return null;
          const remaining = Math.max(0, d.quantityLimit - d.sold);
          const pct = (d.sold / Math.max(1, d.quantityLimit)) * 100;
          return (
            <article
              key={d.id}
              className="rounded-2xl border border-card-border bg-card shadow-sm p-5 flex gap-4"
              data-testid={`flash-card-${d.id}`}
            >
              <DishVisual hue={item.imageHue} name={item.name} className="size-24 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider rounded-full bg-primary/10 text-primary px-2 py-0.5">
                      <Zap className="size-3" /> Flash · {d.discountPct}% off
                    </span>
                    <h3 className="mt-2 text-base font-semibold">{item.name}</h3>
                    <div className="text-xs text-muted-foreground">
                      <span className="line-through mr-2">{usd2(item.price)}</span>
                      <span className="text-foreground font-medium">
                        {usd2(item.price * (1 - d.discountPct / 100))}
                      </span>
                    </div>
                  </div>
                  <Switch checked={d.active} onCheckedChange={() => toggleFlashDeal(d.id)} data-testid={`switch-flash-${d.id}`} />
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{d.sold} sold</span>
                    <span>{remaining} left · {d.durationMin} min window</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    className="size-7 rounded-md text-destructive hover-elevate active-elevate-2 inline-flex items-center justify-center"
                    onClick={() => {
                      deleteFlashDeal(d.id);
                      toast.error("Flash deal removed");
                    }}
                    data-testid={`button-delete-flash-${d.id}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${accent ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
      <div className={`text-[11px] ${accent ? "text-primary-foreground/90" : "text-muted-foreground"}`}>{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function NewFlashDialog({ onCreate }: { onCreate: (d: import("@/lib/mockData").FlashDeal) => void }) {
  const { menu } = useStore();
  const [itemId, setItemId] = useState(menu[0]?.id ?? "");
  const [discount, setDiscount] = useState(20);
  const [duration, setDuration] = useState(60);
  const [qty, setQty] = useState(30);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New flash deal</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Item</Label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            data-testid="select-flash-item"
          >
            {menu.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Discount</Label>
            <span className="text-sm font-medium">{discount}%</span>
          </div>
          <Slider min={5} max={50} step={5} value={[discount]} onValueChange={(v) => setDiscount(v[0]!)} data-testid="slider-discount" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Duration (min)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              data-testid="input-flash-duration"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Quantity limit</Label>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              data-testid="input-flash-qty"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          className="rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
          onClick={() =>
            onCreate({
              id: `f${Date.now()}`,
              itemId,
              discountPct: discount,
              durationMin: duration,
              quantityLimit: qty,
              sold: 0,
              active: true,
              startedAt: new Date().toISOString(),
            })
          }
          data-testid="button-create-flash"
        >
          Schedule
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
