
import { useState } from "react";
import { DateProvider } from "../contexts/DateContext";
import { TierProvider } from "../components/Header";
import Header from "../components/Header";
import MetricsTable from "../components/MetricsTable";
import ActionItemsLog from "../components/ActionItemsLog";
import MetricsLineGraph from "../components/MetricsLineGraph";
import ExportOptions from "../components/ExportOptions";
import { generateHistoricalDataIfNeeded } from "../services/metricsService";

const Index = () => {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");

  // Generate historical data on component mount
  useState(() => {
    generateHistoricalDataIfNeeded();
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

  return (
    <TierProvider>
      <DateProvider>
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
      </DateProvider>
    </TierProvider>
  );
};

export default Index;
