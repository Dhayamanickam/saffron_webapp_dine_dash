import { useState } from "react";
import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LifeBuoy, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { minutesAgoLabel } from "@/lib/format";

export default function Support() {
  const { tickets, createTicket, appendMessage, setTicketStatus } = useStore();
  const [activeId, setActiveId] = useState<string | null>(tickets[0]?.id ?? null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const active = tickets.find((t) => t.id === activeId) ?? tickets[0] ?? null;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-4">
        <SectionPanel
          title="Tickets"
          subtitle={`${tickets.filter((t) => t.status !== "resolved").length} open`}
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-foreground text-background hover-elevate active-elevate-2" data-testid="button-new-ticket">
                  <Plus className="size-4 mr-1" /> New
                </Button>
              </DialogTrigger>
              <NewTicketDialog
                onSave={(s, p, m) => {
                  createTicket(s, p, m);
                  toast.success("Ticket raised");
                  setOpen(false);
                }}
              />
            </Dialog>
          }
        >
          {tickets.length === 0 ? (
            <EmptyState icon={LifeBuoy} title="No tickets" description="Open one when you need help." />
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={[
                    "w-full text-left rounded-xl p-3 border transition-colors",
                    active?.id === t.id ? "bg-secondary border-card-border" : "bg-background border-card-border hover-elevate active-elevate-2",
                  ].join(" ")}
                  data-testid={`ticket-${t.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm">{t.subject}</div>
                    <StatusPill status={t.status} />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{minutesAgoLabel(t.createdAt)} · {t.priority}</div>
                </button>
              ))}
            </div>
          )}
        </SectionPanel>
      </div>

      <div className="col-span-12 md:col-span-8">
        <SectionPanel
          title={active?.subject ?? "Select a ticket"}
          subtitle={active ? `Opened ${minutesAgoLabel(active.createdAt)}` : undefined}
          actions={
            active && active.status !== "resolved" ? (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setTicketStatus(active.id, "resolved");
                  toast.success("Marked resolved");
                }}
                data-testid="button-resolve"
              >
                Mark resolved
              </Button>
            ) : null
          }
        >
          {active ? (
            <>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {active.messages.map((m, i) => (
                  <div
                    key={i}
                    className={[
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                      m.from === "you"
                        ? "ml-auto bg-foreground text-background"
                        : "bg-secondary",
                    ].join(" ")}
                  >
                    {m.text}
                    <div className={`mt-1 text-[10px] ${m.from === "you" ? "text-background/60" : "text-muted-foreground"}`}>
                      {minutesAgoLabel(m.at)}
                    </div>
                  </div>
                ))}
              </div>

              {active.status !== "resolved" && (
                <div className="mt-4 flex items-center gap-2">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your message…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && draft.trim()) {
                        appendMessage(active.id, draft.trim());
                        setDraft("");
                      }
                    }}
                    data-testid="input-chat"
                  />
                  <Button
                    className="rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    onClick={() => {
                      if (!draft.trim()) return;
                      appendMessage(active.id, draft.trim());
                      setDraft("");
                    }}
                    data-testid="button-send-chat"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState icon={LifeBuoy} title="Pick a ticket to view the conversation" />
          )}
        </SectionPanel>
      </div>
    </div>
  );
}

function NewTicketDialog({
  onSave,
}: {
  onSave: (subject: string, priority: import("@/lib/mockData").SupportTicket["priority"], message: string) => void;
}) {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [msg, setMsg] = useState("");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New support ticket</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} data-testid="input-ticket-subject" />
        </div>
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            data-testid="select-ticket-priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Describe the issue</Label>
          <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} data-testid="input-ticket-message" />
        </div>
      </div>
      <DialogFooter>
        <Button
          className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
          onClick={() => {
            if (!subject || !msg) return;
            onSave(subject, priority, msg);
          }}
          data-testid="button-save-ticket"
        >
          Open ticket
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
