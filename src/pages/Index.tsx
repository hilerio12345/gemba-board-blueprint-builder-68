import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import MetricsTable from "@/components/MetricsTable";
import ActionItemsLog from "@/components/ActionItemsLog";
import Header, { TierProvider, useTierConfig } from "@/components/Header";
import DatePicker from "@/components/DatePicker";
import { DateProvider, useDateContext } from "@/contexts/DateContext";
import { generateHistoricalDataIfNeeded } from "@/services/metricsService";
import ExportOptions from "@/components/ExportOptions";
import { CalendarDays, Calendar } from "lucide-react";

export const ViewModeContext = React.createContext<{
  viewMode: 'daily' | 'weekly' | 'monthly';
  setViewMode: React.Dispatch<React.SetStateAction<'daily' | 'weekly' | 'monthly'>>;
}>({
  viewMode: 'weekly',
  setViewMode: () => {},
});

const GembaContent = () => {
  const { currentDate, setCurrentDate, formattedDate } = useDateContext();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const { currentTier } = useTierConfig();
  
  useEffect(() => {
    generateHistoricalDataIfNeeded();
  }, []);

  const getDayOfWeekText = () => {
    const day = currentDate.getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
  };

  const getBoardNumber = (baseTier: string, type: string) => {
    const random = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000-9999
    return `${baseTier}-${type}-${random}`;
  };

  const renderMultiBoardView = () => {
    if (currentTier.tier !== "TIER 1") {
      return (
        <Card className="shadow-md mb-6">
          <CardHeader className="bg-gray-100 border-b border-gray-200 py-3">
            <CardTitle className="text-gray-700">
              {currentTier.tier} Overview - Connected Boards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium">Board #{currentTier.tier === "TIER 2" ? getBoardNumber("T1", "STD") : 
                                           currentTier.tier === "TIER 3" ? getBoardNumber("T2", "STD") : getBoardNumber("T3", "STD")}</h3>
                <p className="text-sm text-gray-500">{currentTier.tier === "TIER 2" ? "Standard DD214s" : 
                                                     currentTier.tier === "TIER 3" ? "Section A" : "Region 1"}</p>
                <div className="mt-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium">Board #{currentTier.tier === "TIER 2" ? getBoardNumber("T1", "EXP") : 
                                           currentTier.tier === "TIER 3" ? getBoardNumber("T2", "EXP") : getBoardNumber("T3", "STD")}</h3>
                <p className="text-sm text-gray-500">{currentTier.tier === "TIER 2" ? "Express DD214s" : 
                                                     currentTier.tier === "TIER 3" ? "Section B" : "Region 2"}</p>
                <div className="mt-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium">Board #{currentTier.tier === "TIER 2" ? getBoardNumber("T1", "URG") : 
                                           currentTier.tier === "TIER 3" ? getBoardNumber("T2", "URG") : getBoardNumber("T3", "STD")}</h3>
                <p className="text-sm text-gray-500">{currentTier.tier === "TIER 2" ? "Urgent DD214s" : 
                                                     currentTier.tier === "TIER 3" ? "Section C" : "Region 3"}</p>
                <div className="mt-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {currentTier.tier} Gemba Board
              <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {viewMode === 'daily' ? (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> Daily View
                  </span>
                ) : viewMode === 'weekly' ? (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Weekly View
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Monthly View
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
              viewMode={viewMode}
            />
            <div className="flex gap-2 flex-wrap">
              <ExportOptions 
                currentTier={currentTier.tier} 
                boardId={currentTier.boardId} 
              />
            </div>
          </div>
        </div>

        {renderMultiBoardView()}

        <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
          <Card className="shadow-md mb-6">
            <CardHeader className="bg-gray-100 border-b border-gray-200 py-3">
              <CardTitle className="text-gray-700 flex items-center justify-between">
                <span>
                  {viewMode === 'daily' ? 'Daily Metrics Status' : 
                   viewMode === 'weekly' ? 'Weekly Metrics Status' : 'Monthly Metrics Status'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MetricsTable />
            </CardContent>
          </Card>

          {viewMode !== 'monthly' && (
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
          )}
        </ViewModeContext.Provider>

        <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p>Gemba Board Blueprint Builder | Version 1.0</p>
          <p className="mt-1">
            Electronic Gemba Board for multi-tiered Lean Management System | SharePoint-compatible
          </p>
          <p className="mt-1">
            Current Board: {currentTier.tier} | ID: {currentTier.boardId}
          </p>
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <DateProvider>
      <TierProvider>
        <GembaContent />
      </TierProvider>
    </DateProvider>
  );
};

export default Index;
