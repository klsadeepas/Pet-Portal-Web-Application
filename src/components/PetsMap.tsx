import { motion } from "motion/react";
import { pets } from "@/data/pets";
import { getCoords } from "@/data/petExtras";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

// Mock USA map — projects rough lat/lng to a viewport
const project = (lat: number, lng: number) => {
  const x = ((lng + 125) / 60) * 100; // -125..-65 → 0..100
  const y = ((50 - lat) / 25) * 100;  // 50..25 → 0..100
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(4, Math.min(96, y)) };
};

export function PetsMap({ ids }: { ids: string[] }) {
  const visible = pets.filter((p) => ids.includes(p.id));

  return (
    <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-sky-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Decorative grid */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* USA outline approximation */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <path
          d="M 5 30 Q 10 15 30 12 Q 50 8 70 12 Q 88 16 95 30 Q 95 50 88 65 Q 80 80 60 85 Q 40 88 25 80 Q 10 70 5 50 Z"
          fill="hsl(var(--primary) / 0.08)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="0.3"
        />
      </svg>

      {visible.map((pet) => {
        const [lat, lng] = getCoords(pet);
        const { x, y } = project(lat, lng);
        return (
          <motion.div
            key={pet.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute -translate-x-1/2 -translate-y-full group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Link to="/pets/$id" params={{ id: pet.id }} className="block">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-background border-2 border-primary shadow-lg overflow-hidden group-hover:scale-125 transition">
                  <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                </div>
                <MapPin className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-4 w-4 text-primary fill-primary" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded-lg bg-popover border border-border text-xs font-medium whitespace-nowrap shadow-card opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                {pet.name} · ${pet.price}
              </div>
            </Link>
          </motion.div>
        );
      })}

      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur text-xs text-muted-foreground border border-border">
        {visible.length} pets on map
      </div>
    </div>
  );
}
