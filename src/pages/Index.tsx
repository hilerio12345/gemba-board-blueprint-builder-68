
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import MetricsTable from "@/components/MetricsTable";
import ActionItemsLog from "@/components/ActionItemsLog";
import Header from "@/components/Header";
import DatePicker from "@/components/DatePicker";
import { DateProvider, useDateContext } from "@/contexts/DateContext";
import { generateHistoricalDataIfNeeded } from "@/services/metricsService";
import ExportOptions from "@/components/ExportOptions";
import { CalendarDays, CalendarWeek } from "lucide-react";

const GembaContent = () => {
  const { currentDate, setCurrentDate, formattedDate } = useDateContext();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');
  
  useEffect(() => {
    // Generate historical data on first load
    generateHistoricalDataIfNeeded();
  }, []);

  const getDayOfWeekText = () => {
    const day = currentDate.getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Tier 1 Gemba Board
              <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {viewMode === 'daily' ? (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> Daily View
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CalendarWeek className="h-3 w-3" /> Weekly View
                  </span>
                )}
              </span>
            </h1>
            <p className="text-sm text-gray-500">
              {viewMode === 'daily' ? `${getDayOfWeekText()}, ${formattedDate}` : formattedDate}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <DatePicker 
              date={currentDate}
              onDateChange={setCurrentDate}
            />
            <div className="flex gap-2 flex-wrap">
              <ExportOptions />
            </div>
          </div>
        </div>

        <Card className="shadow-md mb-6">
          <CardHeader className="bg-gray-100 border-b border-gray-200 py-3">
            <CardTitle className="text-gray-700 flex items-center justify-between">
              <span>
                {viewMode === 'daily' ? 'Daily Metrics Status' : 'Weekly Metrics Status'}
              </span>
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

const Index = () => {
  return (
    <DateProvider>
      <GembaContent />
    </DateProvider>
  );
};

export default Index;
