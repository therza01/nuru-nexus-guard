import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CountyData {
  name: string;
  value: number;
  coordinates: { x: number; y: number };
}

const kenyaCounties: CountyData[] = [
  { name: "Nairobi", value: 245, coordinates: { x: 52, y: 58 } },
  { name: "Mombasa", value: 156, coordinates: { x: 68, y: 78 } },
  { name: "Kisumu", value: 89, coordinates: { x: 32, y: 52 } },
  { name: "Nakuru", value: 134, coordinates: { x: 45, y: 48 } },
  { name: "Eldoret", value: 67, coordinates: { x: 38, y: 40 } },
  { name: "Kiambu", value: 198, coordinates: { x: 50, y: 54 } },
  { name: "Machakos", value: 78, coordinates: { x: 58, y: 62 } },
  { name: "Nyeri", value: 45, coordinates: { x: 48, y: 48 } },
  { name: "Meru", value: 56, coordinates: { x: 55, y: 44 } },
  { name: "Kilifi", value: 87, coordinates: { x: 70, y: 72 } },
  { name: "Kakamega", value: 43, coordinates: { x: 30, y: 45 } },
  { name: "Kisii", value: 52, coordinates: { x: 28, y: 54 } },
  { name: "Kericho", value: 38, coordinates: { x: 35, y: 50 } },
  { name: "Garissa", value: 23, coordinates: { x: 75, y: 52 } },
  { name: "Turkana", value: 12, coordinates: { x: 35, y: 25 } },
];

const getHeatColor = (value: number, max: number) => {
  const intensity = value / max;
  if (intensity > 0.8) return "hsl(0, 80%, 50%)";      // Red
  if (intensity > 0.6) return "hsl(25, 80%, 50%)";    // Orange
  if (intensity > 0.4) return "hsl(45, 80%, 50%)";    // Yellow
  if (intensity > 0.2) return "hsl(120, 60%, 45%)";   // Green
  return "hsl(180, 60%, 45%)";                         // Teal
};

interface ReportsHeatmapProps {
  title?: string;
}

export function ReportsHeatmap({ title = "Fraud Activity by County" }: ReportsHeatmapProps) {
  const maxValue = useMemo(() => Math.max(...kenyaCounties.map(c => c.value)), []);
  const totalCases = useMemo(() => kenyaCounties.reduce((sum, c) => sum + c.value, 0), []);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Cases: <span className="font-semibold text-foreground">{totalCases.toLocaleString()}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[400px] bg-muted/20 rounded-lg overflow-hidden">
          {/* Kenya Outline (Simplified) */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Simplified Kenya border */}
            <path
              d="M25,20 L40,15 L55,18 L75,25 L85,40 L80,55 L75,75 L65,85 L50,80 L35,75 L25,60 L20,40 Z"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              className="opacity-50"
            />
            
            {/* County dots */}
            {kenyaCounties.map((county, index) => {
              const color = getHeatColor(county.value, maxValue);
              const size = 3 + (county.value / maxValue) * 5;
              
              return (
                <motion.g
                  key={county.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Glow effect */}
                  <circle
                    cx={county.coordinates.x}
                    cy={county.coordinates.y}
                    r={size + 2}
                    fill={color}
                    opacity={0.3}
                  />
                  {/* Main dot */}
                  <circle
                    cx={county.coordinates.x}
                    cy={county.coordinates.y}
                    r={size}
                    fill={color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Label */}
                  <text
                    x={county.coordinates.x}
                    y={county.coordinates.y - size - 2}
                    textAnchor="middle"
                    fontSize="3"
                    fill="hsl(var(--foreground))"
                    className="pointer-events-none"
                  >
                    {county.name}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(180, 60%, 45%)" }} />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(45, 80%, 50%)" }} />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 80%, 50%)" }} />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>

        {/* Top Counties List */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium mb-3">Top 5 Counties</h4>
          {kenyaCounties
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((county, index) => (
              <div key={county.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                  <span className="text-sm">{county.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${(county.value / maxValue) * 100}%`,
                        backgroundColor: getHeatColor(county.value, maxValue)
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{county.value}</span>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
