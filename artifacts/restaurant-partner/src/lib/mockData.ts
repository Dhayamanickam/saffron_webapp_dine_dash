export type OrderStatus = "new" | "preparing" | "ready" | "picked" | "rejected";

export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  notes?: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  total: number;
  placedAt: string;
  prepMinutes: number;
  status: OrderStatus;
  isUrgent?: boolean;
  channel: "Direct" | "Aggregator" | "Dine-in";
  partnerId?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  count: number;
};

export type MenuItem = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  available: boolean;
  prepMinutes: number;
  description: string;
  variants: { name: string; deltaPrice: number }[];
  addOns: { name: string; price: number }[];
  imageHue: number;
  imageUrl?: string;
};

export type FlashDeal = {
  id: string;
  itemId: string;
  discountPct: number;
  durationMin: number;
  quantityLimit: number;
  sold: number;
  active: boolean;
  startedAt: string;
};

export type Offer = {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

export type DeliveryPartner = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  status: "available" | "busy" | "offline";
};

export type TicketSource = "customer" | "delivery" | "restaurant";
export type TicketIssueType =
  | "order_issue"
  | "payment"
  | "delivery"
  | "menu"
  | "technical"
  | "billing"
  | "other";
export type TicketStatus = "open" | "in_progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketMessage = {
  id: string;
  from: "you" | "support" | "customer";
  authorName?: string;
  text: string;
  at: string;
  internal?: boolean;
  attachments?: { name: string; size: string }[];
};

export type SupportTicket = {
  id: string;
  subject: string;
  source: TicketSource;
  issueType: TicketIssueType;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  orderRef?: string;
  messages: TicketMessage[];
};

export const restaurantProfile = {
  name: "Saffron & Smoke",
  ownerName: "Sajibur Rahman",
  ownerEmail: "sajibur.rahman@saffronsmoke.co",
  cuisine: "Modern Indian Grill",
  address: "12 Linden Lane, SoMa, San Francisco, CA",
  phone: "+1 (415) 555-0114",
  hours: [
    { day: "Mon", open: "11:00", close: "22:30", closed: false },
    { day: "Tue", open: "11:00", close: "22:30", closed: false },
    { day: "Wed", open: "11:00", close: "22:30", closed: false },
    { day: "Thu", open: "11:00", close: "23:00", closed: false },
    { day: "Fri", open: "11:00", close: "23:30", closed: false },
    { day: "Sat", open: "10:30", close: "23:30", closed: false },
    { day: "Sun", open: "10:30", close: "22:00", closed: false },
  ],
  bank: {
    holder: "Saffron & Smoke LLC",
    accountMasked: "•••• •••• •••• 6782",
    routing: "121000358",
  },
};

export const menuCategories: MenuCategory[] = [
  { id: "c1", name: "Signature Plates", count: 6 },
  { id: "c2", name: "Tandoor & Grill", count: 5 },
  { id: "c3", name: "Small Bites", count: 4 },
  { id: "c4", name: "Curries", count: 5 },
  { id: "c5", name: "Breads & Rice", count: 4 },
  { id: "c6", name: "Drinks", count: 3 },
];

