import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, Moon, Sun, Search, Bell, X, PawPrint, LogOut, LayoutDashboard, User as UserIcon, Truck, Gift, Trophy, HeartPulse, BellRing } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const links = [
  { to: "/", label: "Home" },
  { to: "/pets", label: "Pets" },
  { to: "/match", label: "Match" },
  { to: "/community", label: "Community" },
  { to: "/contests", label: "Contests" },
  { to: "/blog", label: "Blog" },
];

const moreLinks = [
  { to: "/insurance", label: "Insurance", Icon: HeartPulse },
  { to: "/referrals", label: "Refer & earn", Icon: Gift },
  { to: "/tracking", label: "Track order", Icon: Truck },
  { to: "/alerts", label: "Alerts", Icon: BellRing },
];

export function Navbar() {
  const { theme, toggleTheme, wishlist, user, logout, notifications, unreadCount, markAllRead } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/pets", search: { q } as never });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-warm text-primary-foreground">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Pet<span className="text-primary">World</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${path === l.to ? "text-primary" : "text-foreground/80"}`}
            >
              {l.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted">More ▾</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {moreLinks.map((m) => (
                <DropdownMenuItem key={m.to} asChild>
                  <Link to={m.to}><m.Icon className="mr-2 h-4 w-4" />{m.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/about">About</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/contact">Contact</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pets, breeds..." className="pl-9 rounded-full bg-muted/50 border-0" />
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="rounded-full relative hidden sm:flex">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold grid place-items-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <button onClick={markAllRead} className="text-xs font-normal text-primary hover:underline">Mark read</button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <Link key={n.id} to={n.href || "/alerts"} className={`block px-3 py-2 hover:bg-muted ${n.read ? "" : "bg-primary/5"}`}>
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                  </Link>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/alerts" className="justify-center text-primary font-medium">View all</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/favorites" className="relative">
            <Button variant="ghost" size="icon" aria-label="Favorites" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            {wishlist.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] bg-primary">{wishlist.length}</Badge>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full ring-2 ring-transparent hover:ring-primary/30 transition">
                  <Avatar className="h-9 w-9"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.name}<br/><span className="text-xs font-normal text-muted-foreground">{user.email}</span></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4"/>Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/tracking"><Truck className="mr-2 h-4 w-4"/>My orders</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/alerts"><BellRing className="mr-2 h-4 w-4"/>Alerts</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/referrals"><Gift className="mr-2 h-4 w-4"/>Refer & earn</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/favorites"><Heart className="mr-2 h-4 w-4"/>Favorites</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4"/>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden sm:block ml-1">
              <Button className="rounded-full" size="sm"><UserIcon className="mr-1 h-4 w-4"/>Sign In</Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <form onSubmit={onSearch} className="md:hidden relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pets..." className="pl-9 rounded-full" />
              </form>
              {[...links, ...moreLinks.map((m) => ({ to: m.to, label: m.label }))].map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-muted">
                  {l.label}
                </Link>
              ))}
              {!user && (
                <Link to="/login" onClick={() => setOpen(false)} className="block">
                  <Button className="w-full rounded-full">Sign In</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
