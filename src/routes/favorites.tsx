import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Trash2, PawPrint } from "lucide-react";
import { pets } from "@/data/pets";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/PetCard";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "My Favorites — PetWorld" }] }),
  component: Favorites,
});

function Favorites() {
  const { wishlist, toggleWishlist } = useApp();
  const items = wishlist.map((id) => pets.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Heart className="h-6 w-6 fill-primary" /></div>
        <div>
          <h1 className="text-4xl font-extrabold">My Favorites</h1>
          <p className="text-muted-foreground">{items.length} pets saved</p>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center max-w-lg mx-auto">
          <div className="text-7xl mb-4">💔</div>
          <h2 className="text-2xl font-bold">No favorites yet</h2>
          <p className="text-muted-foreground mt-2">Tap the heart icon on any pet to save it here for later.</p>
          <Link to="/pets"><Button className="mt-6 rounded-full"><PawPrint className="h-4 w-4 mr-2" /> Discover pets</Button></Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((p, i) => p && (
              <div key={p.id} className="relative group">
                <PetCard pet={p} index={i} />
                <button onClick={() => toggleWishlist(p.id)} aria-label="Remove" className="absolute top-3 right-14 z-10 h-10 w-10 rounded-full bg-destructive text-destructive-foreground grid place-items-center opacity-0 group-hover:opacity-100 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
