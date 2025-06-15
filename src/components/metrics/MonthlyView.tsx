
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, getDay, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { useDateContext } from "@/contexts/DateContext";
import { Metric } from "@/types/metrics";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, Truck, CheckCircle2, DollarSign, Users } from "lucide-react";
import MetricsLineGraph from "../MetricsLineGraph";

interface MonthlyViewProps {
  metrics: Metric[];
  viewMode?: 'monthly';
}

const MonthlyView = ({ metrics, viewMode = 'monthly' }: MonthlyViewProps) => {
  const { currentDate } = useDateContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

  // Get metrics grouped by category
  const metricsByCategory = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  // Map day of week to our status keys
  const dayOfWeekMapping: Record<number, keyof Metric["status"] | null> = {
    0: null, // Sunday (weekend)
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: null, // Saturday (weekend)
  };

  // Generate monthly graph data for a specific category
  const generateMonthlyGraphData = (category: string) => {
    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
        .filter(day => !isWeekend(day) && isSameMonth(day, currentDate));

      if (weekDays.length === 0) return { day: `Week ${index + 1}`, value: 0 };

      const relevantMetrics = category === "ALL" 
        ? metrics 
        : metricsByCategory[category] || [];

      if (relevantMetrics.length === 0) return { day: `Week ${index + 1}`, value: 0 };

      let totalValue = 0;
      let validDays = 0;

      weekDays.forEach(day => {
        const dayOfWeek = getDay(day);
        const statusKey = dayOfWeekMapping[dayOfWeek];
        
        if (statusKey) {
          relevantMetrics.forEach(metric => {
            const dayValue = metric.category === "AVAILABILITY" 
              ? (metric.availability?.[statusKey] ?? metric.value)
              : (metric.dayValues?.[statusKey] ?? metric.value);
            
            totalValue += dayValue;
            validDays++;
          });
        }
      });

      const averageValue = validDays > 0 ? totalValue / validDays : 0;
      return { day: `Week ${index + 1}`, value: Math.round(averageValue * 10) / 10 };
    });
  };

  // Generate data for all categories combined
  const generateAllCategoriesData = () => {
    const categories = ['AVAILABILITY', 'DELIVERY', 'QUALITY', 'COST', 'PEOPLE'];
    const colors = ['#0EA5E9', '#8B5CF6', '#10B981', '#F97316', '#6E59A5'];
    
    return categories.map((category, index) => ({
      category,
      data: generateMonthlyGraphData(category),
      color: colors[index]
    }));
  };

  // Helper function to get status for a specific day and category directly from the metrics data
  const getDayStatusForCategory = (day: Date, category: string) => {
    // First check if it's a weekend - these should always be gray
    if (isWeekend(day)) return "gray";
    
    // Then check if it's in the current month
    if (!isSameMonth(day, currentDate)) return "gray";

    const dayOfWeek = getDay(day);
    const statusKey = dayOfWeekMapping[dayOfWeek];
    
    // Return gray for weekends
    if (!statusKey) return "gray";
    
    // If we're looking at all categories or a specific one
    const relevantMetrics = category === "ALL" 
      ? metrics 
      : metricsByCategory[category] || [];
    
    if (relevantMetrics.length === 0) return "gray";
    
    // For ALL category view, prioritize red > yellow > green
    if (category === "ALL") {
      const hasRed = relevantMetrics.some(metric => metric.status[statusKey] === "red");
      if (hasRed) return "red";
      
      const hasYellow = relevantMetrics.some(metric => metric.status[statusKey] === "yellow");
      if (hasYellow) return "yellow";
      
      const hasGreen = relevantMetrics.some(metric => metric.status[statusKey] === "green");
      if (hasGreen) return "green";
      
      return "gray";
    } else {
      // For specific category, just use the first metric's status
      const metric = relevantMetrics[0];
      return metric ? metric.status[statusKey] : "gray";
    }
  };

  // Helper function to get status for each category on a specific day
  const getDayDetailedStatus = (day: Date) => {
    if (isWeekend(day) || !isSameMonth(day, currentDate)) {
      return {
        AVAILABILITY: "gray",
        DELIVERY: "gray",
        QUALITY: "gray",
        COST: "gray",
        PEOPLE: "gray"
      };
    }
    
    const dayOfWeek = getDay(day);
    const statusKey = dayOfWeekMapping[dayOfWeek];
    
    if (!statusKey) return {
      AVAILABILITY: "gray",
      DELIVERY: "gray",
      QUALITY: "gray",
      COST: "gray",
      PEOPLE: "gray"
    };
    
    return {
      AVAILABILITY: getDayStatusForCategory(day, "AVAILABILITY"),
      DELIVERY: getDayStatusForCategory(day, "DELIVERY"),
      QUALITY: getDayStatusForCategory(day, "QUALITY"),
      COST: getDayStatusForCategory(day, "COST"),
      PEOPLE: getDayStatusForCategory(day, "PEOPLE")
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-400";
      case "green": return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  // Calculate totals for summary
  const calculateTotals = (category?: string) => {
    // Only consider weekdays in the current month
    const workdays = days.filter(day => 
      isSameMonth(day, currentDate) && !isWeekend(day)
    );
    
    const totals = {
      green: 0,
      yellow: 0,
      red: 0,
      gray: 0
    };
    
    workdays.forEach(day => {
      const status = category 
        ? getDayStatusForCategory(day, category)
        : getDayStatusForCategory(day, "ALL");
      totals[status as keyof typeof totals]++;
    });
    
    return totals;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AVAILABILITY": return <Activity className="h-4 w-4" />;
      case "DELIVERY": return <Truck className="h-4 w-4" />;
      case "QUALITY": return <CheckCircle2 className="h-4 w-4" />;
      case "COST": return <DollarSign className="h-4 w-4" />;
      case "PEOPLE": return <Users className="h-4 w-4" />;
      default: return null;
    }
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

  return (
    <div className="bg-white rounded-lg shadow space-y-6">
      <div className="p-4 border-b">
        <Tabs 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="AVAILABILITY" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Availability</span>
            </TabsTrigger>
            <TabsTrigger value="DELIVERY" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Delivery</span>
            </TabsTrigger>
            <TabsTrigger value="QUALITY" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Quality</span>
            </TabsTrigger>
            <TabsTrigger value="COST" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Cost</span>
            </TabsTrigger>
            <TabsTrigger value="PEOPLE" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>People</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4 space-y-6">
            {/* Monthly Graph */}
            <div>
              {selectedCategory === "ALL" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">All Categories Monthly Trends</h3>
                  <MetricsLineGraph
                    category="All Categories"
                    data={generateAllCategoriesData()}
                    color="#3b82f6"
                    graphType="line"
                    graphView="monthly"
                    showAllCategories={true}
                  />
                </div>
              ) : (
                <MetricsLineGraph
                  category={selectedCategory}
                  data={generateMonthlyGraphData(selectedCategory)}
                  color={getMetricColor(selectedCategory)}
                  graphType="line"
                  graphView="monthly"
                />
              )}
            </div>

            {/* Calendar View */}
            <div className="grid grid-cols-7 gap-1">
              {/* Calendar header - starting with Monday */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center font-semibold text-gray-600"
                >
                  {day}
                </div>
              ))}
              
              {/* Calculate offset for first day to align with Monday-start */}
              {Array.from({ length: (getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-white"></div>
              ))}
              
              {/* Calendar days */}
              {days.map((day, index) => {
                const status = selectedCategory === "ALL" ? 
                  getDayStatusForCategory(day, "ALL") : 
                  getDayStatusForCategory(day, selectedCategory);
                
                const dayStatuses = getDayDetailedStatus(day);
                
                return (
                  <div
                    key={index}
                    className={`
                      aspect-square p-1 flex flex-col
                      ${!isSameMonth(day, currentDate) ? "opacity-50 bg-gray-100" : "bg-white"}
                      rounded-lg border
                    `}
                  >
                    <span className="text-xs font-medium text-gray-600 mb-1">
                      {format(day, "d")}
                    </span>
                    
                    {selectedCategory === "ALL" ? (
                      <div className="grid grid-cols-2 gap-1 flex-1">
                        <div className={`${getStatusColor(dayStatuses.AVAILABILITY)} rounded-sm flex items-center justify-center`}>
                          <Activity className="h-3 w-3 text-white" />
                        </div>
                        <div className={`${getStatusColor(dayStatuses.DELIVERY)} rounded-sm flex items-center justify-center`}>
                          <Truck className="h-3 w-3 text-white" />
                        </div>
                        <div className={`${getStatusColor(dayStatuses.QUALITY)} rounded-sm flex items-center justify-center`}>
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                        <div className={`${getStatusColor(dayStatuses.COST)} rounded-sm flex items-center justify-center`}>
                          <DollarSign className="h-3 w-3 text-white" />
                        </div>
                        <div className={`${getStatusColor(dayStatuses.PEOPLE)} rounded-sm col-span-2 flex items-center justify-center`}>
                          <Users className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className={`flex-1 ${getStatusColor(status)} rounded-sm flex items-center justify-center`}>
                        {getCategoryIcon(selectedCategory)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Summary section */}
      <div className="p-4 border-t">
        <h3 className="text-sm font-medium mb-2">Monthly Summary: {selectedCategory === "ALL" ? "All Categories" : selectedCategory}</h3>
        <div className="flex gap-3 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span>Green: {calculateTotals(selectedCategory !== "ALL" ? selectedCategory : undefined).green}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
            <span>Yellow: {calculateTotals(selectedCategory !== "ALL" ? selectedCategory : undefined).yellow}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span>Red: {calculateTotals(selectedCategory !== "ALL" ? selectedCategory : undefined).red}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-gray-200"></span>
            <span>N/A: {calculateTotals(selectedCategory !== "ALL" ? selectedCategory : undefined).gray}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
