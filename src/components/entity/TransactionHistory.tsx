import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NetworkNode } from "@/data/networkData";

interface TransactionHistoryProps {
  entity: NetworkNode;
}

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  counterparty: string;
  timestamp: string;
  status: "completed" | "flagged" | "blocked";
  channel: string;
}

const generateMockTransactions = (entity: NetworkNode): Transaction[] => {
  const channels = ["M-Pesa", "Bank Transfer", "Till", "Paybill", "Card"];
  const counterparties = [
    "+254 7XX XXX XXX",
    "Paybill 522XXX",
    "Till 832XXX",
    "KCB-XXXXXXXX",
    "Equity-XXXXXXXX",
    "+254 7XX XXX XXX",
  ];

  const transactions: Transaction[] = [];
  const count = Math.floor(Math.random() * 10) + 8;

  for (let i = 0; i < count; i++) {
    const isIncoming = Math.random() > 0.5;
    const isFlagged = entity.riskScore > 70 && Math.random() > 0.6;
    const isBlocked = isFlagged && Math.random() > 0.7;

    transactions.push({
      id: `txn_${i}_${Date.now()}`,
      type: isIncoming ? "incoming" : "outgoing",
      amount: Math.floor(Math.random() * 50000) + 500,
      counterparty: counterparties[Math.floor(Math.random() * counterparties.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: isBlocked ? "blocked" : isFlagged ? "flagged" : "completed",
      channel: channels[Math.floor(Math.random() * channels.length)],
    });
  }

  return transactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
};

export function TransactionHistory({ entity }: TransactionHistoryProps) {
  const transactions = generateMockTransactions(entity);

  const totalIncoming = transactions
    .filter(t => t.type === "incoming")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOutgoing = transactions
    .filter(t => t.type === "outgoing")
    .reduce((sum, t) => sum + t.amount, 0);

  const flaggedCount = transactions.filter(t => t.status === "flagged" || t.status === "blocked").length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Transaction History
          </span>
          {flaggedCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {flaggedCount} Flagged
            </Badge>
          )}
        </CardTitle>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center p-2 rounded-lg bg-emerald-500/10">
            <p className="text-xs text-muted-foreground">Incoming</p>
            <p className="text-sm font-semibold text-emerald-500">{formatCurrency(totalIncoming)}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-destructive/10">
            <p className="text-xs text-muted-foreground">Outgoing</p>
            <p className="text-sm font-semibold text-destructive">{formatCurrency(totalOutgoing)}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-primary/10">
            <p className="text-xs text-muted-foreground">Net Flow</p>
            <p className={`text-sm font-semibold ${totalIncoming - totalOutgoing >= 0 ? "text-emerald-500" : "text-destructive"}`}>
              {formatCurrency(totalIncoming - totalOutgoing)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {transactions.map((txn, index) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  txn.status === "blocked" 
                    ? "bg-destructive/10 border-destructive/30" 
                    : txn.status === "flagged"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-muted/30 border-border/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    txn.type === "incoming" ? "bg-emerald-500/20" : "bg-destructive/20"
                  }`}>
                    {txn.type === "incoming" ? (
                      <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {txn.counterparty}
                      </p>
                      {txn.status !== "completed" && (
                        <AlertCircle className={`h-3 w-3 ${
                          txn.status === "blocked" ? "text-destructive" : "text-warning"
                        }`} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{txn.channel}</span>
                      <span>•</span>
                      <span>{formatTime(txn.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    txn.type === "incoming" ? "text-emerald-500" : "text-foreground"
                  }`}>
                    {txn.type === "incoming" ? "+" : "-"}{formatCurrency(txn.amount)}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      txn.status === "blocked" 
                        ? "border-destructive text-destructive" 
                        : txn.status === "flagged"
                        ? "border-warning text-warning"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {txn.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
