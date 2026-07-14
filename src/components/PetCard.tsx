import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, MapPin, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import type { Pet } from "@/data/pets";
import { getVerification } from "@/data/petExtras";
import { isSponsored } from "@/data/commerce";

export function PetCard({ pet, index = 0 }: { pet: Pet; index?: number }) {
  const { isWished, toggleWishlist } = useApp();
  const wished = isWished(pet.id);
  const verification = getVerification(pet);
  const sponsored = isSponsored(pet);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-card border border-border/50"
    >
      <Link to="/pets/$id" params={{ id: pet.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={pet.image}
            alt={`${pet.name}, a ${pet.age} ${pet.breed}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur">
            {pet.type}
          </Badge>
          {sponsored && (
            <Badge className="absolute top-3 left-20 bg-accent text-accent-foreground backdrop-blur border-0">
              Sponsored
            </Badge>
          )}
          {verification.verified && (
            <Badge className="absolute bottom-3 left-3 bg-secondary/95 text-secondary-foreground backdrop-blur gap-1 border-0">
              <ShieldCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(pet.id);
              toast.success(wished ? `Removed ${pet.name} from wishlist` : `Added ${pet.name} to wishlist`);
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 grid place-items-center h-10 w-10 rounded-full bg-background/90 backdrop-blur hover:scale-110 transition-transform"
          >
            <Heart className={`h-5 w-5 ${wished ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg leading-tight">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.breed}</p>
            </div>
            <p className="font-bold text-primary whitespace-nowrap">${pet.price}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-full bg-muted">{pet.age}</span>
            <span className="px-2 py-1 rounded-full bg-muted">{pet.gender}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{pet.location}</span>
          </div>
          <Button size="sm" className="w-full gap-2 rounded-xl">
            <Eye className="h-4 w-4" /> View Details
          </Button>
        </div>
      </Link>
    </motion.article>
  );
}
