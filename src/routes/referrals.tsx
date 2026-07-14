import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Gift, Copy, Share2, Users, DollarSign, PawPrint } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Counter } from "@/components/Counter";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Refer friends, earn credit — PetWorld" },
      { name: "description", content: "Give $25, get $25 in PetWorld credit for every friend that adopts through your link." },
    ],
  }),
  component: Referrals,
});

function Referrals() {
  const { referralCode, referralCredits, addReferralCredits } = useApp();
  const link = typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : `/?ref=${referralCode}`;

  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try { await navigator.share({ title: "Join me on PetWorld", text: "Get $25 off your first pet adoption 🐾", url: link }); return; } catch {}
    }
    navigator.clipboard?.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const invitees = [
    { name: "Emma R.", status: "Adopted", earned: 25, avatar: "https://i.pravatar.cc/80?img=32" },
    { name: "Noah T.", status: "Signed up", earned: 0, avatar: "https://i.pravatar.cc/80?img=17" },
    { name: "Priya K.", status: "Adopted", earned: 25, avatar: "https://i.pravatar.cc/80?img=44" },
  ];

  return (
    <div>
      <section className="bg-gradient-warm text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium"><Gift className="h-3.5 w-3.5" /> Refer & earn</span>
            <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-[1.05]">Give <span className="underline decoration-4 underline-offset-4">$25</span>, get $25.</h1>
            <p className="mt-4 opacity-90 max-w-md">Share your link. Friends save $25 on their first adoption. You earn $25 in PetWorld credit toward accessories, insurance or your next pet.</p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
              <Stat n={referralCredits} l="Credit balance" prefix="$" />
              <Stat n={2} l="Friends adopted" />
              <Stat n={50} l="Lifetime earned" prefix="$" />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/95 text-foreground p-6 shadow-soft">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Your referral code</p>
            <p className="mt-1 text-4xl font-extrabold font-mono text-primary">{referralCode}</p>
            <div className="mt-4 flex gap-2">
              <Input readOnly value={link} className="rounded-full" />
              <Button className="rounded-full shrink-0" onClick={() => { navigator.clipboard?.writeText(link); toast.success("Copied"); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-full" onClick={share}><Share2 className="h-4 w-4 mr-1" /> Share</Button>
              <Button variant="outline" className="rounded-full" onClick={() => { addReferralCredits(25); toast.success("+$25 credit added"); }}><DollarSign className="h-4 w-4 mr-1" /> Redeem</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold mb-8 text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: Share2, t: "Share your link", d: "Send it via text, email or social — one link works everywhere." },
            { Icon: PawPrint, t: "Friend adopts", d: "They get $25 off any pet. Every breed, every seller." },
            { Icon: Gift, t: "You earn $25", d: "Credit lands in your account the moment their pet ships." },
          ].map((s, i) => (
            <motion.div key={s.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 bg-card border border-border text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-3"><s.Icon className="h-6 w-6" /></div>
              <p className="font-bold text-lg">{s.t}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Your invitees</h2>
          <div className="divide-y divide-border">
            {invitees.map((i) => (
              <div key={i.name} className="flex items-center gap-3 py-3">
                <img src={i.avatar} alt={i.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1"><p className="font-medium text-sm">{i.name}</p><p className="text-xs text-muted-foreground">{i.status}</p></div>
                <span className={`text-sm font-bold ${i.earned ? "text-secondary" : "text-muted-foreground"}`}>{i.earned ? `+$${i.earned}` : "Pending"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, l, prefix }: { n: number; l: string; prefix?: string }) {
  return (
    <div>
      <p className="text-3xl font-extrabold">{prefix}<Counter to={n} /></p>
      <p className="text-xs opacity-80">{l}</p>
    </div>
  );
}
