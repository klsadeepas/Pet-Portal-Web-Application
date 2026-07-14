import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm Pawly 🐾 Need help finding your perfect pet?" },
  ]);
  const [v, setV] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: v }]);
    setV("");
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: "Great! Browse the Pets page and use filters to narrow your search." }]), 700);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open chat" className="fixed bottom-6 left-6 z-40 grid place-items-center h-12 w-12 rounded-full bg-gradient-cool text-primary-foreground shadow-soft hover:scale-110 transition-transform">
        <MessageCircle className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-[320px] max-w-[calc(100vw-3rem)] rounded-2xl bg-card border border-border shadow-card overflow-hidden"
          >
            <div className="bg-gradient-cool text-primary-foreground p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">Chat with Pawly</p>
                <p className="text-xs opacity-90">Typically replies in seconds</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-3 h-64 overflow-y-auto space-y-2 bg-muted/30">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] ${m.from === "me" ? "bg-primary text-primary-foreground" : "bg-background"}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="p-2 border-t border-border flex gap-2">
              <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 h-10 rounded-full bg-muted/50 text-sm outline-none" />
              <button aria-label="Send" className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
