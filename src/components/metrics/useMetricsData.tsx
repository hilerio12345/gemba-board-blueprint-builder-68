
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
    
    // Generate trend data based on the actual daily values
    // or fallback to status-based values if actual values aren't available
    return [
      { 
        day: "Mon", 
        value: getDayValue(metric, 'monday')
      },
      { 
        day: "Tue", 
        value: getDayValue(metric, 'tuesday')
      },
      { 
        day: "Wed", 
        value: getDayValue(metric, 'wednesday')
      },
      { 
        day: "Thu", 
        value: getDayValue(metric, 'thursday')
      },
      { 
        day: "Fri", 
        value: getDayValue(metric, 'friday')
      },
    ];
  };
  
  // Helper function to get the actual value for a day or derive one from status
  const getDayValue = (metric: Metric, day: keyof Metric['status']) => {
    if (metric.category === "AVAILABILITY" && metric.availability && metric.availability[day] !== undefined) {
      return metric.availability[day];
    }
    
    // For other metrics, check if there's a day value
    if (metric.dayValues && metric.dayValues[day] !== undefined) {
      return metric.dayValues[day];
    }
    
    // Fallback to status-based estimation
    const statusToValue = {
      green: metric.value * 1.05,
      yellow: metric.value * 0.9,
      red: metric.value * 0.75
    };
    
    return statusToValue[metric.status[day] as keyof typeof statusToValue] || metric.value;
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
        
        let updatedMetric = {
          ...metric,
          value: newValue
        };
        
        // If this is an availability metric, update all days that don't have specific values
        if (metric.category === "AVAILABILITY") {
          const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
          const availability = { ...(metric.availability || {}) };
          
          days.forEach(day => {
            // Only update days that haven't been manually set
            if (availability[day] === undefined || availability[day] === metric.value) {
              availability[day] = newValue;
            }
          });
          
          updatedMetric.availability = availability;
        }
        
        // Similarly for other metrics with day values
        if (metric.dayValues) {
          const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
          const dayValues = { ...(metric.dayValues || {}) };
          
          days.forEach(day => {
            // Only update days that haven't been manually set
            if (dayValues[day] === undefined || dayValues[day] === metric.value) {
              dayValues[day] = newValue;
            }
          });
          
          updatedMetric.dayValues = dayValues;
        }
        
        return updatedMetric;
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };

  const handleAvailabilityChange = (metricId: string, value: number, day?: keyof Metric['status']) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        if (day) {
          if (metric.category === "AVAILABILITY") {
            return {
              ...metric,
              availability: {
                ...metric.availability || {
                  monday: metric.value,
                  tuesday: metric.value,
                  wednesday: metric.value,
                  thursday: metric.value,
                  friday: metric.value
                },
                [day]: value
              }
            };
          } else {
            // For non-availability metrics, update the day-specific value
            return {
              ...metric,
              dayValues: {
                ...metric.dayValues || {
                  monday: metric.value,
                  tuesday: metric.value,
                  wednesday: metric.value,
                  thursday: metric.value,
                  friday: metric.value
                },
                [day]: value
              }
            };
          }
        } else {
          // Update the overall value
          let updatedMetric = { ...metric, value: value };
          
          // For availability metrics, synchronize all days
          if (metric.category === "AVAILABILITY") {
            const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            const availability = { ...(metric.availability || {}) };
            
            days.forEach(d => {
              // Only update days that haven't been manually set
              if (availability[d] === undefined || availability[d] === metric.value) {
                availability[d] = value;
              }
            });
            
            updatedMetric.availability = availability;
          }
          
          // Similarly for other metrics with day values
          if (metric.dayValues) {
            const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            const dayValues = { ...(metric.dayValues || {}) };
            
            days.forEach(d => {
              // Only update days that haven't been manually set
              if (dayValues[d] === undefined || dayValues[d] === metric.value) {
                dayValues[d] = value;
              }
            });
            
            updatedMetric.dayValues = dayValues;
          }
          
          return updatedMetric;
        }
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
    
    const metricType = metrics.find(m => m.id === metricId)?.category || "metric";
    
    toast({
      title: `${metricType} value updated`,
      description: day 
        ? `${day.charAt(0).toUpperCase() + day.slice(1)} value updated to ${value}.` 
        : `Overall value updated to ${value}.`
    });
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

  const getDayAvailability = (metric: Metric, day: keyof Metric['status']) => {
    if (metric.category !== "AVAILABILITY") return undefined;
    
    return metric.availability && metric.availability[day] !== undefined 
      ? metric.availability[day] 
      : metric.value;
  };
  
  // New helper function to get day-specific value for any metric type
  const getDayValue = (metric: Metric, day: keyof Metric['status']) => {
    if (metric.category === "AVAILABILITY") {
      return getDayAvailability(metric, day);
    }
    
    return metric.dayValues && metric.dayValues[day] !== undefined 
      ? metric.dayValues[day] 
      : metric.value;
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
    handleAvailabilityChange,
    toggleExpanded,
    getMetricColor,
    viewMode,
    getDayAvailability,
    getDayValue
  };
};
