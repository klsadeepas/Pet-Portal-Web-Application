import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Truck, MapPin, Copy } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/tracking/$id")({
  head: () => ({ meta: [{ title: "Order tracking — PetWorld" }] }),
  component: TrackingDetail,
});

function TrackingDetail() {
  const { id } = Route.useParams();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="text-muted-foreground mt-2">This order may have been cleared or created in another browser.</p>
        <Link to="/tracking"><Button className="mt-4 rounded-full">View all orders</Button></Link>
      </div>
    );
  }

  const doneCount = order.timeline.filter((t) => t.done).length;
  const progress = (doneCount / order.timeline.length) * 100;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-gradient-hero text-primary-foreground p-8 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <img src={order.petImage} alt={order.petName} className="h-20 w-20 rounded-2xl object-cover border-4 border-white/30" />
          <div className="flex-1">
            <p className="text-sm opacity-80">Reservation for</p>
            <h1 className="text-3xl font-extrabold">{order.petName}</h1>
            <p className="text-sm opacity-90 mt-1 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1"><Truck className="h-4 w-4" /> ETA {order.eta}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {order.address}</span>
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur font-semibold text-sm">{order.status}</span>
        </div>
        <div className="mt-6">
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} />
          </div>
          <div className="flex justify-between text-xs opacity-80 mt-2">
            <span>Reserved</span><span>In transit</span><span>Delivered</span>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold text-lg mb-6">Shipping progress</h2>
          <ol className="relative border-l-2 border-border ml-3 space-y-6">
            {order.timeline.map((t, i) => (
              <li key={i} className="pl-6 relative">
                <span className={`absolute -left-[13px] top-0 h-6 w-6 rounded-full grid place-items-center ring-4 ring-background ${t.done ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {t.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                </span>
                <p className={`font-medium ${t.done ? "" : "text-muted-foreground"}`}>{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 h-fit space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Tracking number</p>
            <div className="flex items-center gap-2">
              <p className="font-mono font-bold">{order.tracking}</p>
              <button onClick={() => { navigator.clipboard?.writeText(order.tracking); toast.success("Copied"); }} aria-label="Copy tracking">
                <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Purchase</span><span>${order.price}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Deposit paid</span><span>${order.deposit}</span></div>
            <div className="flex justify-between font-bold"><span>Balance on delivery</span><span>${order.price - order.deposit}</span></div>
          </div>
          <Link to="/insurance"><Button className="w-full rounded-full">Add pet insurance</Button></Link>
        </aside>
      </div>
    </div>
  );
}
