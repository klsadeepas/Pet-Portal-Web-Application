import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Pet } from "@/data/pets";

type User = { name: string; email: string; avatar: string } | null;

export type Order = {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  price: number;
  deposit: number;
  status: "Reserved" | "Preparing" | "In transit" | "Out for delivery" | "Delivered";
  placedAt: string;
  eta: string;
  address: string;
  tracking: string;
  timeline: { label: string; date: string; done: boolean }[];
};

export type SavedSearch = {
  id: string;
  label: string;
  query: Record<string, string>;
  createdAt: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
};

type Ctx = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  user: User;
  login: (email: string, name?: string) => void;
  logout: () => void;
  recentlyViewed: string[];
  addRecent: (id: string) => void;
  comparePets: string[];
  toggleCompare: (id: string) => void;
  // Commerce
  orders: Order[];
  addOrder: (o: Order) => void;
  // Marketing
  savedSearches: SavedSearch[];
  addSavedSearch: (s: Omit<SavedSearch, "id" | "createdAt">) => void;
  removeSavedSearch: (id: string) => void;
  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: number;
  referralCode: string;
  referralCredits: number;
  addReferralCredits: (n: number) => void;
};

const AppContext = createContext<Ctx | null>(null);

const read = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};

const defaultNotifications: Notification[] = [
  { id: "n1", title: "🎉 Summer Collection is live", body: "50+ playful pups ready for adoption this season.", time: "2h ago", read: false, href: "/pets" },
  { id: "n2", title: "New match for your saved search", body: "3 hypoallergenic pets match your filters.", time: "1d ago", read: false, href: "/alerts" },
  { id: "n3", title: "Referral bonus", body: "You earned $25 in PetWorld credit.", time: "3d ago", read: true, href: "/referrals" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [comparePets, setCompare] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [referralCode, setReferralCode] = useState<string>("PAW-WELCOME");
  const [referralCredits, setReferralCredits] = useState<number>(25);

  useEffect(() => {
    setTheme(read("pw_theme", "light"));
    setWishlist(read("pw_wish", [] as string[]));
    setUser(read("pw_user", null as User));
    setRecentlyViewed(read("pw_recent", [] as string[]));
    setCompare(read("pw_compare", [] as string[]));
    setOrders(read("pw_orders", [] as Order[]));
    setSavedSearches(read("pw_searches", [] as SavedSearch[]));
    setNotifications(read("pw_notifs", defaultNotifications));
    setReferralCode(read("pw_refcode", "PAW-" + Math.random().toString(36).slice(2, 8).toUpperCase()));
    setReferralCredits(read("pw_refcredits", 25));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pw_theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => { localStorage.setItem("pw_wish", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("pw_user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("pw_recent", JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem("pw_compare", JSON.stringify(comparePets)); }, [comparePets]);
  useEffect(() => { localStorage.setItem("pw_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("pw_searches", JSON.stringify(savedSearches)); }, [savedSearches]);
  useEffect(() => { localStorage.setItem("pw_notifs", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("pw_refcode", JSON.stringify(referralCode)); }, [referralCode]);
  useEffect(() => { localStorage.setItem("pw_refcredits", JSON.stringify(referralCredits)); }, [referralCredits]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value: Ctx = {
    theme,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    wishlist,
    toggleWishlist: (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    isWished: (id) => wishlist.includes(id),
    user,
    login: (email, name) => setUser({ email, name: name || email.split("@")[0], avatar: `https://i.pravatar.cc/100?u=${email}` }),
    logout: () => setUser(null),
    recentlyViewed,
    addRecent: (id) => setRecentlyViewed((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8)),
    comparePets,
    toggleCompare: (id) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id].slice(-3))),
    orders,
    addOrder: (o) => setOrders((prev) => [o, ...prev]),
    savedSearches,
    addSavedSearch: (s) => setSavedSearches((prev) => [{ ...s, id: "ss-" + Date.now(), createdAt: new Date().toISOString() }, ...prev]),
    removeSavedSearch: (id) => setSavedSearches((prev) => prev.filter((x) => x.id !== id)),
    notifications,
    markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    unreadCount,
    referralCode,
    referralCredits,
    addReferralCredits: (n) => setReferralCredits((c) => c + n),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
};

export const filterPets = (pets: Pet[], ids: string[]) => ids.map((id) => pets.find((p) => p.id === id)).filter(Boolean) as Pet[];
