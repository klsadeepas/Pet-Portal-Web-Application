import { Link } from "@tanstack/react-router";
import { PawPrint, Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-warm text-primary-foreground">
              <PawPrint className="h-5 w-5" />
            </span>
            Pet<span className="text-primary">World</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The trusted marketplace to find your perfect companion. Verified breeders, healthy pets, loving homes.
          </p>
          <div className="flex gap-2 pt-2">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/pets" className="hover:text-primary">All Pets</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-primary">Help Center</Link></li>
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
            <li><Link to="/dashboard" className="hover:text-primary">Sell on PetWorld</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">Weekly pet tips & exclusive listings.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" placeholder="you@email.com" className="w-full pl-9 pr-3 h-10 rounded-full bg-background border border-border text-sm" />
            </div>
            <button className="px-4 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PetWorld. Crafted with love for pets and their humans.
      </div>
    </footer>
  );
}
