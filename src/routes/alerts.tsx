import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Bell, BellRing, Trash2, Plus, Search as SearchIcon, CheckCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts & saved searches — PetWorld" }] }),
  component: Alerts,
});

function Alerts() {
  const { savedSearches, addSavedSearch, removeSavedSearch, notifications, markAllRead } = useApp();
  const [label, setLabel] = useState("");
  const [q, setQ] = useState("");

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
          <BellRing className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">Alerts & saved searches</h1>
          <p className="text-muted-foreground text-sm">Get notified the moment a matching pet is listed.</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={markAllRead}>
          <CheckCheck className="h-4 w-4 mr-2" /> Mark all read
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-bold mb-4 flex items-center gap-2"><SearchIcon className="h-4 w-4 text-primary" /> Saved searches</h2>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Input placeholder="Label (e.g. Hypoallergenic pups)" value={label} onChange={(e) => setLabel(e.target.value)} className="flex-1 min-w-[180px]" />
              <Input placeholder="Query (breed, city...)" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 min-w-[180px]" />
              <Button className="rounded-full" onClick={() => {
                if (!label) return toast.error("Give your alert a label");
                addSavedSearch({ label, query: { q } });
                setLabel(""); setQ("");
                toast.success("Alert saved — we'll email you matches");
              }}><Plus className="h-4 w-4 mr-1" /> Save alert</Button>
            </div>
            {savedSearches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No saved searches yet. Add filters on the pets page and save them here.</p>
            ) : (
              <div className="divide-y divide-border">
                {savedSearches.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 py-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Bell className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{s.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.query.q || "All pets"}</p>
                    </div>
                    <Link to="/pets" search={{ q: s.query.q } as never}>
                      <Button size="sm" variant="outline" className="rounded-full">View</Button>
                    </Link>
                    <button onClick={() => { removeSavedSearch(s.id); toast.success("Removed"); }} aria-label="Delete alert">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notifications</h2>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
            {notifications.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex gap-3 p-3 rounded-xl ${n.read ? "bg-transparent" : "bg-primary/5"}`}>
                <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${n.read ? "bg-muted-foreground/40" : "bg-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
