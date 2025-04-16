
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import StatusSelector from "./StatusSelector";
import MetricHeader from "./MetricHeader";
import MetricsLineGraph from "../MetricsLineGraph";
import { Metric } from "../../types/metrics";
import { useDateContext } from "../../contexts/DateContext";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MetricRowProps {
  metric: Metric;
  expandedMetric: string | null;
  onStatusChange: (metricId: string, day: keyof Metric['status'], value: string) => void;
  onNotesChange: (metricId: string, value: string) => void;
  onValueChange: (metricId: string, increment: boolean) => void;
  onToggleExpanded: (metricId: string) => void;
  onThresholdChange: (metricId: string, thresholdType: string, value: string) => void;
  onGoalChange: (metricId: string, value: string) => void;
  onAvailabilityChange: (metricId: string, value: number, day?: keyof Metric['status']) => void;
  generateTrendData: (metricId: string) => { day: string; value: number }[];
  getMetricColor: (category: string) => string;
  viewMode?: 'daily' | 'weekly';
  getDayAvailability?: (metric: Metric, day: keyof Metric['status']) => number | undefined;
}

const MetricRow = ({ 
  metric, 
  expandedMetric, 
  onStatusChange, 
  onNotesChange,
  onValueChange,
  onToggleExpanded,
  onThresholdChange,
  onGoalChange,
  onAvailabilityChange,
  generateTrendData,
  getMetricColor,
  viewMode = 'weekly',
  getDayAvailability
}: MetricRowProps) => {
  const { currentDate } = useDateContext();
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [tempAvailability, setTempAvailability] = useState(metric.value.toString());
  const [editingDay, setEditingDay] = useState<keyof Metric['status'] | null>(null);
  
  // Get day-specific availability values
  const getMondayValue = () => getDayAvailability ? getDayAvailability(metric, 'monday') : metric.value;
  const getTuesdayValue = () => getDayAvailability ? getDayAvailability(metric, 'tuesday') : metric.value;
  const getWednesdayValue = () => getDayAvailability ? getDayAvailability(metric, 'wednesday') : metric.value;
  const getThursdayValue = () => getDayAvailability ? getDayAvailability(metric, 'thursday') : metric.value;
  const getFridayValue = () => getDayAvailability ? getDayAvailability(metric, 'friday') : metric.value;
  
  // Determine which day of the week to show for daily view
  const getDayOfWeek = () => {
    const dayIndex = currentDate.getDay();
    if (dayIndex === 0) return 'monday'; // Sunday - show Monday
    if (dayIndex === 6) return 'friday'; // Saturday - show Friday
    
    // For other days, map to the appropriate day
    const days: (keyof Metric['status'])[] = ['monday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    return days[dayIndex];
  };
  
  const currentDay = getDayOfWeek();

  const handleAvailabilityEdit = (day?: keyof Metric['status']) => {
    if (day) {
      // Edit specific day's availability in weekly view
      const value = getDayAvailability ? getDayAvailability(metric, day) : metric.value;
      setTempAvailability(value?.toString() || metric.value.toString());
      setEditingDay(day);
    } else {
      // Edit main availability in daily view
      setTempAvailability(metric.value.toString());
      setEditingDay(null);
    }
    setIsEditingAvailability(true);
  };

  const handleAvailabilitySave = () => {
    const newValue = parseFloat(tempAvailability);
    if (!isNaN(newValue)) {
      onAvailabilityChange(metric.id, newValue, editingDay || undefined);
    }
    setIsEditingAvailability(false);
    setEditingDay(null);
  };

  const handleAvailabilityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAvailabilitySave();
    } else if (e.key === "Escape") {
      setIsEditingAvailability(false);
      setEditingDay(null);
    }
  };

  // Helper for rendering availability in a day cell
  const renderDayAvailability = (day: keyof Metric['status']) => {
    if (metric.category !== "AVAILABILITY") return null;
    
    const value = getDayAvailability ? getDayAvailability(metric, day) : metric.value;
    
    if (isEditingAvailability && editingDay === day) {
      return (
        <div className="mt-2 flex items-center justify-center">
          <Input
            value={tempAvailability}
            onChange={(e) => setTempAvailability(e.target.value)}
            className="h-6 text-xs w-16 mx-auto"
            onBlur={handleAvailabilitySave}
            onKeyDown={handleAvailabilityKeyDown}
            autoFocus
          />
        </div>
      );
    }
    
    return (
      <div className="mt-2 flex items-center justify-center">
        <div className="flex items-center gap-1 text-sm">
          <span>{value}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={() => handleAvailabilityEdit(day)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <React.Fragment>
      <TableRow className="hover:bg-gray-50">
        <TableCell className="font-medium border-r bg-gray-50">
          <MetricHeader 
            category={metric.category} 
            metric={metric} 
            expandedMetric={expandedMetric}
            onValueChange={onValueChange}
            onToggleExpanded={onToggleExpanded}
            onThresholdChange={onThresholdChange}
            onGoalChange={onGoalChange}
            onAvailabilityEdit={() => handleAvailabilityEdit()}
            isEditingAvailability={isEditingAvailability && !editingDay}
            tempAvailability={tempAvailability}
            setTempAvailability={setTempAvailability}
            handleAvailabilitySave={handleAvailabilitySave}
            handleAvailabilityKeyDown={handleAvailabilityKeyDown}
            viewMode={viewMode}
          />
        </TableCell>
        
        {viewMode === 'weekly' ? (
          <>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.monday} 
                onValueChange={(value) => onStatusChange(metric.id, 'monday', value)}
              />
              {metric.category === "AVAILABILITY" && renderDayAvailability('monday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.tuesday} 
                onValueChange={(value) => onStatusChange(metric.id, 'tuesday', value)}
              />
              {metric.category === "AVAILABILITY" && renderDayAvailability('tuesday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.wednesday} 
                onValueChange={(value) => onStatusChange(metric.id, 'wednesday', value)}
              />
              {metric.category === "AVAILABILITY" && renderDayAvailability('wednesday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.thursday} 
                onValueChange={(value) => onStatusChange(metric.id, 'thursday', value)}
              />
              {metric.category === "AVAILABILITY" && renderDayAvailability('thursday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.friday} 
                onValueChange={(value) => onStatusChange(metric.id, 'friday', value)}
              />
              {metric.category === "AVAILABILITY" && renderDayAvailability('friday')}
            </TableCell>
          </>
        ) : (
          <TableCell className="text-center border-r border-gray-200 p-1">
            <StatusSelector 
              value={metric.status[currentDay]} 
              onValueChange={(value) => onStatusChange(metric.id, currentDay, value)}
            />
          </TableCell>
        )}
        
        <TableCell className="p-1">
          <Input 
            value={metric.notes} 
            onChange={(e) => onNotesChange(metric.id, e.target.value)} 
            className="h-8"
          />
        </TableCell>
      </TableRow>
      {expandedMetric === metric.id && (
        <TableRow>
          <TableCell colSpan={viewMode === 'weekly' ? 7 : 3} className="p-4 bg-gray-50">
            <MetricsLineGraph 
              category={metric.category}
              data={generateTrendData(metric.id)}
              color={getMetricColor(metric.category)}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default MetricRow;
