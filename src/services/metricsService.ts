
import { Metric } from "../types/metrics";

// Sample initial metrics data
const initialMetricsData: Record<string, Metric[]> = {};

// Get today's date key
const getTodayKey = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Default metrics for a new date
const getDefaultMetrics = (): Metric[] => [
  {
    id: "1",
    category: "AVAILABILITY",
    goal: "Goal: 100%",
    value: 98,
    status: { monday: "green", tuesday: "green", wednesday: "yellow", thursday: "green", friday: "green" },
    notes: "Systems available throughout the week",
    greenThreshold: "≥ 98%",
    yellowThreshold: "90-97%",
    redThreshold: "< 90%"
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
    redThreshold: "< 3"
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
    redThreshold: "< 65%"
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
    redThreshold: "> 7%"
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
    redThreshold: "< 85%"
  },
];

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
          
        // Random status values
        const statusOptions = ["green", "yellow", "red"];
        const randomStatus = {
          monday: statusOptions[Math.floor(Math.random() * 3)],
          tuesday: statusOptions[Math.floor(Math.random() * 3)],
          wednesday: statusOptions[Math.floor(Math.random() * 3)],
          thursday: statusOptions[Math.floor(Math.random() * 3)],
          friday: statusOptions[Math.floor(Math.random() * 3)]
        };
        
        return {
          ...metric,
          value: newValue,
          status: randomStatus,
          notes: `Historical data for ${pastDate.toLocaleDateString()}`
        };
      });
      
      allData[pastDateKey] = variedMetrics;
    }
  }
  
  saveMetricsData(allData);
};
