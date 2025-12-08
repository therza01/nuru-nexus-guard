import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CreditCard, AlertOctagon, ShieldCheck, TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: typeof Users;
  color: "gold" | "teal" | "danger" | "success";
  subtext?: string;
}

// Realistic Kenyan fintech stats
const stats: StatCard[] = [
  {
    label: "Entities Monitored",
    value: "2.4M",
    change: 5.2,
    icon: Users,
    color: "teal",
    subtext: "M-Pesa accounts, devices, paybills",
  },
  {
    label: "Transactions Today",
    value: "847K",
    change: 12.8,
    icon: CreditCard,
    color: "gold",
    subtext: "KES 4.2B total volume",
  },
  {
    label: "Active Cases",
    value: "156",
    change: -8.3,
    icon: AlertOctagon,
    color: "danger",
    subtext: "47 critical, 89 high priority",
  },
  {
    label: "Fraud Prevented",
    value: "KES 120M",
    change: 23.1,
    icon: ShieldCheck,
    color: "success",
    subtext: "This month vs KES 97M last month",
  },
];

const colorStyles = {
  gold: "gradient-gold glow-gold",
  teal: "gradient-teal glow-teal",
  danger: "gradient-danger glow-danger",
  success: "bg-success",
};

export function QuickStats() {
  const [animatedValues, setAnimatedValues] = useState<string[]>(stats.map(s => s.value));
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues(prev => {
        const newValues = [...prev];
        // Randomly update transaction count
        const txIndex = 1;
        const currentTx = parseFloat(newValues[txIndex].replace('K', ''));
        newValues[txIndex] = `${(currentTx + Math.random() * 0.5).toFixed(0)}K`;
        return newValues;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-success font-medium">Live Data</span>
        </motion.div>
        <span className="text-xs text-muted-foreground">• Last updated: Just now</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-card p-5 rounded-xl relative overflow-hidden group cursor-pointer"
          >
            {/* Background glow on hover */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
              stat.color === "gold" && "bg-primary",
              stat.color === "teal" && "bg-secondary",
              stat.color === "danger" && "bg-destructive",
              stat.color === "success" && "bg-success"
            )} />

            <div className="flex items-center justify-between mb-4 relative">
              <motion.div 
                className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorStyles[stat.color])}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div className="flex items-center gap-1">
                {stat.change > 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  stat.change > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                )}>
                  {stat.change > 0 ? "+" : ""}{stat.change}%
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={animatedValues[index]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl font-display font-bold text-foreground"
              >
                {animatedValues[index]}
              </motion.p>
            </AnimatePresence>
            {stat.subtext && (
              <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {stat.subtext}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
