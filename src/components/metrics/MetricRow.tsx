
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import StatusSelector from "./StatusSelector";
import MetricHeader from "./MetricHeader";
import MetricsLineGraph from "../MetricsLineGraph";
import { Metric } from "../../types/metrics";

interface MetricRowProps {
  metric: Metric;
  expandedMetric: string | null;
  onStatusChange: (metricId: string, day: keyof Metric['status'], value: string) => void;
  onNotesChange: (metricId: string, value: string) => void;
  onValueChange: (metricId: string, increment: boolean) => void;
  onToggleExpanded: (metricId: string) => void;
  onThresholdChange: (metricId: string, thresholdType: string, value: string) => void;
  onGoalChange: (metricId: string, value: string) => void;
  generateTrendData: (metricId: string) => { day: string; value: number }[];
  getMetricColor: (category: string) => string;
}

const MetricRow = ({ 
  metric, 
  expandedMetric, 
  onStatusChange, 
  onNotesChange,
  onValueChange,
  onToggleExpanded,
  onThresholdChange,
  onGoalChange,
  generateTrendData,
  getMetricColor
}: MetricRowProps) => {
  return (
    <React.Fragment>
      <TableRow className="hover:bg-gray-50">
        <TableCell className="font-medium border-r bg-gray-50">
          <MetricHeader 
            category={metric.category} 
            metric={metric} 
            expandedMetric={expandedMetric}
            onValueChange={onValueChange}
            onToggleExpanded={onToggleExpanded}
            onThresholdChange={onThresholdChange}
            onGoalChange={onGoalChange}
          />
        </TableCell>
        
        <TableCell className="text-center border-r border-gray-200 p-1">
          <StatusSelector 
            value={metric.status.monday} 
            onValueChange={(value) => onStatusChange(metric.id, 'monday', value)}
          />
        </TableCell>
        <TableCell className="text-center border-r border-gray-200 p-1">
          <StatusSelector 
            value={metric.status.tuesday} 
            onValueChange={(value) => onStatusChange(metric.id, 'tuesday', value)}
          />
        </TableCell>
        <TableCell className="text-center border-r border-gray-200 p-1">
          <StatusSelector 
            value={metric.status.wednesday} 
            onValueChange={(value) => onStatusChange(metric.id, 'wednesday', value)}
          />
        </TableCell>
        <TableCell className="text-center border-r border-gray-200 p-1">
          <StatusSelector 
            value={metric.status.thursday} 
            onValueChange={(value) => onStatusChange(metric.id, 'thursday', value)}
          />
        </TableCell>
        <TableCell className="text-center border-r border-gray-200 p-1">
          <StatusSelector 
            value={metric.status.friday} 
            onValueChange={(value) => onStatusChange(metric.id, 'friday', value)}
          />
        </TableCell>
        
        <TableCell className="p-1">
          <Input 
            value={metric.notes} 
            onChange={(e) => onNotesChange(metric.id, e.target.value)} 
            className="h-8"
          />
        </TableCell>
      </TableRow>
      {expandedMetric === metric.id && (
        <TableRow>
          <TableCell colSpan={7} className="p-4 bg-gray-50">
            <MetricsLineGraph 
              category={metric.category}
              data={generateTrendData(metric.id)}
              color={getMetricColor(metric.category)}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default MetricRow;
