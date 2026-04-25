import { useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { PageHeader } from "@/components/PageHeader";
import { StatStrip } from "@/components/StatStrip";
import { DishImage } from "@/components/DishImage";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Pencil, Trash2, Clock, Search, Upload, Utensils, CheckCircle2, EyeOff, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { usd2 } from "@/lib/format";

export default function Menu() {
  const { menu, toggleAvailability, upsertMenuItem, deleteMenuItem, bulkSetPrep, setMenuImage } = useStore();
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
  const available = menu.filter((m) => m.available).length;
  const avgPrep = Math.round(menu.reduce((s, m) => s + m.prepMinutes, 0) / Math.max(1, menu.length));
  const avgPrice = menu.reduce((s, m) => s + m.price, 0) / Math.max(1, menu.length);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Menu"
        description="Update your dishes, manage availability, upload photos, and tune prep times."
        actions={
          <Dialog open={editing === "new"} onOpenChange={(o) => setEditing(o ? "new" : null)}>
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
        }
      />

      <StatStrip
        items={[
          { label: "Total dishes", value: String(menu.length), icon: Utensils, hint: `${menuCategories.length} categories` },
          { label: "Available now", value: String(available), icon: CheckCircle2, hint: `${menu.length - available} hidden` },
          { label: "Avg prep time", value: `${avgPrep} min`, icon: Clock, accent: true },
          { label: "Avg price", value: usd2(avgPrice), icon: ImageIcon },
        ]}
      />

      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 md:col-span-3 space-y-4">
          <SectionPanel title="Categories" subtitle={`${menu.length} items total`}>
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

          <SectionPanel title="Bulk prep time" subtitle="Apply to all items">
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
            title="Dishes"
            subtitle="Click the image to upload a new photo. Toggle the switch to show or hide on the storefront."
            actions={
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
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((m) => (
                <MenuCard
                  key={m.id}
                  item={m}
                  onToggle={() => {
                    toggleAvailability(m.id);
                    toast.message(`${m.name} ${m.available ? "hidden" : "available"}`);
                  }}
                  onEdit={() => setEditing(m.id)}
                  onDelete={() => {
                    deleteMenuItem(m.id);
                    toast.error(`Deleted ${m.name}`);
                  }}
                  onImage={(dataUrl) => {
                    setMenuImage(m.id, dataUrl);
                    toast.success("Photo updated");
                  }}
                />
              ))}
            </div>

            <Dialog open={!!editing && editing !== "new"} onOpenChange={(o) => !o && setEditing(null)}>
              {editing && editing !== "new" && editingItem && (
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
          </SectionPanel>
        </div>
      </div>
    </div>
  );
}

function MenuCard({
  item,
  onToggle,
  onEdit,
  onDelete,
  onImage,
}: {
  item: import("@/lib/mockData").MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onImage: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <article
      className="rounded-2xl border border-card-border bg-card shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md"
      data-testid={`menu-item-${item.id}`}
    >
      <div className="relative aspect-[16/10]">
        <DishImage itemId={item.id} src={item.imageUrl} name={item.name} className="h-full w-full" rounded="rounded-none" />
        {!item.available && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-card border border-card-border px-2 py-1 text-xs">
              <EyeOff className="size-3" /> Hidden
            </span>
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/90 border border-card-border px-2.5 py-1 text-xs shadow-sm hover-elevate active-elevate-2"
          data-testid={`button-upload-${item.id}`}
        >
          <Upload className="size-3" /> Photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{item.name}</h3>
          <span className="font-semibold tabular-nums">{usd2(item.price)}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
            <Clock className="size-3" /> {item.prepMinutes} min
          </span>
          {item.variants.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
              {item.variants.length} variant{item.variants.length === 1 ? "" : "s"}
            </span>
          )}
          {item.addOns.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
              {item.addOns.length} add-on{item.addOns.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={item.available} onCheckedChange={onToggle} data-testid={`switch-available-${item.id}`} />
            <span className="text-xs text-muted-foreground">{item.available ? "Available" : "Hidden"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onEdit}
                  className="size-8 rounded-md text-muted-foreground hover-elevate active-elevate-2 inline-flex items-center justify-center"
                  data-testid={`button-edit-${item.id}`}
                >
                  <Pencil className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit dish</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onDelete}
                  className="size-8 rounded-md text-destructive hover-elevate active-elevate-2 inline-flex items-center justify-center"
                  data-testid={`button-delete-${item.id}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete dish</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </article>
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
  initial: import("@/lib/mockData").MenuItem | null;
  onSave: (item: import("@/lib/mockData").MenuItem) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState<number | "">(initial?.price ?? "");
  const [prep, setPrep] = useState<number | "">(initial?.prepMinutes ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? menuCategories[0].id);
  const [variants, setVariants] = useState(initial?.variants?.map((v) => v.name).join(", ") ?? "Regular");
  const [addOns, setAddOns] = useState(initial?.addOns?.map((a) => `${a.name}:${a.price}`).join(", ") ?? "");
  const [imageUrl, setImageUrl] = useState<string | undefined>(initial?.imageUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>{initial ? "Edit dish" : "Add dish"}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-5">
          <div className="aspect-square rounded-xl overflow-hidden border border-card-border">
            <DishImage itemId={initial?.id} src={imageUrl} name={name || "Dish"} className="h-full w-full" rounded="rounded-none" />
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-2 w-full inline-flex items-center justify-center gap-1 rounded-full bg-secondary px-3 py-2 text-sm hover-elevate active-elevate-2"
            data-testid="button-upload-dialog"
            type="button"
          >
            <Upload className="size-3.5" /> Upload photo
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === "string") setImageUrl(reader.result);
              };
              reader.readAsDataURL(f);
            }}
          />
        </div>

        <div className="col-span-12 sm:col-span-7 space-y-3">
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
              imageUrl,
              variants: variants
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
                .map((nm) => ({ name: nm, deltaPrice: 0 })),
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
