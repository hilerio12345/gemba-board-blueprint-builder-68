
import { useState } from "react";
import { DateProvider } from "../contexts/DateContext";
import { TierProvider, useTierConfig } from "../components/Header";
import Header from "../components/Header";
import MetricsTable from "../components/MetricsTable";
import ActionItemsLog from "../components/ActionItemsLog";
import MetricsLineGraph from "../components/MetricsLineGraph";
import ExportOptions from "../components/ExportOptions";
import { generateHistoricalDataIfNeeded } from "../services/metricsService";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

const GembaBoardContent = () => {
  const { isFullyConfigured } = useTierConfig();
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");

  // Generate historical data on component mount
  useState(() => {
    if (isFullyConfigured) {
      generateHistoricalDataIfNeeded();
    }
  });

  // Sample data for MetricsLineGraph
  const sampleGraphData = [
    { day: "Mon", value: 85 },
    { day: "Tue", value: 92 },
    { day: "Wed", value: 78 },
    { day: "Thu", value: 95 },
    { day: "Fri", value: 88 },
  ];

  const sampleMonthlyData = [
    { day: "Week 1", value: 87 },
    { day: "Week 2", value: 91 },
    { day: "Week 3", value: 85 },
    { day: "Week 4", value: 89 },
  ];

  if (!isFullyConfigured) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="p-12 text-center max-w-md">
              <Settings className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Configure Your Gemba Board
              </h2>
              <p className="text-gray-600 mb-6">
                Please select your Tier, Directorate, Office Code, and Line of Production to begin using your Gemba Board.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Required fields:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Directorate</li>
                  <li>Office Code</li>
                  <li>Line of Production</li>
                </ul>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <MetricsTable />
        <MetricsLineGraph 
          category="Sample Metric"
          data={viewMode === "weekly" ? sampleGraphData : sampleMonthlyData}
          color="#3b82f6"
          graphView={viewMode}
        />
        <ActionItemsLog />
        <ExportOptions />
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <TierProvider>
      <DateProvider>
        <GembaBoardContent />
      </DateProvider>
    </TierProvider>
  );
};

export default Index;