export const menuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Coal-Smoked Lamb Chops",
    categoryId: "c2",
    price: 28,
    available: true,
    prepMinutes: 22,
    description: "Hand-trimmed chops, overnight yogurt marinade, smoked over mango wood.",
    variants: [
      { name: "Half plate", deltaPrice: -10 },
      { name: "Full plate", deltaPrice: 0 },
    ],
    addOns: [
      { name: "Mint chutney", price: 1.5 },
      { name: "Saffron raita", price: 2 },
    ],
    imageHue: 16,
  },
  {
    id: "m2",
    name: "Butter Chicken, Slow",
    categoryId: "c4",
    price: 19,
    available: true,
    prepMinutes: 14,
    description: "Tomato-fenugreek gravy, finished with cultured butter.",
    variants: [{ name: "Regular", deltaPrice: 0 }, { name: "Family", deltaPrice: 12 }],
    addOns: [{ name: "Extra naan", price: 3 }],
    imageHue: 12,
  },
  {
    id: "m3",
    name: "Charred Paneer Tikka",
    categoryId: "c2",
    price: 16,
    available: true,
    prepMinutes: 12,
    description: "House paneer, kashmiri chili glaze, blistered peppers.",
    variants: [{ name: "Regular", deltaPrice: 0 }],
    addOns: [{ name: "Tamarind drizzle", price: 1 }],
    imageHue: 28,
  },
  {
    id: "m4",
    name: "Saffron Biryani",
    categoryId: "c1",
    price: 22,
    available: true,
    prepMinutes: 25,
    description: "Aged basmati, hand-pounded spices, sealed with dough.",
    variants: [
      { name: "Chicken", deltaPrice: 0 },
      { name: "Lamb", deltaPrice: 4 },
      { name: "Vegetable", deltaPrice: -3 },
    ],
    addOns: [{ name: "Boiled egg", price: 2 }],
    imageHue: 38,
  },
  {
    id: "m5",
    name: "Tandoori Cauliflower",
    categoryId: "c2",
    price: 14,
    available: false,
    prepMinutes: 16,
    description: "Whole roasted, beet-tahini, pomegranate.",
    variants: [{ name: "Regular", deltaPrice: 0 }],
    addOns: [],
    imageHue: 8,
  },
  {
    id: "m6",
    name: "Truffle Garlic Naan",
    categoryId: "c5",
    price: 7,
    available: true,
    prepMinutes: 6,
    description: "Hand-stretched, black garlic, shaved truffle.",
    variants: [{ name: "Single", deltaPrice: 0 }, { name: "Double", deltaPrice: 5 }],
    addOns: [],
    imageHue: 42,
  },
  {
    id: "m7",
    name: "Spiced Mango Lassi",
    categoryId: "c6",
    price: 6,
    available: true,
    prepMinutes: 3,
    description: "Cold-pressed alphonso, cardamom, sea salt.",
    variants: [{ name: "Regular", deltaPrice: 0 }],
    addOns: [],
    imageHue: 35,
  },
  {
    id: "m8",
    name: "Chili Cheese Kulcha",
    categoryId: "c3",
    price: 9,
    available: true,
    prepMinutes: 8,
    description: "Stuffed flatbread, smoked mozzarella, pickled chilies.",
    variants: [{ name: "Regular", deltaPrice: 0 }],
    addOns: [],
    imageHue: 22,
  },
];

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86400_000).toISOString();

export const initialOrders: Order[] = [
  {
    id: "INV_000076",
    customerName: "Mira Patel",
    customerPhone: "+1 415 555 0118",
    address: "415 Folsom St, Apt 12B",
    items: [
      { id: "i1", name: "Coal-Smoked Lamb Chops", qty: 1, price: 28 },
      { id: "i2", name: "Truffle Garlic Naan", qty: 2, price: 7 },
      { id: "i3", name: "Spiced Mango Lassi", qty: 1, price: 6, notes: "Less sugar" },
    ],
    total: 48,
    placedAt: minutesAgo(2),
    prepMinutes: 22,
    status: "new",
    isUrgent: true,
    channel: "Direct",
  },
  {
    id: "INV_000075",
    customerName: "Daniel Cho",
    customerPhone: "+1 415 555 0143",
    address: "98 Townsend St",
    items: [
      { id: "i1", name: "Saffron Biryani — Lamb", qty: 1, price: 26 },
      { id: "i2", name: "Charred Paneer Tikka", qty: 1, price: 16 },
    ],
    total: 42,
    placedAt: minutesAgo(7),
    prepMinutes: 25,
    status: "preparing",
    channel: "Aggregator",
    partnerId: "p1",
  },
  {
    id: "INV_000074",
    customerName: "Aisha Khan",
    customerPhone: "+1 415 555 0102",
    address: "1100 Howard St",
    items: [
      { id: "i1", name: "Butter Chicken, Slow — Family", qty: 1, price: 31 },
      { id: "i2", name: "Truffle Garlic Naan — Double", qty: 1, price: 12 },
      { id: "i3", name: "Chili Cheese Kulcha", qty: 2, price: 9 },
    ],
    total: 61,
    placedAt: minutesAgo(14),
    prepMinutes: 18,
    status: "ready",
    channel: "Direct",
    partnerId: "p2",
  },
  {
    id: "INV_000073",
    customerName: "Jordan Hill",
    customerPhone: "+1 415 555 0167",
    address: "300 Brannan St",
    items: [
      { id: "i1", name: "Charred Paneer Tikka", qty: 2, price: 16 },
      { id: "i2", name: "Spiced Mango Lassi", qty: 2, price: 6 },
    ],
    total: 44,
    placedAt: minutesAgo(28),
    prepMinutes: 14,
    status: "picked",
    channel: "Aggregator",
    partnerId: "p3",
  },
  {
    id: "INV_000072",
    customerName: "Priya Shah",
    customerPhone: "+1 415 555 0190",
    address: "455 Mission St",
    items: [{ id: "i1", name: "Saffron Biryani — Vegetable", qty: 1, price: 19 }],
    total: 19,
    placedAt: minutesAgo(46),
    prepMinutes: 25,
    status: "picked",
    channel: "Direct",
    partnerId: "p1",
  },
  {
    id: "INV_000071",
    customerName: "Marcus Lee",
    customerPhone: "+1 415 555 0144",
    address: "200 King St",
    items: [
      { id: "i1", name: "Coal-Smoked Lamb Chops — Half", qty: 1, price: 18 },
      { id: "i2", name: "Truffle Garlic Naan", qty: 1, price: 7 },
    ],
    total: 25,
    placedAt: minutesAgo(72),
    prepMinutes: 22,
    status: "picked",
    channel: "Dine-in",
  },
];

