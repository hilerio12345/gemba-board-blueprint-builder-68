
import { Metric } from "../types/metrics";

// Sample initial metrics data
const initialMetricsData: Record<string, Metric[]> = {};

// Get today's date key
const getTodayKey = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Calculate status color based on value and thresholds
const calculateStatusColor = (metric: Metric, value: number): string => {
  // Parse threshold values (removing any non-numeric characters)
  const parseThreshold = (threshold: string | undefined): number | null => {
    if (!threshold) return null;
    
    // Extract numeric values and operators
    const matches = threshold.match(/(>=?|<=?|<|>)?\s*(\d+(?:\.\d+)?)%?/);
    if (!matches) return null;
    
    return parseFloat(matches[2]);
  };

  // Check if it's a green threshold
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

  // Check if it's a yellow threshold
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

  // Check if it's a red threshold
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

  // Default to yellow if no condition matches
  return 'yellow';
};

// Default metrics for a new date
const getDefaultMetrics = (): Metric[] => {
  const metrics = [
    {
      id: "1",
      category: "AVAILABILITY",
      goal: "Goal: 100%",
      value: 98,
      status: { monday: "green", tuesday: "green", wednesday: "yellow", thursday: "green", friday: "green" },
      notes: "Systems available throughout the week",
      greenThreshold: "≥ 98%",
      yellowThreshold: "90-97%",
      redThreshold: "< 90%",
      availability: {
        monday: 98.5,
        tuesday: 99.1,
        wednesday: 96.8,
        thursday: 98.2,
        friday: 97.9
      }
    },
    {
      id: "2",
      category: "DELIVERY",
      goal: "Goal: 4",
      value: 3,
      status: { monday: "green", tuesday: "green", wednesday: "green", thursday: "red", friday: "yellow" },
      notes: "4 DVs/wk | 4 DVs | = 4 total",
      greenThreshold: "≥ 4",
      yellowThreshold: "3",
      redThreshold: "< 3",
      dayValues: {
        monday: 4,
        tuesday: 4,
        wednesday: 3,
        thursday: 2,
        friday: 3
      }
    },
    {
      id: "3",
      category: "QUALITY",
      goal: "Goal: 75%",
      value: 78,
      status: { monday: "green", tuesday: "yellow", wednesday: "yellow", thursday: "green", friday: "green" },
      notes: "3rd prty PV > Target",
      greenThreshold: "≥ 75%",
      yellowThreshold: "65-74%",
      redThreshold: "< 65%",
      dayValues: {
        monday: 80,
        tuesday: 70,
        wednesday: 72,
        thursday: 82,
        friday: 78
      }
    },
    {
      id: "4",
      category: "COST",
      goal: "Goal: <5%",
      value: 4.2,
      status: { monday: "yellow", tuesday: "green", wednesday: "green", thursday: "green", friday: "red" },
      notes: "Overtime % above target on Friday",
      greenThreshold: "< 5%",
      yellowThreshold: "5-7%",
      redThreshold: "> 7%",
      dayValues: {
        monday: 6.1,
        tuesday: 4.5,
        wednesday: 3.8,
        thursday: 4.0,
        friday: 8.5
      }
    },
    {
      id: "5",
      category: "PEOPLE",
      goal: "Goal: 95%",
      value: 92,
      status: { monday: "green", tuesday: "green", wednesday: "green", thursday: "green", friday: "yellow" },
      notes: "Training compliance on track",
      greenThreshold: "≥ 95%",
      yellowThreshold: "85-94%",
      redThreshold: "< 85%",
      dayValues: {
        monday: 96,
        tuesday: 95,
        wednesday: 94,
        thursday: 94,
        friday: 90
      }
    },
  ];
  
  // Update status colors based on actual values
  return metrics.map(metric => {
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

// Initialize today's data if it doesn't exist
const todayKey = getTodayKey();
initialMetricsData[todayKey] = getDefaultMetrics();

// Use local storage to persist data
const saveMetricsData = (data: Record<string, Metric[]>) => {
  localStorage.setItem('gembaMetricsData', JSON.stringify(data));
};

const loadMetricsData = (): Record<string, Metric[]> => {
  const saved = localStorage.getItem('gembaMetricsData');
  if (saved) {
    const parsed = JSON.parse(saved);
    // If today's data doesn't exist in saved data, add it
    if (!parsed[todayKey]) {
      parsed[todayKey] = getDefaultMetrics();
      saveMetricsData(parsed);
    }
    return parsed;
  }
  // Initialize with today's data
  saveMetricsData(initialMetricsData);
  return initialMetricsData;
};

// Get metrics for a specific date
export const getMetricsForDate = (dateKey: string): Metric[] => {
  const allData = loadMetricsData();
  
  // If data for this date doesn't exist, create a new entry
  if (!allData[dateKey]) {
    allData[dateKey] = getDefaultMetrics();
    saveMetricsData(allData);
  }
  
  return allData[dateKey];
};

// Update metrics for a specific date
export const updateMetricsForDate = (dateKey: string, metrics: Metric[]): void => {
  const allData = loadMetricsData();
  allData[dateKey] = metrics;
  saveMetricsData(allData);
};

// Generate varying data for new dates to create history
export const generateHistoricalDataIfNeeded = () => {
  const allData = loadMetricsData();
  const today = new Date();
  
  // Generate data for the past 30 days if it doesn't exist
  for (let i = 1; i <= 30; i++) {
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - i);
    const pastDateKey = pastDate.toISOString().split('T')[0];
    
    // Only generate if this date doesn't have data yet
    if (!allData[pastDateKey]) {
      const baseMetrics = getDefaultMetrics();
      
      // Vary the metrics slightly to create historical differences
      const variedMetrics = baseMetrics.map(metric => {
        // Random variation between -10% and +10% for values
        const variationFactor = 0.9 + Math.random() * 0.2;
        const newValue = typeof metric.value === 'number' 
          ? Math.round(metric.value * variationFactor * 10) / 10
          : metric.value;
          
        // Generate day values for each metric
        const dayValues = {
          monday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          tuesday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          wednesday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          thursday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          friday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10
        };
        
        // Create the metric with day-specific values
        const updatedMetric = {
          ...metric,
          value: newValue,
          notes: `Historical data for ${pastDate.toLocaleDateString()}`,
          availability: metric.category === "AVAILABILITY" ? dayValues : undefined,
          dayValues: metric.category !== "AVAILABILITY" ? dayValues : undefined
        };
        
        // Calculate status colors based on values
        const days: (keyof Metric['status'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const updatedStatus = { ...updatedMetric.status };
        
        days.forEach(day => {
          const dayValue = updatedMetric.category === "AVAILABILITY" 
            ? (updatedMetric.availability?.[day] ?? updatedMetric.value)
            : (updatedMetric.dayValues?.[day] ?? updatedMetric.value);
            
          updatedStatus[day] = calculateStatusColor(updatedMetric, dayValue);
        });
        
        return {
          ...updatedMetric,
          status: updatedStatus
        };
      });
      
      allData[pastDateKey] = variedMetrics as Metric[];
    }
  }
  
  saveMetricsData(allData);
};
