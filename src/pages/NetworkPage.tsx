import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Filter, ZoomIn, ZoomOut, Maximize2, Phone, Smartphone, CreditCard, Building, Globe } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NetworkGraph } from "@/components/network/NetworkGraph";
import { EntitySidebar } from "@/components/network/EntitySidebar";
import { Button } from "@/components/ui/button";
import { NetworkNode, mockNetworkData } from "@/data/networkData";
import { cn } from "@/lib/utils";

const entityTypes = [
  { type: "phone", label: "Phones", icon: Phone, count: mockNetworkData.nodes.filter(n => n.type === "phone").length },
  { type: "device", label: "Devices", icon: Smartphone, count: mockNetworkData.nodes.filter(n => n.type === "device").length },
  { type: "paybill", label: "Paybills", icon: CreditCard, count: mockNetworkData.nodes.filter(n => n.type === "paybill").length },
  { type: "account", label: "Accounts", icon: Building, count: mockNetworkData.nodes.filter(n => n.type === "account").length },
  { type: "ip", label: "IPs", icon: Globe, count: mockNetworkData.nodes.filter(n => n.type === "ip").length },
];

const clusters = ["A", "B", "C"];

export default function NetworkPage() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [highlightCluster, setHighlightCluster] = useState<string | null>(null);

  const highRiskCount = mockNetworkData.nodes.filter(n => n.riskScore >= 80).length;
  const totalConnections = mockNetworkData.links.length;

  return (
    <MainLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                <Network className="w-5 h-5 text-secondary-foreground" />
              </div>
              Fraud Network Graph
            </h1>
            <p className="text-muted-foreground">
              Interactive visualization of connected entities and suspicious patterns
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="icon">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Total Entities:</span>
            <span className="text-lg font-bold text-foreground">{mockNetworkData.nodes.length}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Connections:</span>
            <span className="text-lg font-bold text-secondary">{totalConnections}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="text-sm text-muted-foreground">High Risk:</span>
            <span className="text-lg font-bold text-destructive">{highRiskCount}</span>
          </div>

          {/* Entity Type Legend */}
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            {entityTypes.map(({ type, label, icon: Icon, count }) => (
              <div key={type} className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground font-medium">({count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cluster Filter */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground mr-2">Clusters:</span>
          <Button
            variant={highlightCluster === null ? "gold" : "outline"}
            size="sm"
            onClick={() => setHighlightCluster(null)}
          >
            All
          </Button>
          {clusters.map((cluster) => (
            <Button
              key={cluster}
              variant={highlightCluster === cluster ? "gold" : "outline"}
              size="sm"
              onClick={() => setHighlightCluster(cluster === highlightCluster ? null : cluster)}
            >
              Cluster {cluster}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-0 min-h-0">
          {/* Graph */}
          <motion.div 
            className={cn(
              "flex-1 glass-card rounded-xl overflow-hidden",
              selectedNode && "rounded-r-none"
            )}
            layout
          >
            <NetworkGraph
              onNodeClick={setSelectedNode}
              selectedNode={selectedNode}
              highlightCluster={highlightCluster}
            />
          </motion.div>

          {/* Entity Sidebar */}
          <AnimatePresence>
            {selectedNode && (
              <EntitySidebar 
                node={selectedNode} 
                onClose={() => setSelectedNode(null)} 
              />
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-4 glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-foreground">Connection Types:</span>
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-secondary rounded" />
                <span className="text-xs text-muted-foreground">Transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-primary rounded" />
                <span className="text-xs text-muted-foreground">Device Share</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-destructive rounded" style={{ borderStyle: "dashed" }} />
                <span className="text-xs text-muted-foreground">SIM Swap</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-indigo-500 rounded" />
                <span className="text-xs text-muted-foreground">IP Match</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs text-muted-foreground">Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
