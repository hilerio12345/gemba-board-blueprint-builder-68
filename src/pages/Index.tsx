
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import MetricsTable from "@/components/MetricsTable";
import ActionItemsLog from "@/components/ActionItemsLog";
import Header, { TierProvider, useTierConfig } from "@/components/Header";
import DatePicker from "@/components/DatePicker";
import { DateProvider, useDateContext } from "@/contexts/DateContext";
import { generateHistoricalDataIfNeeded } from "@/services/metricsService";
import ExportOptions from "@/components/ExportOptions";
import { CalendarDays, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ViewModeContext = React.createContext<{
  viewMode: 'daily' | 'weekly' | 'monthly';
  setViewMode: React.Dispatch<React.SetStateAction<'daily' | 'weekly' | 'monthly'>>;
}>({
  viewMode: 'weekly',
  setViewMode: () => {},
});

// Helper function to get initials from a line of production
const getInitialsFromLine = (line: string): string => {
  return line
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase();
};

// Function to generate a board ID based on tier and type
const generateBoardId = (baseTier: string, type: string): string => {
  const random = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000-9999
  return `${baseTier}-${type}-${random}`;
};

const GembaContent = () => {
  const { currentDate, setCurrentDate, formattedDate } = useDateContext();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const { currentTier, setCurrentTier } = useTierConfig();
  const [aggregatedData, setAggregatedData] = useState<{
    availability: number;
    delivery: number;
    quality: number;
    cost: number;
    people: number;
  }>({
    availability: 0,
    delivery: 0,
    quality: 0,
    cost: 0,
    people: 0
  });
  
  useEffect(() => {
    generateHistoricalDataIfNeeded();
    generateAggregatedData();
  }, [currentTier.tier]);

  const getDayOfWeekText = () => {
    const day = currentDate.getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
  };

  const getBoardNumber = (baseTier: string, type: string) => {
    const random = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000-9999
    return `${baseTier}-${type}-${random}`;
  };

  const handleBoardClick = (boardId: string) => {
    const parts = boardId.split('-');
    if (parts.length >= 2) {
      const tierPrefix = parts[0];
      const type = parts[1];
      
      // Convert T1 to TIER 1, etc.
      const tier = `TIER ${tierPrefix.replace('T', '')}`;
      
      let lineOfProduction = "STANDARD DD214s";
      if (type === "STD") lineOfProduction = "STANDARD DD214s";
      else if (type === "EXP") lineOfProduction = "EXPRESS DD214s";
      else if (type === "URG") lineOfProduction = "URGENT DD214s";
      
      const newTierConfig = {
        tier,
        lineOfProduction,
        boardId
      };
      
      setCurrentTier(newTierConfig);
    }
  };
  
  // Generate aggregated data for higher tiers
  const generateAggregatedData = () => {
    // In a real application, this would pull data from all lower tier boards
    // For this demo, we'll simulate aggregated metrics
    const tierLevel = parseInt(currentTier.tier.split(' ')[1]);
    
    // Higher tiers should have slightly better metrics as they aggregate and optimize
    const multiplier = (tierLevel - 1) * 0.02 + 1; // 2% improvement per tier level
    
    setAggregatedData({
      availability: Math.min(99.5, 97 * multiplier),
      delivery: Math.min(5, 3 * multiplier),
      quality: Math.min(85, 78 * multiplier),
      cost: Math.max(3.5, 4.2 / multiplier),
      people: Math.min(97, 92 * multiplier)
    });
  };

  // Render boards for parent-child relationships
  const renderMultiBoardView = () => {
    const tierNum = parseInt(currentTier.tier.replace('TIER ', ''));
    
    if (tierNum > 1) {
      return (
        <Card className="shadow-md mb-6">
          <CardHeader className="bg-gray-100 border-b border-gray-200 py-3">
            <CardTitle className="text-gray-700 flex justify-between items-center">
              {tierNum > 1 && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleNavToParentTier()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Tier {tierNum - 1}
                </Button>
              )}
              <span>{currentTier.tier} Overview - Connected Boards</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aggregated metrics summary */}
              <div className="col-span-full bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h3 className="font-medium mb-2">Aggregated Metrics</h3>
                <div className="grid grid-cols-5 gap-2 text-sm">
                  <div>
                    <p className="font-bold text-blue-600">AVAILABILITY</p>
                    <p className="text-lg">{aggregatedData.availability.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-bold text-purple-600">DELIVERY</p>
                    <p className="text-lg">{aggregatedData.delivery.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="font-bold text-green-600">QUALITY</p>
                    <p className="text-lg">{aggregatedData.quality.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-bold text-orange-600">COST</p>
                    <p className="text-lg">{aggregatedData.cost.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-bold text-indigo-600">PEOPLE</p>
                    <p className="text-lg">{aggregatedData.people.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              {/* Connected boards for this tier */}
              {renderConnectedBoards(tierNum)}
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };
  
  const renderConnectedBoards = (tierNum: number) => {
    // For Tier 2, show Tier 1 boards
    if (tierNum === 2) {
      return (
        <>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T1", "STD"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T1", "STD")}
              </h3>
              <p className="text-sm text-gray-500">Standard DD214s</p>
              <div className="mt-2 h-2 bg-green-500 rounded-full"></div>
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T1", "EXP"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T1", "EXP")}
              </h3>
              <p className="text-sm text-gray-500">Express DD214s</p>
              <div className="mt-2 h-2 bg-yellow-400 rounded-full"></div>
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T1", "URG"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T1", "URG")}
              </h3>
              <p className="text-sm text-gray-500">Urgent DD214s</p>
              <div className="mt-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </>
      );
    }
    // For Tier 3, show Tier 2 sections
    else if (tierNum === 3) {
      return (
        <>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T2", "STD"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T2", "STD")}
              </h3>
              <p className="text-sm text-gray-500">Section A</p>
              <div className="mt-2 h-2 bg-green-500 rounded-full"></div>
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T2", "EXP"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T2", "EXP")}
              </h3>
              <p className="text-sm text-gray-500">Section B</p>
              <div className="mt-2 h-2 bg-yellow-400 rounded-full"></div>
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T2", "URG"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T2", "URG")}
              </h3>
              <p className="text-sm text-gray-500">Section C</p>
              <div className="mt-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </>
      );
    }
    // For Tier 4, show Tier 3 regions
    else if (tierNum === 4) {
      return (
        <>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T3", "STD"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T3", "STD")}
              </h3>
              <p className="text-sm text-gray-500">Region 1</p>
              <div className="mt-2 h-2 bg-green-500 rounded-full"></div>
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T3", "STD"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T3", "STD")}
              </h3>
              <p className="text-sm text-gray-500">Region 2</p>
              <div className="mt-2 h-2 bg-yellow-400 rounded-full"></div>
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <button
              onClick={() => handleBoardClick(generateBoardId("T3", "STD"))}
              className="text-left w-full"
            >
              <h3 className="font-medium hover:text-blue-600 transition-colors">
                Board #{generateBoardId("T3", "STD")}
              </h3>
              <p className="text-sm text-gray-500">Region 3</p>
              <div className="mt-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </>
      );
    }
    
    return null;
  };
  
  // Handle navigation to parent tier
  const handleNavToParentTier = () => {
    const currentTierNum = parseInt(currentTier.tier.replace('TIER ', ''));
    if (currentTierNum > 1) {
      const parentTier = `TIER ${currentTierNum - 1}`;
      const parentBoardId = `T${currentTierNum - 1}-SUMMARY-${Math.floor(1000 + Math.random() * 9000)}`;
      
      setCurrentTier({
        tier: parentTier,
        lineOfProduction: "TIER SUMMARY",
        boardId: parentBoardId
      });
    }
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
