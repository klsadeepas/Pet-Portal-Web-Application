import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Target, Eye, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — PetWorld" }, { name: "description", content: "Our story: connecting pets with loving families through a trusted, compassionate marketplace." }] }),
  component: About,
});

const team = [
  { name: "Emma Rivera", role: "Founder & CEO", avatar: "https://i.pravatar.cc/200?img=47" },
  { name: "Noah Park", role: "Head of Welfare", avatar: "https://i.pravatar.cc/200?img=33" },
  { name: "Aisha Khan", role: "Lead Veterinarian", avatar: "https://i.pravatar.cc/200?img=49" },
  { name: "Diego Martinez", role: "Community Manager", avatar: "https://i.pravatar.cc/200?img=14" },
];

function About() {
  return (
    <div>
      <section className="bg-gradient-soft py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Story</span>
            <h1 className="mt-3 text-5xl md:text-6xl font-extrabold">Building a world where every pet finds love</h1>
            <p className="mt-5 text-lg text-muted-foreground">PetWorld started with a simple belief: every pet deserves a loving family, and every family deserves a trusted way to find their companion.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&auto=format&fit=crop" alt="People with pets" className="rounded-3xl shadow-card aspect-[4/3] object-cover" />
        <div>
          <h2 className="text-4xl font-extrabold">From shelter to sofa</h2>
          <p className="mt-4 text-muted-foreground">Founded in 2022, PetWorld has helped 12,000+ pets find their forever homes. We partner with verified breeders and shelters to ensure every listing is genuine, healthy, and loved.</p>
          <p className="mt-3 text-muted-foreground">Our team includes veterinarians, animal welfare experts, and lifelong pet parents. We're building the most trusted pet marketplace, one happy adoption at a time.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-5">
        {[
          { Icon: Target, t: "Our Mission", d: "Connect every pet with a loving, responsible home." },
          { Icon: Eye, t: "Our Vision", d: "A world where pets are valued, healthy, and cherished." },
          { Icon: Heart, t: "Our Values", d: "Compassion, transparency, and lifelong support." },
        ].map((v) => (
          <div key={v.t} className="rounded-2xl p-8 bg-card border border-border shadow-card">
            <div className="h-12 w-12 rounded-xl bg-gradient-warm text-primary-foreground grid place-items-center mb-4"><v.Icon className="h-6 w-6" /></div>
            <h3 className="text-xl font-bold">{v.t}</h3>
            <p className="mt-2 text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Team</span>
          <h2 className="mt-2 text-4xl font-extrabold">The humans behind PetWorld</h2>
          <p className="mt-3 text-muted-foreground">A team of pet lovers, vets, and builders.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {team.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="text-center rounded-2xl p-6 bg-card border border-border shadow-card">
              <Avatar className="h-24 w-24 mx-auto mb-3"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
              <p className="font-bold">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-cool text-primary-foreground p-10 md:p-16 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-extrabold max-w-2xl mx-auto">Pet care, simplified for every household</h2>
          <p className="mt-3 max-w-xl mx-auto opacity-90">From feeding guides to vet appointments — we've got resources for every step of your pet's journey.</p>
        </div>
      </section>
    </div>
  );
}
