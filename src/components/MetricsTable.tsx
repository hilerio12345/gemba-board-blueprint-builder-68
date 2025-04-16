
import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import MetricParametersDialog from "./MetricParametersDialog";
import { useDateContext } from "../contexts/DateContext";
import MetricsTableHeader from "./metrics/MetricsTableHeader";
import MetricRow from "./metrics/MetricRow";
import { useMetricsData } from "./metrics/useMetricsData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, CalendarWeek } from "lucide-react";

const MetricsTable = () => {
  const { dateKey } = useDateContext();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');
  
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
    toggleExpanded,
    getMetricColor
  } = useMetricsData(dateKey, viewMode);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <Tabs defaultValue="weekly" onValueChange={(value) => setViewMode(value as 'daily' | 'weekly')} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Daily</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <CalendarWeek className="h-4 w-4" />
              <span>Weekly</span>
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
              generateTrendData={generateTrendData}
              getMetricColor={getMetricColor}
              viewMode={viewMode}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MetricsTable;
