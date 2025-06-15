
import { useState } from "react";
import { DateProvider } from "../contexts/DateContext";
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

  return (
    <DateProvider>
      <div className="min-h-screen bg-gray-50">
        <Header viewMode={viewMode} setViewMode={setViewMode} />
        
        <main className="container mx-auto px-4 py-6 space-y-6">
          <MetricsTable viewMode={viewMode} />
          <MetricsLineGraph />
          <ActionItemsLog />
          <ExportOptions />
        </main>
      </div>
    </DateProvider>
  );
};

export default Index;
