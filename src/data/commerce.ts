import type { Pet } from "./pets";

const hash = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
};

// Sponsored / promoted listings
export const isSponsored = (pet: Pet) => hash(pet.id) % 6 === 0;

// Seasonal collection tag
export const seasonalCollection = {
  name: "Summer 2026",
  tagline: "Sun-loving companions ready for adventure",
  cta: "Explore the collection",
  image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&auto=format&fit=crop",
};

export const isSeasonal = (pet: Pet) => hash(pet.id) % 3 === 0;

// Deposit calculation
export const depositFor = (price: number) => Math.max(50, Math.round(price * 0.15));

// Shipping ETA — 4-9 days out
export const shippingEta = () => {
  const d = new Date();
  d.setDate(d.getDate() + 4 + Math.floor(Math.random() * 6));
  return d.toISOString().slice(0, 10);
};

export const trackingNumber = () =>
  "PW" + Math.random().toString(36).slice(2, 8).toUpperCase() + Math.floor(Math.random() * 900 + 100);

// Insurance plans
export type InsurancePlan = {
  id: string;
  name: string;
  price: number;
  color: string;
  tagline: string;
  features: string[];
  popular?: boolean;
};

export const insurancePlans: InsurancePlan[] = [
  {
    id: "basic",
    name: "Wag Basic",
    price: 19,
    color: "from-sky-400 to-blue-500",
    tagline: "Essential accident coverage",
    features: ["Accident coverage up to $5,000", "24/7 vet chat", "1 wellness visit / yr", "No lifetime cap on incidents"],
  },
  {
    id: "plus",
    name: "Wag Plus",
    price: 39,
    color: "from-primary to-secondary",
    tagline: "Full accident + illness protection",
    popular: true,
    features: ["Accident + illness up to $15,000", "Unlimited vet chat", "4 wellness visits / yr", "Dental + prescriptions included", "10% multi-pet discount"],
  },
  {
    id: "premier",
    name: "Wag Premier",
    price: 69,
    color: "from-fuchsia-500 to-rose-500",
    tagline: "Peak coverage, zero surprises",
    features: ["Unlimited annual coverage", "Alternative therapies", "Behavioral treatment", "Boarding + travel reimbursement", "Concierge care manager"],
  },
];

// Contests
export type Contest = {
  id: string;
  title: string;
  prize: string;
  endsIn: string;
  entries: number;
  image: string;
  tag: string;
};

export const contests: Contest[] = [
  {
    id: "cutest-pup",
    title: "Cutest Pup of Summer",
    prize: "$500 pet store credit",
    endsIn: "6 days",
    entries: 1284,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&auto=format&fit=crop",
    tag: "Photo",
  },
  {
    id: "adventure-cat",
    title: "Adventure Cat Diaries",
    prize: "Adventure gear bundle",
    endsIn: "12 days",
    entries: 642,
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=900&auto=format&fit=crop",
    tag: "Story",
  },
  {
    id: "bunny-bake",
    title: "Bunny Treat Bake-Off",
    prize: "Featured on PetWorld homepage",
    endsIn: "3 days",
    entries: 318,
    image: "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=900&auto=format&fit=crop",
    tag: "Recipe",
  },
];

export const buildTimeline = (placedAt: string) => {
  const d0 = new Date(placedAt);
  const step = (n: number) => new Date(d0.getTime() + n * 86400000).toISOString().slice(0, 10);
  return [
    { label: "Order placed & deposit received", date: step(0), done: true },
    { label: "Health recheck & travel prep", date: step(1), done: true },
    { label: "Handoff to pet-safe courier", date: step(2), done: false },
    { label: "In transit to your city", date: step(3), done: false },
    { label: "Out for delivery", date: step(5), done: false },
    { label: "Delivered to your door", date: step(6), done: false },
  ];
};
