import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/pets";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Pet Care Blog — Tips, Guides & Stories | PetWorld" },
      { name: "description", content: "Expert pet care articles, breed guides, training tips and heartwarming stories from PetWorld's team of pet specialists." },
      { property: "og:title", content: "Pet Care Blog | PetWorld" },
      { property: "og:description", content: "Expert pet care articles, breed guides, and training tips." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { property: "og:image", content: blogPosts[0]?.image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: blogPosts[0]?.image },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

const cats = ["All", "Dogs", "Cats", "Birds", "Fish", "Rabbits", "Exotic"];

function Blog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const posts = useMemo(() => blogPosts.filter((p) =>
    (cat === "All" || p.category === cat) &&
    (!q || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
  ), [q, cat]);

  const featured = posts[0];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Pet care wisdom</span>
        <h1 className="mt-2 text-5xl font-extrabold">The PetWorld Blog</h1>
        <p className="mt-3 text-muted-foreground">Expert advice, breed guides, training tips and heartwarming stories.</p>
      </div>

      <div className="max-w-xl mx-auto relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles..." className="pl-10 h-12 rounded-full" />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>
            {c}
          </button>
        ))}
      </div>

      {featured && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog/$id" params={{ id: featured.id }}
            className="grid md:grid-cols-2 gap-6 rounded-3xl overflow-hidden bg-card border border-border shadow-card mb-10 group">
            <img src={featured.image} alt={featured.title} className="aspect-[4/3] md:aspect-auto md:h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-8 flex flex-col justify-center">
              <Badge className="self-start mb-3">{featured.category}</Badge>
              <h2 className="text-3xl font-extrabold leading-tight">{featured.title}</h2>
              <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{featured.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.readTime}</span>
              </div>
              <span className="mt-6 self-start inline-flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(1).map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to="/blog/$id" params={{ id: p.id }}
              className="block rounded-2xl overflow-hidden bg-card border border-border shadow-card group hover:-translate-y-1 transition h-full">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="mb-2">{p.category}</Badge>
                <h3 className="font-bold text-lg leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{p.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readTime}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No articles match your search.</div>
      )}
    </div>
  );
}
