import { useState } from "react";
import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { dateOnly, usd2 } from "@/lib/format";

export default function Offers() {
  const { offers, upsertOffer, deleteOffer } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <SectionPanel
        title="Offers & Discounts"
        subtitle="Promo codes, schedule windows, and minimum order rules."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-foreground text-background hover-elevate active-elevate-2" data-testid="button-new-offer">
                <Plus className="size-4 mr-1" /> Create offer
              </Button>
            </DialogTrigger>
            <NewOfferDialog
              onSave={(o) => {
                upsertOffer(o);
                toast.success(`Created ${o.code}`);
                setOpen(false);
              }}
            />
          </Dialog>
        }
        noPadding
      >
        {offers.length === 0 ? (
          <EmptyState icon={Tag} title="No offers yet" description="Create your first promo code to start running discounts." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-card-border">
                  <th className="text-left font-normal py-3 pl-5 pr-3">Code</th>
                  <th className="text-left font-normal py-3 px-3">Type</th>
                  <th className="text-right font-normal py-3 px-3">Value</th>
                  <th className="text-right font-normal py-3 px-3">Min order</th>
                  <th className="text-left font-normal py-3 px-3">Window</th>
                  <th className="text-left font-normal py-3 px-3">Status</th>
                  <th className="py-3 pr-5" />
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b border-card-border/60 last:border-b-0" data-testid={`row-offer-${o.id}`}>
                    <td className="py-3.5 pl-5 pr-3 font-medium tracking-wide">{o.code}</td>
                    <td className="py-3.5 px-3 text-muted-foreground">{o.type === "percent" ? "Percent" : "Flat"}</td>
                    <td className="py-3.5 px-3 text-right font-medium tabular-nums">
                      {o.type === "percent" ? `${o.value}%` : usd2(o.value)}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums">{usd2(o.minOrder)}</td>
                    <td className="py-3.5 px-3 text-muted-foreground">
                      {dateOnly(o.startsAt)} → {dateOnly(o.endsAt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusPill status={o.active ? "active" : "inactive"} />
                    </td>
                    <td className="py-3.5 pr-5 text-right">
                      <button
                        className="size-7 rounded-md text-destructive hover-elevate active-elevate-2 inline-flex items-center justify-center"
                        onClick={() => {
                          deleteOffer(o.id);
                          toast.error(`Deleted ${o.code}`);
                        }}
                        data-testid={`button-delete-offer-${o.id}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function NewOfferDialog({ onSave }: { onSave: (o: import("@/lib/mockData").Offer) => void }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "flat">("percent");
  const [value, setValue] = useState<number | "">(10);
  const [minOrder, setMinOrder] = useState<number | "">(0);
  const today = new Date().toISOString().slice(0, 10);
  const inTwoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(inTwoWeeks);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create offer</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Promo code</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WEEKEND15" data-testid="input-offer-code" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "percent" | "flat")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              data-testid="select-offer-type"
            >
              <option value="percent">Percent</option>
              <option value="flat">Flat amount</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>{type === "percent" ? "Percent off" : "Amount off"}</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
              data-testid="input-offer-value"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Minimum order</Label>
          <Input
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value === "" ? "" : Number(e.target.value))}
            data-testid="input-offer-min"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Starts</Label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} data-testid="input-offer-start" />
          </div>
          <div className="space-y-1.5">
            <Label>Ends</Label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} data-testid="input-offer-end" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
          onClick={() => {
            if (!code || value === "") return;
            onSave({
              id: `o${Date.now()}`,
              code,
              type,
              value: Number(value),
              minOrder: Number(minOrder || 0),
              startsAt: new Date(start).toISOString(),
              endsAt: new Date(end).toISOString(),
              active: true,
            });
          }}
          data-testid="button-save-offer"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
