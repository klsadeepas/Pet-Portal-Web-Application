import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Package, Truck, MapPin, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Track your order — PetWorld" }] }),
  component: TrackingList,
});

function TrackingList() {
  const { orders } = useApp();

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">Your orders</h1>
          <p className="text-muted-foreground text-sm">Track reservations and deliveries in one place.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-xl font-bold">No orders yet</h2>
          <p className="text-muted-foreground mt-1">Reserve a pet to see it here with live shipping updates.</p>
          <Link to="/pets"><Button className="mt-4 rounded-full"><Search className="h-4 w-4 mr-2" /> Browse pets</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 flex flex-wrap items-center gap-5">
              <img src={o.petImage} alt={o.petName} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-[180px]">
                <p className="font-bold text-lg">{o.petName}</p>
                <p className="text-xs text-muted-foreground">Tracking · <span className="font-mono">{o.tracking}</span></p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" /> ETA {o.eta}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs bg-secondary/20 text-secondary font-semibold">{o.status}</span>
                <p className="font-bold mt-2">${o.price}</p>
              </div>
              <Link to="/tracking/$id" params={{ id: o.id }}><Button variant="outline" className="rounded-full">Track</Button></Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
