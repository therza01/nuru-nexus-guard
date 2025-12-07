import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Phone, Smartphone, Building2, CreditCard, Globe, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";
import { EntityCard } from "@/components/entity/EntityCard";
import { EntityProfile } from "@/components/entity/EntityProfile";
import { TransactionHistory } from "@/components/entity/TransactionHistory";
import { mockNetworkData, NetworkNode } from "@/data/networkData";

type EntityType = "all" | NetworkNode["type"];
type ViewMode = "grid" | "detail";

export default function EntityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<EntityType>("all");
  const [selectedEntity, setSelectedEntity] = useState<NetworkNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [riskFilter, setRiskFilter] = useState<string>("all");

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

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Entity Intelligence</h1>
            <p className="text-muted-foreground text-sm">
              Detailed profiles and risk analysis for all monitored entities
            </p>
          </div>

          {viewMode === "detail" && selectedEntity && (
            <Button variant="outline" onClick={handleBackToGrid}>
              <LayoutGrid className="h-4 w-4 mr-2" />
              Back to Grid
            </Button>
          )}
        </motion.div>

        {viewMode === "grid" ? (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
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
              <TabsList className="bg-card/50 border border-border/50 p-1 h-auto flex-wrap">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      <span className="capitalize">{type === "paybill" ? "Paybill" : type}</span>
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
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No entities found matching your criteria</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          /* Detail View */
          selectedEntity && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <EntityProfile entity={selectedEntity} />
              </div>
              <div>
                <TransactionHistory entity={selectedEntity} />
              </div>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}
