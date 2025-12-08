import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Phone, Smartphone, Building2, CreditCard, Globe, LayoutGrid, Activity, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { EntityCard } from "@/components/entity/EntityCard";
import { EntityProfile } from "@/components/entity/EntityProfile";
import { TransactionHistory } from "@/components/entity/TransactionHistory";
import { EntityTimeline } from "@/components/entity/EntityTimeline";
import { RiskFlags } from "@/components/entity/RiskFlags";
import { PulseIndicator } from "@/components/common/AnimatedCard";
import { mockNetworkData, NetworkNode } from "@/data/networkData";
import { useRealtimeTransactions } from "@/hooks/useRealtimeTransactions";

type EntityType = "all" | NetworkNode["type"];
type ViewMode = "grid" | "detail";

export default function EntityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<EntityType>("all");
  const [selectedEntity, setSelectedEntity] = useState<NetworkNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  // Real-time transactions for the selected entity
  const { transactions: realtimeTransactions } = useRealtimeTransactions(
    selectedEntity?.id
  );

  const filteredEntities = useMemo(() => {
    return mockNetworkData.nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || node.type === selectedType;
      const matchesRisk = 
        riskFilter === "all" ||
        (riskFilter === "critical" && node.riskScore >= 80) ||
        (riskFilter === "high" && node.riskScore >= 60 && node.riskScore < 80) ||
        (riskFilter === "medium" && node.riskScore >= 40 && node.riskScore < 60) ||
        (riskFilter === "low" && node.riskScore < 40);
      
      return matchesSearch && matchesType && matchesRisk;
    });
  }, [searchQuery, selectedType, riskFilter]);

  const entityCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockNetworkData.nodes.length };
    mockNetworkData.nodes.forEach(node => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });
    return counts;
  }, []);

  const handleEntityClick = (entity: NetworkNode) => {
    setSelectedEntity(entity);
    setViewMode("detail");
  };

  const handleBackToGrid = () => {
    setSelectedEntity(null);
    setViewMode("grid");
  };

  const typeIcons = {
    phone: Phone,
    device: Smartphone,
    paybill: Building2,
    account: CreditCard,
    ip: Globe,
  };

  // Calculate live stats from real-time transactions
  const liveStats = useMemo(() => {
    const flaggedCount = realtimeTransactions.filter(t => t.is_flagged).length;
    const totalAmount = realtimeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    return { flaggedCount, totalAmount, totalCount: realtimeTransactions.length };
  }, [realtimeTransactions]);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Entity Intelligence</h1>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/30">
                <PulseIndicator color="success" size="sm" />
                <span className="text-xs text-success font-medium">Live</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Real-time monitoring and risk analysis for all entities
            </p>
          </div>

          {viewMode === "detail" && selectedEntity && (
            <Button variant="outline" onClick={handleBackToGrid} className="group">
              <LayoutGrid className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Back to Grid
            </Button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col md:flex-row gap-4 mb-6"
              >
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-card/50 border-border/50">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="critical">Critical (80+)</SelectItem>
                    <SelectItem value="high">High (60-79)</SelectItem>
                    <SelectItem value="medium">Medium (40-59)</SelectItem>
                    <SelectItem value="low">Low (&lt;40)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Type Tabs */}
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as EntityType)}>
                <TabsList className="bg-card/50 border border-border/50 p-1 h-auto flex-wrap w-full justify-start">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    All
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {entityCounts.all}
                    </Badge>
                  </TabsTrigger>
                  {(["phone", "device", "paybill", "account", "ip"] as const).map((type) => {
                    const Icon = typeIcons[type];
                    return (
                      <TabsTrigger 
                        key={type} 
                        value={type}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        <span className="capitalize hidden sm:inline">{type === "paybill" ? "Paybill" : type}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {entityCounts[type] || 0}
                        </Badge>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value={selectedType} className="mt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {filteredEntities.map((entity, index) => (
                      <motion.div
                        key={entity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        whileHover={{ y: -5 }}
                      >
                        <EntityCard
                          entity={entity}
                          onClick={handleEntityClick}
                          isSelected={selectedEntity?.id === entity.id}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {filteredEntities.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No entities found matching your criteria</p>
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            /* Detail View */
            selectedEntity && (
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Live Transaction Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="glass-card border-border/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
                      <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Live Transactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-foreground">{liveStats.totalCount}</span>
                          <PulseIndicator color="success" size="sm" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Card className="glass-card border-border/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                      <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Total Volume
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <span className="text-3xl font-bold text-foreground">
                          KES {liveStats.totalAmount.toLocaleString()}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="glass-card border-border/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent" />
                      <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Flagged
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-destructive">{liveStats.flaggedCount}</span>
                          {liveStats.flaggedCount > 0 && <PulseIndicator color="destructive" size="sm" />}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Entity Details */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <motion.div 
                    className="xl:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <EntityProfile entity={selectedEntity} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <TransactionHistory entity={selectedEntity} />
                  </motion.div>
                </div>

                {/* Risk Flags and Timeline */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <RiskFlags entityId={selectedEntity.id} entityType={selectedEntity.type} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <EntityTimeline entityId={selectedEntity.id} entityType={selectedEntity.type} />
                  </motion.div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
}
