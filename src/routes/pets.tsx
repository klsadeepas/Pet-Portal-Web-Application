import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Filter, X, Map as MapIcon, LayoutGrid, ShieldCheck } from "lucide-react";
import { pets, categories } from "@/data/pets";
import { getTraits, getVerification } from "@/data/petExtras";
import { PetCard } from "@/components/PetCard";
import { PetsMap } from "@/components/PetsMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

type SearchParams = { q?: string; type?: string; page?: number };

export const Route = createFileRoute("/pets")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
    page: typeof s.page === "number" ? s.page : 1,
  }),
  head: () => ({
    meta: [
      { title: "Browse Pets — PetWorld" },
      { name: "description", content: "Browse our curated catalog of dogs, cats, birds, fish, rabbits, and exotic pets from verified sellers." },
    ],
  }),
  component: PetsPage,
});

function PetsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [type, setType] = useState<string>(search.type || "All");
  const [gender, setGender] = useState<string>("All");
  const [breed, setBreed] = useState("");
  const [maxAge, setMaxAge] = useState(24);
  const [price, setPrice] = useState<[number, number]>([0, 2500]);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("latest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");
  // Advanced filters
  const [temperament, setTemperament] = useState<string>("Any");
  const [minEnergy, setMinEnergy] = useState(1);
  const [kidsOnly, setKidsOnly] = useState(false);
  const [hypoOnly, setHypoOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const q = search.q?.toLowerCase() || "";
  const page = search.page || 1;
  const perPage = 8;

  const filtered = useMemo(() => {
    let r = pets.filter((p) => {
      const t = getTraits(p);
      const v = getVerification(p);
      return (
        (type === "All" || p.type === type) &&
        (gender === "All" || p.gender === gender) &&
        (!breed || p.breed.toLowerCase().includes(breed.toLowerCase())) &&
        p.ageMonths <= maxAge &&
        p.price >= price[0] && p.price <= price[1] &&
        (!location || p.location.toLowerCase().includes(location.toLowerCase())) &&
        (temperament === "Any" || t.temperament === temperament) &&
        t.energy >= minEnergy &&
        (!kidsOnly || t.kidsFriendly) &&
        (!hypoOnly || t.hypoallergenic) &&
        (!verifiedOnly || v.verified) &&
        (!q || p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
      );
    });
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    else r = [...r].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return r;
  }, [type, gender, breed, maxAge, price, location, q, sort, temperament, minEnergy, kidsOnly, hypoOnly, verifiedOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const setPage = (p: number) => navigate({ to: "/pets", search: { ...search, page: p } });

  const reset = () => {
    setType("All"); setGender("All"); setBreed(""); setMaxAge(24); setPrice([0, 2500]); setLocation("");
    setTemperament("Any"); setMinEnergy(1); setKidsOnly(false); setHypoOnly(false); setVerifiedOnly(false);
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Filters</h3>
        <button onClick={reset} className="text-xs text-primary hover:underline">Reset</button>
      </div>
      <div className="space-y-2">
        <Label>Pet Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Breed</Label><Input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Husky" /></div>
      <div className="space-y-3">
        <Label>Max Age ({maxAge} months)</Label>
        <Slider value={[maxAge]} onValueChange={(v) => setMaxAge(v[0])} min={1} max={24} step={1} />
      </div>
      <div className="space-y-2">
        <Label>Gender</Label>
        <div className="flex gap-3">
          {["All", "Male", "Female"].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <Checkbox checked={gender === g} onCheckedChange={() => setGender(g)} /> {g}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label>Price: ${price[0]} - ${price[1]}</Label>
        <Slider value={price} onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])} min={0} max={2500} step={50} />
      </div>
      <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or state" /></div>

      <div className="pt-4 border-t border-border space-y-4">
        <h4 className="text-sm font-bold flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-secondary" /> Advanced</h4>
        <div className="space-y-2">
          <Label>Temperament</Label>
          <Select value={temperament} onValueChange={setTemperament}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Any", "Calm", "Playful", "Energetic", "Affectionate", "Independent"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label>Min Energy ({minEnergy}/5)</Label>
          <Slider value={[minEnergy]} onValueChange={(v) => setMinEnergy(v[0])} min={1} max={5} step={1} />
        </div>
        <label className="flex items-center justify-between text-sm">
          <span>Kid-friendly only</span>
          <Switch checked={kidsOnly} onCheckedChange={setKidsOnly} />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Hypoallergenic</span>
          <Switch checked={hypoOnly} onCheckedChange={setHypoOnly} />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Verified sellers only</span>
          <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
        </label>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-extrabold">Find your pet</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} pets matching your search</p>
      </motion.div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block sticky top-20 self-start rounded-2xl p-6 bg-card border border-border shadow-card">
          {FilterPanel}
        </aside>

        <div>
          <div className="flex gap-2 mb-6 items-center justify-between flex-wrap">
            <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <div className="inline-flex rounded-full bg-muted p-1">
                <button onClick={() => setView("grid")} className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                  <LayoutGrid className="h-3.5 w-3.5" /> Grid
                </button>
                <button onClick={() => setView("map")} className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${view === "map" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                  <MapIcon className="h-3.5 w-3.5" /> Map
                </button>
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="low">Price: Low to High</SelectItem>
                  <SelectItem value="high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {view === "map" ? (
            <PetsMap ids={filtered.map((p) => p.id)} />
          ) : paged.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <div className="text-6xl mb-3">🔍</div>
              <p className="font-bold text-lg">No pets found</p>
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
              <Button onClick={reset} className="mt-4 rounded-full">Reset filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paged.map((p, i) => <PetCard key={p.id} pet={p} index={i} />)}
            </div>
          )}

          {view === "grid" && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background p-6 overflow-y-auto">
            <button onClick={() => setFiltersOpen(false)} className="absolute top-4 right-4"><X className="h-5 w-5" /></button>
            {FilterPanel}
          </motion.aside>
        </div>
      )}
    </div>
  );
}
