
import { Metric } from "../types/metrics";

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

// Default metrics for a new date with comprehensive delivery parameters
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
      goal: "Goal: 4 DVs/week",
      value: 3,
      status: { monday: "green", tuesday: "green", wednesday: "green", thursday: "red", friday: "yellow" },
      notes: "Daily deliveries: Mon(1), Tue(1), Wed(0), Thu(0), Fri(1) | Lost delivery: Thu - system issue",
      greenThreshold: "≥ 4",
      yellowThreshold: "3",
      redThreshold: "< 3",
      dayValues: {
        monday: 1,
        tuesday: 1,
        wednesday: 0,
        thursday: 0,
        friday: 1
      },
      deliveryParams: {
        targetPerWeek: 4,
        lostDeliveries: [
          { day: "thursday", reason: "System outage", impact: "High", mitigationPlan: "Backup system deployment" }
        ],
        cumulativeDeliveries: 3,
        weeklyTarget: 4,
        monthlyTarget: 16
      }
    },
    {
      id: "3",
      category: "QUALITY",
      goal: "Goal: 75%",
      value: 78,
      status: { monday: "green", tuesday: "yellow", wednesday: "yellow", thursday: "green", friday: "green" },
      notes: "3rd party PV > Target | Quality issues on Tue/Wed resolved",
      greenThreshold: "≥ 75%",
      yellowThreshold: "65-74%",
      redThreshold: "< 65%",
      dayValues: {
        monday: 80,
        tuesday: 70,
        wednesday: 72,
        thursday: 82,
        friday: 78
      },
      qualityParams: {
        defectRate: 2.1,
        customerSatisfaction: 4.3,
        reworkRate: 1.8,
        testPassRate: 94.2
      }
    },
    {
      id: "4",
      category: "COST",
      goal: "Goal: <5% variance",
      value: 4.2,
      status: { monday: "yellow", tuesday: "green", wednesday: "green", thursday: "green", friday: "red" },
      notes: "Budget variance tracking | Overtime spike on Friday",
      greenThreshold: "< 5%",
      yellowThreshold: "5-7%",
      redThreshold: "> 7%",
      dayValues: {
        monday: 6.1,
        tuesday: 4.5,
        wednesday: 3.8,
        thursday: 4.0,
        friday: 8.5
      },
      costParams: {
        budgetVariance: 4.2,
        overtimeHours: 12.5,
        resourceUtilization: 87.3,
        costPerDelivery: 1250
      }
    },
    {
      id: "5",
      category: "PEOPLE",
      goal: "Goal: 95% satisfaction",
      value: 92,
      status: { monday: "green", tuesday: "green", wednesday: "green", thursday: "green", friday: "yellow" },
      notes: "Training compliance on track | Team satisfaction survey completed",
      greenThreshold: "≥ 95%",
      yellowThreshold: "85-94%",
      redThreshold: "< 85%",
      dayValues: {
        monday: 96,
        tuesday: 95,
        wednesday: 94,
        thursday: 94,
        friday: 90
      },
      peopleParams: {
        teamSatisfaction: 92,
        trainingCompliance: 94,
        attendanceRate: 96.5,
        turnoverRate: 2.1
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

// Use local storage to persist data with better error handling
const saveMetricsData = (data: Record<string, Metric[]>) => {
  try {
    const dataString = JSON.stringify(data);
    localStorage.setItem('gembaMetricsData', dataString);
    console.log("Metrics data saved successfully", Object.keys(data));
  } catch (error) {
    console.error("Failed to save metrics data:", error);
  }
};

const loadMetricsData = (): Record<string, Metric[]> => {
  try {
    const saved = localStorage.getItem('gembaMetricsData');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("Metrics data loaded successfully", Object.keys(parsed));
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load metrics data:", error);
  }
  return {};
};

// Get metrics for a specific date
export const getMetricsForDate = (dateKey: string): Metric[] => {
  const allData = loadMetricsData();
  const metrics = allData[dateKey] || [];
  console.log(`Getting metrics for ${dateKey}:`, metrics.length, "metrics found");
  return metrics;
};

// Update metrics for a specific date
export const updateMetricsForDate = (dateKey: string, metrics: Metric[]): void => {
  console.log(`Updating metrics for ${dateKey}:`, metrics.length, "metrics");
  const allData = loadMetricsData();
  allData[dateKey] = metrics;
  saveMetricsData(allData);
};

// Import metrics from external source
export const importMetricsData = (metrics: Metric[], dateKey?: string): void => {
  const targetDate = dateKey || getTodayKey();
  const allData = loadMetricsData();
  allData[targetDate] = metrics;
  saveMetricsData(allData);
  console.log(`Imported metrics for ${targetDate}`);
};

// Check if any data exists
export const hasAnyData = (): boolean => {
  const allData = loadMetricsData();
  return Object.keys(allData).length > 0;
};

// Initialize data for new users or when configuration is complete
export const initializeDefaultData = (): void => {
  const todayKey = getTodayKey();
  const allData = loadMetricsData();
  
  if (!allData[todayKey]) {
    console.log("Initializing default data for", todayKey);
    allData[todayKey] = getDefaultMetrics();
    saveMetricsData(allData);
  } else {
    console.log("Data already exists for", todayKey);
  }
};

// Generate varying data for new dates to create history
export const generateHistoricalDataIfNeeded = () => {
  if (!hasAnyData()) {
    return;
  }
  
  const allData = loadMetricsData();
  const today = new Date();
  
  // Generate data for the past 30 days if it doesn't exist
  for (let i = 1; i <= 30; i++) {
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - i);
    const pastDateKey = pastDate.toISOString().split('T')[0];
    
    if (!allData[pastDateKey]) {
      const baseMetrics = getDefaultMetrics();
      
      const variedMetrics = baseMetrics.map(metric => {
        const variationFactor = 0.9 + Math.random() * 0.2;
        const newValue = typeof metric.value === 'number' 
          ? Math.round(metric.value * variationFactor * 10) / 10
          : metric.value;
          
        const dayValues = {
          monday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          tuesday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          wednesday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          thursday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10,
          friday: Math.round(newValue * (0.95 + Math.random() * 0.1) * 10) / 10
        };
        
        const updatedMetric = {
          ...metric,
          value: newValue,
          notes: `Historical data for ${pastDate.toLocaleDateString()}`,
          availability: metric.category === "AVAILABILITY" ? dayValues : undefined,
          dayValues: metric.category !== "AVAILABILITY" ? dayValues : undefined
        };
        
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

// Calculate weekly aggregates from daily data
export const calculateWeeklyData = (startDate: string): Metric[] => {
  const allData = loadMetricsData();
  const weekDays = [];
  const start = new Date(startDate);
  
  // Get all days in the week
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    weekDays.push(day.toISOString().split('T')[0]);
  }
  
  // Aggregate daily data into weekly metrics
  const weeklyMetrics = getDefaultMetrics().map(metric => {
    const weekData = weekDays.map(day => allData[day]?.find(m => m.category === metric.category)).filter(Boolean);
    
    if (weekData.length === 0) return metric;
    
    // Calculate weekly averages and totals
    const avgValue = weekData.reduce((sum, m) => sum + (m?.value || 0), 0) / weekData.length;
    
    return {
      ...metric,
      value: Math.round(avgValue * 10) / 10,
      notes: `Weekly aggregate (${weekData.length} days of data)`
    };
  });
  
  return weeklyMetrics;
};

// Calculate monthly aggregates from weekly data
export const calculateMonthlyData = (month: number, year: number): Metric[] => {
  const allData = loadMetricsData();
  const monthlyMetrics = getDefaultMetrics().map(metric => {
    const monthData = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Collect all data for the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayMetric = allData[dateKey]?.find(m => m.category === metric.category);
      if (dayMetric) monthData.push(dayMetric);
    }
    
    if (monthData.length === 0) return metric;
    
    // Calculate monthly averages
    const avgValue = monthData.reduce((sum, m) => sum + (m?.value || 0), 0) / monthData.length;
    
    return {
      ...metric,
      value: Math.round(avgValue * 10) / 10,
      notes: `Monthly aggregate (${monthData.length} days of data)`
    };
  });
  
  return monthlyMetrics;
};

