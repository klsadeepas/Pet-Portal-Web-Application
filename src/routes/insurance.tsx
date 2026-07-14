import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";
import { insurancePlans } from "@/data/commerce";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Pet insurance — Wag by PetWorld" },
      { name: "description", content: "Protect your companion with accident, illness and wellness coverage starting at $19/month." },
    ],
  }),
  component: Insurance,
});

function Insurance() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const factor = billing === "yearly" ? 10 : 1;

  return (
    <div>
      <section className="bg-gradient-soft py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 text-xs font-medium text-primary border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Pet insurance
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold">Vet bills, <span className="text-gradient">covered.</span></h1>
          <p className="mt-4 text-muted-foreground">Peace of mind from day one. Choose a plan and add it to any pet you reserve on PetWorld.</p>
          <div className="mt-6 inline-flex bg-background rounded-full p-1 border border-border">
            {(["monthly", "yearly"] as const).map((b) => (
              <button key={b} onClick={() => setBilling(b)} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${billing === b ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {b === "yearly" ? "Yearly — 2 months free" : "Monthly"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {insurancePlans.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`relative rounded-3xl p-8 border-2 ${p.popular ? "border-primary shadow-soft" : "border-border"} bg-card`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">Most popular</span>
              )}
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${p.color} grid place-items-center text-white mb-4`}>
                <HeartPulse className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-extrabold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
              <p className="mt-4 text-4xl font-extrabold">${p.price * factor}<span className="text-base font-normal text-muted-foreground">/{billing === "yearly" ? "yr" : "mo"}</span></p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Button className="w-full rounded-full mt-6" variant={p.popular ? "default" : "outline"} onClick={() => toast.success(`${p.name} added to your account`)}>
                Choose {p.name}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { Icon: Sparkles, t: "No breed exclusions", d: "Every breed, every mix — same coverage tiers." },
            { Icon: ShieldCheck, t: "Direct vet pay", d: "We settle with your vet so you never front the bill." },
            { Icon: HeartPulse, t: "Wellness rewards", d: "Earn credits every year your pet stays healthy." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl p-6 bg-muted/40 flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><f.Icon className="h-6 w-6" /></div>
              <div><p className="font-bold">{f.t}</p><p className="text-sm text-muted-foreground">{f.d}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