export const initialFlashDeals: FlashDeal[] = [
  {
    id: "f1",
    itemId: "m3",
    discountPct: 25,
    durationMin: 60,
    quantityLimit: 30,
    sold: 18,
    active: true,
    startedAt: minutesAgo(22),
  },
  {
    id: "f2",
    itemId: "m6",
    discountPct: 15,
    durationMin: 45,
    quantityLimit: 50,
    sold: 12,
    active: true,
    startedAt: minutesAgo(8),
  },
];

export const initialOffers: Offer[] = [
  {
    id: "o1",
    code: "SAFFRON10",
    type: "percent",
    value: 10,
    minOrder: 25,
    startsAt: daysAgo(4),
    endsAt: new Date(now + 86400000 * 12).toISOString(),
    active: true,
  },
  {
    id: "o2",
    code: "WEEKEND5",
    type: "flat",
    value: 5,
    minOrder: 35,
    startsAt: daysAgo(1),
    endsAt: new Date(now + 86400000 * 6).toISOString(),
    active: true,
  },
  {
    id: "o3",
    code: "FIRSTBITE",
    type: "percent",
    value: 20,
    minOrder: 0,
    startsAt: daysAgo(30),
    endsAt: daysAgo(1),
    active: false,
  },
];

export const deliveryPartners: DeliveryPartner[] = [
  { id: "p1", name: "Eli Romero", phone: "+1 415 555 0211", rating: 4.9, status: "busy" },
  { id: "p2", name: "Naomi Park", phone: "+1 415 555 0233", rating: 4.8, status: "available" },
  { id: "p3", name: "Theo Vance", phone: "+1 415 555 0241", rating: 4.7, status: "busy" },
  { id: "p4", name: "Sana Iqbal", phone: "+1 415 555 0277", rating: 5.0, status: "available" },
];

export const supportAgents = ["Unassigned", "Priya M.", "Jordan K.", "Sajibur R."];

export const issueTypeLabels: Record<TicketIssueType, string> = {
  order_issue: "Order issue",
  payment: "Payment",
  delivery: "Delivery",
  menu: "Menu",
  technical: "Technical",
  billing: "Billing",
  other: "Other",
};

export const sourceLabels: Record<TicketSource, string> = {
  customer: "Customer",
  delivery: "Delivery",
  restaurant: "Restaurant",
};

export const quickReplies = [
  { id: "qr1", label: "Acknowledge", text: "Thanks for reaching out — we're looking into this right away and will follow up shortly." },
  { id: "qr2", label: "Refund issued", text: "We've processed a refund for the affected order. It should reflect in 3–5 business days." },
  { id: "qr3", label: "Apology + comp", text: "Apologies for the experience. We've added a complimentary credit to your account for your next order." },
  { id: "qr4", label: "Need more info", text: "Could you share your order ID and the time you placed it? That'll help us track this faster." },
  { id: "qr5", label: "Resolved", text: "Glad we could sort this out. Closing this ticket — feel free to open a new one anytime." },
];

