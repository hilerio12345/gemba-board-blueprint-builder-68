
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Metric } from "../../types/metrics";

interface MetricHeaderProps {
  category: string;
  metric: Metric;
  expandedMetric: string | null;
  onValueChange: (metricId: string, increment: boolean) => void;
  onToggleExpanded: (metricId: string) => void;
}

const MetricHeader = ({ 
  category, 
  metric, 
  expandedMetric, 
  onValueChange,
  onToggleExpanded 
}: MetricHeaderProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-bold">{category}</span>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => onValueChange(metric.id, false)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{metric.value}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => onValueChange(metric.id, true)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {metric.greenThreshold && (
        <div className="text-xs text-gray-500 mt-2">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-1"></span>
            <span>{metric.greenThreshold}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block mr-1"></span>
            <span>{metric.yellowThreshold}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-1"></span>
            <span>{metric.redThreshold}</span>
          </div>
        </div>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 text-xs h-6"
        onClick={() => onToggleExpanded(metric.id)}
      >
        {expandedMetric === metric.id ? "Hide Graph" : "Show Graph"}
      </Button>
    </div>
  );
};

export default MetricHeader;
