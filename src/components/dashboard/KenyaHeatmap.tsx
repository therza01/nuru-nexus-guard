import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface CountyData {
  name: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  incidents: number;
  x: number;
  y: number;
}

const counties: CountyData[] = [
  { name: "Nairobi", riskLevel: "critical", incidents: 342, x: 55, y: 52 },
  { name: "Mombasa", riskLevel: "high", incidents: 189, x: 70, y: 75 },
  { name: "Kisumu", riskLevel: "high", incidents: 156, x: 25, y: 45 },
  { name: "Nakuru", riskLevel: "medium", incidents: 98, x: 40, y: 42 },
  { name: "Kiambu", riskLevel: "high", incidents: 178, x: 52, y: 48 },
  { name: "Machakos", riskLevel: "medium", incidents: 67, x: 58, y: 58 },
  { name: "Eldoret", riskLevel: "medium", incidents: 45, x: 32, y: 32 },
  { name: "Meru", riskLevel: "low", incidents: 23, x: 62, y: 38 },
];

const riskColors = {
  low: "bg-success",
  medium: "bg-primary",
  high: "bg-warning",
  critical: "bg-destructive",
};

const riskPulse = {
  critical: "animate-pulse",
  high: "animate-pulse-slow",
  medium: "",
  low: "",
};

export function KenyaHeatmap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Fraud Heatmap</h3>
            <p className="text-sm text-muted-foreground">Kenya county-level threat distribution</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative aspect-[4/3] bg-muted/20 rounded-xl overflow-hidden border border-border/50">
        {/* Simplified Kenya shape using SVG */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.3 }}
        >
          <path
            d="M 45,10 L 60,15 L 75,25 L 80,45 L 85,65 L 75,85 L 55,90 L 35,85 L 25,75 L 20,55 L 25,35 L 35,20 Z"
            fill="none"
            stroke="hsl(39, 61%, 56%)"
            strokeWidth="0.5"
          />
        </svg>

        {/* County Points */}
        {counties.map((county, index) => (
          <motion.div
            key={county.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="absolute group cursor-pointer"
            style={{ left: `${county.x}%`, top: `${county.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className={`w-4 h-4 rounded-full ${riskColors[county.riskLevel]} ${riskPulse[county.riskLevel]} shadow-lg`} />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="glass-card px-3 py-2 rounded-lg whitespace-nowrap">
                <p className="text-sm font-semibold text-foreground">{county.name}</p>
                <p className="text-xs text-muted-foreground">{county.incidents} incidents</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Grid Lines */}
        <div className="absolute inset-0 pattern-grid opacity-20" />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {(["low", "medium", "high", "critical"] as const).map((level) => (
          <div key={level} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${riskColors[level]}`} />
            <span className="text-xs text-muted-foreground capitalize">{level}</span>
          </div>
        ))}
      </div>

      {/* Top Counties */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-medium text-foreground mb-3">Highest Risk Counties</h4>
        {counties
          .sort((a, b) => b.incidents - a.incidents)
          .slice(0, 4)
          .map((county, index) => (
            <div key={county.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-5">{index + 1}</span>
                <span className={`w-2 h-2 rounded-full ${riskColors[county.riskLevel]}`} />
                <span className="text-sm text-foreground">{county.name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{county.incidents}</span>
            </div>
          ))}
      </div>
    </motion.div>
  );
}