export const initialTickets: SupportTicket[] = [
  {
    id: "TKT-2041",
    subject: "Item missing from order",
    source: "customer",
    issueType: "order_issue",
    status: "open",
    priority: "high",
    createdAt: minutesAgo(18),
    updatedAt: minutesAgo(18),
    user: { name: "Mira Patel", email: "mira.p@example.com", phone: "+1 415 555 0118" },
    orderRef: "INV_000076",
    messages: [
      {
        id: "msg1",
        from: "customer",
        authorName: "Mira Patel",
        text: "Hi — my order arrived but the mango lassi is missing. Could you sort this out?",
        at: minutesAgo(18),
        attachments: [{ name: "receipt.jpg", size: "248 KB" }],
      },
    ],
  },
  {
    id: "TKT-2040",
    subject: "Aggregator showing wrong prep time",
    source: "restaurant",
    issueType: "technical",
    status: "in_progress",
    priority: "urgent",
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(1),
    assignedTo: "Priya M.",
    user: { name: "Sajibur Rahman", email: "sajibur.rahman@saffronsmoke.co" },
    messages: [
      {
        id: "msg1",
        from: "you",
        authorName: "Sajibur Rahman",
        text: "Aggregator app is showing 12 min prep when our default is 18.",
        at: hoursAgo(3),
      },
      {
        id: "msg2",
        from: "support",
        authorName: "Priya M.",
        text: "Thanks Sajibur — escalating to the platform team. ETA 2h.",
        at: hoursAgo(2),
      },
      {
        id: "msg3",
        from: "support",
        authorName: "Priya M.",
        internal: true,
        text: "Internal note: confirmed config drift on aggregator side. Pushing fix.",
        at: hoursAgo(1),
      },
    ],
  },
  {
    id: "TKT-2039",
    subject: "Courier waited 14 min at handoff",
    source: "delivery",
    issueType: "delivery",
    status: "open",
    priority: "medium",
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
    user: { name: "Eli Romero", email: "eli.r@couriers.example", phone: "+1 415 555 0211" },
    orderRef: "INV_000074",
    messages: [
      {
        id: "msg1",
        from: "customer",
        authorName: "Eli Romero",
        text: "Waited 14 minutes for handoff. Long delay impacted my next pickup.",
        at: hoursAgo(5),
      },
    ],
  },
  {
    id: "TKT-2038",
    subject: "Payout schedule for last week",
    source: "restaurant",
    issueType: "billing",
    status: "in_progress",
    priority: "medium",
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(8),
    assignedTo: "Jordan K.",
    user: { name: "Sajibur Rahman", email: "sajibur.rahman@saffronsmoke.co" },
    messages: [
      {
        id: "msg1",
        from: "you",
        authorName: "Sajibur Rahman",
        text: "Hi — when will the Apr 14–20 payout land?",
        at: daysAgo(1),
      },
      {
        id: "msg2",
        from: "support",
        authorName: "Jordan K.",
        text: "Hey Sajibur, payout is queued for tomorrow 10am PT.",
        at: hoursAgo(8),
      },
    ],
  },
  {
    id: "TKT-2037",
    subject: "Cold biryani on arrival",
    source: "customer",
    issueType: "order_issue",
    status: "resolved",
    priority: "high",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    resolvedAt: daysAgo(1),
    assignedTo: "Sajibur R.",
    user: { name: "Daniel Cho", email: "daniel.c@example.com", phone: "+1 415 555 0143" },
    orderRef: "INV_000075",
    messages: [
      { id: "msg1", from: "customer", authorName: "Daniel Cho", text: "Biryani arrived cold — disappointing.", at: daysAgo(2) },
      { id: "msg2", from: "you", authorName: "Sajibur R.", text: "Apologies Daniel. Refunded and added a $15 credit.", at: daysAgo(1) },
      { id: "msg3", from: "customer", authorName: "Daniel Cho", text: "Thank you, much appreciated.", at: daysAgo(1) },
    ],
  },
  {
    id: "TKT-2036",
    subject: "Add second printer to dispatch",
    source: "restaurant",
    issueType: "technical",
    status: "resolved",
    priority: "low",
    createdAt: daysAgo(11),
    updatedAt: daysAgo(10),
    resolvedAt: daysAgo(10),
    assignedTo: "Jordan K.",
    user: { name: "Sajibur Rahman", email: "sajibur.rahman@saffronsmoke.co" },
    messages: [
      { id: "msg1", from: "you", authorName: "Sajibur Rahman", text: "Need a kitchen-side printer mirror.", at: daysAgo(11) },
      { id: "msg2", from: "support", authorName: "Jordan K.", text: "Provisioned. Restart the dispatch tablet.", at: daysAgo(10) },
    ],
  },
  {
    id: "TKT-2035",
    subject: "Update weekend hours",
    source: "restaurant",
    issueType: "other",
    status: "resolved",
    priority: "low",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(13),
    resolvedAt: daysAgo(13),
    assignedTo: "Priya M.",
    user: { name: "Sajibur Rahman", email: "sajibur.rahman@saffronsmoke.co" },
    messages: [
      { id: "msg1", from: "you", authorName: "Sajibur Rahman", text: "Extending Sat hours to 11:30pm starting next week.", at: daysAgo(14) },
      { id: "msg2", from: "support", authorName: "Priya M.", text: "Updated across listings.", at: daysAgo(13) },
    ],
  },
];

export const revenueByDay = [
  { day: "Mon", revenue: 1840, orders: 64 },
  { day: "Tue", revenue: 2120, orders: 71 },
  { day: "Wed", revenue: 1980, orders: 68 },
  { day: "Thu", revenue: 2640, orders: 86 },
  { day: "Fri", revenue: 3210, orders: 104 },
  { day: "Sat", revenue: 3680, orders: 118 },
  { day: "Sun", revenue: 2980, orders: 96 },
];

export const popularItems = [
  { name: "Saffron Biryani", orders: 142 },
  { name: "Butter Chicken", orders: 124 },
  { name: "Lamb Chops", orders: 96 },
  { name: "Paneer Tikka", orders: 88 },
  { name: "Truffle Naan", orders: 71 },
];

export const channelMix = [
  { name: "Direct", value: 46 },
  { name: "Aggregator", value: 38 },
  { name: "Dine-in", value: 16 },
];
