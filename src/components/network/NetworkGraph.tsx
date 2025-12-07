import { useRef, useCallback, useState, useEffect } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { motion } from "framer-motion";
import { 
  mockNetworkData, 
  NetworkNode, 
  NetworkLink, 
  getNodeColor, 
  getRiskColor,
  getLinkColor 
} from "@/data/networkData";

interface NetworkGraphProps {
  onNodeClick: (node: NetworkNode | null) => void;
  selectedNode: NetworkNode | null;
  highlightCluster: string | null;
}

export function NetworkGraph({ onNodeClick, selectedNode, highlightCluster }: NetworkGraphProps) {
  const graphRef = useRef<ForceGraphMethods>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    onNodeClick(node as NetworkNode);
    
    // Zoom to node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500);
      graphRef.current.zoom(2, 500);
    }
  }, [onNodeClick]);

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as NetworkNode & { x: number; y: number };
    const size = n.val || 10;
    const isSelected = selectedNode?.id === n.id;
    const isHighlighted = highlightCluster ? n.cluster === highlightCluster : true;
    const opacity = isHighlighted ? 1 : 0.3;

    // Draw glow for high-risk nodes
    if (n.riskScore >= 80) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, size + 4, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 107, 97, ${0.3 * opacity})`;
      ctx.fill();
    }

    // Draw node
    ctx.beginPath();
    ctx.arc(n.x, n.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = isSelected 
      ? "#FFFFFF" 
      : getNodeColor(n).replace(")", `, ${opacity})`).replace("rgb", "rgba");
    ctx.fill();

    // Draw border
    ctx.strokeStyle = isSelected ? "#D4A24B" : getRiskColor(n.riskScore);
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();

    // Draw label
    if (globalScale > 0.8 || isSelected) {
      const label = n.name.length > 15 ? n.name.substring(0, 15) + "..." : n.name;
      const fontSize = Math.max(10 / globalScale, 3);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = `rgba(245, 243, 247, ${opacity})`;
      ctx.fillText(label, n.x, n.y + size + 3);
    }
  }, [selectedNode, highlightCluster]);

  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const l = link as NetworkLink & { source: any; target: any };
    const isHighlighted = highlightCluster 
      ? l.source.cluster === highlightCluster || l.target.cluster === highlightCluster 
      : true;
    
    if (!isHighlighted) return;

    ctx.beginPath();
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
    ctx.strokeStyle = getLinkColor(l);
    ctx.lineWidth = l.strength * 3;
    
    // Dashed line for SIM swaps
    if (l.type === "sim_swap") {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
  }, [highlightCluster]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full rounded-xl overflow-hidden bg-card/50"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={mockNetworkData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeClick={handleNodeClick}
        onBackgroundClick={() => onNodeClick(null)}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTime={3000}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        backgroundColor="transparent"
      />
    </motion.div>
  );
}
