
import { useState, useEffect } from "react";
import { Metric } from "../../types/metrics";
import { getMetricsForDate, updateMetricsForDate } from "../../services/metricsService";
import { MetricParameter } from "../MetricParametersDialog";
import { useToast } from "@/hooks/use-toast";

export const useMetricsData = (dateKey: string, viewMode: 'daily' | 'weekly' = 'weekly') => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadedMetrics = getMetricsForDate(dateKey);
    setMetrics(loadedMetrics);
  }, [dateKey]);

  const generateTrendData = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return [];
    
    const statusToValue = {
      green: metric.value * 1.05,
      yellow: metric.value * 0.9,
      red: metric.value * 0.75
    };
    
    return [
      { day: "Mon", value: statusToValue[metric.status.monday as keyof typeof statusToValue] || metric.value },
      { day: "Tue", value: statusToValue[metric.status.tuesday as keyof typeof statusToValue] || metric.value },
      { day: "Wed", value: statusToValue[metric.status.wednesday as keyof typeof statusToValue] || metric.value },
      { day: "Thu", value: statusToValue[metric.status.thursday as keyof typeof statusToValue] || metric.value },
      { day: "Fri", value: statusToValue[metric.status.friday as keyof typeof statusToValue] || metric.value },
    ];
  };

  const handleStatusChange = (metricId: string, day: keyof Metric['status'], value: string) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        return {
          ...metric,
          status: {
            ...metric.status,
            [day]: value
          }
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };

  const handleNotesChange = (metricId: string, value: string) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        return {
          ...metric,
          notes: value
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };

  const handleParametersUpdate = (parameters: MetricParameter[]) => {
    // Create a mapping of category to parameter for easier lookup
    const parametersByCategory = parameters.reduce((acc, param) => {
      acc[param.category] = param;
      return acc;
    }, {} as Record<string, MetricParameter>);

    const updatedMetrics = metrics.map(metric => {
      const parameter = parametersByCategory[metric.category];
      if (!parameter) return metric;
      
      return {
        ...metric,
        goal: parameter.goal,
        greenThreshold: parameter.greenThreshold,
        yellowThreshold: parameter.yellowThreshold,
        redThreshold: parameter.redThreshold
      };
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
    
    toast({
      title: "All parameters updated",
      description: "Parameters for all metric categories have been updated successfully",
    });
  };
  
  const handleValueChange = (metricId: string, increment: boolean) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        let newValue = increment ? metric.value + 1 : metric.value - 1;
        if (newValue < 0) newValue = 0;
        
        return {
          ...metric,
          value: newValue
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };

  const handleThresholdChange = (metricId: string, thresholdType: string, value: string) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        return {
          ...metric,
          [thresholdType]: value
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
    
    toast({
      title: "Threshold updated",
      description: `${thresholdType.replace('Threshold', '')} threshold updated successfully.`
    });
  };

  const handleGoalChange = (metricId: string, value: string) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        return {
          ...metric,
          goal: value.startsWith('Goal:') ? value : `Goal: ${value}`
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
    
    toast({
      title: "Goal updated",
      description: "Metric goal updated successfully."
    });
  };

  const toggleExpanded = (metricId: string) => {
    setExpandedMetric(expandedMetric === metricId ? null : metricId);
    setTimeout(() => {
      console.log("Graph toggled for metric:", metricId);
    }, 100);
  };

  const getMetricColor = (category: string) => {
    switch(category) {
      case "AVAILABILITY": return "#0EA5E9"; // blue
      case "DELIVERY": return "#8B5CF6"; // purple
      case "QUALITY": return "#10B981"; // green
      case "COST": return "#F97316"; // orange
      case "PEOPLE": return "#6E59A5"; // dark purple
      default: return "#8E9196"; // gray
    }
  };

  return {
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
    getMetricColor,
    viewMode
  };
};
