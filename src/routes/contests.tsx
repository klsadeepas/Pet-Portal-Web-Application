import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Trophy, Users, Clock, Sparkles, Upload } from "lucide-react";
import { contests } from "@/data/commerce";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contests")({
  head: () => ({
    meta: [
      { title: "Pet contests & giveaways — PetWorld" },
      { name: "description", content: "Enter monthly photo, story and recipe contests. Win prizes and get featured on PetWorld." },
    ],
  }),
  component: Contests,
});

function Contests() {
  return (
    <div>
      <section className="bg-gradient-soft py-14">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 text-xs font-medium text-primary border border-primary/20">
            <Trophy className="h-3.5 w-3.5" /> Contests
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold">Show off your <span className="text-gradient">superstar.</span></h1>
          <p className="mt-4 text-muted-foreground">Enter monthly community contests. Vote, share, and win prizes for you and your pet.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {contests.map((c, i) => (
            <motion.article key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group rounded-3xl overflow-hidden border border-border bg-card shadow-card hover:-translate-y-1 transition">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.image} alt={c.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 text-xs font-semibold backdrop-blur">{c.tag}</span>
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  <Clock className="h-3 w-3" /> {c.endsIn}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-lg">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-accent" /> {c.prize}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Users className="h-3 w-3" /> {c.entries.toLocaleString()} entries</p>
                <Button className="w-full rounded-full mt-4" onClick={() => toast.success("Entry started — upload flow opened")}>
                  <Upload className="h-4 w-4 mr-2" /> Enter contest
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-hero text-primary-foreground p-10 md:p-14 relative overflow-hidden">
          <Sparkles className="absolute top-6 right-6 h-24 w-24 opacity-10" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold">Host a themed contest for your community</h2>
            <p className="mt-3 opacity-90">Breeders, shelters and pet brands can sponsor a PetWorld contest and reach thousands of pet lovers.</p>
            <Button variant="secondary" size="lg" className="rounded-full mt-6" onClick={() => toast.success("We'll be in touch!")}>Sponsor a contest</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
