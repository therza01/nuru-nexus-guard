import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Filter, FolderOpen, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { AlertCard } from "@/components/alerts/AlertCard";
import { CaseDetail } from "@/components/alerts/CaseDetail";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

type Alert = Tables<"alerts">;
type Case = Tables<"cases"> & {
  alert?: Alert | null;
  assigned_profile?: { full_name: string | null; email: string } | null;
};
type CaseNote = Tables<"case_notes"> & {
  author?: { full_name: string | null; email: string } | null;
};

const ITEMS_PER_PAGE = 6;

export default function AlertsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"alerts" | "cases">("alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [createCaseDialog, setCreateCaseDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        toast({ title: "Error", description: "Failed to fetch alerts", variant: "destructive" });
      } else {
        setAlerts(data || []);
      }
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  // Fetch cases
  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          alert:alerts(*),
          assigned_profile:profiles!cases_assigned_to_fkey(full_name, email)
        `)
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setCases(data as Case[]);
      }
    };
    fetchCases();
  }, []);

  // Fetch case notes when a case is selected
  useEffect(() => {
    if (selectedCase) {
      const fetchNotes = async () => {
        const { data, error } = await supabase
          .from("case_notes")
          .select(`
            *,
            author:profiles!case_notes_author_id_fkey(full_name, email)
          `)
          .eq("case_id", selectedCase.id)
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          setCaseNotes(data as CaseNote[]);
        }
      };
      fetchNotes();
    }
  }, [selectedCase]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [alerts, searchQuery, severityFilter]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.case_number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchQuery, statusFilter]);

  const currentItems = activeTab === "alerts" ? filteredAlerts : filteredCases;
  const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);
  const paginatedItems = currentItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateCase = async () => {
    if (!selectedAlert || !user) return;

    const caseNumber = `CASE-${Date.now().toString(36).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from("cases")
      .insert({
        alert_id: selectedAlert.id,
        case_number: caseNumber,
        title: caseTitle || selectedAlert.title,
        description: caseDescription || selectedAlert.description,
        priority: selectedAlert.severity as any,
        created_by: user.id,
        assigned_to: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to create case", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Case ${caseNumber} created` });
      setCases(prev => [data as Case, ...prev]);
      setCreateCaseDialog(false);
      setCaseTitle("");
      setCaseDescription("");
      setSelectedAlert(null);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!selectedCase || !user) return;

    const { data, error } = await supabase
      .from("case_notes")
      .insert({
        case_id: selectedCase.id,
        author_id: user.id,
        content,
      })
      .select(`*, author:profiles!case_notes_author_id_fkey(full_name, email)`)
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    } else {
      setCaseNotes(prev => [data as CaseNote, ...prev]);
      toast({ title: "Note added" });
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedCase) return;

    const { error } = await supabase
      .from("cases")
      .update({ status: status as any })
      .eq("id", selectedCase.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      setSelectedCase(prev => prev ? { ...prev, status: status as any } : null);
      setCases(prev => prev.map(c => c.id === selectedCase.id ? { ...c, status: status as any } : c));
      toast({ title: "Status updated" });
    }
  };

  const alertCounts = useMemo(() => ({
    all: alerts.length,
    critical: alerts.filter(a => a.severity === "critical").length,
    high: alerts.filter(a => a.severity === "high").length,
    medium: alerts.filter(a => a.severity === "medium").length,
    low: alerts.filter(a => a.severity === "low").length,
  }), [alerts]);

  return (
    <MainLayout>
      <div className="p-6 h-full">
        <div className="flex gap-6 h-full">
          {/* Main Content */}
          <div className={`flex-1 flex flex-col ${selectedCase ? "xl:max-w-[60%]" : ""}`}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Alerts & Cases</h1>
                  <p className="text-muted-foreground text-sm">Monitor and manage fraud alerts and investigations</p>
                </div>
                <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["all", "critical", "high", "medium", "low"].map((sev) => (
                  <div 
                    key={sev}
                    className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                      severityFilter === sev ? "ring-2 ring-primary" : ""
                    } ${
                      sev === "critical" ? "bg-destructive/20" :
                      sev === "high" ? "bg-warning/20" :
                      sev === "medium" ? "bg-primary/20" :
                      sev === "low" ? "bg-emerald-500/20" : "bg-muted/30"
                    }`}
                    onClick={() => {
                      setSeverityFilter(sev);
                      setCurrentPage(1);
                    }}
                  >
                    <p className="text-xs text-muted-foreground capitalize">{sev}</p>
                    <p className="text-xl font-bold">{alertCounts[sev as keyof typeof alertCounts]}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tabs and Filters */}
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setCurrentPage(1); }}>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <TabsList className="bg-card/50 border border-border/50">
                  <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Alerts
                    <Badge variant="secondary" className="ml-2">{alerts.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="cases" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Cases
                    <Badge variant="secondary" className="ml-2">{cases.length}</Badge>
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={activeTab === "alerts" ? "Search alerts..." : "Search cases..."}
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="pl-10 bg-card/50 border-border/50"
                    />
                  </div>
                  {activeTab === "cases" && (
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[150px] bg-card/50 border-border/50">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <TabsContent value="alerts" className="mt-0 flex-1">
                <div className="space-y-3">
                  {(paginatedItems as Alert[]).map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onCreateCase={(a) => {
                        setSelectedAlert(a);
                        setCaseTitle(a.title);
                        setCaseDescription(a.description || "");
                        setCreateCaseDialog(true);
                      }}
                      onViewDetails={() => {}}
                    />
                  ))}
                  {paginatedItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No alerts found
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="cases" className="mt-0 flex-1">
                <div className="space-y-3">
                  {(paginatedItems as Case[]).map((c) => (
                    <motion.div
                      key={c.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedCase(c)}
                      className={`p-4 rounded-lg border bg-card/50 cursor-pointer transition-all ${
                        selectedCase?.id === c.id ? "ring-2 ring-primary border-primary" : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">{c.case_number}</span>
                            <Badge variant="outline" className="capitalize text-xs">{c.status}</Badge>
                          </div>
                          <h3 className="font-medium text-foreground">{c.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Assigned to: {c.assigned_profile?.full_name || "Unassigned"}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">{c.priority}</Badge>
                      </div>
                    </motion.div>
                  ))}
                  {paginatedItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No cases found
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Case Detail Sidebar */}
          {selectedCase && (
            <div className="hidden xl:block w-[400px]">
              <CaseDetail
                caseData={selectedCase}
                notes={caseNotes}
                onClose={() => setSelectedCase(null)}
                onAddNote={handleAddNote}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Case Dialog */}
      <Dialog open={createCaseDialog} onOpenChange={setCreateCaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Case</DialogTitle>
            <DialogDescription>
              Create an investigation case from this alert
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Case Title</Label>
              <Input
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="Enter case title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder="Enter case description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCaseDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateCase}>Create Case</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
