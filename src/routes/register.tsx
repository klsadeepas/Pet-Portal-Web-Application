import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, User, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — PetWorld" }] }),
  component: Register,
});

function Register() {
  const { login } = useApp();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.length < 2) return setErr("Name is too short");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr("Invalid email");
    if (form.password.length < 6) return setErr("Password must be at least 6 characters");
    login(form.email, form.name);
    toast.success("Account created — welcome!");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 order-2 lg:order-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold">Create your account</h1>
          <p className="text-muted-foreground mt-1">Join the PetWorld family today.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErr(""); }} className="pl-9" placeholder="Jane Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErr(""); }} className="pl-9" type="email" placeholder="you@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErr(""); }} className="pl-9 pr-9" type={show ? "text" : "password"} placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full rounded-full" size="lg">Create account</Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-full">🌐 Google</Button>
            <Button variant="outline" className="rounded-full"> Apple</Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
      <div className="hidden lg:block relative bg-gradient-cool overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground">
          <div />
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">Start your journey with a new best friend 🐶</h2>
            <p className="mt-3 opacity-90 max-w-md">Save favorites, message sellers, and list your own pets — all in one place.</p>
          </div>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl"><PawPrint className="h-6 w-6" /> PetWorld</Link>
        </div>
      </div>
    </div>
  );
}
