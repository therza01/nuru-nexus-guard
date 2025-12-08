import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, CreditCard, Smartphone, ArrowRight, MapPin, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: string;
  type: "sim_swap" | "mpesa_reversal" | "paybill_misuse" | "device_fraud";
  entity: string;
  location: string;
  time: string;
  severity: "critical" | "high" | "medium";
  description: string;
}

// Realistic Kenyan fintech fraud alerts
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "sim_swap",
    entity: "+254 722 XXX 456",
    location: "Nairobi, Westlands",
    time: "2 min ago",
    severity: "critical",
    description: "SIM swap detected - 3 swaps in 48 hours linked to M-Pesa fraud",
  },
  {
    id: "2",
    type: "mpesa_reversal",
    entity: "Paybill 522XXX",
    location: "Kiambu County",
    time: "8 min ago",
    severity: "high",
    description: "Suspicious reversal pattern - KES 250,000 from fake Fuliza loans",
  },
  {
    id: "3",
    type: "device_fraud",
    entity: "IMEI-3580XXXX",
    location: "Mombasa, Nyali",
    time: "15 min ago",
    severity: "critical",
    description: "Device linked to 12 M-Pesa accounts - possible mule network",
  },
  {
    id: "4",
    type: "paybill_misuse",
    entity: "Till 174XXX",
    location: "Kisumu CBD",
    time: "23 min ago",
    severity: "medium",
    description: "Unusual velocity: 47 transactions in 10 min - wash trading suspected",
  },
  {
    id: "5",
    type: "sim_swap",
    entity: "+254 733 XXX 789",
    location: "Nakuru Town",
    time: "31 min ago",
    severity: "high",
    description: "SIM swap + immediate KES 150,000 withdrawal - social engineering",
  },
  {
    id: "6",
    type: "mpesa_reversal",
    entity: "Agent 123XXX",
    location: "Eldoret",
    time: "45 min ago",
    severity: "medium",
    description: "Agent float manipulation - repeated reversals flagged by CBK",
  },
];

const alertIcons = {
  sim_swap: Phone,
  mpesa_reversal: CreditCard,
  paybill_misuse: CreditCard,
  device_fraud: Smartphone,
};

const alertTypeLabels = {
  sim_swap: "SIM Swap",
  mpesa_reversal: "M-Pesa Reversal",
  paybill_misuse: "Paybill Misuse",
  device_fraud: "Device Fraud",
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
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newAlertId, setNewAlertId] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(7);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount(prev => prev + Math.floor(Math.random() * 2));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate new alert
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: "sim_swap",
        entity: `+254 7${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} XXX ${Math.floor(Math.random() * 1000)}`,
        location: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"][Math.floor(Math.random() * 4)],
        time: "Just now",
        severity: ["critical", "high", "medium"][Math.floor(Math.random() * 3)] as Alert["severity"],
        description: "New suspicious activity detected",
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 5)]);
      setNewAlertId(newAlert.id);
      setIsRefreshing(false);
      setTimeout(() => setNewAlertId(null), 3000);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 rounded-2xl h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-danger flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Live Fraud Alerts</h3>
            <p className="text-sm text-muted-foreground">Kenya financial ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex items-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-xs font-medium text-destructive">{activeCount} Active</span>
          </motion.div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, index) => {
            const Icon = alertIcons[alert.type];
            const isNew = alert.id === newAlertId;
            
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  boxShadow: isNew ? "0 0 20px rgba(255, 107, 97, 0.3)" : "none"
                }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "p-4 rounded-xl border-l-4 cursor-pointer group",
                  "hover:scale-[1.02] transition-all duration-200",
                  severityStyles[alert.severity],
                  isNew && "ring-2 ring-destructive/50"
                )}
                onClick={() => navigate("/alerts")}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-foreground truncate">{alert.entity}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold uppercase",
                        severityBadge[alert.severity]
                      )}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-secondary font-medium mb-1">
                      {alertTypeLabels[alert.type]}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Button 
        variant="ghost" 
        className="w-full mt-4 gap-2 group"
        onClick={() => navigate("/alerts")}
      >
        View All Alerts
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}
