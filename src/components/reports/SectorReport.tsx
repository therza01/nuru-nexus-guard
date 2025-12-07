import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Building2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sectorData = [
  { name: "Mobile Money", value: 342, trend: 12, color: "hsl(var(--primary))" },
  { name: "Banking", value: 256, trend: -5, color: "hsl(var(--warning))" },
  { name: "Microfinance", value: 145, trend: 8, color: "hsl(var(--destructive))" },
  { name: "SACCOs", value: 98, trend: 15, color: "hsl(180, 60%, 45%)" },
  { name: "Digital Lenders", value: 187, trend: 23, color: "hsl(270, 60%, 50%)" },
];

const monthlyTrend = [
  { month: "Jul", "Mobile Money": 280, Banking: 220, Microfinance: 120, SACCOs: 85, "Digital Lenders": 150 },
  { month: "Aug", "Mobile Money": 295, Banking: 235, Microfinance: 125, SACCOs: 88, "Digital Lenders": 162 },
  { month: "Sep", "Mobile Money": 310, Banking: 248, Microfinance: 132, SACCOs: 92, "Digital Lenders": 170 },
  { month: "Oct", "Mobile Money": 325, Banking: 252, Microfinance: 138, SACCOs: 95, "Digital Lenders": 178 },
  { month: "Nov", "Mobile Money": 338, Banking: 258, Microfinance: 142, SACCOs: 96, "Digital Lenders: ": 185 },
  { month: "Dec", "Mobile Money": 342, Banking: 256, Microfinance: 145, SACCOs: 98, "Digital Lenders": 187 },
];

const topFraudTypes = [
  { type: "SIM Swap Fraud", count: 234, percentage: 28 },
  { type: "Account Takeover", count: 187, percentage: 22 },
  { type: "Phishing/Social Engineering", count: 156, percentage: 19 },
  { type: "Identity Theft", count: 123, percentage: 15 },
  { type: "Transaction Fraud", count: 98, percentage: 12 },
  { type: "Other", count: 30, percentage: 4 },
];

export function SectorReport() {
  const totalCases = useMemo(() => sectorData.reduce((sum, s) => sum + s.value, 0), []);

  return (
    <div className="space-y-6">
      {/* Sector Overview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            Fraud Cases by Sector
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total Reported Cases: <span className="font-semibold text-foreground">{totalCases.toLocaleString()}</span>
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sector Cards */}
            <div className="space-y-3">
              {sectorData.map((sector, index) => (
                <motion.div
                  key={sector.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className="font-medium">{sector.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{sector.value}</span>
                    <div className={`flex items-center gap-1 text-xs ${
                      sector.trend > 0 ? "text-destructive" : "text-emerald-500"
                    }`}>
                      {sector.trend > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(sector.trend)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">6-Month Trend by Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="Mobile Money" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Banking" fill="hsl(var(--warning))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Microfinance" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Fraud Types */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Top Fraud Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFraudTypes.map((fraud, index) => (
              <div key={fraud.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <span className="text-sm font-medium">{fraud.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{fraud.count} cases</span>
                    <Badge variant="outline" className="text-xs">{fraud.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fraud.percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
