import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, Smartphone, Building2, CreditCard, Globe, Clock, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

type Alert = Tables<"alerts">;

interface AlertCardProps {
  alert: Alert;
  onCreateCase: (alert: Alert) => void;
  onViewDetails: (alert: Alert) => void;
}

const getEntityIcon = (type: string | null) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    phone: Phone,
    device: Smartphone,
    paybill: Building2,
    account: CreditCard,
    ip: Globe,
  };
  return icons[type || "phone"] || Phone;
};

const getSeverityStyles = (severity: string | null) => {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: "bg-destructive/20", text: "text-destructive", border: "border-destructive/30" },
    high: { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30" },
    medium: { bg: "bg-primary/20", text: "text-primary", border: "border-primary/30" },
    low: { bg: "bg-emerald-500/20", text: "text-emerald-500", border: "border-emerald-500/30" },
  };
  return styles[severity || "medium"] || styles.medium;
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export function AlertCard({ alert, onCreateCase, onViewDetails }: AlertCardProps) {
  const Icon = getEntityIcon(alert.entity_type);
  const severityStyles = getSeverityStyles(alert.severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-card/50 backdrop-blur-sm border ${severityStyles.border} hover:border-primary/50 transition-all`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg ${severityStyles.bg}`}>
                {alert.severity === "critical" ? (
                  <AlertTriangle className={`h-5 w-5 ${severityStyles.text}`} />
                ) : (
                  <Icon className={`h-5 w-5 ${severityStyles.text}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{alert.title}</h3>
                  <Badge variant="outline" className={`${severityStyles.text} ${severityStyles.border} capitalize text-xs`}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{alert.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {alert.entity_name && (
                    <span className="flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {alert.entity_name}
                    </span>
                  )}
                  {alert.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(alert.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`text-2xl font-bold ${severityStyles.text}`}>
                {alert.risk_score}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onCreateCase(alert)}>
                  Create Case
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onViewDetails(alert)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
