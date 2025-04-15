
import { useState, useEffect } from "react";
import { Metric } from "../../types/metrics";
import { getMetricsForDate, updateMetricsForDate } from "../../services/metricsService";
import { MetricParameter } from "../MetricParametersDialog";

export const useMetricsData = (dateKey: string) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  
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
    const updatedMetrics = metrics.map((metric, index) => {
      const parameter = parameters[index];
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
    toggleExpanded,
    getMetricColor
  };
};
