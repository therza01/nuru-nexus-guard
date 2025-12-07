import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-teal glow-teal flex items-center justify-center shadow-2xl z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-6 h-6 text-secondary-foreground" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 glass-card rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-secondary/20 to-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Nuru AI</h3>
                    <p className="text-xs text-secondary">Fraud Intelligence Agent</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 p-4 overflow-y-auto space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="glass-card p-3 rounded-xl rounded-tl-none max-w-[280px]">
                  <p className="text-sm text-foreground">
                    Habari! I'm Nuru, your fraud intelligence assistant. I can help you analyze suspicious patterns, investigate entities, or explain risk scores.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="glass-card p-3 rounded-xl rounded-tl-none max-w-[280px]">
                  <p className="text-sm text-foreground">
                    I've detected <span className="text-destructive font-semibold">7 new alerts</span> in the last hour. The most concerning involves a SIM swap cluster in Westlands. Would you like me to analyze it?
                  </p>
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="flex flex-wrap gap-2 pl-11">
                <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                  Analyze SIM swap cluster
                </button>
                <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors">
                  Show risk breakdown
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about fraud patterns..."
                  className="bg-muted/50 border-border/50"
                />
                <Button variant="gold" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
