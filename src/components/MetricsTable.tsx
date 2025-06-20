import React, { useState, useEffect } from "react";
import { Table, TableBody } from "@/components/ui/table";
import MetricParametersDialog from "./MetricParametersDialog";
import { useDateContext } from "../contexts/DateContext";
import MetricsTableHeader from "./metrics/MetricsTableHeader";
import MetricRow from "./metrics/MetricRow";
import { useMetricsData } from "./metrics/useMetricsData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Calendar, FileChartLine, Settings } from "lucide-react";
import MonthlyView from "./metrics/MonthlyView";
import { useTierConfig } from "./Header";
import { Button } from "@/components/ui/button";
import DeliveryParametersDialog from "./metrics/DeliveryParametersDialog";
import DailyUpdateDialog from "./metrics/DailyUpdateDialog";
import { updateMetricsForDate, getMetricsForDate, initializeDefaultData } from "../services/metricsService";

const MetricsTable = () => {
  const { dateKey, currentDate } = useDateContext();
  const { currentTier, isFullyConfigured } = useTierConfig();
  const tierLevel = parseInt(currentTier.tier.split(' ')[1]);
  const [showDeptMetrics, setShowDeptMetrics] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);
  
  const {
    metrics,
    expandedMetric,
    generateTrendData,
    handleStatusChange,
    handleNotesChange,
    handleParametersUpdate,
    handleValueChange,
    handleThresholdChange,
    handleGoalChange,
    handleAvailabilityChange,
    toggleExpanded,
    getMetricColor,
    getDayAvailability,
    getDayValue,
    refreshMetrics
  } = useMetricsData(dateKey, viewMode, tierLevel);

  // Initialize data when configuration is complete
  useEffect(() => {
    const performInitialization = async () => {
      if (isFullyConfigured && !isInitializing && !initializationComplete) {
        console.log("Starting metrics initialization for fully configured board");
        setIsInitializing(true);
        
        try {
          // Clear any existing data for today to start fresh
          updateMetricsForDate(dateKey, []);
          
          // Initialize default data
          initializeDefaultData();
          
          // Force refresh the metrics
          setTimeout(() => {
            console.log("Forcing metrics refresh after initialization");
            if (refreshMetrics) {
              refreshMetrics();
            }
            setInitializationComplete(true);
            setIsInitializing(false);
          }, 100);
          
        } catch (error) {
          console.error("Error during initialization:", error);
          setIsInitializing(false);
        }
      }
    };

    performInitialization();
  }, [isFullyConfigured, dateKey, refreshMetrics, isInitializing, initializationComplete]);

  // Reset initialization state when configuration changes
  useEffect(() => {
    console.log("Configuration or date changed, resetting initialization state");
    setInitializationComplete(false);
    setIsInitializing(false);
  }, [currentTier.boardId, dateKey]);

  // Debug logging to check metrics loading
  useEffect(() => {
    console.log("MetricsTable - Current metrics:", metrics.length, "metrics");
    console.log("MetricsTable - View mode:", viewMode);
    console.log("MetricsTable - Date key:", dateKey);
    console.log("MetricsTable - Is fully configured:", isFullyConfigured);
    console.log("MetricsTable - Is initializing:", isInitializing);
    console.log("MetricsTable - Initialization complete:", initializationComplete);
    
    if (metrics.length > 0) {
      console.log("MetricsTable - Metrics categories:", metrics.map(m => m.category));
      console.log("MetricsTable - Sample metric values:", metrics.map(m => ({ category: m.category, value: m.value })));
    }
  }, [metrics, viewMode, dateKey, isFullyConfigured, isInitializing, initializationComplete]);

  // Handle delivery parameters update
  const handleDeliveryParametersUpdate = (updatedMetric: any) => {
    const updatedMetrics = metrics.map(m => 
      m.id === updatedMetric.id ? updatedMetric : m
    );
    updateMetricsForDate(dateKey, updatedMetrics);
    if (refreshMetrics) {
      refreshMetrics();
    }
  };

  // Handle daily update
  const handleDailyUpdate = (updatedMetrics: any[]) => {
    updateMetricsForDate(dateKey, updatedMetrics);
    if (refreshMetrics) {
      refreshMetrics();
    }
  };

  // Get delivery metric for parameters dialog
  const deliveryMetric = metrics.find(m => m.category === "DELIVERY");

  // Ensure we have all required metrics
  const requiredMetrics = ["AVAILABILITY", "DELIVERY", "QUALITY", "COST", "PEOPLE"];
  const missingMetrics = requiredMetrics.filter(category => 
    !metrics.some(m => m.category === category)
  );

  if (missingMetrics.length > 0) {
    console.warn("Missing metrics:", missingMetrics);
  }

  // Don't render the table until configuration is complete
  if (!isFullyConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-yellow-600" />
          <span className="text-yellow-800 font-medium">Waiting for configuration...</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Please complete the Tier, Directorate, Office Code, and Line of Production selection.
        </p>
      </div>
    );
  }

  // Show initialization status
  if (isInitializing || (isFullyConfigured && metrics.length === 0 && !initializationComplete)) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-blue-600 animate-spin" />
          <span className="text-blue-800 font-medium">Initializing metrics...</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Setting up your Gemba board metrics. This will only take a moment.
        </p>
      </div>
    );
  }

  // Function to generate department metrics data based on the images uploaded
  const getDepartmentMetrics = () => {
    if (tierLevel !== 4) return [];

    return [
      {
        id: "dept-cc-staff",
        department: "CC & Staff",
        totalAssigned: 43,
        fillRate: 88,
        filledPositions: 38,
        effectiveFillRate: 82,
        rpaAssigned: 3,
        augmentedFillRate: 94
      },
      {
        id: "dept-dpa",
        department: "DPA",
        totalAssigned: 95,
        fillRate: 86,
        filledPositions: 90,
        effectiveFillRate: 81,
        rpaAssigned: 15,
        augmentedFillRate: 95
      },
      {
        id: "dept-dph",
        department: "DPH",
        totalAssigned: 11,
        fillRate: 78,
        filledPositions: 11,
        effectiveFillRate: 79,
        rpaAssigned: 8,
        augmentedFillRate: 123
      },
      {
        id: "dept-dpt",
        department: "DPT",
        totalAssigned: 105,
        fillRate: 82,
        filledPositions: 104,
        effectiveFillRate: 81,
        rpaAssigned: 12,
        augmentedFillRate: 91
      },
      {
        id: "dept-dpx",
        department: "DPX",
        totalAssigned: 66,
        fillRate: 95,
        filledPositions: 62,
        effectiveFillRate: 87,
        rpaAssigned: 2,
        augmentedFillRate: 98
      },
      {
        id: "dept-pb",
        department: "PB",
        totalAssigned: 26,
        fillRate: 114,
        filledPositions: 20,
        effectiveFillRate: 95,
        rpaAssigned: 2,
        augmentedFillRate: 124
      },
      {
        id: "dept-ja",
        department: "JA",
        totalAssigned: 14,
        fillRate: 100,
        filledPositions: 14,
        effectiveFillRate: 100,
        rpaAssigned: 0,
        augmentedFillRate: 100
      }
    ];
  };

  // Function to render the department metrics table
  const renderDepartmentMetricsTable = () => {
    const deptMetrics = getDepartmentMetrics();
    
    if (deptMetrics.length === 0) return null;
    
    return (
      <div className="mt-6 rounded-md border">
        <div className="bg-blue-50 p-3 border-b border-blue-200">
          <h3 className="font-medium text-blue-900">Department Fill Rates (CADIAPP)</h3>
          <p className="text-xs text-blue-700">Fill Rate Goal: 85%</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-3 text-left font-medium">Department</th>
                <th className="py-2 px-3 text-center font-medium">UND Auth</th>
                <th className="py-2 px-3 text-center font-medium">Total Assigned</th>
                <th className="py-2 px-3 text-center font-medium">Total Fill Rate %</th>
                <th className="py-2 px-3 text-center font-medium">Filled Positions</th>
                <th className="py-2 px-3 text-center font-medium">Effective Fill Rate %</th>
                <th className="py-2 px-3 text-center font-medium">RPA/Interns Assigned</th>
                <th className="py-2 px-3 text-center font-medium">Augmented Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {deptMetrics.map((dept) => {
                const getFillRateColor = (rate: number) => {
                  if (rate >= 90) return "bg-green-100 text-green-800";
                  if (rate >= 80) return "bg-yellow-100 text-yellow-800";
                  return "bg-red-100 text-red-800";
                };
                
                return (
                  <tr key={dept.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium bg-blue-50">{dept.department}</td>
                    <td className="py-2 px-3 text-center">{dept.department === "DPA" ? 105 : dept.department === "DPT" ? 128 : dept.department === "DPX" ? 70 : dept.department === "PB" ? 21 : dept.department === "DPH" ? 14 : dept.department === "JA" ? 14 : 48}</td>
                    <td className="py-2 px-3 text-center">{dept.totalAssigned}</td>
                    <td className={`py-2 px-3 text-center ${getFillRateColor(dept.fillRate)}`}>{dept.fillRate}%</td>
                    <td className="py-2 px-3 text-center">{dept.filledPositions}</td>
                    <td className={`py-2 px-3 text-center ${getFillRateColor(dept.effectiveFillRate)}`}>{dept.effectiveFillRate}%</td>
                    <td className="py-2 px-3 text-center">{dept.rpaAssigned}</td>
                    <td className={`py-2 px-3 text-center ${dept.augmentedFillRate > 100 ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>{dept.augmentedFillRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDeliveryMetricsChart = () => {
    if (tierLevel !== 4) return null;
    
    return (
      <div className="mt-6 rounded-md border">
        <div className="bg-blue-50 p-3 border-b border-blue-200">
          <h3 className="font-medium text-blue-900">Daily Delivery Metrics</h3>
          <p className="text-xs text-blue-700">Percent of Directorate Key Performance Indicators</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-5 gap-1 h-60">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
              <div key={day} className="flex flex-col">
                <div className="text-xs text-center mb-1">{day}</div>
                <div className="flex-1 flex items-end space-x-2 justify-center">
                  <div className="bg-blue-200 w-10 h-[85%] relative">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-[93%]"></div>
                    <div className="absolute top-0 left-0 right-0 text-xs text-center text-blue-900 font-bold mt-1">DPA</div>
                  </div>
                  <div className="bg-green-200 w-10 h-[85%] relative">
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500 h-[95%]"></div>
                    <div className="absolute top-0 left-0 right-0 text-xs text-center text-green-900 font-bold mt-1">DPT</div>
                  </div>
                  <div className="bg-purple-200 w-10 h-[85%] relative">
                    <div className="absolute bottom-0 left-0 right-0 bg-purple-500 h-[90%]"></div>
                    <div className="absolute top-0 left-0 right-0 text-xs text-center text-purple-900 font-bold mt-1">PB</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-8 border-t pt-1 mt-2">
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <div>0%</div>
              <div>20%</div>
              <div>40%</div>
              <div>60%</div>
              <div>80%</div>
              <div>100%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCostMetricsChart = () => {
    if (tierLevel !== 4) return null;
    
    return (
      <div className="mt-6 rounded-md border">
        <div className="bg-blue-50 p-3 border-b border-blue-200">
          <h3 className="font-medium text-blue-900">Cost Metrics</h3>
          <p className="text-xs text-blue-700">RPA Assigned/Funded Vacancies Target - 100% of Funded Rate</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 h-64">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, idx) => (
              <div key={week} className="flex items-end justify-center space-x-2">
                <div className="w-16 bg-red-100 relative h-[80%]">
                  <div style={{height: `${70 + idx * 5}%`}} className="absolute bottom-0 left-0 right-0 bg-red-500"></div>
                  <div className="absolute bottom-[101%] w-full text-center text-xs">RPA's</div>
                  <div className="absolute bottom-[-20px] w-full text-center text-xs font-bold">{17 + idx} / {21 + idx}</div>
                </div>
                <div className="w-16 bg-green-100 relative h-[80%]">
                  <div style={{height: `${80 + idx * 3}%`}} className="absolute bottom-0 left-0 right-0 bg-green-500"></div>
                  <div className="absolute bottom-[101%] w-full text-center text-xs">Funded</div>
                  <div className="absolute bottom-[-20px] w-full text-center text-xs font-bold">{13 + idx} / {21 + idx}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-sm text-red-600 font-medium">
            Working / Learning
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <Tabs 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as 'daily' | 'weekly' | 'monthly')} 
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Daily</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Weekly</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Monthly</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <DailyUpdateDialog
            metrics={metrics}
            onUpdate={handleDailyUpdate}
            currentDate={currentDate.toISOString().split('T')[0]}
          />

          {deliveryMetric && (
            <DeliveryParametersDialog
              metric={deliveryMetric}
              onUpdate={handleDeliveryParametersUpdate}
            />
          )}

          {tierLevel === 4 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeptMetrics(!showDeptMetrics)}
              className="flex items-center gap-1"
            >
              <FileChartLine className="h-4 w-4" />
              {showDeptMetrics ? "Hide Dept. Metrics" : "Show Dept. Metrics"}
            </Button>
          )}
          
          <MetricParametersDialog 
            initialParameters={metrics.map(metric => ({
              category: metric.category,
              goal: metric.goal,
              greenThreshold: metric.greenThreshold,
              yellowThreshold: metric.yellowThreshold,
              redThreshold: metric.redThreshold
            }))}
            onParametersUpdate={handleParametersUpdate}
          />
        </div>
      </div>

      {/* Show metrics count for debugging */}
      <div className="mb-2 text-xs text-gray-500">
        Showing {metrics.length} metrics in {viewMode} view
        {metrics.length > 0 && (
          <span className="ml-2">
            Categories: {metrics.map(m => m.category).join(', ')}
          </span>
        )}
      </div>

      {viewMode === 'monthly' ? (
        <MonthlyView metrics={metrics} viewMode={viewMode} />
      ) : (
        <Table className="w-full">
          <MetricsTableHeader viewMode={viewMode} tier={currentTier.tier} />
          <TableBody>
            {metrics.map((metric) => (
              <MetricRow
                key={metric.id}
                metric={metric}
                expandedMetric={expandedMetric}
                onStatusChange={handleStatusChange}
                onNotesChange={handleNotesChange}
                onValueChange={handleValueChange}
                onToggleExpanded={toggleExpanded}
                onThresholdChange={handleThresholdChange}
                onGoalChange={handleGoalChange}
                onAvailabilityChange={handleAvailabilityChange}
                generateTrendData={generateTrendData}
                getMetricColor={getMetricColor}
                viewMode={viewMode}
                getDayAvailability={getDayAvailability}
                getDayValue={getDayValue}
              />
            ))}
          </TableBody>
        </Table>
      )}
      
      {tierLevel > 1 && (
        <div className="mt-4 text-xs text-gray-600 p-2 bg-gray-100 rounded-md">
          <p>* Note: These metrics represent an aggregation of all Tier {tierLevel-1} boards.</p>
        </div>
      )}

      {/* Display additional tier 4 metrics when enabled */}
      {tierLevel === 4 && showDeptMetrics && (
        <>
          {renderDepartmentMetricsTable()}
          {renderDeliveryMetricsChart()}
          {renderCostMetricsChart()}
        </>
      )}
    </div>
  );
};

export default MetricsTable;
