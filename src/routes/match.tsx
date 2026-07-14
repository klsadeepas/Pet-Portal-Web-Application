import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { matchQuestions, matchPets, type MatchAnswers } from "@/data/petExtras";
import { PetCard } from "@/components/PetCard";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Pet Matching Quiz — PetWorld" },
      { name: "description", content: "Take our quick lifestyle quiz and get matched with pets that fit your home, energy, and family." },
      { property: "og:title", content: "Find your perfect pet match" },
      { property: "og:description", content: "A 5-question quiz that recommends pets matching your lifestyle." },
    ],
  }),
  component: MatchPage,
});

function MatchPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<MatchAnswers>({});
  const [done, setDone] = useState(false);

  const q = matchQuestions[step];
  const total = matchQuestions.length;
  const progress = (step / total) * 100;

  const pick = (value: string) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step + 1 < total) setStep(step + 1);
    else setDone(true);
  };

  const reset = () => { setAnswers({}); setStep(0); setDone(false); };

  if (done) {
    const results = matchPets(answers);
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Sparkles className="h-4 w-4" /> Your matches
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold">Pets made for you</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Based on your answers, here are the pets that best fit your lifestyle.
          </p>
          <Button onClick={reset} variant="outline" className="mt-4 rounded-full"><RotateCcw className="h-4 w-4 mr-2" /> Retake quiz</Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map(({ pet, score }, i) => (
            <div key={pet.id} className="relative">
              <PetCard pet={pet} index={i} />
              <div className="absolute -top-2 -right-2 z-10 grid place-items-center h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg font-bold border-4 border-background">
                {score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <Heart className="h-4 w-4" /> Pet matching
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold">Find your perfect companion</h1>
        <p className="text-muted-foreground mt-2">5 quick questions · ~30 seconds</p>
      </div>

      <Progress value={progress} className="h-2 mb-8" />

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl bg-card border border-border p-8 shadow-card"
        >
          <p className="text-sm text-muted-foreground mb-2">Question {step + 1} of {total}</p>
          <h2 className="text-2xl font-bold mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((o) => (
              <button
                key={o.value}
                onClick={() => pick(o.value)}
                className="w-full text-left p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition flex items-center justify-between group"
              >
                <span className="font-medium">{o.label}</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="text-center mt-6">
        <Link to="/pets" className="text-sm text-muted-foreground hover:text-primary">Skip and browse all pets →</Link>
      </div>
    </div>
  );
}
