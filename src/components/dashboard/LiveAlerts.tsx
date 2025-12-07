import { motion } from "framer-motion";
import { AlertTriangle, Phone, CreditCard, Smartphone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: "sim_swap" | "mpesa_reversal" | "paybill_misuse" | "device_fraud";
  entity: string;
  location: string;
  time: string;
  severity: "critical" | "high" | "medium";
  description: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "sim_swap",
    entity: "+254 722 XXX 456",
    location: "Nairobi, Westlands",
    time: "2 min ago",
    severity: "critical",
    description: "SIM swap detected - 3 swaps in 48 hours",
  },
  {
    id: "2",
    type: "mpesa_reversal",
    entity: "Paybill 522XXX",
    location: "Kiambu County",
    time: "8 min ago",
    severity: "high",
    description: "Suspicious reversal pattern - KES 250,000",
  },
  {
    id: "3",
    type: "device_fraud",
    entity: "IMEI-3580XXXX",
    location: "Mombasa, Nyali",
    time: "15 min ago",
    severity: "critical",
    description: "Device linked to 12 different accounts",
  },
  {
    id: "4",
    type: "paybill_misuse",
    entity: "Till 174XXX",
    location: "Kisumu CBD",
    time: "23 min ago",
    severity: "medium",
    description: "Unusual transaction velocity detected",
  },
];

const alertIcons = {
  sim_swap: Phone,
  mpesa_reversal: CreditCard,
  paybill_misuse: CreditCard,
  device_fraud: Smartphone,
};

const severityStyles = {
  critical: "border-l-destructive bg-destructive/5",
  high: "border-l-warning bg-warning/5",
  medium: "border-l-primary bg-primary/5",
};

const severityBadge = {
  critical: "bg-destructive/20 text-destructive",
  high: "bg-warning/20 text-warning",
  medium: "bg-primary/20 text-primary",
};

export function LiveAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 rounded-2xl h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-danger flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Live Fraud Alerts</h3>
            <p className="text-sm text-muted-foreground">Real-time threat detection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs font-medium text-destructive">7 Active</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {mockAlerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border-l-4 cursor-pointer hover:scale-[1.02] transition-transform",
                severityStyles[alert.severity]
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">{alert.entity}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold uppercase", severityBadge[alert.severity])}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{alert.location}</span>
                    <span>•</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full mt-4 gap-2">
        View All Alerts
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
