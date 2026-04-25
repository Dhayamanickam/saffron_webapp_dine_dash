import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatStrip } from "@/components/StatStrip";
import { SectionPanel } from "@/components/SectionPanel";
import {
  issueTypeLabels,
  sourceLabels,
  supportAgents,
  quickReplies,
  type SupportTicket,
  type TicketPriority,
  type TicketStatus,
  type TicketSource,
  type TicketIssueType,
} from "@/lib/mockData";
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
import {
  Plus,
  Search,
  Inbox,
  AlertOctagon,
  Timer,
  CheckCircle2,
  Paperclip,
  Send,
  Lock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { fmtTimeAgo } from "@/lib/format";

type StatusFilter = "all" | TicketStatus;
type PriorityFilter = "all" | TicketPriority;
type SourceFilter = "all" | TicketSource;

export default function Support() {
  const { tickets, createTicket, appendMessage, setTicketStatus, setTicketPriority, assignTicket } = useStore();

  const [statusF, setStatusF] = useState<StatusFilter>("all");
  const [priorityF, setPriorityF] = useState<PriorityFilter>("all");
  const [sourceF, setSourceF] = useState<SourceFilter>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(tickets[0]?.id ?? null);
  const [openCreate, setOpenCreate] = useState(false);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (statusF !== "all" && t.status !== statusF) return false;
      if (priorityF !== "all" && t.priority !== priorityF) return false;
      if (sourceF !== "all" && t.source !== sourceF) return false;
      if (q) {
        const needle = q.toLowerCase();
        if (
          !t.subject.toLowerCase().includes(needle) &&
          !t.id.toLowerCase().includes(needle) &&
          !t.user.name.toLowerCase().includes(needle)
        )
          return false;
      }
      return true;
    });
  }, [tickets, statusF, priorityF, sourceF, q]);

  const open = filtered.find((t) => t.id === openId) ?? filtered[0] ?? null;

  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === "open").length;
  const highPriority = tickets.filter((t) => t.priority === "high" || t.priority === "urgent").length;
  const avgResolution = useMemo(() => {
    const resolved = tickets.filter((t) => t.resolvedAt);
    if (resolved.length === 0) return "—";
    const totalMs = resolved.reduce((s, t) => s + (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()), 0);
    const avgMin = totalMs / resolved.length / 60000;
    if (avgMin < 60) return `${Math.round(avgMin)} min`;
    const h = avgMin / 60;
    if (h < 24) return `${h.toFixed(1)} h`;
    return `${(h / 24).toFixed(1)} d`;
  }, [tickets]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Support"
        description="Manage tickets from customers, couriers, and internal staff. Reply, assign, prioritize, and resolve in one place."
        actions={
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-foreground text-background hover-elevate active-elevate-2" data-testid="button-new-ticket">
                <Plus className="size-4 mr-1" /> Raise ticket
              </Button>
            </DialogTrigger>
            <CreateDialog
              onCreate={(input) => {
                createTicket(input);
                toast.success("Ticket raised");
                setOpenCreate(false);
              }}
            />
          </Dialog>
        }
      />

      <StatStrip
        items={[
          { label: "Total tickets", value: String(total), icon: Inbox, hint: `${tickets.filter((t) => t.status === "resolved").length} resolved` },
          { label: "Open", value: String(openCount), icon: Timer, hint: `${tickets.filter((t) => t.status === "in_progress").length} in progress` },
          { label: "High priority", value: String(highPriority), icon: AlertOctagon, accent: true },
          { label: "Avg resolution", value: avgResolution, icon: CheckCircle2 },
        ]}
      />

      <SectionPanel
        title="Filters"
        subtitle="Search by ticket ID, subject, or person; narrow by status, priority, or source."
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 flex-1 min-w-[200px] max-w-md">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tickets…"
              className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
              data-testid="input-search-tickets"
            />
          </div>
          <Filter className="size-3.5 text-muted-foreground ml-auto" />
          <FilterSelect
            label="Status"
            value={statusF}
            onChange={(v) => setStatusF(v as StatusFilter)}
            options={[
              { v: "all", l: "All status" },
              { v: "open", l: "Open" },
              { v: "in_progress", l: "In progress" },
              { v: "resolved", l: "Resolved" },
            ]}
            testId="select-status-filter"
          />
          <FilterSelect
            label="Priority"
            value={priorityF}
            onChange={(v) => setPriorityF(v as PriorityFilter)}
            options={[
              { v: "all", l: "All priority" },
              { v: "urgent", l: "Urgent" },
              { v: "high", l: "High" },
              { v: "medium", l: "Medium" },
              { v: "low", l: "Low" },
            ]}
            testId="select-priority-filter"
          />
          <FilterSelect
            label="Source"
            value={sourceF}
            onChange={(v) => setSourceF(v as SourceFilter)}
            options={[
              { v: "all", l: "All sources" },
              { v: "customer", l: "Customer" },
              { v: "delivery", l: "Delivery" },
              { v: "restaurant", l: "Restaurant" },
            ]}
            testId="select-source-filter"
          />
        </div>
      </SectionPanel>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <SectionPanel title={`Tickets (${filtered.length})`} subtitle="Click a row to view the conversation.">
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="text-left text-muted-foreground bg-card">
                    <th className="font-medium py-2 px-2">Ticket</th>
                    <th className="font-medium py-2 px-2">Source</th>
                    <th className="font-medium py-2 px-2">Issue</th>
                    <th className="font-medium py-2 px-2">Priority</th>
                    <th className="font-medium py-2 px-2">Status</th>
                    <th className="font-medium py-2 px-2 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <Inbox className="size-6 mx-auto mb-2 opacity-50" />
                        No tickets match these filters.
                      </td>
                    </tr>
                  )}
                  {filtered.map((t) => {
                    const active = open?.id === t.id;
                    return (
                      <tr
                        key={t.id}
                        className={[
                          "cursor-pointer border-t border-card-border transition-colors",
                          active ? "bg-secondary" : "hover:bg-secondary/60",
                        ].join(" ")}
                        onClick={() => setOpenId(t.id)}
                        data-testid={`row-ticket-${t.id}`}
                      >
                        <td className="py-3 px-2">
                          <div className="font-medium leading-tight">{t.subject}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {t.id} • {t.user.name}
                          </div>
                        </td>
                        <td className="py-3 px-2"><SourceTag s={t.source} /></td>
                        <td className="py-3 px-2 text-xs">{issueTypeLabels[t.issueType]}</td>
                        <td className="py-3 px-2"><PriorityTag p={t.priority} /></td>
                        <td className="py-3 px-2"><StatusTag s={t.status} /></td>
                        <td className="py-3 px-2 text-right text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          {fmtTimeAgo(t.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionPanel>
        </div>

        <div className="col-span-12 lg:col-span-5">
          {open ? (
            <TicketDetail
              ticket={open}
              onReply={(text, internal) => {
                appendMessage(open.id, text, internal);
                toast.success(internal ? "Internal note added" : "Reply sent");
              }}
              onStatus={(s) => {
                setTicketStatus(open.id, s);
                toast.message(`Marked ${s.replace("_", " ")}`);
              }}
              onPriority={(p) => {
                setTicketPriority(open.id, p);
                toast.message(`Priority set to ${p}`);
              }}
              onAssign={(a) => {
                assignTicket(open.id, a);
                toast.message(a === "Unassigned" ? "Unassigned" : `Assigned to ${a}`);
              }}
            />
          ) : (
            <SectionPanel title="Conversation">
              <div className="py-12 text-center text-muted-foreground text-sm">
                <Inbox className="size-6 mx-auto mb-2 opacity-50" />
                Select a ticket to view its conversation.
              </div>
            </SectionPanel>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketDetail({
  ticket,
  onReply,
  onStatus,
  onPriority,
  onAssign,
}: {
  ticket: SupportTicket;
  onReply: (text: string, internal: boolean) => void;
  onStatus: (s: TicketStatus) => void;
  onPriority: (p: TicketPriority) => void;
  onAssign: (agent: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [internal, setInternal] = useState(false);

  return (
    <div className="rounded-2xl border border-card-border bg-card shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-card-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground tabular-nums">{ticket.id}</div>
            <h3 className="font-semibold leading-tight truncate">{ticket.subject}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <SourceTag s={ticket.source} />
              <span className="text-[11px] text-muted-foreground">{issueTypeLabels[ticket.issueType]}</span>
              {ticket.orderRef && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px]">
                  <ChevronRight className="size-3" /> {ticket.orderRef}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <PriorityTag p={ticket.priority} />
            <StatusTag s={ticket.status} />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <Field label="From"><span className="font-medium text-foreground">{ticket.user.name}</span><div className="text-muted-foreground truncate">{ticket.user.email}</div></Field>
          <Field label="Phone">{ticket.user.phone ?? "—"}</Field>
          <Field label="Created">{new Date(ticket.createdAt).toLocaleString()}</Field>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <FilterSelect
            label="Assign"
            value={ticket.assignedTo ?? "Unassigned"}
            onChange={onAssign}
            options={supportAgents.map((a) => ({ v: a, l: a }))}
            testId="select-assign"
          />
          <FilterSelect
            label="Priority"
            value={ticket.priority}
            onChange={(v) => onPriority(v as TicketPriority)}
            options={[
              { v: "urgent", l: "Urgent" },
              { v: "high", l: "High" },
              { v: "medium", l: "Medium" },
              { v: "low", l: "Low" },
            ]}
            testId="select-set-priority"
          />
          {ticket.status !== "resolved" ? (
            <Button
              size="sm"
              className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
              onClick={() => onStatus("resolved")}
              data-testid="button-resolve"
            >
              <CheckCircle2 className="size-3.5 mr-1" /> Resolve
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => onStatus("open")}
              data-testid="button-reopen"
            >
              Reopen
            </Button>
          )}
          {ticket.status === "open" && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => onStatus("in_progress")}
              data-testid="button-progress"
            >
              <Timer className="size-3.5 mr-1" /> In progress
            </Button>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-[460px]">
        {ticket.messages.map((m) => {
          const mine = m.from === "you";
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={[
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                  m.internal
                    ? "bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-800"
                    : mine
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground",
                ].join(" ")}
              >
                <div className="flex items-center gap-1.5 mb-0.5 opacity-80">
                  {m.internal && <Lock className="size-3" />}
                  <span className="text-[11px] font-medium">{m.authorName ?? (mine ? "You" : "Support")}</span>
                  <span className="text-[10px] opacity-70">• {fmtTimeAgo(m.at)}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                {m.attachments && m.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.attachments.map((a) => (
                      <span key={a.name} className="inline-flex items-center gap-1 rounded-md bg-background/20 px-2 py-1 text-[11px]">
                        <Paperclip className="size-3" /> {a.name} <span className="opacity-70">{a.size}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-card-border p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {quickReplies.map((qr) => (
            <button
              key={qr.id}
              onClick={() => setDraft((d) => (d ? `${d}\n\n${qr.text}` : qr.text))}
              className="text-[11px] rounded-full bg-secondary px-2.5 py-1 hover-elevate active-elevate-2"
              data-testid={`quick-reply-${qr.id}`}
            >
              {qr.label}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            placeholder={internal ? "Internal note (only your team will see this)…" : "Reply to the customer…"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[64px]"
            data-testid="input-reply"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="size-9 rounded-md bg-secondary hover-elevate active-elevate-2 flex items-center justify-center text-muted-foreground"
                aria-label="Attach"
                data-testid="button-attach"
              >
                <Paperclip className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
          <Button
            className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
            onClick={() => {
              if (!draft.trim()) return;
              onReply(draft.trim(), internal);
              setDraft("");
            }}
            data-testid="button-send-reply"
          >
            <Send className="size-3.5 mr-1" /> Send
          </Button>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={internal} onCheckedChange={setInternal} data-testid="switch-internal" />
          Internal note
        </label>
      </div>
    </div>
  );
}

function CreateDialog({ onCreate }: { onCreate: (input: { subject: string; priority: TicketPriority; source: TicketSource; issueType: TicketIssueType; message: string; orderRef?: string }) => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [source, setSource] = useState<TicketSource>("restaurant");
  const [issueType, setIssueType] = useState<TicketIssueType>("technical");
  const [orderRef, setOrderRef] = useState("");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Raise a new ticket</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} data-testid="input-subject" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Source</Label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as TicketSource)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              data-testid="select-source"
            >
              <option value="restaurant">Restaurant</option>
              <option value="customer">Customer</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Issue type</Label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as TicketIssueType)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              data-testid="select-issue-type"
            >
              {Object.entries(issueTypeLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              data-testid="select-priority-new"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Order reference (optional)</Label>
          <Input placeholder="INV_…" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} data-testid="input-order-ref" />
        </div>
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[100px]" data-testid="input-message" />
        </div>
      </div>
      <DialogFooter>
        <Button
          className="rounded-full bg-foreground text-background hover-elevate active-elevate-2"
          onClick={() => {
            if (!subject || !message) return;
            onCreate({ subject, priority, source, issueType, message, orderRef: orderRef || undefined });
          }}
          data-testid="button-submit-ticket"
        >
          Submit ticket
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  testId,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { v: T; l: string }[];
  testId?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full bg-secondary pl-3 pr-1 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-transparent text-xs font-medium outline-none pr-1 py-1"
        data-testid={testId}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-secondary px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-xs mt-0.5 truncate">{children}</div>
    </div>
  );
}

function PriorityTag({ p }: { p: TicketPriority }) {
  const map: Record<TicketPriority, string> = {
    urgent: "bg-destructive/15 text-destructive",
    high: "bg-primary/15 text-primary",
    medium: "bg-secondary text-foreground",
    low: "bg-secondary text-muted-foreground",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${map[p]}`}>{p}</span>;
}

function StatusTag({ s }: { s: TicketStatus }) {
  const map: Record<TicketStatus, { label: string; cls: string; dot: string }> = {
    open: { label: "Open", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
    in_progress: { label: "In progress", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
    resolved: { label: "Resolved", cls: "bg-secondary text-muted-foreground", dot: "bg-muted-foreground" },
  };
  const m = map[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${m.cls}`}>
      <span className={`size-1.5 rounded-full ${m.dot}`} /> {m.label}
    </span>
  );
}

function SourceTag({ s }: { s: TicketSource }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px]">
      {sourceLabels[s]}
    </span>
  );
}
