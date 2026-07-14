import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Clock, ArrowLeft, Calendar } from "lucide-react";
import { blogPosts } from "@/data/pets";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/blog/$id")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.id === params.id);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const { post } = loaderData;
    const title = `${post.title} | PetWorld Blog`;
    const url = `/blog/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: post.image },
        { property: "og:image:alt", content: post.title },
        { property: "article:section", content: post.category },
        { property: "article:published_time", content: post.date },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            datePublished: post.date,
            articleSection: post.category,
            author: { "@type": "Organization", name: "PetWorld" },
            publisher: { "@type": "Organization", name: "PetWorld" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Back to blog</Link>
    </div>
  ),
  component: BlogDetails,
});

function BlogDetails() {
  const { post } = Route.useLoaderData();
  const related = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <article className="container mx-auto px-4 py-10 max-w-4xl">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{post.title}</h1>
        <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
        </div>

        <div className="mt-8 aspect-[16/9] rounded-3xl overflow-hidden bg-muted shadow-card">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>

        <div className="mt-10 prose prose-lg max-w-none dark:prose-invert">
          <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <p className="mt-6 leading-relaxed">
            Welcome to the full article. Our experts at PetWorld have curated this {post.category.toLowerCase()} guide to help you give your companion the best life possible. Whether you're a first-time owner or a seasoned pet parent, the tips below will help you build a stronger bond with your animal.
          </p>
          <h2 className="text-2xl font-bold mt-8">Why this matters</h2>
          <p className="leading-relaxed">
            Understanding your pet's needs is the foundation of a happy household. Small daily habits — quality nutrition, regular play, gentle training — compound over time into a thriving relationship.
          </p>
          <h2 className="text-2xl font-bold mt-8">Practical takeaways</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Start with the basics: food, water, shelter, and routine vet visits.</li>
            <li>Spend dedicated one-on-one time every day, even just 10 minutes.</li>
            <li>Observe behavior changes — they often signal health or stress.</li>
            <li>Invest in enrichment: toys, training, and exploration.</li>
          </ul>
          <p className="mt-6 leading-relaxed">
            Have questions? Reach out via our contact page, or browse the rest of the PetWorld blog for more in-depth guides.
          </p>
        </div>
      </motion.div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold mb-6">More from {post.category}</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link key={p.id} to="/blog/$id" params={{ id: p.id }} className="group rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:-translate-y-1 transition">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">{p.category}</Badge>
                  <h3 className="font-bold leading-snug">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
