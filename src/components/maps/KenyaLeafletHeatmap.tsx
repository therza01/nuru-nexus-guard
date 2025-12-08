import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// Extend Leaflet types for heat layer
declare module "leaflet" {
  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      minOpacity?: number;
      gradient?: Record<number, string>;
    }
  ): L.Layer;
}

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
  name?: string;
}

// Mock data for Kenyan fraud hotspots
const mockHeatmapData: HeatmapPoint[] = [
  { lat: -1.286389, lng: 36.817223, weight: 5, name: "Nairobi" },
  { lat: -0.1022, lng: 34.7617, weight: 3, name: "Kisumu" },
  { lat: -4.0435, lng: 39.6682, weight: 4, name: "Mombasa" },
  { lat: 0.5200, lng: 35.2698, weight: 2, name: "Eldoret" },
  { lat: -0.4167, lng: 36.95, weight: 1, name: "Thika" },
  { lat: -1.1634, lng: 37.0022, weight: 3, name: "Machakos" },
  { lat: -0.2827, lng: 36.0669, weight: 2, name: "Nakuru" },
  { lat: 0.0515, lng: 37.6493, weight: 1, name: "Meru" },
  { lat: -1.0169, lng: 37.0731, weight: 2, name: "Kiambu" },
  { lat: -0.7172, lng: 36.4308, weight: 1, name: "Naivasha" },
];

// Kenyan towns for search suggestions
const kenyanTowns = [
  { name: "Nairobi", lat: -1.286389, lng: 36.817223 },
  { name: "Mombasa", lat: -4.0435, lng: 39.6682 },
  { name: "Kisumu", lat: -0.1022, lng: 34.7617 },
  { name: "Nakuru", lat: -0.2827, lng: 36.0669 },
  { name: "Eldoret", lat: 0.5200, lng: 35.2698 },
  { name: "Thika", lat: -0.4167, lng: 36.95 },
  { name: "Malindi", lat: -3.2138, lng: 40.1169 },
  { name: "Kitale", lat: 1.0167, lng: 35.0 },
  { name: "Garissa", lat: -0.4536, lng: 39.6401 },
  { name: "Nyeri", lat: -0.4197, lng: 36.9553 },
  { name: "Machakos", lat: -1.5177, lng: 37.2634 },
  { name: "Meru", lat: 0.0515, lng: 37.6493 },
  { name: "Lamu", lat: -2.2686, lng: 40.9020 },
  { name: "Naivasha", lat: -0.7172, lng: 36.4308 },
  { name: "Kiambu", lat: -1.1714, lng: 36.8356 },
];

interface KenyaLeafletHeatmapProps {
  title?: string;
  className?: string;
}

export function KenyaLeafletHeatmap({ 
  title = "Fraud Heatmap",
  className = ""
}: KenyaLeafletHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof kenyanTowns>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>(mockHeatmapData);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on Kenya
    const map = L.map(mapRef.current, {
      center: [0.0236, 37.9062],
      zoom: 6,
      zoomControl: true,
      attributionControl: true,
    });

    // Custom dark tile layer for Afrofuturistic theme
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add heatmap layer
    const heatPoints: [number, number, number][] = heatmapData.map((point) => [
      point.lat,
      point.lng,
      point.weight,
    ]);

    const heat = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 5,
      minOpacity: 0.4,
      gradient: {
        0.2: "#0FA3A3", // Teal
        0.4: "#D4A24B", // Gold
        0.6: "#FF9500", // Orange
        0.8: "#FF6B61", // Coral
        1.0: "#FF3B30", // Red
      },
    });

    heat.addTo(map);
    heatLayerRef.current = heat;

    setIsLoading(false);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update heatmap when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !heatLayerRef.current) return;

    mapInstanceRef.current.removeLayer(heatLayerRef.current);

    const heatPoints: [number, number, number][] = heatmapData.map((point) => [
      point.lat,
      point.lng,
      point.weight,
    ]);

    const heat = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 5,
      minOpacity: 0.4,
      gradient: {
        0.2: "#0FA3A3",
        0.4: "#D4A24B",
        0.6: "#FF9500",
        0.8: "#FF6B61",
        1.0: "#FF3B30",
      },
    });

    heat.addTo(mapInstanceRef.current);
    heatLayerRef.current = heat;
  }, [heatmapData]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = kenyanTowns.filter((town) =>
        town.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Handle location selection
  const handleSelectLocation = (town: typeof kenyanTowns[0]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([town.lat, town.lng], 12, {
        animate: true,
        duration: 1,
      });
    }
    setSearchQuery(town.name);
    setSuggestions([]);
  };

  // Fetch data from API (mock implementation)
  const fetchHeatmapData = async () => {
    setIsLoading(true);
    try {
      // In production, replace with actual API call:
      // const response = await fetch('/api/heatmap-data/');
      // const data = await response.json();
      // setHeatmapData(data);
      
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHeatmapData(mockHeatmapData);
    } catch (error) {
      console.error("Failed to fetch heatmap data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-6 rounded-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">Kenya fraud hotspots visualization</p>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search town or location..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-muted/30 border-border/50"
          />
        </div>
        
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((town) => (
              <button
                key={town.name}
                onClick={() => handleSelectLocation(town)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-3 h-3 text-primary" />
                <span className="text-foreground">{town.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <span className="text-xs text-muted-foreground">Low Risk</span>
        <div className="flex gap-1">
          {["bg-secondary", "bg-primary", "bg-warning", "bg-destructive"].map((color, i) => (
            <span key={i} className={`w-8 h-2 rounded ${color}`} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">High Risk</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { label: "Total Hotspots", value: heatmapData.length },
          { label: "Critical Zones", value: heatmapData.filter((p) => p.weight >= 4).length },
          { label: "Active Alerts", value: heatmapData.reduce((sum, p) => sum + p.weight, 0) },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
