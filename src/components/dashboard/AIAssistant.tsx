import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Send, Sparkles, Bot, User, Loader2, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Habari! I'm Nuru, your fraud intelligence assistant. I can help you analyze suspicious patterns, investigate entities, or explain risk scores across Kenya's financial ecosystem.",
    timestamp: new Date(),
  },
  {
    id: "2",
    role: "assistant",
    content: "I've detected **7 new alerts** in the last hour. The most concerning involves a SIM swap cluster in Westlands linked to M-Pesa float theft. Would you like me to analyze it?",
    timestamp: new Date(),
  },
];

const suggestedQueries = [
  "Analyze SIM swap cluster",
  "Show M-Pesa fraud trends",
  "Explain risk score calculation",
  "List high-risk paybills",
  "CBK compliance status",
];

// Simulated AI responses based on keywords
const generateResponse = (query: string): string => {
  const q = query.toLowerCase();
  
  if (q.includes("sim swap") || q.includes("cluster")) {
    return "**SIM Swap Cluster Analysis - Westlands, Nairobi**\n\n🔴 **Risk Level:** Critical\n\n**Key Findings:**\n- 12 phone numbers involved across 3 devices\n- Total float stolen: KES 2.4M in 48 hours\n- Primary target: Safaricom M-Pesa agents\n- Modus operandi: Social engineering → SIM swap → immediate withdrawal\n\n**Connected Entities:**\n- Device IMEI-3580721 (hub node)\n- Paybill 522XXX (receiving funds)\n- 4 bank accounts flagged by KCB AML\n\n**Recommendation:** Escalate to DCI Cybercrime Unit and block all associated accounts.";
  }
  
  if (q.includes("trend") || q.includes("mpesa")) {
    return "**M-Pesa Fraud Trends - Last 30 Days**\n\n📈 **Overall:** +23% increase in fraud attempts\n\n**Top Fraud Types:**\n1. SIM Swap (42%) - Up 35%\n2. Fake Fuliza (28%) - Up 18%\n3. Agent Float Theft (18%) - Down 5%\n4. Paybill Misuse (12%) - Up 45%\n\n**Hotspots:**\n- Nairobi: 45% of cases\n- Mombasa: 18%\n- Kisumu: 12%\n\n**Peak Hours:** 2-5 AM (agent float theft), 9-11 AM (social engineering)";
  }
  
  if (q.includes("risk score") || q.includes("calculation")) {
    return "**Risk Score Calculation Model**\n\nNuru uses a multi-factor scoring system (0-100):\n\n**Factors & Weights:**\n- Transaction velocity (25%)\n- Device fingerprint anomalies (20%)\n- Geographic velocity (15%)\n- Historical patterns (15%)\n- Network connections (15%)\n- CBK/FRC watchlist matches (10%)\n\n**Thresholds:**\n- 0-39: Low risk ✅\n- 40-59: Medium ⚠️\n- 60-79: High 🔶\n- 80-100: Critical 🔴\n\nScores update in real-time as new transactions occur.";
  }
  
  if (q.includes("paybill") || q.includes("high-risk")) {
    return "**High-Risk Paybills - Active Monitoring**\n\n🚨 **Critical (Score 80+):**\n1. Paybill 522XXX - KES 4.2M suspicious flow\n2. Till 174XXX - Wash trading pattern\n3. Paybill 891XXX - Fake merchant profile\n\n⚠️ **High (Score 60-79):**\n4. Paybill 345XXX - Unusual velocity\n5. Till 678XXX - Geographic mismatch\n\nAll flagged to CBK for enhanced monitoring. Click any to view full entity profile.";
  }
  
  if (q.includes("cbk") || q.includes("compliance")) {
    return "**CBK Compliance Status - Nuru Nexus**\n\n✅ **Compliant Areas:**\n- Suspicious Transaction Reporting (STR)\n- Customer Due Diligence (CDD)\n- Record Keeping (7-year retention)\n- Staff Training (quarterly)\n\n⏳ **Pending:**\n- Enhanced Due Diligence (EDD) for 12 high-risk accounts\n- Annual AML audit (due in 14 days)\n\n📋 **Recent Reports:**\n- 47 STRs filed this month\n- 3 cases escalated to FRC Kenya\n- 1 case referred to DCI";
  }
  
  return "I understand you're asking about \"" + query + "\". Let me analyze the relevant data from our fraud detection systems.\n\nBased on current patterns in Kenya's financial ecosystem, I can provide insights on:\n- Entity risk profiles\n- Transaction patterns\n- Network connections\n- Compliance requirements\n\nCould you be more specific about what you'd like to investigate?";
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const response = generateResponse(message);
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }]);
    setIsTyping(false);
  };

  const handleSuggestion = (query: string) => {
    setMessage(query);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-teal glow-teal flex items-center justify-center shadow-2xl z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-secondary-foreground" />
            </motion.div>
            
            {/* Notification dot */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center"
            >
              3
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 glass-card rounded-2xl shadow-2xl overflow-hidden flex flex-col",
              isExpanded 
                ? "bottom-4 right-4 left-4 top-20 md:left-auto md:w-[600px] md:top-4"
                : "bottom-6 right-6 w-96 h-[500px]"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-secondary/20 to-primary/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-secondary-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Nuru AI</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <p className="text-xs text-muted-foreground">Fraud Intelligence Agent</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      msg.role === "assistant" ? "gradient-teal" : "bg-primary"
                    )}>
                      {msg.role === "assistant" ? (
                        <Bot className="w-4 h-4 text-secondary-foreground" />
                      ) : (
                        <User className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className={cn(
                      "p-3 rounded-xl max-w-[80%]",
                      msg.role === "assistant" 
                        ? "glass-card rounded-tl-none" 
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    )}>
                      <p className="text-sm whitespace-pre-line">
                        {msg.content.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="glass-card p-3 rounded-xl rounded-tl-none">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-2">Quick queries:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleSuggestion(query)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border flex-shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about fraud patterns, entities, or risks..."
                  className="bg-muted/50 border-border/50"
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  variant="gold" 
                  size="icon"
                  disabled={isTyping || !message.trim()}
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
