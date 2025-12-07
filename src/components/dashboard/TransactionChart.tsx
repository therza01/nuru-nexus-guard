import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Activity } from "lucide-react";

const mockData = [
  { time: "00:00", legitimate: 4200, suspicious: 120 },
  { time: "04:00", legitimate: 3100, suspicious: 80 },
  { time: "08:00", legitimate: 8900, suspicious: 340 },
  { time: "12:00", legitimate: 12400, suspicious: 520 },
  { time: "16:00", legitimate: 11200, suspicious: 380 },
  { time: "20:00", legitimate: 8700, suspicious: 290 },
  { time: "Now", legitimate: 6500, suspicious: 180 },
];

export function TransactionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
            <Activity className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Transaction Volume</h3>
            <p className="text-sm text-muted-foreground">Last 24 hours across M-Pesa network</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Legitimate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">Suspicious</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-muted/30">
          <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
          <p className="text-2xl font-display font-bold text-foreground">1.2M</p>
          <div className="flex items-center gap-1 text-success text-xs mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5%</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-muted/30">
          <p className="text-sm text-muted-foreground mb-1">Flagged</p>
          <p className="text-2xl font-display font-bold text-destructive">2,340</p>
          <div className="flex items-center gap-1 text-destructive text-xs mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+8.2%</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-muted/30">
          <p className="text-sm text-muted-foreground mb-1">Value at Risk</p>
          <p className="text-2xl font-display font-bold text-warning">KES 45M</p>
          <span className="text-xs text-muted-foreground">Est. exposure</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="legitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(180, 84%, 35%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(180, 84%, 35%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="suspiciousGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(4, 100%, 69%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(4, 100%, 69%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 40%, 22%)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(228, 20%, 60%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(228, 20%, 60%)" 
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(228, 50%, 12%)",
                border: "1px solid hsl(228, 40%, 22%)",
                borderRadius: "12px",
                padding: "12px",
              }}
              labelStyle={{ color: "hsl(270, 22%, 96%)" }}
            />
            <Area
              type="monotone"
              dataKey="legitimate"
              stroke="hsl(180, 84%, 35%)"
              strokeWidth={2}
              fill="url(#legitGradient)"
            />
            <Area
              type="monotone"
              dataKey="suspicious"
              stroke="hsl(4, 100%, 69%)"
              strokeWidth={2}
              fill="url(#suspiciousGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
