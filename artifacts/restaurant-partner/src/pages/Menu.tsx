import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { DishVisual } from "@/components/DishVisual";
import { menuCategories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Clock, Search } from "lucide-react";
import { toast } from "sonner";
import { usd2 } from "@/lib/format";

export default function Menu() {
  const { menu, toggleAvailability, upsertMenuItem, deleteMenuItem, bulkSetPrep } = useStore();
  const [activeCat, setActiveCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [prepBulk, setPrepBulk] = useState<number | "">("");

  const items = useMemo(() => {
    return menu.filter((m) => {
      if (activeCat !== "all" && m.categoryId !== activeCat) return false;
      if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [menu, activeCat, q]);

  const editingItem = editing ? menu.find((m) => m.id === editing) : null;

  return (
    <div className="grid grid-cols-12 gap-4">
      <aside className="col-span-12 md:col-span-3">
        <SectionPanel title="Categories" subtitle={`${menu.length} items`}>
          <div className="space-y-1">
            <CategoryButton label="All items" count={menu.length} active={activeCat === "all"} onClick={() => setActiveCat("all")} />
            {menuCategories.map((c) => (
              <CategoryButton
                key={c.id}
                label={c.name}
                count={menu.filter((m) => m.categoryId === c.id).length}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
              />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel className="mt-4" title="Bulk prep time" subtitle="Apply to all items">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="min"
              value={prepBulk}
              onChange={(e) => setPrepBulk(e.target.value === "" ? "" : Number(e.target.value))}
              data-testid="input-bulk-prep"
            />
            <Button
              className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
              onClick={() => {
                if (typeof prepBulk === "number" && prepBulk > 0) {
                  bulkSetPrep(prepBulk);
                  toast.success(`All items set to ${prepBulk} min`);
                }
              }}
              data-testid="button-apply-bulk"
            >
              Apply
            </Button>
          </div>
        </SectionPanel>
      </aside>

      <div className="col-span-12 md:col-span-9 space-y-4">
        <SectionPanel
          title="Menu"
          subtitle="Toggle availability instantly. Edit or add items as you go."
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                <Search className="size-3.5 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search dishes"
                  className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-44"
                  data-testid="input-search-menu"
                />
              </div>
              <Dialog
                open={editing === "new"}
                onOpenChange={(o) => setEditing(o ? "new" : null)}
              >
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-foreground text-background hover-elevate active-elevate-2" data-testid="button-add-item">
                    <Plus className="size-4 mr-1" /> Add item
                  </Button>
                </DialogTrigger>
                <ItemDialog
                  initial={null}
                  onSave={(item) => {
                    upsertMenuItem(item);
                    toast.success(`Added ${item.name}`);
                    setEditing(null);
                  }}
                />
              </Dialog>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {items.map((m) => (
              <article
                key={m.id}
                className="rounded-xl border border-card-border bg-background p-3 flex gap-3"
                data-testid={`menu-item-${m.id}`}
              >
                <DishVisual hue={m.imageHue} name={m.name} className="size-20 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">{m.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{m.description}</p>
                    </div>
                    <span className="font-semibold tabular-nums">{usd2(m.price)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="size-3" /> {m.prepMinutes} min
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={m.available}
                        onCheckedChange={() => {
                          toggleAvailability(m.id);
                          toast.message(`${m.name} ${m.available ? "hidden" : "available"}`);
                        }}
                        data-testid={`switch-available-${m.id}`}
                      />
                      <Dialog open={editing === m.id} onOpenChange={(o) => setEditing(o ? m.id : null)}>
                        <DialogTrigger asChild>
                          <button
                            className="size-7 rounded-md text-muted-foreground hover-elevate active-elevate-2 inline-flex items-center justify-center"
                            data-testid={`button-edit-${m.id}`}
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        </DialogTrigger>
                        {editing === m.id && editingItem && (
                          <ItemDialog
                            initial={editingItem}
                            onSave={(item) => {
                              upsertMenuItem(item);
                              toast.success(`Saved ${item.name}`);
                              setEditing(null);
                            }}
                          />
                        )}
                      </Dialog>
                      <button
                        className="size-7 rounded-md text-destructive hover-elevate active-elevate-2 inline-flex items-center justify-center"
                        onClick={() => {
                          deleteMenuItem(m.id);
                          toast.error(`Deleted ${m.name}`);
                        }}
                        data-testid={`button-delete-${m.id}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  );
}

function CategoryButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      className={[
        "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover-elevate active-elevate-2",
      ].join(" ")}
      onClick={onClick}
      data-testid={`category-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span>{label}</span>
      <span className={`text-xs tabular-nums ${active ? "text-background/80" : "text-muted-foreground"}`}>{count}</span>
    </button>
  );
}

function ItemDialog({
  initial,
  onSave,
}: {
  initial: ReturnType<typeof Object> extends never ? never : import("@/lib/mockData").MenuItem | null;
  onSave: (item: import("@/lib/mockData").MenuItem) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState<number | "">(initial?.price ?? "");
  const [prep, setPrep] = useState<number | "">(initial?.prepMinutes ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? menuCategories[0].id);
  const [variants, setVariants] = useState(initial?.variants?.map((v) => v.name).join(", ") ?? "Regular");
  const [addOns, setAddOns] = useState(initial?.addOns?.map((a) => `${a.name}:${a.price}`).join(", ") ?? "");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit item" : "Add item"}</DialogTitle>
      </DialogHeader>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} data-testid="input-item-name" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              data-testid="input-item-price"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Prep (min)</Label>
            <Input
              type="number"
              value={prep}
              onChange={(e) => setPrep(e.target.value === "" ? "" : Number(e.target.value))}
              data-testid="input-item-prep"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              data-testid="select-item-category"
            >
              {menuCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} data-testid="input-item-description" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Variants (comma separated)</Label>
            <Input value={variants} onChange={(e) => setVariants(e.target.value)} data-testid="input-item-variants" />
          </div>
          <div className="space-y-1.5">
            <Label>Add-ons (name:price, …)</Label>
            <Input value={addOns} onChange={(e) => setAddOns(e.target.value)} data-testid="input-item-addons" />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
          onClick={() => {
            if (!name || price === "" || prep === "") return;
            onSave({
              id: initial?.id ?? `m${Date.now()}`,
              name,
              price: Number(price),
              prepMinutes: Number(prep),
              description,
              categoryId,
              available: initial?.available ?? true,
              imageHue: initial?.imageHue ?? Math.floor(Math.random() * 50) + 5,
              variants: variants
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
                .map((name) => ({ name, deltaPrice: 0 })),
              addOns: addOns
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
                .map((s) => {
                  const [n, p] = s.split(":");
                  return { name: n?.trim() ?? "", price: Number(p ?? 0) || 0 };
                }),
            });
          }}
          data-testid="button-save-item"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
