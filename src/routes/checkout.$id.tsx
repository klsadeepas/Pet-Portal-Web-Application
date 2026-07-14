import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, ShieldCheck, Truck, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import { pets } from "@/data/pets";
import { depositFor, shippingEta, trackingNumber, buildTimeline } from "@/data/commerce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout/$id")({
  loader: ({ params }) => {
    const pet = pets.find((p) => p.id === params.id);
    if (!pet) throw notFound();
    return { pet };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `Reserve ${loaderData.pet.name} — PetWorld` : "Checkout — PetWorld" }],
  }),
  component: Checkout,
});

function Checkout() {
  const { pet } = Route.useLoaderData();
  const { addOrder } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ name: "", street: "", city: "", zip: "", phone: "" });
  const [pay, setPay] = useState({ card: "", exp: "", cvc: "" });
  const deposit = depositFor(pet.price);

  const complete = () => {
    const placedAt = new Date().toISOString();
    const id = "ord-" + Date.now();
    addOrder({
      id,
      petId: pet.id,
      petName: pet.name,
      petImage: pet.image,
      price: pet.price,
      deposit,
      status: "Preparing",
      placedAt,
      eta: shippingEta(),
      address: `${addr.street}, ${addr.city} ${addr.zip}`,
      tracking: trackingNumber(),
      timeline: buildTimeline(placedAt),
    });
    toast.success("Reservation confirmed!");
    nav({ to: "/tracking/$id", params: { id } });
  };

  const steps = ["Shipping", "Payment", "Review"];

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Link to="/pets/$id" params={{ id: pet.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to {pet.name}
      </Link>

      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-9 w-9 rounded-full grid place-items-center font-bold text-sm ${step > i ? "bg-secondary text-secondary-foreground" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-secondary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border p-6 space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Delivery address</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Full name"><Input value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} placeholder="Jane Doe" /></Field>
                <Field label="Phone"><Input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} placeholder="+1 555 000 0000" /></Field>
                <Field label="Street" className="sm:col-span-2"><Input value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} placeholder="123 Main St" /></Field>
                <Field label="City"><Input value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} placeholder="Los Angeles" /></Field>
                <Field label="ZIP"><Input value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} placeholder="90001" /></Field>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-sm flex gap-3">
                <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                <p>Every pet ships via our vetted pet-safe courier. Climate-controlled, tracked door-to-door, insured for the full purchase price.</p>
              </div>
              <div className="flex justify-end">
                <Button size="lg" className="rounded-full" onClick={() => setStep(2)} disabled={!addr.name || !addr.street || !addr.city || !addr.zip}>Continue to payment</Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Deposit payment</h2>
              <p className="text-sm text-muted-foreground">Only a <span className="font-semibold text-foreground">${deposit} refundable deposit</span> is charged today. The balance is paid on delivery.</p>
              <Field label="Card number"><Input value={pay.card} onChange={(e) => setPay({ ...pay, card: e.target.value })} placeholder="4242 4242 4242 4242" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry"><Input value={pay.exp} onChange={(e) => setPay({ ...pay, exp: e.target.value })} placeholder="MM/YY" /></Field>
                <Field label="CVC"><Input value={pay.cvc} onChange={(e) => setPay({ ...pay, cvc: e.target.value })} placeholder="123" /></Field>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-sm flex gap-3">
                <Lock className="h-5 w-5 text-secondary shrink-0" />
                <p>Payments are processed over an encrypted channel and held in escrow until you confirm delivery.</p>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="rounded-full" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" className="rounded-full" onClick={() => setStep(3)} disabled={pay.card.length < 12}>Review order</Button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold">Review & confirm</h2>
              <Detail k="Delivering to" v={`${addr.name}, ${addr.street}, ${addr.city} ${addr.zip}`} />
              <Detail k="Payment method" v={`Card ending in ${pay.card.slice(-4) || "••••"}`} />
              <Detail k="Estimated arrival" v={shippingEta()} />
              <div className="flex justify-between pt-2">
                <Button variant="outline" className="rounded-full" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" className="rounded-full" onClick={complete}>Confirm reservation — ${deposit}</Button>
              </div>
            </>
          )}
        </motion.div>

        <aside className="rounded-2xl bg-card border border-border p-5 h-fit sticky top-24">
          <div className="flex gap-3 mb-4">
            <img src={pet.image} alt={pet.name} className="h-20 w-20 rounded-xl object-cover" />
            <div>
              <p className="font-bold">{pet.name}</p>
              <p className="text-xs text-muted-foreground">{pet.breed} · {pet.age}</p>
              <p className="text-xs text-muted-foreground">{pet.location}</p>
            </div>
          </div>
          <dl className="space-y-2 text-sm border-t border-border pt-4">
            <Row k="Purchase price" v={`$${pet.price}`} />
            <Row k="Delivery" v="Included" />
            <Row k="Health guarantee" v="Included" />
            <div className="border-t border-border my-3" />
            <Row k="Refundable deposit today" v={`$${deposit}`} bold />
            <Row k="Balance on delivery" v={`$${pet.price - deposit}`} muted />
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className}`}><Label>{label}</Label>{children}</div>;
}
function Row({ k, v, bold, muted }: { k: string; v: string; bold?: boolean; muted?: boolean }) {
  return <div className={`flex justify-between ${bold ? "font-bold text-base" : muted ? "text-muted-foreground" : ""}`}><span>{k}</span><span>{v}</span></div>;
}
function Detail({ k, v }: { k: string; v: string }) {
  return <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="font-medium text-sm">{v}</p></div>;
}
