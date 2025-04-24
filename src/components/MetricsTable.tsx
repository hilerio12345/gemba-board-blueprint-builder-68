
import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import MetricParametersDialog from "./MetricParametersDialog";
import { useDateContext } from "../contexts/DateContext";
import MetricsTableHeader from "./metrics/MetricsTableHeader";
import MetricRow from "./metrics/MetricRow";
import { useMetricsData } from "./metrics/useMetricsData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Calendar } from "lucide-react";
import MonthlyView from "./metrics/MonthlyView";

const MetricsTable = () => {
  const { dateKey } = useDateContext();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
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
    getDayValue
  } = useMetricsData(dateKey, viewMode);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <Tabs defaultValue="weekly" onValueChange={(value) => setViewMode(value as 'daily' | 'weekly' | 'monthly')} className="w-[400px]">
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

      {viewMode === 'monthly' ? (
        <MonthlyView metrics={metrics} />
      ) : (
        <Table className="w-full">
          <MetricsTableHeader viewMode={viewMode} />
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
    </div>
  );
};

export default MetricsTable;
