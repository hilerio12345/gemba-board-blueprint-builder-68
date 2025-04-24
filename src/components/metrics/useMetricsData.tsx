import { useState, useEffect } from "react";
import { Metric } from "../../types/metrics";
import { getMetricsForDate, updateMetricsForDate } from "../../services/metricsService";
import { MetricParameter } from "../MetricParametersDialog";
import { useToast } from "@/hooks/use-toast";

export const useMetricsData = (dateKey: string, viewMode: 'daily' | 'weekly' | 'monthly' = 'weekly', tierLevel: number = 1) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    let loadedMetrics = getMetricsForDate(dateKey);
    
    if (tierLevel > 1) {
      loadedMetrics = loadedMetrics.map(metric => {
        const tierMultiplier = 1 + ((tierLevel - 1) * 0.025);
        let newValue = metric.value;
        
        switch (metric.category) {
          case "AVAILABILITY":
            newValue = Math.min(99.9, metric.value * tierMultiplier);
            break;
          case "DELIVERY":
            if (metric.goal.includes("<")) {
              newValue = Math.max(1, metric.value / tierMultiplier);
            } else {
              newValue = Math.min(10, metric.value * tierMultiplier);
            }
            break;
          case "QUALITY":
            newValue = Math.min(99, metric.value * tierMultiplier);
            break;
          case "COST":
            if (metric.goal.includes("<")) {
              newValue = Math.max(1, metric.value / tierMultiplier);
            } else {
              newValue = metric.value * tierMultiplier;
            }
            break;
          case "PEOPLE":
            newValue = Math.min(99, metric.value * tierMultiplier);
            break;
        }
        
        let dayValues = { ...metric.dayValues };
        if (dayValues) {
          Object.keys(dayValues).forEach(day => {
            const dayKey = day as keyof typeof dayValues;
            if (dayValues[dayKey] !== undefined) {
              const variance = Math.random() * 0.1 - 0.05;
              dayValues[dayKey] = Math.round((newValue * (1 + variance)) * 10) / 10;
            }
          });
        }
        
        let availability = { ...metric.availability };
        if (availability && metric.category === "AVAILABILITY") {
          Object.keys(availability).forEach(day => {
            const dayKey = day as keyof typeof availability;
            if (availability[dayKey] !== undefined) {
              const variance = Math.random() * 0.05;
              availability[dayKey] = Math.min(100, Math.round((newValue * (1 + variance)) * 10) / 10);
            }
          });
        }
        
        return {
          ...metric,
          value: Math.round(newValue * 10) / 10,
          dayValues: dayValues as Metric['dayValues'],
          availability: availability as Metric['availability'],
          notes: metric.notes + (tierLevel > 1 ? ` (Tier ${tierLevel} aggregated)` : '')
        };
      });
    }
    
    setMetrics(loadedMetrics);
  }, [dateKey, tierLevel]);

  const calculateStatusColor = (metric: Metric, value: number): string => {
    const parseThreshold = (threshold: string | undefined): number | null => {
      if (!threshold) return null;
      
      const matches = threshold.match(/(>=?|<=?|<|>)?\s*(\d+(?:\.\d+)?)%?/);
      if (!matches) return null;
      
      return parseFloat(matches[2]);
    };

    if (metric.greenThreshold) {
      const greenMatch = metric.greenThreshold.match(/(>=?|<=?|<|>)?\s*(\d+(?:\.\d+)?)%?/);
      if (greenMatch) {
        const operator = greenMatch[1] || '>=';
        const threshold = parseFloat(greenMatch[2]);
        
        switch (operator) {
          case '>=':
            if (value >= threshold) return 'green';
            break;
          case '>':
            if (value > threshold) return 'green';
            break;
          case '<=':
            if (value <= threshold) return 'green';
            break;
          case '<':
            if (value < threshold) return 'green';
            break;
        }
      }
    }

    if (metric.yellowThreshold) {
      const yellowMatch = metric.yellowThreshold.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)%?/);
      if (yellowMatch) {
        const lower = parseFloat(yellowMatch[1]);
        const upper = parseFloat(yellowMatch[2]);
        if (value >= lower && value <= upper) return 'yellow';
      } else {
        const singleMatch = metric.yellowThreshold.match(/(>=?|<=?|<|>)?\s*(\d+(?:\.\d+)?)%?/);
        if (singleMatch) {
          const operator = singleMatch[1] || '=';
          const threshold = parseFloat(singleMatch[2]);
          
          switch (operator) {
            case '>=':
              if (value >= threshold) return 'yellow';
              break;
            case '>':
              if (value > threshold) return 'yellow';
              break;
            case '<=':
              if (value <= threshold) return 'yellow';
              break;
            case '<':
              if (value < threshold) return 'yellow';
              break;
            case '=':
              if (value === threshold) return 'yellow';
              break;
          }
        }
      }
    }

    if (metric.redThreshold) {
      const redMatch = metric.redThreshold.match(/(>=?|<=?|<|>)?\s*(\d+(?:\.\d+)?)%?/);
      if (redMatch) {
        const operator = redMatch[1] || '<';
        const threshold = parseFloat(redMatch[2]);
        
        switch (operator) {
          case '>=':
            if (value >= threshold) return 'red';
            break;
          case '>':
            if (value > threshold) return 'red';
            break;
          case '<=':
            if (value <= threshold) return 'red';
            break;
          case '<':
            if (value < threshold) return 'red';
            break;
        }
      }
    }

    return 'yellow';
  };

  const generateTrendData = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return [];
    
    return [
      { 
        day: "Mon", 
        value: getMetricDayValue(metric, 'monday')
      },
      { 
        day: "Tue", 
        value: getMetricDayValue(metric, 'tuesday')
      },
      { 
        day: "Wed", 
        value: getMetricDayValue(metric, 'wednesday')
      },
      { 
        day: "Thu", 
        value: getMetricDayValue(metric, 'thursday')
      },
      { 
        day: "Fri", 
        value: getMetricDayValue(metric, 'friday')
      },
    ];
  };

  const getMetricDayValue = (metric: Metric, day: keyof Metric['status']) => {
    if (metric.category === "AVAILABILITY" && metric.availability && metric.availability[day] !== undefined) {
      return metric.availability[day];
    }
    
    if (metric.dayValues && metric.dayValues[day] !== undefined) {
      return metric.dayValues[day];
    }
    
    const statusToValue = {
      green: metric.value * 1.05,
      yellow: metric.value * 0.9,
      red: metric.value * 0.75
    };
    
    return statusToValue[metric.status[day] as keyof typeof statusToValue] || metric.value;
  };

  const updateStatusBasedOnValues = (updatedMetrics: Metric[]): Metric[] => {
    return updatedMetrics.map(metric => {
      const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      const updatedStatus = { ...metric.status };
      
      days.forEach(day => {
        const dayValue = metric.category === "AVAILABILITY" 
          ? (metric.availability?.[day] ?? metric.value)
          : (metric.dayValues?.[day] ?? metric.value);
          
        updatedStatus[day] = calculateStatusColor(metric, dayValue);
      });
      
      return {
        ...metric,
        status: updatedStatus
      };
    });
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
    if (tierLevel === 1) {
      updateMetricsForDate(dateKey, updatedMetrics);
    }
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
    if (tierLevel === 1) {
      updateMetricsForDate(dateKey, updatedMetrics);
    }
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
    if (tierLevel === 1) {
      updateMetricsForDate(dateKey, updatedMetrics);
    }
    
    toast({
      title: "All parameters updated",
      description: "Parameters for all metric categories have been updated successfully",
    });
  };

  const handleValueChange = (metricId: string, increment: boolean) => {
    let updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        let newValue = increment ? metric.value + 1 : metric.value - 1;
        if (newValue < 0) newValue = 0;
        
        let updatedMetric = {
          ...metric,
          value: newValue
        };
        
        if (metric.category === "AVAILABILITY") {
          const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
          const availability = { ...(metric.availability || {}) };
          
          days.forEach(day => {
            if (availability[day] === undefined || availability[day] === metric.value) {
              availability[day] = newValue;
            }
          });
          
          updatedMetric.availability = availability as Metric['availability'];
        }
        
        if (metric.dayValues) {
          const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
          const dayValues = { ...(metric.dayValues || {}) };
          
          days.forEach(day => {
            if (dayValues[day] === undefined || dayValues[day] === metric.value) {
              dayValues[day] = newValue;
            }
          });
          
          updatedMetric.dayValues = dayValues as Metric['dayValues'];
        }
        
        return updatedMetric;
      }
      return metric;
    });
    
    updatedMetrics = updateStatusBasedOnValues(updatedMetrics);
    
    setMetrics(updatedMetrics);
    if (tierLevel === 1) {
      updateMetricsForDate(dateKey, updatedMetrics);
    }
  };

  const handleAvailabilityChange = (metricId: string, value: number, day?: keyof Metric['status']) => {
    let updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        if (day) {
          if (metric.category === "AVAILABILITY") {
            const defaultValues = {
              monday: metric.value,
              tuesday: metric.value,
              wednesday: metric.value,
              thursday: metric.value,
              friday: metric.value
            };
            
            return {
              ...metric,
              availability: {
                ...(metric.availability || defaultValues),
                [day]: value
              }
            };
          } else {
            const defaultValues = {
              monday: metric.value,
              tuesday: metric.value,
              wednesday: metric.value,
              thursday: metric.value,
              friday: metric.value
            };
            
            return {
              ...metric,
              dayValues: {
                ...(metric.dayValues || defaultValues),
                [day]: value
              }
            };
          }
        } else {
          let updatedMetric = { ...metric, value: value };
          
          if (metric.category === "AVAILABILITY") {
            const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            const availability = { ...(metric.availability || {}) };
            
            days.forEach(d => {
              if (availability[d] === undefined || availability[d] === metric.value) {
                availability[d] = value;
              }
            });
            
            updatedMetric.availability = availability as Metric['availability'];
          }
          
          if (metric.dayValues) {
            const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            const dayValues = { ...(metric.dayValues || {}) };
            
            days.forEach(d => {
              if (dayValues[d] === undefined || dayValues[d] === metric.value) {
                dayValues[d] = value;
              }
            });
            
            updatedMetric.dayValues = dayValues as Metric['dayValues'];
          }
          
          return updatedMetric;
        }
      }
      return metric;
    });
    
    updatedMetrics = updateStatusBasedOnValues(updatedMetrics);
    
    setMetrics(updatedMetrics);
    if (tierLevel === 1) {
      updateMetricsForDate(dateKey, updatedMetrics);
    }
    
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
    if (tierLevel === 1) {
      updateMetricsForDate(dateKey, updatedMetrics);
    }
    
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
    if (tierLevel === 1) {
      updateMetricsForDate(dateKey, updatedMetrics);
    }
    
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
    getDayValue,
    getMetricDayValue
  };
};
