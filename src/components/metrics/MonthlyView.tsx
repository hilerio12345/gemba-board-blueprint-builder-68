
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, getDay, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { useDateContext } from "@/contexts/DateContext";
import { Metric } from "@/types/metrics";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Truck, CheckCircle2, DollarSign, Users, TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
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

  const generateAllCategoriesData = () => {
    const categories = ['AVAILABILITY', 'DELIVERY', 'QUALITY', 'COST', 'PEOPLE'];
    const colors = ['#0EA5E9', '#8B5CF6', '#10B981', '#F97316', '#6E59A5'];
    
    return categories.map((category, index) => ({
      category,
      data: generateMonthlyGraphData(category),
      color: colors[index]
    }));
  };

  const getDayStatusForCategory = (day: Date, category: string) => {
    if (isWeekend(day)) return "gray";
    if (!isSameMonth(day, currentDate)) return "gray";

    const dayOfWeek = getDay(day);
    const statusKey = dayOfWeekMapping[dayOfWeek];
    
    if (!statusKey) return "gray";
    
    const relevantMetrics = category === "ALL" 
      ? metrics 
      : metricsByCategory[category] || [];
    
    if (relevantMetrics.length === 0) return "gray";
    
    if (category === "ALL") {
      const hasRed = relevantMetrics.some(metric => metric.status[statusKey] === "red");
      if (hasRed) return "red";
      
      const hasYellow = relevantMetrics.some(metric => metric.status[statusKey] === "yellow");
      if (hasYellow) return "yellow";
      
      const hasGreen = relevantMetrics.some(metric => metric.status[statusKey] === "green");
      if (hasGreen) return "green";
      
      return "gray";
    } else {
      const metric = relevantMetrics[0];
      return metric ? metric.status[statusKey] : "gray";
    }
  };

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

  // Calculate insights and key metrics
  const calculateInsights = () => {
    const workdays = days.filter(day => 
      isSameMonth(day, currentDate) && !isWeekend(day)
    );
    
    const totals = {
      green: 0,
      yellow: 0,
      red: 0,
      gray: 0
    };
    
    const categoryTotals: Record<string, typeof totals> = {};
    
    ['AVAILABILITY', 'DELIVERY', 'QUALITY', 'COST', 'PEOPLE'].forEach(category => {
      categoryTotals[category] = { green: 0, yellow: 0, red: 0, gray: 0 };
      
      workdays.forEach(day => {
        const status = getDayStatusForCategory(day, category);
        categoryTotals[category][status as keyof typeof totals]++;
        
        if (category === 'AVAILABILITY') {
          totals[status as keyof typeof totals]++;
        }
      });
    });

    // Calculate performance percentages
    const totalWorkdays = workdays.length;
    const categoryPerformance = Object.entries(categoryTotals).map(([category, counts]) => {
      const successRate = totalWorkdays > 0 ? ((counts.green / totalWorkdays) * 100) : 0;
      const warningRate = totalWorkdays > 0 ? ((counts.yellow / totalWorkdays) * 100) : 0;
      const criticalRate = totalWorkdays > 0 ? ((counts.red / totalWorkdays) * 100) : 0;
      
      return {
        category,
        successRate: Math.round(successRate),
        warningRate: Math.round(warningRate),
        criticalRate: Math.round(criticalRate),
        trend: successRate >= 80 ? 'good' : successRate >= 60 ? 'warning' : 'critical'
      };
    });

    return {
      totalWorkdays,
      overallSuccessRate: Math.round((totals.green / totalWorkdays) * 100),
      categoryPerformance,
      criticalAreas: categoryPerformance.filter(cat => cat.criticalRate > 20),
      topPerformers: categoryPerformance.filter(cat => cat.successRate >= 80)
    };
  };

  const insights = calculateInsights();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-400";
      case "green": return "bg-green-500";
      default: return "bg-gray-200";
    }
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
      case "AVAILABILITY": return "#0EA5E9";
      case "DELIVERY": return "#8B5CF6";
      case "QUALITY": return "#10B981";
      case "COST": return "#F97316";
      case "PEOPLE": return "#6E59A5";
      default: return "#8E9196";
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Insights Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{insights.overallSuccessRate}%</div>
            <p className="text-xs text-blue-600 mt-1">Success Rate This Month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{insights.topPerformers.length}</div>
            <p className="text-xs text-green-600 mt-1">Categories Above 80%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{insights.criticalAreas.length}</div>
            <p className="text-xs text-red-600 mt-1">Categories Need Attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Working Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{insights.totalWorkdays}</div>
            <p className="text-xs text-purple-600 mt-1">Total This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Category Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {insights.categoryPerformance.map((perf) => (
              <div key={perf.category} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getCategoryIcon(perf.category)}
                  <span className="ml-2 text-sm font-medium">{perf.category}</span>
                </div>
                <div className="space-y-1">
                  <div className={`text-lg font-bold ${
                    perf.trend === 'good' ? 'text-green-600' : 
                    perf.trend === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {perf.successRate}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        perf.trend === 'good' ? 'bg-green-500' : 
                        perf.trend === 'warning' ? 'bg-yellow-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${perf.successRate}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {perf.criticalRate > 0 && (
                      <span className="text-red-500">{perf.criticalRate}% critical</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="ALL" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="AVAILABILITY" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Availability
              </TabsTrigger>
              <TabsTrigger value="DELIVERY" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery
              </TabsTrigger>
              <TabsTrigger value="QUALITY" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Quality
              </TabsTrigger>
              <TabsTrigger value="COST" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost
              </TabsTrigger>
              <TabsTrigger value="PEOPLE" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                People
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6 space-y-6">
              {/* Monthly Graph */}
              <Card>
                <CardContent className="pt-6">
                  {selectedCategory === "ALL" ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        All Categories Monthly Trends
                      </h3>
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
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        {getCategoryIcon(selectedCategory)}
                        {selectedCategory} Monthly Trend
                      </h3>
                      <MetricsLineGraph
                        category={selectedCategory}
                        data={generateMonthlyGraphData(selectedCategory)}
                        color={getMetricColor(selectedCategory)}
                        graphType="line"
                        graphView="monthly"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calendar View */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Monthly Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Calendar header */}
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div
                        key={day}
                        className="h-8 flex items-center justify-center font-semibold text-gray-600 bg-gray-50 rounded"
                      >
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar offset */}
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
                            aspect-square p-1 flex flex-col transition-all duration-200 hover:scale-105
                            ${!isSameMonth(day, currentDate) ? "opacity-50 bg-gray-100" : "bg-white hover:shadow-md"}
                            rounded-lg border-2 ${status === 'red' ? 'border-red-300' : status === 'yellow' ? 'border-yellow-300' : status === 'green' ? 'border-green-300' : 'border-gray-200'}
                          `}
                        >
                          <span className="text-xs font-medium text-gray-600 mb-1">
                            {format(day, "d")}
                          </span>
                          
                          {selectedCategory === "ALL" ? (
                            <div className="grid grid-cols-2 gap-1 flex-1">
                              <div className={`${getStatusColor(dayStatuses.AVAILABILITY)} rounded-sm flex items-center justify-center shadow-sm`}>
                                <Activity className="h-3 w-3 text-white" />
                              </div>
                              <div className={`${getStatusColor(dayStatuses.DELIVERY)} rounded-sm flex items-center justify-center shadow-sm`}>
                                <Truck className="h-3 w-3 text-white" />
                              </div>
                              <div className={`${getStatusColor(dayStatuses.QUALITY)} rounded-sm flex items-center justify-center shadow-sm`}>
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </div>
                              <div className={`${getStatusColor(dayStatuses.COST)} rounded-sm flex items-center justify-center shadow-sm`}>
                                <DollarSign className="h-3 w-3 text-white" />
                              </div>
                              <div className={`${getStatusColor(dayStatuses.PEOPLE)} rounded-sm col-span-2 flex items-center justify-center shadow-sm`}>
                                <Users className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className={`flex-1 ${getStatusColor(status)} rounded-sm flex items-center justify-center shadow-sm`}>
                              {getCategoryIcon(selectedCategory)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Summary Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Monthly Summary: {selectedCategory === "ALL" ? "All Categories" : selectedCategory}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-2 bg-green-50 border-green-200 text-green-800">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span>Green: {insights.categoryPerformance.find(p => selectedCategory === "ALL" || p.category === selectedCategory)?.successRate || 0}% of days</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 bg-yellow-50 border-yellow-200 text-yellow-800">
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span>Yellow: {insights.categoryPerformance.find(p => selectedCategory === "ALL" || p.category === selectedCategory)?.warningRate || 0}% of days</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 bg-red-50 border-red-200 text-red-800">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span>Red: {insights.categoryPerformance.find(p => selectedCategory === "ALL" || p.category === selectedCategory)?.criticalRate || 0}% of days</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyView;
