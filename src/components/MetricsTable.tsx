
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import MetricParametersDialog from "./MetricParametersDialog";
import { useDateContext } from "../contexts/DateContext";
import MetricsTableHeader from "./metrics/MetricsTableHeader";
import MetricRow from "./metrics/MetricRow";
import { useMetricsData } from "./metrics/useMetricsData";

const MetricsTable = () => {
  const { dateKey } = useDateContext();
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
  } = useMetricsData(dateKey);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end">
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
        <MetricsTableHeader />
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MetricsTable;
