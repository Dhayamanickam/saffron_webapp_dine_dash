import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  initialOrders,
  initialFlashDeals,
  initialOffers,
  initialTickets,
  menuItems as seedMenuItems,
  type Order,
  type OrderStatus,
  type FlashDeal,
  type Offer,
  type SupportTicket,
  type MenuItem,
} from "./mockData";

type RestaurantStatus = {
  open: boolean;
  busy: boolean;
  paused: boolean;
};

type Ctx = {
  status: RestaurantStatus;
  setStatus: (next: Partial<RestaurantStatus>) => void;

  orders: Order[];
  acceptOrder: (id: string) => void;
  rejectOrder: (id: string) => void;
  advanceOrder: (id: string) => void;
  setOrderPrep: (id: string, minutes: number) => void;
  assignPartner: (id: string, partnerId: string) => void;
  reportDelay: (id: string, extraMin: number) => void;

  menu: MenuItem[];
  toggleAvailability: (id: string) => void;
  upsertMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  bulkSetPrep: (minutes: number) => void;

  flashDeals: FlashDeal[];
  flashEnabled: boolean;
  setFlashEnabled: (b: boolean) => void;
  upsertFlashDeal: (deal: FlashDeal) => void;
  toggleFlashDeal: (id: string) => void;
  deleteFlashDeal: (id: string) => void;

  offers: Offer[];
  upsertOffer: (o: Offer) => void;
  deleteOffer: (id: string) => void;

  tickets: SupportTicket[];
  createTicket: (subject: string, priority: SupportTicket["priority"], message: string) => void;
  appendMessage: (id: string, text: string) => void;
  setTicketStatus: (id: string, status: SupportTicket["status"]) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

const nextStatus: Record<OrderStatus, OrderStatus> = {
  new: "preparing",
  preparing: "ready",
  ready: "picked",
  picked: "picked",
  rejected: "rejected",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [status, setStatusState] = useState<RestaurantStatus>({ open: true, busy: false, paused: false });
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menu, setMenu] = useState<MenuItem[]>(seedMenuItems);
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>(initialFlashDeals);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);

  const value = useMemo<Ctx>(
    () => ({
      status,
      setStatus: (next) => setStatusState((s) => ({ ...s, ...next })),

      orders,
      acceptOrder: (id) =>
        setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, status: "preparing" } : o))),
      rejectOrder: (id) =>
        setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, status: "rejected" } : o))),
      advanceOrder: (id) =>
        setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, status: nextStatus[o.status] } : o))),
      setOrderPrep: (id, minutes) =>
        setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, prepMinutes: minutes } : o))),
      assignPartner: (id, partnerId) =>
        setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, partnerId } : o))),
      reportDelay: (id, extraMin) =>
        setOrders((arr) =>
          arr.map((o) => (o.id === id ? { ...o, prepMinutes: o.prepMinutes + extraMin, isUrgent: true } : o)),
        ),

      menu,
      toggleAvailability: (id) =>
        setMenu((arr) => arr.map((m) => (m.id === id ? { ...m, available: !m.available } : m))),
      upsertMenuItem: (item) =>
        setMenu((arr) => {
          const idx = arr.findIndex((m) => m.id === item.id);
          if (idx === -1) return [item, ...arr];
          const next = arr.slice();
          next[idx] = item;
          return next;
        }),
      deleteMenuItem: (id) => setMenu((arr) => arr.filter((m) => m.id !== id)),
      bulkSetPrep: (minutes) => setMenu((arr) => arr.map((m) => ({ ...m, prepMinutes: minutes }))),

      flashDeals,
      flashEnabled,
      setFlashEnabled,
      upsertFlashDeal: (deal) =>
        setFlashDeals((arr) => {
          const idx = arr.findIndex((d) => d.id === deal.id);
          if (idx === -1) return [deal, ...arr];
          const next = arr.slice();
          next[idx] = deal;
          return next;
        }),
      toggleFlashDeal: (id) =>
        setFlashDeals((arr) => arr.map((d) => (d.id === id ? { ...d, active: !d.active } : d))),
      deleteFlashDeal: (id) => setFlashDeals((arr) => arr.filter((d) => d.id !== id)),

      offers,
      upsertOffer: (o) =>
        setOffers((arr) => {
          const idx = arr.findIndex((x) => x.id === o.id);
          if (idx === -1) return [o, ...arr];
          const next = arr.slice();
          next[idx] = o;
          return next;
        }),
      deleteOffer: (id) => setOffers((arr) => arr.filter((o) => o.id !== id)),

      tickets,
      createTicket: (subject, priority, message) =>
        setTickets((arr) => [
          {
            id: `t${Date.now()}`,
            subject,
            priority,
            status: "open",
            createdAt: new Date().toISOString(),
            messages: [{ from: "you", text: message, at: new Date().toISOString() }],
          },
          ...arr,
        ]),
      appendMessage: (id, text) =>
        setTickets((arr) =>
          arr.map((t) =>
            t.id === id
              ? { ...t, messages: [...t.messages, { from: "you", text, at: new Date().toISOString() }] }
              : t,
          ),
        ),
      setTicketStatus: (id, st) => setTickets((arr) => arr.map((t) => (t.id === id ? { ...t, status: st } : t))),
    }),
    [status, orders, menu, flashDeals, flashEnabled, offers, tickets],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
