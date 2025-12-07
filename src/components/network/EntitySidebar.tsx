import { motion } from "framer-motion";
import { X, Phone, Smartphone, CreditCard, Building, Globe, AlertTriangle, TrendingUp, Activity, Users } from "lucide-react";
import { NetworkNode, getRiskColor } from "@/data/networkData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EntitySidebarProps {
  node: NetworkNode | null;
  onClose: () => void;
}

const typeIcons = {
  phone: Phone,
  device: Smartphone,
  paybill: CreditCard,
  account: Building,
  ip: Globe,
};

const typeLabels = {
  phone: "Phone Number",
  device: "Device",
  paybill: "Paybill/Till",
  account: "Bank Account",
  ip: "IP Address",
};

// Mock detailed data for entities
const getEntityDetails = (node: NetworkNode) => ({
  transactions: Math.floor(Math.random() * 500) + 50,
  connections: Math.floor(Math.random() * 20) + 5,
  firstSeen: "2024-08-15",
  lastActive: "2025-12-07",
  flags: node.riskScore >= 80 
    ? ["Multiple SIM swaps", "Fast cash-out pattern", "Device sharing"]
    : node.riskScore >= 60 
    ? ["Unusual transaction times", "High velocity"]
    : ["Normal activity pattern"],
  location: node.type === "phone" ? "Nairobi, Westlands" : 
            node.type === "device" ? "Multiple locations" :
            node.type === "ip" ? "Safaricom Network" : "Kenya",
});

export function EntitySidebar({ node, onClose }: EntitySidebarProps) {
  if (!node) return null;

  const Icon = typeIcons[node.type];
  const details = getEntityDetails(node);
  const riskColor = getRiskColor(node.riskScore);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25 }}
      className="w-96 h-full glass-card border-l border-border overflow-y-auto"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${riskColor}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: riskColor }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {typeLabels[node.type]}
              </p>
              <h3 className="font-display font-semibold text-lg text-foreground">
                {node.name}
              </h3>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Risk Score */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Risk Score</span>
              <span 
                className="text-2xl font-display font-bold"
                style={{ color: riskColor }}
              >
                {node.riskScore}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${node.riskScore}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: riskColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/30">
            <Activity className="w-5 h-5 text-secondary mb-2" />
            <p className="text-2xl font-display font-bold text-foreground">{details.transactions}</p>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <Users className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold text-foreground">{details.connections}</p>
            <p className="text-xs text-muted-foreground">Connections</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 border-b border-border space-y-4">
        <h4 className="text-sm font-medium text-foreground">Entity Details</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Cluster</span>
            <span className="text-sm font-medium text-foreground">Cluster {node.cluster}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="text-sm font-medium text-foreground">{details.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">First Seen</span>
            <span className="text-sm font-medium text-foreground">{details.firstSeen}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Active</span>
            <span className="text-sm font-medium text-foreground">{details.lastActive}</span>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="p-6 border-b border-border">
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Risk Indicators
        </h4>
        
        <div className="space-y-2">
          {details.flags.map((flag, index) => (
            <div 
              key={index}
              className={cn(
                "px-3 py-2 rounded-lg text-sm",
                node.riskScore >= 80 
                  ? "bg-destructive/10 text-destructive border border-destructive/30"
                  : node.riskScore >= 60
                  ? "bg-warning/10 text-warning border border-warning/30"
                  : "bg-success/10 text-success border border-success/30"
              )}
            >
              {flag}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-3">
        <Button variant="gold" className="w-full">
          <TrendingUp className="w-4 h-4 mr-2" />
          Full Investigation
        </Button>
        <Button variant="outline" className="w-full">
          View Transaction History
        </Button>
        <Button variant="ghost" className="w-full text-destructive">
          Flag as Suspicious
        </Button>
      </div>
    </motion.div>
  );
}
