import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, MessageCircle, HelpCircle, Headphones, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — PetWorld" }] }),
  component: Contact,
});

const faqs = [
  { q: "How do I know sellers are trustworthy?", a: "All sellers undergo verification including ID checks, breeding credentials, and home visits where applicable." },
  { q: "What if my pet has health issues after purchase?", a: "Every pet comes with a 14-day health guarantee. Contact our support team and we'll work with you and the seller to resolve any issues." },
  { q: "Can I return a pet?", a: "We strongly discourage returns, but understand it happens. We facilitate re-homing through our network when necessary." },
  { q: "How does shipping work?", a: "We partner with certified pet transport services for safe delivery. Local pickup is always free." },
  { q: "Is adoption free?", a: "Adoption fees vary by pet and shelter, usually covering vaccinations and initial care." },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Get in touch</span>
        <h1 className="mt-2 text-5xl font-extrabold">We'd love to hear from you</h1>
        <p className="mt-3 text-muted-foreground">Have a question? Need support? Want to partner with us? Reach out anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { Icon: Mail, t: "Email", d: "hello@petworld.app" },
          { Icon: Phone, t: "Phone", d: "+1 (555) 123-4567" },
          { Icon: MessageCircle, t: "Live Chat", d: "Available 9am–9pm EST" },
        ].map((c) => (
          <motion.div key={c.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl p-6 bg-card border border-border shadow-card flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-warm text-primary-foreground grid place-items-center"><c.Icon className="h-5 w-5" /></div>
            <div><p className="font-bold">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-3xl p-8 bg-card border border-border shadow-card">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            <Button type="submit" className="w-full rounded-full" size="lg">Send message</Button>
          </form>
        </div>

        <div>
          <div className="rounded-3xl overflow-hidden border border-border shadow-card aspect-[4/3] bg-muted">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.0!2d-73.985428!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU1LjciTiA3M8KwNTknMDcuNSJX!5e0!3m2!1sen!2sus!4v1700000000000"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> 350 Park Ave, New York, NY 10022</div>
        </div>
      </div>

      <section className="mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="mt-2 text-4xl font-extrabold">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`${i}`} className="border border-border rounded-2xl mb-3 px-5 bg-card">
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-20 grid md:grid-cols-3 gap-4">
        {[
          { Icon: HelpCircle, t: "Help Center", d: "Browse articles and guides" },
          { Icon: Headphones, t: "24/7 Support", d: "We're always one tap away" },
          { Icon: MessageCircle, t: "Community", d: "Connect with pet parents" },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl p-6 bg-gradient-soft border border-border text-center">
            <c.Icon className="h-8 w-8 mx-auto text-primary mb-3" />
            <p className="font-bold">{c.t}</p>
            <p className="text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
