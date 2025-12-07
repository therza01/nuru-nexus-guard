import { motion } from "framer-motion";
import { Phone, Smartphone, Building2, CreditCard, Globe, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkNode, getRiskColor } from "@/data/networkData";

interface EntityCardProps {
  entity: NetworkNode;
  onClick: (entity: NetworkNode) => void;
  isSelected: boolean;
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

const getEntityTypeLabel = (type: NetworkNode["type"]) => {
  const labels = {
    phone: "Phone Number",
    device: "Device",
    paybill: "Paybill/Till",
    account: "Bank Account",
    ip: "IP Address",
  };
  return labels[type];
};

export function EntityCard({ entity, onClick, isSelected }: EntityCardProps) {
  const Icon = getEntityIcon(entity.type);
  const riskColor = getRiskColor(entity.riskScore);
  const trend = Math.random() > 0.5 ? "up" : "down";
  const trendValue = Math.floor(Math.random() * 15) + 1;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(entity)}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 ${
          isSelected ? "ring-2 ring-primary border-primary" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${riskColor}20` }}
              >
                <Icon className="h-5 w-5" style={{ color: riskColor }} />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{entity.name}</p>
                <p className="text-xs text-muted-foreground">{getEntityTypeLabel(entity.type)}</p>
              </div>
            </div>
            {entity.riskScore >= 80 && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="text-2xl font-bold"
                style={{ color: riskColor }}
              >
                {entity.riskScore}
              </div>
              <div className="flex items-center gap-1">
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-destructive" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-emerald-500" />
                )}
                <span className={`text-xs ${trend === "up" ? "text-destructive" : "text-emerald-500"}`}>
                  {trendValue}%
                </span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: riskColor, color: riskColor }}
            >
              Cluster {entity.cluster}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
