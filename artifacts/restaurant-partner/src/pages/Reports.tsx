import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { SectionPanel } from "@/components/SectionPanel";
import { StatusPill } from "@/components/StatusPill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { revenueByDay } from "@/lib/mockData";
import { dateShort, usd } from "@/lib/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";

export default function Reports() {
  const { orders } = useStore();
  const [from, setFrom] = useState(new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));

  const filtered = useMemo(() => {
    const f = new Date(from).getTime();
    const t = new Date(to).getTime() + 86400000;
    return orders.filter((o) => {
      const ts = new Date(o.placedAt).getTime();
      return ts >= f && ts <= t;
    });
  }, [orders, from, to]);

  const total = filtered.reduce((s, o) => s + o.total, 0);
  const avg = total / Math.max(1, filtered.length);
  const completed = filtered.filter((o) => o.status === "picked").length;

  return (
    <div className="space-y-4">
      <SectionPanel
        title="Reports"
        subtitle="Revenue trends and order history."
        actions={
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <Label className="text-[11px] text-muted-foreground">From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-8" data-testid="input-from-date" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[11px] text-muted-foreground">To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-8" data-testid="input-to-date" />
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Stat label="Total revenue" value={usd(total)} accent />
          <Stat label="Orders" value={String(filtered.length)} />
          <Stat label="Avg ticket" value={usd(avg)} />
        </div>

        <div className="mt-5 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByDay} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={36} />
              <RTooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Showing {filtered.length} orders · {completed} completed
        </div>
      </SectionPanel>

      <SectionPanel title="Order history" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-card-border">
                <th className="text-left font-normal py-3 pl-5 pr-3">Order ID</th>
                <th className="text-left font-normal py-3 px-3">Customer</th>
                <th className="text-left font-normal py-3 px-3">Channel</th>
                <th className="text-right font-normal py-3 px-3">Total</th>
                <th className="text-left font-normal py-3 px-3">Status</th>
                <th className="text-left font-normal py-3 pr-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-card-border/60 last:border-b-0" data-testid={`row-report-${o.id}`}>
                  <td className="py-3.5 pl-5 pr-3 font-medium">{o.id}</td>
                  <td className="py-3.5 px-3">{o.customerName}</td>
                  <td className="py-3.5 px-3 text-muted-foreground">{o.channel}</td>
                  <td className="py-3.5 px-3 text-right tabular-nums">{usd(o.total)}</td>
                  <td className="py-3.5 px-3"><StatusPill status={o.status} /></td>
                  <td className="py-3.5 pr-5 text-muted-foreground">{dateShort(o.placedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>
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
