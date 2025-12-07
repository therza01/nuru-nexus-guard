import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskScoreCardProps {
  score: number;
  trend: number;
  highRiskEntities: number;
  analyzedToday: number;
}

export function RiskScoreCard({ score, trend, highRiskEntities, analyzedToday }: RiskScoreCardProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: "Critical", color: "text-destructive", bg: "bg-destructive/20" };
    if (score >= 60) return { label: "High", color: "text-warning", bg: "bg-warning/20" };
    if (score >= 40) return { label: "Medium", color: "text-primary", bg: "bg-primary/20" };
    return { label: "Low", color: "text-success", bg: "bg-success/20" };
  };

  const risk = getRiskLevel(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 rounded-2xl relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center glow-gold">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">AI Risk Score</h3>
              <p className="text-sm text-muted-foreground">Real-time threat assessment</p>
            </div>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold", risk.bg, risk.color)}>
            {risk.label} Risk
          </span>
        </div>

        {/* Score Display */}
        <div className="flex items-end gap-4 mb-6">
          <div className="relative">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="text-6xl font-display font-bold text-gradient-gold"
            >
              {score}
            </motion.span>
            <span className="text-2xl text-muted-foreground ml-1">/100</span>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
            trend > 0 ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"
          )}>
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-8">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: `${(score / 100) * 251.2} 251.2` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(39, 61%, 56%)" />
                  <stop offset="100%" stopColor="hsl(45, 80%, 65%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High-Risk Entities</span>
              <span className="text-lg font-bold text-destructive">{highRiskEntities}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Analyzed Today</span>
              <span className="text-lg font-bold text-secondary">{analyzedToday.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
