import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, MapPin, MessageCircle, Phone, ShieldCheck, Syringe, Calendar, Mars, Venus, Share2, GitCompareArrows, BadgeCheck, FileCheck2, Sparkles, Star, CreditCard, HeartPulse } from "lucide-react";
import { pets } from "@/data/pets";
import { getVerification, getTimeline, getReviews, getTraits } from "@/data/petExtras";
import { depositFor } from "@/data/commerce";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PetCard } from "@/components/PetCard";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Lightbox } from "@/components/Lightbox";

export const Route = createFileRoute("/pets/$id")({
  loader: ({ params }) => {
    const pet = pets.find((p) => p.id === params.id);
    if (!pet) throw notFound();
    return { pet };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const { pet } = loaderData;
    const title = `${pet.name} — ${pet.breed} for sale | PetWorld`;
    const desc = `${pet.description} ${pet.age}, ${pet.gender}, ${pet.location}. $${pet.price}.`;
    const url = `/pets/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: pet.image },
        { property: "og:image:alt", content: `${pet.name}, a ${pet.breed}` },
        { property: "product:price:amount", content: String(pet.price) },
        { property: "product:price:currency", content: "USD" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: pet.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${pet.name} — ${pet.breed}`,
            description: pet.description,
            image: [pet.image, ...(pet.gallery || [])],
            category: pet.type,
            brand: { "@type": "Organization", name: pet.seller?.name || "PetWorld" },
            offers: {
              "@type": "Offer",
              price: pet.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url,
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => <div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Pet not found</h1></div>,
  component: PetDetails,
});

function PetDetails() {
  const { pet } = Route.useLoaderData();
  const { isWished, toggleWishlist, addRecent, toggleCompare, comparePets } = useApp();
  const [active, setActive] = useState(pet.image);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const galleryImages = Array.from(new Set([pet.image, ...pet.gallery]));
  const lightboxStart = Math.max(0, galleryImages.indexOf(active));
  const wished = isWished(pet.id);
  const inCompare = comparePets.includes(pet.id);

  useEffect(() => { addRecent(pet.id); /* eslint-disable-next-line */ }, [pet.id]);

  const similar = pets.filter((p) => p.type === pet.type && p.id !== pet.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
        <div>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open image in full screen"
            className="group relative aspect-square w-full rounded-3xl overflow-hidden bg-muted shadow-card block"
          >
            <img src={active} alt={pet.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs backdrop-blur opacity-0 group-hover:opacity-100 transition">
              Click to zoom
            </span>
          </button>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {pet.gallery.map((g: string, i: number) => (
              <button key={i} onClick={() => setActive(g)} className={`aspect-square rounded-xl overflow-hidden border-2 ${active === g ? "border-primary" : "border-transparent"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Badge className="mb-3">{pet.type}</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold">{pet.name}</h1>
          <p className="text-lg text-muted-foreground mt-1">{pet.breed}</p>
          <p className="mt-4 text-4xl font-extrabold text-primary">${pet.price}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={Calendar} label="Age" value={pet.age} />
            <Stat icon={pet.gender === "Male" ? Mars : Venus} label="Gender" value={pet.gender} />
            <Stat icon={Syringe} label="Vaccinated" value={pet.vaccinated ? "Yes" : "No"} />
            <Stat icon={ShieldCheck} label="Health" value={pet.health} />
          </div>

          <div className="mt-6 rounded-2xl p-5 bg-card border border-border">
            <h3 className="font-bold mb-2">About {pet.name}</h3>
            <p className="text-muted-foreground">{pet.description}</p>
            <p className="mt-3 text-sm flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {pet.location}</p>
          </div>

          <div className="mt-6 rounded-2xl p-5 bg-card border border-border flex items-center gap-4">
            <Avatar className="h-14 w-14"><AvatarImage src={pet.seller.avatar} /><AvatarFallback>{pet.seller.name[0]}</AvatarFallback></Avatar>
            <div className="flex-1">
              <p className="font-bold flex items-center gap-1">
                {pet.seller.name}
                {getVerification(pet).verified && <BadgeCheck className="h-4 w-4 text-secondary" />}
              </p>
              <p className="text-sm text-muted-foreground">⭐ {pet.seller.rating} · {getVerification(pet).background === "Verified" ? "Background checked" : "Verification pending"}</p>
            </div>
            <ShieldCheck className="h-6 w-6 text-secondary" />
          </div>

          <div className="mt-6 rounded-2xl p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-bold">Reserve now</p>
                <p className="text-sm text-muted-foreground">Refundable deposit · Balance on delivery</p>
              </div>
              <p className="text-2xl font-extrabold">${depositFor(pet.price)}</p>
            </div>
            <Link to="/checkout/$id" params={{ id: pet.id }}>
              <Button size="lg" className="rounded-full w-full"><CreditCard className="h-4 w-4 mr-2" /> Reserve with deposit</Button>
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button size="lg" variant="outline" className="rounded-full"><Phone className="h-4 w-4 mr-2" /> Contact seller</Button>
            <a href={`https://wa.me/${pet.seller.phone.replace(/[^0-9]/g, "")}?text=Hi, I'm interested in ${pet.name}`} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="rounded-full w-full"><MessageCircle className="h-4 w-4 mr-2" /> WhatsApp</Button>
            </a>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => { toggleWishlist(pet.id); toast.success(wished ? "Removed" : "Saved!"); }}>
              <Heart className={`h-4 w-4 mr-1 ${wished ? "fill-primary text-primary" : ""}`} /> {wished ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => { toggleCompare(pet.id); toast.success(inCompare ? "Removed from compare" : "Added to compare"); }}>
              <GitCompareArrows className="h-4 w-4 mr-1" /> Compare
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied!"); }}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>

          <Link to="/insurance" className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><HeartPulse className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="font-bold text-sm">Add pet insurance</p>
              <p className="text-xs text-muted-foreground">Cover accidents & illness from $19/mo</p>
            </div>
            <span className="text-primary text-sm font-semibold">Explore →</span>
          </Link>
        </div>
      </motion.div>

      {/* Trust & transparency */}
      <TrustSection pet={pet} />

      {/* Traits */}
      <TraitsSection pet={pet} />

      {/* Timeline */}
      <TimelineSection pet={pet} />

      {/* Reviews */}
      <ReviewsSection pet={pet} />


      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold mb-6">Similar pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((p, i) => <PetCard key={p.id} pet={p} index={i} />)}
          </div>
        </section>
      )}

      <div className="mt-10 text-center">
        <Link to="/pets" className="text-sm text-primary hover:underline">← Back to all pets</Link>
      </div>

      <Lightbox
        images={galleryImages}
        startIndex={lightboxStart}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="rounded-xl p-3 bg-muted text-center">
      <Icon className="h-5 w-5 mx-auto text-primary mb-1" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
}

function TrustSection({ pet }: { pet: typeof pets[number] }) {
  const v = getVerification(pet);
  return (
    <section className="mt-14">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-5 w-5 text-secondary" />
        <h2 className="text-2xl font-extrabold">Trust & transparency</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrustCard icon={BadgeCheck} label="Seller verified" value={v.verified ? "Yes" : "Pending"} ok={v.verified} />
        <TrustCard icon={Syringe} label="Vaccinated" value={pet.vaccinated ? "Up to date" : "Not yet"} ok={pet.vaccinated} />
        <TrustCard icon={FileCheck2} label="Microchipped" value={v.microchipped ? "Yes" : "No"} ok={v.microchipped} />
        <TrustCard icon={ShieldCheck} label="Background" value={v.background} ok={v.background === "Verified"} />
      </div>
      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <div className="grid place-items-center h-12 w-12 rounded-xl bg-secondary/15 text-secondary">
            <FileCheck2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Health Certificate</p>
            <p className="text-sm text-muted-foreground">Issued by {v.vetName} on {v.issuedOn}</p>
            <p className="text-xs text-muted-foreground mt-1">Certificate ID: <span className="font-mono">{v.certificateId}</span></p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => toast.success("Certificate opened in viewer")}>View</Button>
        </div>
      </div>
    </section>
  );
}

function TrustCard({ icon: Icon, label, value, ok }: { icon: typeof ShieldCheck; label: string; value: string; ok: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border ${ok ? "border-secondary/40 bg-secondary/5" : "border-border bg-card"}`}>
      <Icon className={`h-5 w-5 mb-2 ${ok ? "text-secondary" : "text-muted-foreground"}`} />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function TraitsSection({ pet }: { pet: typeof pets[number] }) {
  const t = getTraits(pet);
  const Bar = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="text-muted-foreground">{value}/5</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );
  return (
    <section className="mt-12 rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-extrabold">Personality & traits</h2>
        <Badge variant="secondary" className="ml-2">{t.temperament}</Badge>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Bar label="Energy" value={t.energy} />
        <Bar label="Trainability" value={t.trainability} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {t.kidsFriendly && <Badge variant="outline">Kid-friendly</Badge>}
        {t.petFriendly && <Badge variant="outline">Pet-friendly</Badge>}
        {t.hypoallergenic && <Badge variant="outline">Hypoallergenic</Badge>}
      </div>
    </section>
  );
}

function TimelineSection({ pet }: { pet: typeof pets[number] }) {
  const events = getTimeline(pet);
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold mb-6">Pet history</h2>
      <ol className="relative border-l-2 border-border ml-3 space-y-6">
        {events.map((e, i) => (
          <li key={i} className="pl-6 relative">
            <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
            <p className="text-xs text-muted-foreground">{e.date}</p>
            <p className="font-bold">{e.title}</p>
            <p className="text-sm text-muted-foreground">{e.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ReviewsSection({ pet }: { pet: typeof pets[number] }) {
  const reviews = getReviews(pet);
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold">Buyer reviews</h2>
          <p className="text-sm text-muted-foreground">{reviews.length} verified reviews · ⭐ {avg} average</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10"><AvatarImage src={r.avatar} /><AvatarFallback>{r.user[0]}</AvatarFallback></Avatar>
              <div>
                <p className="font-medium text-sm">{r.user}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <div className="ml-auto flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

