export interface NetworkNode {
  id: string;
  name: string;
  type: "phone" | "device" | "paybill" | "account" | "ip";
  riskScore: number;
  cluster?: string;
  val?: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  type: "transaction" | "device_share" | "sim_swap" | "ip_match";
  strength: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

// Realistic Kenyan fintech fraud network data
export const mockNetworkData: NetworkData = {
  nodes: [
    // Phone numbers
    { id: "phone_1", name: "+254 722 345 678", type: "phone", riskScore: 92, cluster: "A", val: 15 },
    { id: "phone_2", name: "+254 733 456 789", type: "phone", riskScore: 88, cluster: "A", val: 12 },
    { id: "phone_3", name: "+254 711 234 567", type: "phone", riskScore: 75, cluster: "A", val: 10 },
    { id: "phone_4", name: "+254 700 876 543", type: "phone", riskScore: 45, cluster: "B", val: 8 },
    { id: "phone_5", name: "+254 768 123 456", type: "phone", riskScore: 82, cluster: "B", val: 11 },
    { id: "phone_6", name: "+254 790 654 321", type: "phone", riskScore: 35, cluster: "C", val: 7 },
    { id: "phone_7", name: "+254 712 987 654", type: "phone", riskScore: 68, cluster: "A", val: 9 },
    
    // Devices
    { id: "device_1", name: "Android-IMEI-3580721", type: "device", riskScore: 95, cluster: "A", val: 18 },
    { id: "device_2", name: "iPhone-UDID-A1B2C3", type: "device", riskScore: 78, cluster: "B", val: 14 },
    { id: "device_3", name: "Android-IMEI-9876543", type: "device", riskScore: 62, cluster: "C", val: 10 },
    { id: "device_4", name: "Huawei-IMEI-5432109", type: "device", riskScore: 85, cluster: "A", val: 13 },
    
    // Paybills
    { id: "paybill_1", name: "Paybill 522XXX", type: "paybill", riskScore: 89, cluster: "A", val: 16 },
    { id: "paybill_2", name: "Paybill 174XXX", type: "paybill", riskScore: 72, cluster: "B", val: 12 },
    { id: "paybill_3", name: "Till 832XXX", type: "paybill", riskScore: 55, cluster: "C", val: 9 },
    
    // Accounts
    { id: "account_1", name: "KCB-XXXX4567", type: "account", riskScore: 78, cluster: "A", val: 11 },
    { id: "account_2", name: "Equity-XXXX8901", type: "account", riskScore: 65, cluster: "B", val: 10 },
    { id: "account_3", name: "NCBA-XXXX2345", type: "account", riskScore: 42, cluster: "C", val: 8 },
    
    // IPs
    { id: "ip_1", name: "41.89.XXX.XXX", type: "ip", riskScore: 91, cluster: "A", val: 14 },
    { id: "ip_2", name: "197.248.XXX.XXX", type: "ip", riskScore: 58, cluster: "B", val: 9 },
  ],
  links: [
    // Cluster A - High risk fraud ring
    { source: "phone_1", target: "device_1", type: "device_share", strength: 0.9 },
    { source: "phone_2", target: "device_1", type: "device_share", strength: 0.85 },
    { source: "phone_3", target: "device_1", type: "device_share", strength: 0.8 },
    { source: "phone_7", target: "device_4", type: "device_share", strength: 0.75 },
    { source: "device_1", target: "device_4", type: "ip_match", strength: 0.7 },
    { source: "phone_1", target: "paybill_1", type: "transaction", strength: 0.95 },
    { source: "phone_2", target: "paybill_1", type: "transaction", strength: 0.88 },
    { source: "phone_1", target: "account_1", type: "transaction", strength: 0.82 },
    { source: "phone_3", target: "account_1", type: "transaction", strength: 0.7 },
    { source: "device_1", target: "ip_1", type: "ip_match", strength: 0.92 },
    { source: "device_4", target: "ip_1", type: "ip_match", strength: 0.88 },
    { source: "phone_1", target: "phone_2", type: "sim_swap", strength: 0.95 },
    
    // Cluster B
    { source: "phone_4", target: "device_2", type: "device_share", strength: 0.65 },
    { source: "phone_5", target: "device_2", type: "device_share", strength: 0.72 },
    { source: "phone_5", target: "paybill_2", type: "transaction", strength: 0.78 },
    { source: "phone_4", target: "account_2", type: "transaction", strength: 0.55 },
    { source: "device_2", target: "ip_2", type: "ip_match", strength: 0.68 },
    
    // Cluster C
    { source: "phone_6", target: "device_3", type: "device_share", strength: 0.5 },
    { source: "phone_6", target: "paybill_3", type: "transaction", strength: 0.45 },
    { source: "phone_6", target: "account_3", type: "transaction", strength: 0.4 },
    
    // Cross-cluster connections (suspicious)
    { source: "phone_5", target: "paybill_1", type: "transaction", strength: 0.6 },
    { source: "device_2", target: "account_1", type: "transaction", strength: 0.55 },
  ],
};

export const getNodeColor = (node: NetworkNode): string => {
  const typeColors: Record<NetworkNode["type"], string> = {
    phone: "#0FA3A3",     // Teal
    device: "#D4A24B",    // Gold
    paybill: "#FF6B61",   // Coral
    account: "#8B5CF6",   // Purple
    ip: "#6366F1",        // Indigo
  };
  return typeColors[node.type];
};

export const getRiskColor = (score: number): string => {
  if (score >= 80) return "#FF6B61";  // Coral/Red - Critical
  if (score >= 60) return "#D4A24B";  // Gold/Warning
  if (score >= 40) return "#0FA3A3";  // Teal - Medium
  return "#10B981";                    // Green - Low
};

export const getLinkColor = (link: NetworkLink): string => {
  const linkColors: Record<NetworkLink["type"], string> = {
    transaction: "rgba(15, 163, 163, 0.6)",   // Teal
    device_share: "rgba(212, 162, 75, 0.6)",  // Gold
    sim_swap: "rgba(255, 107, 97, 0.8)",      // Coral - most dangerous
    ip_match: "rgba(99, 102, 241, 0.5)",      // Indigo
  };
  return linkColors[link.type];
};
