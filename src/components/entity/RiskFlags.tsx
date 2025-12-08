import { motion } from "framer-motion";
import { 
  AlertOctagon, 
  Zap, 
  Smartphone, 
  Users, 
  Clock, 
  MapPin,
  CreditCard,
  Shield,
  TrendingUp,
  FileWarning
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskFlag {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
  indicator: string;
  source: string;
}

interface RiskFlagsProps {
  entityId: string;
  entityType: string;
}

// Realistic Kenyan fraud pattern flags based on CBK/FRC advisories
const mockFlags: RiskFlag[] = [
  {
    id: "1",
    type: "velocity",
    title: "Fast Cash-in/Cash-out",
    description: "KES 2.4M moved through account in 24 hours with immediate withdrawals",
    severity: "critical",
    indicator: "47 transactions in 1 hour",
    source: "CBK AML Pattern #12"
  },
  {
    id: "2",
    type: "device",
    title: "Multiple Accounts - Same Device",
    description: "Device IMEI linked to 12 separate M-Pesa accounts across different names",
    severity: "critical",
    indicator: "12 accounts on 1 device",
    source: "Safaricom Fraud Alert"
  },
  {
    id: "3",
    type: "identity",
    title: "Stolen ID Pattern",
    description: "Account holder's national ID reported stolen - account opened after report date",
    severity: "high",
    indicator: "ID flagged by IPRS",
    source: "DCI Database Match"
  },
  {
    id: "4",
    type: "network",
    title: "Fraud Ring Connection",
    description: "Entity connected to known fraud cluster via shared device and transaction patterns",
    severity: "critical",
    indicator: "Part of Cluster A (14 entities)",
    source: "Nuru Network Analysis"
  },
  {
    id: "5",
    type: "geographic",
    title: "Impossible Travel",
    description: "Transactions from Mombasa and Nairobi within 15 minutes",
    severity: "medium",
    indicator: "Geographic velocity exceeded",
    source: "Location Intelligence"
  },
  {
    id: "6",
    type: "reversal",
    title: "M-Pesa Reversal Abuse",
    description: "Pattern of Lipa Na M-Pesa transactions followed by disputed reversals",
    severity: "high",
    indicator: "8 reversals in 30 days",
    source: "Safaricom Dispute System"
  },
];

const flagIcons: Record<string, typeof AlertOctagon> = {
  velocity: Zap,
  device: Smartphone,
  identity: Shield,
  network: Users,
  geographic: MapPin,
  reversal: CreditCard,
};

const severityStyles = {
  critical: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    badge: "bg-destructive text-destructive-foreground",
    icon: "text-destructive",
  },
  high: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    badge: "bg-warning text-warning-foreground",
    icon: "text-warning",
  },
  medium: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    badge: "bg-primary text-primary-foreground",
    icon: "text-primary",
  },
};

export function RiskFlags({ entityId, entityType }: RiskFlagsProps) {
  const criticalCount = mockFlags.filter(f => f.severity === "critical").length;
  const highCount = mockFlags.filter(f => f.severity === "high").length;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-danger flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Risk Flags</h3>
            <p className="text-sm text-muted-foreground">Detected fraud indicators</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-destructive/20 text-destructive">
            {criticalCount} Critical
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-warning/20 text-warning">
            {highCount} High
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {mockFlags.map((flag, index) => {
          const Icon = flagIcons[flag.type] || FileWarning;
          const styles = severityStyles[flag.severity];
          
          return (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-xl border",
                styles.bg,
                styles.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg bg-card flex items-center justify-center flex-shrink-0",
                  styles.icon
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-medium text-foreground">{flag.title}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold uppercase",
                      styles.badge
                    )}>
                      {flag.severity}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-foreground font-medium">
                      <TrendingUp className="w-3 h-3" />
                      {flag.indicator}
                    </span>
                    <span className="text-muted-foreground">
                      Source: {flag.source}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
