import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Pencil, Trash2, DollarSign, Eye, Heart, Package, X } from "lucide-react";
import { pets as seedPets, categories, type Pet } from "@/data/pets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Counter } from "@/components/Counter";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Seller Dashboard — PetWorld" }] }),
  component: Dashboard,
});

type Draft = Pick<Pet, "name" | "type" | "breed" | "age" | "gender" | "price" | "location" | "image" | "description">;

const empty: Draft = { name: "", type: "Dogs", breed: "", age: "", gender: "Male", price: 0, location: "", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop", description: "" };

function Dashboard() {
  const { user } = useApp();
  const [list, setList] = useState<Pet[]>(seedPets.slice(0, 6));
  const [drawer, setDrawer] = useState<{ mode: "add" } | { mode: "edit"; id: string } | null>(null);
  const [draft, setDraft] = useState<Draft>(empty);

  const open = (mode: "add" | "edit", pet?: Pet) => {
    if (mode === "edit" && pet) { setDraft({ ...pet }); setDrawer({ mode: "edit", id: pet.id }); }
    else { setDraft(empty); setDrawer({ mode: "add" }); }
  };

  const save = () => {
    if (!draft.name || !draft.breed) return toast.error("Name and breed are required");
    if (drawer?.mode === "edit") {
      setList((l) => l.map((p) => p.id === drawer.id ? { ...p, ...draft } : p));
      toast.success("Listing updated");
    } else {
      const id = `new-${Date.now()}`;
      setList((l) => [{ ...seedPets[0], ...draft, id, ageMonths: 6, vaccinated: true, health: "Excellent", gallery: [draft.image], createdAt: new Date().toISOString() }, ...l]);
      toast.success("Pet listed!");
    }
    setDrawer(null);
  };

  const remove = (id: string) => { setList((l) => l.filter((p) => p.id !== id)); toast.success("Listing deleted"); };

  const stats = [
    { Icon: Package, label: "Active listings", value: list.length, suffix: "" },
    { Icon: Eye, label: "Total views", value: 4287, suffix: "" },
    { Icon: Heart, label: "Wishlisted", value: 312, suffix: "" },
    { Icon: DollarSign, label: "Revenue", value: 12850, suffix: "" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-4 items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar || "https://i.pravatar.cc/100?img=12"} />
            <AvatarFallback>{(user?.name || "S")[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-extrabold">{user?.name || "Seller"}'s Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your listings and track performance.</p>
          </div>
        </div>
        <Button onClick={() => open("add")} className="rounded-full"><Plus className="h-4 w-4 mr-2" /> Add new pet</Button>
      </motion.div>

      {!user && (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center mb-8">
          <p className="text-sm text-muted-foreground">You're viewing the demo dashboard. <Link to="/login" className="text-primary font-semibold">Sign in</Link> to personalize.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-5 bg-card border border-border shadow-card">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3"><s.Icon className="h-5 w-5" /></div>
            <p className="text-3xl font-extrabold"><Counter to={s.value} /></p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="font-bold text-lg">Your listings</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-4">Pet</th>
                <th className="p-4 hidden md:table-cell">Type</th>
                <th className="p-4 hidden lg:table-cell">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div><p className="font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.breed}</p></div>
                  </td>
                  <td className="p-4 hidden md:table-cell">{p.type}</td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">{p.location}</td>
                  <td className="p-4 font-bold text-primary">${p.price}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => open("edit", p)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(p.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(null)} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} className="absolute right-0 top-0 bottom-0 w-full sm:w-[480px] bg-background overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{drawer.mode === "add" ? "Add new pet" : "Edit listing"}</h2>
              <button onClick={() => setDrawer(null)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
              <Field label="Type">
                <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as Pet["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Breed"><Input value={draft.breed} onChange={(e) => setDraft({ ...draft, breed: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Age"><Input value={draft.age} onChange={(e) => setDraft({ ...draft, age: e.target.value })} placeholder="e.g. 3 months" /></Field>
                <Field label="Gender">
                  <Select value={draft.gender} onValueChange={(v) => setDraft({ ...draft, gender: v as "Male" | "Female" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price ($)"><Input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: +e.target.value })} /></Field>
                <Field label="Location"><Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></Field>
              </div>
              <Field label="Image URL"><Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} /></Field>
              <Field label="Description"><Textarea rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
              <Button onClick={save} className="w-full rounded-full" size="lg">{drawer.mode === "add" ? "Publish listing" : "Save changes"}</Button>
            </div>
          </motion.aside>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}
