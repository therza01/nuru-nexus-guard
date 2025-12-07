import { motion } from "framer-motion";
import { Phone, Smartphone, Building2, CreditCard, Globe, AlertTriangle, Shield, Clock, MapPin, Link2, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { NetworkNode, getRiskColor, mockNetworkData } from "@/data/networkData";

interface EntityProfileProps {
  entity: NetworkNode;
}

const getEntityIcon = (type: NetworkNode["type"]) => {
  const icons = {
    phone: Phone,
    device: Smartphone,
    paybill: Building2,
    account: CreditCard,
    ip: Globe,
  };
  return icons[type];
};

const getRiskLevel = (score: number) => {
  if (score >= 80) return { label: "Critical", color: "text-destructive" };
  if (score >= 60) return { label: "High", color: "text-warning" };
  if (score >= 40) return { label: "Medium", color: "text-primary" };
  return { label: "Low", color: "text-emerald-500" };
};

// Mock entity details based on type
const getEntityDetails = (entity: NetworkNode) => {
  const baseDetails = {
    phone: {
      carrier: "Safaricom",
      registrationDate: "2023-03-15",
      location: "Nairobi, Kenya",
      simSwaps: entity.riskScore > 70 ? 3 : 0,
      linkedAccounts: Math.floor(Math.random() * 5) + 1,
    },
    device: {
      manufacturer: entity.name.includes("iPhone") ? "Apple" : entity.name.includes("Huawei") ? "Huawei" : "Samsung",
      firstSeen: "2023-01-20",
      lastLocation: "Westlands, Nairobi",
      linkedNumbers: Math.floor(Math.random() * 4) + 1,
      rootedJailbroken: entity.riskScore > 80,
    },
    paybill: {
      businessName: "Kenya Digital Services Ltd",
      registrationDate: "2022-06-10",
      businessType: "E-commerce",
      dailyVolume: `KES ${(Math.random() * 500000 + 100000).toFixed(0)}`,
      flaggedTransactions: entity.riskScore > 60 ? Math.floor(Math.random() * 20) + 5 : 0,
    },
    account: {
      bank: entity.name.includes("KCB") ? "KCB Bank" : entity.name.includes("Equity") ? "Equity Bank" : "NCBA Bank",
      accountType: "Business Current",
      openedDate: "2021-11-05",
      averageBalance: `KES ${(Math.random() * 200000 + 50000).toFixed(0)}`,
      suspiciousActivity: entity.riskScore > 70,
    },
    ip: {
      isp: "Safaricom PLC",
      location: "Nairobi, Kenya",
      firstSeen: "2024-01-15",
      vpnProxy: entity.riskScore > 80,
      associatedDevices: Math.floor(Math.random() * 6) + 1,
    },
  };
  return baseDetails[entity.type];
};

const getRiskFactors = (entity: NetworkNode) => {
  const factors = [];
  if (entity.riskScore >= 80) {
    factors.push({ label: "Multiple SIM swaps detected", severity: "critical" });
    factors.push({ label: "Rapid transaction velocity", severity: "critical" });
  }
  if (entity.riskScore >= 60) {
    factors.push({ label: "Cross-cluster connections", severity: "high" });
    factors.push({ label: "Unusual transaction patterns", severity: "high" });
  }
  if (entity.riskScore >= 40) {
    factors.push({ label: "New device association", severity: "medium" });
  }
  factors.push({ label: "Regular transaction hours", severity: "low" });
  return factors;
};

export function EntityProfile({ entity }: EntityProfileProps) {
  const Icon = getEntityIcon(entity.type);
  const riskColor = getRiskColor(entity.riskScore);
  const riskLevel = getRiskLevel(entity.riskScore);
  const details = getEntityDetails(entity);
  const riskFactors = getRiskFactors(entity);

  // Find connected entities
  const connectedEntities = mockNetworkData.links
    .filter(link => link.source === entity.id || link.target === entity.id)
    .map(link => {
      const connectedId = link.source === entity.id ? link.target : link.source;
      return mockNetworkData.nodes.find(n => n.id === connectedId);
    })
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${riskColor}20` }}
              >
                <Icon className="h-8 w-8" style={{ color: riskColor }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{entity.name}</h2>
                  {entity.riskScore >= 80 && (
                    <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {entity.type === "phone" ? "Nairobi, Kenya" : "Kenya"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Last active: 2 hours ago
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold" style={{ color: riskColor }}>
                  {entity.riskScore}
                </div>
                <Badge variant="outline" className={riskLevel.color}>
                  {riskLevel.label} Risk
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(details).slice(0, 4).map(([key, value]) => (
                <div key={key} className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskFactors.map((factor, index) => {
                const severityColors = {
                  critical: "bg-destructive/20 text-destructive border-destructive/30",
                  high: "bg-warning/20 text-warning border-warning/30",
                  medium: "bg-primary/20 text-primary border-primary/30",
                  low: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
                };
                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${severityColors[factor.severity as keyof typeof severityColors]}`}
                  >
                    <span className="text-sm">{factor.label}</span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {factor.severity}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Connected Entities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5 text-primary" />
                Connected Entities ({connectedEntities.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {connectedEntities.slice(0, 5).map((connected) => {
                if (!connected) return null;
                const ConnIcon = getEntityIcon(connected.type);
                const connColor = getRiskColor(connected.riskScore);
                return (
                  <div 
                    key={connected.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ConnIcon className="h-4 w-4" style={{ color: connColor }} />
                      <span className="text-sm text-foreground">{connected.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: connColor }}>
                        {connected.riskScore}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {connected.cluster}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {connectedEntities.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{connectedEntities.length - 5} more connections
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Risk Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Transaction Velocity", value: entity.riskScore > 70 ? 85 : 45 },
              { label: "Device Fingerprint", value: entity.riskScore > 60 ? 72 : 30 },
              { label: "Behavioral Pattern", value: entity.riskScore > 50 ? 68 : 25 },
              { label: "Network Connections", value: Math.min(entity.riskScore + 10, 100) },
            ].map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium" style={{ color: getRiskColor(metric.value) }}>
                    {metric.value}%
                  </span>
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2"
                  style={{ 
                    "--progress-foreground": getRiskColor(metric.value) 
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
