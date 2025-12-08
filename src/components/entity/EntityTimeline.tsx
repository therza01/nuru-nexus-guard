import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Phone, 
  CreditCard, 
  MapPin, 
  Shield,
  Smartphone,
  Users,
  TrendingUp,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "alert" | "transaction" | "device_change" | "location" | "verification" | "block" | "connection";
  title: string;
  description: string;
  timestamp: string;
  severity?: "critical" | "high" | "medium" | "low" | "success";
  metadata?: Record<string, string>;
}

interface EntityTimelineProps {
  entityId: string;
  entityType: string;
}

// Realistic Kenyan fintech timeline events
const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "alert",
    title: "SIM Swap Detected",
    description: "SIM swap initiated via Safaricom customer care - unauthorized",
    timestamp: "2024-01-15 14:32",
    severity: "critical",
    metadata: { "Previous SIM": "8901XXXXXXXX", "New SIM": "8902XXXXXXXX" }
  },
  {
    id: "2",
    type: "transaction",
    title: "Suspicious M-Pesa Transfer",
    description: "KES 150,000 transferred to Paybill 522XXX immediately after SIM swap",
    timestamp: "2024-01-15 14:35",
    severity: "high",
    metadata: { "Amount": "KES 150,000", "Destination": "Paybill 522XXX" }
  },
  {
    id: "3",
    type: "device_change",
    title: "New Device Registered",
    description: "Android device IMEI-3580721 first seen - linked to fraud cluster",
    timestamp: "2024-01-15 14:30",
    severity: "high",
    metadata: { "Device": "Samsung Galaxy A52", "IMEI": "358072XXXXXXX" }
  },
  {
    id: "4",
    type: "location",
    title: "Geographic Velocity Alert",
    description: "Location changed from Kisumu to Nairobi in 15 minutes - impossible travel",
    timestamp: "2024-01-15 14:25",
    severity: "medium",
    metadata: { "From": "Kisumu CBD", "To": "Nairobi Westlands" }
  },
  {
    id: "5",
    type: "connection",
    title: "New Entity Connection",
    description: "Connected to known fraud network via shared device IMEI",
    timestamp: "2024-01-15 14:20",
    severity: "high",
    metadata: { "Network": "Cluster A", "Connections": "12 entities" }
  },
  {
    id: "6",
    type: "transaction",
    title: "Normal Transaction",
    description: "Airtime purchase KES 100 - within normal pattern",
    timestamp: "2024-01-14 09:15",
    severity: "low",
    metadata: { "Amount": "KES 100", "Type": "Airtime" }
  },
  {
    id: "7",
    type: "verification",
    title: "KYC Verification",
    description: "ID verification completed via Safaricom - National ID matched",
    timestamp: "2024-01-10 11:00",
    severity: "success",
    metadata: { "ID Type": "National ID", "Status": "Verified" }
  },
  {
    id: "8",
    type: "block",
    title: "Account Flagged",
    description: "Account flagged for enhanced monitoring by CBK directive",
    timestamp: "2024-01-15 15:00",
    severity: "critical",
    metadata: { "Directive": "CBK/AML/2024/01", "Status": "Active" }
  },
];

const eventIcons = {
  alert: AlertTriangle,
  transaction: CreditCard,
  device_change: Smartphone,
  location: MapPin,
  verification: Shield,
  block: Ban,
  connection: Users,
};

const severityColors = {
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-warning/20 text-warning border-warning/30",
  medium: "bg-primary/20 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
  success: "bg-success/20 text-success border-success/30",
};

const severityLineColors = {
  critical: "bg-destructive",
  high: "bg-warning",
  medium: "bg-primary",
  low: "bg-muted-foreground",
  success: "bg-success",
};

export function EntityTimeline({ entityId, entityType }: EntityTimelineProps) {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Activity Timeline</h3>
          <p className="text-sm text-muted-foreground">Suspicious events and transactions</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {mockEvents.map((event, index) => {
            const Icon = eventIcons[event.type];
            const severity = event.severity || "low";
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 border",
                  severityColors[severity]
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Connector dot */}
                <div className={cn(
                  "absolute left-[15px] top-[18px] w-3 h-3 rounded-full",
                  severityLineColors[severity]
                )} />

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                  
                  {event.metadata && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 rounded-md bg-muted/50 text-xs"
                        >
                          <span className="text-muted-foreground">{key}:</span>{" "}
                          <span className="text-foreground font-medium">{value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
