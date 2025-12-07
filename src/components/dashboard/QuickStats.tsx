import { motion } from "framer-motion";
import { Users, CreditCard, AlertOctagon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: typeof Users;
  color: "gold" | "teal" | "danger" | "success";
}

const stats: StatCard[] = [
  {
    label: "Entities Monitored",
    value: "2.4M",
    change: 5.2,
    icon: Users,
    color: "teal",
  },
  {
    label: "Transactions Today",
    value: "847K",
    change: 12.8,
    icon: CreditCard,
    color: "gold",
  },
  {
    label: "Active Cases",
    value: "156",
    change: -8.3,
    icon: AlertOctagon,
    color: "danger",
  },
  {
    label: "Fraud Prevented",
    value: "KES 120M",
    change: 23.1,
    icon: ShieldCheck,
    color: "success",
  },
];

const colorStyles = {
  gold: "gradient-gold glow-gold",
  teal: "gradient-teal glow-teal",
  danger: "gradient-danger glow-danger",
  success: "bg-success",
};

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * index }}
          className="glass-card p-5 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorStyles[stat.color])}>
              <stat.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              stat.change > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            )}>
              {stat.change > 0 ? "+" : ""}{stat.change}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
