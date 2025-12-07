import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, Filter, BarChart3, Map, PieChart, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { ReportsHeatmap } from "@/components/reports/ReportsHeatmap";
import { SectorReport } from "@/components/reports/SectorReport";

type ReportType = "heatmap" | "sector" | "summary";
type DateRange = "7d" | "30d" | "90d" | "1y";

export default function ReportsPage() {
  const { toast } = useToast();
  const [activeReport, setActiveReport] = useState<ReportType>("heatmap");
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const handleExport = (format: "pdf" | "csv") => {
    // Generate mock data for export
    const reportData = {
      title: activeReport === "heatmap" ? "County Fraud Heatmap" : 
             activeReport === "sector" ? "Sector Analysis Report" : "Summary Report",
      dateRange: dateRange,
      generatedAt: new Date().toISOString(),
    };

    if (format === "csv") {
      // Generate CSV content
      const csvContent = `Report Type,${reportData.title}\nDate Range,${dateRange}\nGenerated At,${reportData.generatedAt}\n\nCounty,Cases\nNairobi,245\nMombasa,156\nKisumu,89\nNakuru,134\nEldoret,67`;
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fraud-report-${dateRange}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({ title: "CSV exported", description: "Report downloaded successfully" });
    } else {
      // For PDF, we'll show a toast since actual PDF generation would require a library
      toast({ 
        title: "PDF Export", 
        description: "PDF generation would require additional setup. CSV is available.",
      });
    }
  };

  const summaryStats = [
    { label: "Total Cases", value: "1,028", change: "+12%", trend: "up" },
    { label: "Critical Alerts", value: "156", change: "+8%", trend: "up" },
    { label: "Cases Resolved", value: "742", change: "+23%", trend: "up" },
    { label: "Avg Resolution Time", value: "4.2 days", change: "-15%", trend: "down" },
  ];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground text-sm">
              Generate insights and export fraud intelligence reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
              <SelectTrigger className="w-[150px] bg-card/50 border-border/50">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => handleExport("pdf")}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {summaryStats.map((stat, index) => (
            <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className={`text-xs ${
                    stat.trend === "up" && stat.label.includes("Resolved") ? "text-emerald-500" :
                    stat.trend === "up" ? "text-destructive" :
                    "text-emerald-500"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Report Tabs */}
        <Tabs value={activeReport} onValueChange={(v) => setActiveReport(v as ReportType)}>
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="heatmap" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Map className="h-4 w-4 mr-2" />
              County Heatmap
            </TabsTrigger>
            <TabsTrigger value="sector" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <PieChart className="h-4 w-4 mr-2" />
              Sector Analysis
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Summary Table
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="mt-6">
            <ReportsHeatmap />
          </TabsContent>

          <TabsContent value="sector" className="mt-6">
            <SectorReport />
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Table className="h-5 w-5 text-primary" />
                  Summary Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">County</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Total Cases</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Critical</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">High</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Medium</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Low</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Resolved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { county: "Nairobi", total: 245, critical: 45, high: 78, medium: 82, low: 40, resolved: 189 },
                        { county: "Kiambu", total: 198, critical: 32, high: 56, medium: 72, low: 38, resolved: 156 },
                        { county: "Mombasa", total: 156, critical: 28, high: 45, medium: 53, low: 30, resolved: 124 },
                        { county: "Nakuru", total: 134, critical: 22, high: 38, medium: 48, low: 26, resolved: 108 },
                        { county: "Kisumu", total: 89, critical: 15, high: 25, medium: 32, low: 17, resolved: 72 },
                        { county: "Kilifi", total: 87, critical: 14, high: 24, medium: 31, low: 18, resolved: 68 },
                        { county: "Eldoret", total: 67, critical: 10, high: 18, medium: 25, low: 14, resolved: 54 },
                      ].map((row) => (
                        <tr key={row.county} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-3 font-medium">{row.county}</td>
                          <td className="p-3 text-right">{row.total}</td>
                          <td className="p-3 text-right text-destructive">{row.critical}</td>
                          <td className="p-3 text-right text-warning">{row.high}</td>
                          <td className="p-3 text-right text-primary">{row.medium}</td>
                          <td className="p-3 text-right text-emerald-500">{row.low}</td>
                          <td className="p-3 text-right">{row.resolved}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
