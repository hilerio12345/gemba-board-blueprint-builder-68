
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { useDateContext } from "@/contexts/DateContext";
import { Metric } from "@/types/metrics";

interface MonthlyViewProps {
  metrics: Metric[];
}

const MonthlyView = ({ metrics }: MonthlyViewProps) => {
  const { currentDate } = useDateContext();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Helper function to get aggregated status for a day
  const getDayStatus = (date: Date) => {
    const dayOfWeek = format(date, "EEEE").toLowerCase();
    if (!isSameMonth(date, currentDate)) return "gray";

    // Only consider weekdays (Monday-Friday)
    if (dayOfWeek === "saturday" || dayOfWeek === "sunday") return "gray";

    // Convert day name to status key
    const statusKey = dayOfWeek.slice(0, 3) + "day" as keyof Metric["status"];
    
    // Count statuses for the day
    const statuses = metrics.map(metric => metric.status[statusKey]);
    const redCount = statuses.filter(s => s === "red").length;
    const yellowCount = statuses.filter(s => s === "yellow").length;
    
    if (redCount > 0) return "red";
    if (yellowCount > 0) return "yellow";
    return "green";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-400";
      case "green": return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

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
    </div>
  );
};

export default MonthlyView;
