import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search, ShieldCheck, Truck, HeartHandshake, Star, ArrowRight, Sparkles, Dog, Cat, Bird, Fish, Rabbit, Turtle, Quote, Sun, Trophy, Gift } from "lucide-react";
import { useState } from "react";
import { pets, categories, testimonials, breeders, healthTips } from "@/data/pets";
import { seasonalCollection, contests } from "@/data/commerce";
import { PetCard } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Counter } from "@/components/Counter";
import { useApp } from "@/context/AppContext";

const iconMap = { Dog, Cat, Bird, Fish, Rabbit, Turtle } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PetWorld" },
      { name: "description", content: "Discover dogs, cats, birds, fish, rabbits and exotic pets from trusted breeders. Adoption, comparison, wishlist and more." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { recentlyViewed } = useApp();
  const featured = pets.slice(0, 8);
  const recents = recentlyViewed.map((id) => pets.find((p) => p.id === id)).filter(Boolean).slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-12 pb-20 bg-gradient-soft">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            
            <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
              Find your <span className="text-gradient">furry</span><br/> best friend
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Browse thousands of healthy, verified pets from loving breeders. From playful pups to graceful cats — your new companion is waiting.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/pets", search: { q } as never }); }}
              className="mt-7 flex gap-2 bg-background rounded-full p-2 shadow-soft max-w-lg"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by breed, name, location..." className="border-0 shadow-none focus-visible:ring-0 px-0" />
              </div>
              <Button type="submit" className="rounded-full px-6">Search</Button>
            </form>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: 12000, s: "+", l: "Happy adoptions" },
                { n: 850, s: "+", l: "Verified breeders" },
                { n: 98, s: "%", l: "Satisfaction" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-bold"><Counter to={s.n} suffix={s.s} /></p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-[40%_60%_60%_40%_/_50%_50%_50%_50%] bg-gradient-warm shadow-soft" />
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&auto=format&fit=crop"
                alt="Happy puppy"
                className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-cover rounded-[40%_60%_60%_40%_/_50%_50%_50%_50%]"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-4 glass rounded-2xl p-3 flex items-center gap-3 shadow-card"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center"><ShieldCheck className="h-5 w-5 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground">100%</p><p className="font-bold text-sm">Health Verified</p></div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 glass rounded-2xl p-3 flex items-center gap-3 shadow-card"
              >
                <div className="h-10 w-10 rounded-full bg-secondary/20 grid place-items-center"><Star className="h-5 w-5 text-secondary fill-secondary" /></div>
                <div><p className="text-xs text-muted-foreground">4.9 / 5</p><p className="font-bold text-sm">10k+ Reviews</p></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading kicker="Browse" title="Shop by category" sub="Find your perfect companion across all our pet categories." />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => {
            const Icon = iconMap[c.icon];
            return (
              <motion.div key={c.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}>
                <Link to="/pets" search={{ type: c.name } as never} className="group block">
                  <div className={`aspect-square rounded-2xl bg-gradient-to-br ${c.color} p-6 flex flex-col items-center justify-center text-white shadow-card transition-transform group-hover:-translate-y-2`}>
                    <Icon className="h-10 w-10 mb-3" strokeWidth={1.5} />
                    <p className="font-bold">{c.name}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading kicker="Featured" title="Meet today's stars" sub="Handpicked pets ready for their forever home." compact />
          <Link to="/pets" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p, i) => <PetCard key={p.id} pet={p} index={i} />)}
        </div>
      </section>

      {/* SEASONAL COLLECTION */}
      <section className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl grid md:grid-cols-2 min-h-[360px] shadow-card">
          <img src={seasonalCollection.image} alt={seasonalCollection.name} className="absolute inset-0 h-full w-full object-cover md:relative md:col-span-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent md:hidden" />
          <div className="relative p-8 md:p-12 flex flex-col justify-center bg-card">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-bold w-fit">
              <Sun className="h-3.5 w-3.5" /> Seasonal collection
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold">{seasonalCollection.name}</h2>
            <p className="mt-3 text-muted-foreground max-w-md">{seasonalCollection.tagline}</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link to="/pets"><Button size="lg" className="rounded-full">{seasonalCollection.cta}</Button></Link>
              <Link to="/referrals"><Button size="lg" variant="outline" className="rounded-full"><Gift className="h-4 w-4 mr-2" /> Refer & earn $25</Button></Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CONTESTS */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading kicker="Play" title="Contests & giveaways" sub="Enter for prizes and get featured on PetWorld." compact />
          <Link to="/contests" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">See all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {contests.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to="/contests" className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:-translate-y-1 transition">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={c.image} alt={c.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">{c.endsIn}</span>
                </div>
                <div className="p-4">
                  <p className="font-bold">{c.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Trophy className="h-3 w-3 text-accent" /> {c.prize}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ADOPTION BANNER */}
      <section className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-hero text-primary-foreground p-10 md:p-16">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-medium"><HeartHandshake className="h-3.5 w-3.5" /> Adoption Program</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-extrabold">Adopt. Don't shop. Change a life today.</h2>
              <p className="mt-4 opacity-90 max-w-md">Thousands of rescued pets are waiting for a loving family. Every adoption supports our shelter partners.</p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link to="/pets"><Button size="lg" variant="secondary" className="rounded-full">Browse adoptable pets</Button></Link>
                <Link to="/about"><Button size="lg" variant="outline" className="rounded-full bg-transparent text-primary-foreground border-white/40 hover:bg-white/10">Learn more</Button></Link>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&auto=format&fit=crop" alt="Adopt a pet" className="rounded-2xl shadow-soft aspect-[4/3] object-cover" />
            </div>
          </div>
        </motion.div>
      </section>



      {/* HEALTH TIPS */}
      <section className="container mx-auto px-4 py-10">
        <SectionHeading kicker="Care" title="Pet health tips" sub="Quick wisdom for a healthier, happier companion." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthTips.map((t, i) => (
            <motion.div key={t.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 bg-card border border-border shadow-card hover:-translate-y-1 transition">
              <div className="h-10 w-10 rounded-xl bg-secondary/20 text-secondary grid place-items-center mb-3"><Sparkles className="h-5 w-5" /></div>
              <h3 className="font-bold mb-1">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BREEDERS */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading kicker="Trusted" title="Popular breeders" sub="Top-rated sellers with verified credentials." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {breeders.slice(0, 6).map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-6 bg-card border border-border shadow-card flex items-center gap-4 hover:-translate-y-1 transition">
              <Avatar className="h-16 w-16"><AvatarImage src={b.avatar} /><AvatarFallback>{b.name[0]}</AvatarFallback></Avatar>
              <div className="flex-1">
                <p className="font-bold">{b.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-accent text-accent" /> {b.rating} · {b.pets} pets
                </div>
              </div>
              <ShieldCheck className="h-5 w-5 text-secondary" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENTLY VIEWED */}
      {recents.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <SectionHeading kicker="For you" title="Recently viewed" sub="Pick up where you left off." compact />
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {recents.map((p, i) => p && <PetCard key={p.id} pet={p} index={i} />)}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading kicker="Stories" title="Loved by pet parents" sub="Real stories from happy families." />
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 bg-card border border-border shadow-card relative">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-accent text-accent" />)}</div>
              <p className="text-foreground/90">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar><AvatarImage src={t.avatar} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { Icon: ShieldCheck, t: "100% Verified", d: "All breeders are vetted and approved." },
            { Icon: Truck, t: "Safe Delivery", d: "Pet-safe transport across the country." },
            { Icon: HeartHandshake, t: "Lifetime Support", d: "We're here for you and your pet." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl p-6 bg-card border border-border flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center"><f.Icon className="h-6 w-6" /></div>
              <div><p className="font-bold">{f.t}</p><p className="text-sm text-muted-foreground">{f.d}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ kicker, title, sub, compact }: { kicker: string; title: string; sub?: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "text-center max-w-2xl mx-auto"}>
      <span className="text-xs font-bold uppercase tracking-widest text-primary">{kicker}</span>
      <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}
