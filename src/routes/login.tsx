import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — PetWorld" }] }),
  component: Login,
});

function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Please enter a valid email");
    if (password.length < 6) return setErr("Password must be at least 6 characters");
    login(email);
    toast.success("Welcome back!");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl"><PawPrint className="h-6 w-6" /> PetWorld</Link>
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">Welcome back to the world of pets 🐾</h2>
            <p className="mt-3 opacity-90 max-w-md">Sign in to access your favorites, manage listings, and chat with sellers.</p>
          </div>
          <div />
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold">Sign in</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Enter your details below.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} className="pl-9" type="email" placeholder="you@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} className="pl-9 pr-9" type={show ? "text" : "password"} placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full rounded-full" size="lg">Sign in</Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OR CONTINUE WITH <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-full">🌐 Google</Button>
            <Button variant="outline" className="rounded-full"> Apple</Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
