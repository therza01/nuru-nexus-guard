import { MainLayout } from "@/components/layout/MainLayout";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { LiveAlerts } from "@/components/dashboard/LiveAlerts";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { KenyaHeatmap } from "@/components/dashboard/KenyaHeatmap";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { AIAssistant } from "@/components/dashboard/AIAssistant";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Fraud Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time threat monitoring across Kenya's financial ecosystem
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Risk Score & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <RiskScoreCard
              score={73}
              trend={8.5}
              highRiskEntities={234}
              analyzedToday={847342}
            />
            <TransactionChart />
          </div>

          {/* Right Column - Alerts & Heatmap */}
          <div className="space-y-6">
            <LiveAlerts />
          </div>
        </div>

        {/* Bottom Row - Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KenyaHeatmap />
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Sector Risk Distribution
            </h3>
            <div className="space-y-4">
              {[
                { name: "Mobile Money (M-Pesa)", risk: 78, color: "bg-destructive" },
                { name: "Digital Lending Apps", risk: 65, color: "bg-warning" },
                { name: "SACCO Operations", risk: 45, color: "bg-primary" },
                { name: "Bank Transfers", risk: 32, color: "bg-success" },
                { name: "Merchant Payments", risk: 58, color: "bg-warning" },
              ].map((sector) => (
                <div key={sector.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{sector.name}</span>
                    <span className="text-sm font-semibold text-foreground">{sector.risk}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sector.color} rounded-full transition-all duration-500`}
                      style={{ width: `${sector.risk}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </MainLayout>
  );
};

export default Index;
