import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Users, Heart, MessageCircle, Calendar, MapPin, ThumbsUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { communityProfiles, communityTips, meetups } from "@/data/petExtras";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — PetWorld" },
      { name: "description", content: "Connect with pet owners, share tips, join local meetups, and read trusted reviews." },
      { property: "og:title", content: "PetWorld Community" },
      { property: "og:description", content: "Pet owner profiles, community tips, and local meetups." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const [tab, setTab] = useState<"profiles" | "tips" | "meetups">("profiles");
  const [liked, setLiked] = useState<string[]>([]);
  const toggleLike = (id: string) => {
    setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-3">
          <Users className="h-4 w-4" /> Community
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold">A home for pet lovers</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Meet fellow owners, share what works, and find playdates near you.
        </p>
      </motion.div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full bg-muted p-1">
          {(["profiles", "tips", "meetups"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition ${tab === t ? "bg-background shadow-card" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "profiles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityProfiles.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-card border border-border overflow-hidden shadow-card"
            >
              <div className="p-6 flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarImage src={p.avatar} /><AvatarFallback>{p.name[0]}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.followers.toLocaleString()} followers</p>
                </div>
              </div>
              <p className="px-6 text-sm text-muted-foreground">{p.bio}</p>
              <div className="px-6 mt-3 flex flex-wrap gap-1">
                {p.pets.map((pet) => <Badge key={pet} variant="secondary">{pet}</Badge>)}
              </div>
              <div className="grid grid-cols-3 gap-1 mt-4">
                {p.photos.map((src, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden bg-muted">
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover hover:scale-110 transition" />
                  </div>
                ))}
              </div>
              <div className="p-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => toast.success(`Following ${p.name}`)}>
                  <Plus className="h-4 w-4 mr-1" /> Follow
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => toast.success("Message sent")}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {tab === "tips" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityTips.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-card border border-border p-6 shadow-card flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10"><AvatarImage src={t.avatar} /><AvatarFallback>{t.author[0]}</AvatarFallback></Avatar>
                <div>
                  <p className="font-medium text-sm">{t.author}</p>
                  <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                </div>
              </div>
              <h3 className="font-bold text-lg">{t.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{t.body}</p>
              <button
                onClick={() => toggleLike(t.id)}
                className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition self-start"
              >
                <ThumbsUp className={`h-4 w-4 ${liked.includes(t.id) ? "fill-primary text-primary" : ""}`} />
                {t.likes + (liked.includes(t.id) ? 1 : 0)} helpful
              </button>
            </motion.article>
          ))}
        </div>
      )}

      {tab === "meetups" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetups.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-card border border-border overflow-hidden shadow-card group"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img src={m.image} alt={m.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg">{m.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" />{m.location}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{m.date}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {m.attendees} going</span>
                  <Button size="sm" className="rounded-full" onClick={() => toast.success("You're going! 🎉")}>RSVP</Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
