
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import MetricsTable from "@/components/MetricsTable";
import ActionItemsLog from "@/components/ActionItemsLog";
import Header from "@/components/Header";
import SharePointExport from "@/components/SharePointExport";
import ExportOptions from "@/components/ExportOptions";

const Index = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tier 1 Gemba Board</h1>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>
          <div className="flex gap-2">
            <SharePointExport />
            <ExportOptions />
          </div>
        </div>

        <Card className="shadow-md mb-6">
          <CardHeader className="bg-gray-100 border-b border-gray-200 py-3">
            <CardTitle className="text-gray-700 flex items-center justify-between">
              <span>Daily Metrics Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MetricsTable />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-gray-100 border-b border-gray-200 py-3">
            <CardTitle className="text-gray-700">CI Action Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ActionItemsLog />
          </CardContent>
          <CardFooter className="bg-gray-50 text-xs text-gray-500 py-2">
            <p>
              No action should be longer than 7 days! - Actions requiring longer timeframes should be broken into smaller steps.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p>Gemba Board Blueprint Builder | Version 1.0</p>
          <p className="mt-1">
            Electronic Gemba Board for multi-tiered Lean Management System | SharePoint-compatible
          </p>
          {/* Hidden placeholders for future tier integration */}
          {/* <!-- TIER_INTEGRATION: This is where data will be sent to Tier 2 dashboards --> */}
          {/* <!-- TIER_INTEGRATION: This is where aggregated metrics will be compiled --> */}
        </div>
      </main>
    </div>
  );
};

export default Index;
