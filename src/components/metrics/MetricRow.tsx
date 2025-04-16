
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import StatusSelector from "./StatusSelector";
import MetricHeader from "./MetricHeader";
import MetricsLineGraph from "../MetricsLineGraph";
import { Metric } from "../../types/metrics";
import { useDateContext } from "../../contexts/DateContext";
import { Edit2, Pencil } from "lucide-react";
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
  getDayValue?: (metric: Metric, day: keyof Metric['status']) => number | undefined;
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
  getDayAvailability,
  getDayValue
}: MetricRowProps) => {
  const { currentDate } = useDateContext();
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [tempAvailability, setTempAvailability] = useState(metric.value.toString());
  const [editingDay, setEditingDay] = useState<keyof Metric['status'] | null>(null);
  const [editingDayValue, setEditingDayValue] = useState("");
  
  // Get day-specific values for all metrics
  const getMondayValue = () => getDayValue ? getDayValue(metric, 'monday') : metric.value;
  const getTuesdayValue = () => getDayValue ? getDayValue(metric, 'tuesday') : metric.value;
  const getWednesdayValue = () => getDayValue ? getDayValue(metric, 'wednesday') : metric.value;
  const getThursdayValue = () => getDayValue ? getDayValue(metric, 'thursday') : metric.value;
  const getFridayValue = () => getDayValue ? getDayValue(metric, 'friday') : metric.value;
  
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
      const value = getDayValue ? getDayValue(metric, day) : metric.value;
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

  // Helper for rendering availability/value in a day cell
  const renderDayAvailability = (day: keyof Metric['status']) => {
    if (metric.category === "AVAILABILITY") {
      const value = getDayValue ? getDayValue(metric, day) : metric.value;
      
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
    }
    
    return null;
  };

  // Function to handle day-specific value editing for all metrics
  const handleDayValueEdit = (day: keyof Metric['status']) => {
    setEditingDay(day);
    const value = getDayValue ? getDayValue(metric, day) : metric.value;
    setEditingDayValue(value?.toString() || metric.value.toString());
  };

  const handleDayValueSave = () => {
    if (editingDay) {
      const newValue = parseFloat(editingDayValue);
      if (!isNaN(newValue)) {
        onAvailabilityChange(metric.id, newValue, editingDay);
      }
      setEditingDay(null);
    }
  };

  const handleDayValueKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDayValueSave();
    } else if (e.key === "Escape") {
      setEditingDay(null);
    }
  };

  // Render day-specific value editing for all metric categories
  const renderDayValue = (day: keyof Metric['status']) => {
    if (metric.category === "AVAILABILITY") {
      return renderDayAvailability(day);
    }

    const value = getDayValue ? getDayValue(metric, day) : metric.value;

    if (editingDay === day) {
      return (
        <div className="mt-2 flex items-center justify-center">
          <Input
            value={editingDayValue}
            onChange={(e) => setEditingDayValue(e.target.value)}
            className="h-6 text-xs w-16 mx-auto"
            onBlur={handleDayValueSave}
            onKeyDown={handleDayValueKeyDown}
            autoFocus
          />
        </div>
      );
    }

    if (viewMode === 'weekly') {
      return (
        <div className="mt-1 flex items-center justify-center">
          <div className="flex items-center gap-1 text-sm">
            <span>{value}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0"
              onClick={() => handleDayValueEdit(day)}
              title={`Edit ${day} value`}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    return null;
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
              {renderDayValue('monday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.tuesday} 
                onValueChange={(value) => onStatusChange(metric.id, 'tuesday', value)}
              />
              {renderDayValue('tuesday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.wednesday} 
                onValueChange={(value) => onStatusChange(metric.id, 'wednesday', value)}
              />
              {renderDayValue('wednesday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.thursday} 
                onValueChange={(value) => onStatusChange(metric.id, 'thursday', value)}
              />
              {renderDayValue('thursday')}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.friday} 
                onValueChange={(value) => onStatusChange(metric.id, 'friday', value)}
              />
              {renderDayValue('friday')}
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
