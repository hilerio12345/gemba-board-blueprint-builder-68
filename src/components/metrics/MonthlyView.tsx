
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend } from "date-fns";
import { useDateContext } from "@/contexts/DateContext";
import { Metric } from "@/types/metrics";
import { Badge } from "@/components/ui/badge";

interface MonthlyViewProps {
  metrics: Metric[];
}

const MonthlyView = ({ metrics }: MonthlyViewProps) => {
  const { currentDate } = useDateContext();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Helper function to get aggregated status for a day
  const getDayStatus = (day: Date) => {
    // First check if it's a weekend - these should always be gray
    if (isWeekend(day)) return "gray";
    
    // Then check if it's in the current month
    if (!isSameMonth(day, currentDate)) return "gray";

    // Convert day name to status key
    const dayName = format(day, "EEEE").toLowerCase();
    const statusKey = dayName.slice(0, 3) + "day" as keyof Metric["status"];
    
    // Count statuses for the day
    const statuses = metrics.map(metric => metric.status[statusKey]);
    const redCount = statuses.filter(s => s === "red").length;
    const yellowCount = statuses.filter(s => s === "yellow").length;
    const greenCount = statuses.filter(s => s === "green").length;
    
    if (redCount > 0) return "red";
    if (yellowCount > 0) return "yellow";
    if (greenCount > 0) return "green";
    return "gray"; // Default if no statuses found
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
  const calculateTotals = () => {
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
      const status = getDayStatus(day);
      totals[status as keyof typeof totals]++;
    });
    
    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-7 gap-1">
        {/* Calendar header */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const status = getDayStatus(day);
          return (
            <div
              key={index}
              className={`
                aspect-square p-2 flex flex-col
                ${getStatusColor(status)}
                ${!isSameMonth(day, currentDate) ? "opacity-50" : ""}
                rounded-lg
              `}
            >
              <span className={`text-sm font-medium ${status === 'gray' ? 'text-gray-600' : 'text-white'}`}>
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Monthly Summary</h3>
        <div className="flex gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span>Green: {totals.green}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
            <span>Yellow: {totals.yellow}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span>Red: {totals.red}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-gray-200"></span>
            <span>N/A: {totals.gray}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
