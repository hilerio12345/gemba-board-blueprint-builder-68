
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
  onAvailabilityChange: (metricId: string, value: number) => void;
  generateTrendData: (metricId: string) => { day: string; value: number }[];
  getMetricColor: (category: string) => string;
  viewMode?: 'daily' | 'weekly';
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
  viewMode = 'weekly'
}: MetricRowProps) => {
  const { currentDate } = useDateContext();
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [tempAvailability, setTempAvailability] = useState(metric.value.toString());
  
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

  const handleAvailabilityEdit = () => {
    setIsEditingAvailability(true);
    setTempAvailability(metric.value.toString());
  };

  const handleAvailabilitySave = () => {
    const newValue = parseFloat(tempAvailability);
    if (!isNaN(newValue)) {
      onAvailabilityChange(metric.id, newValue);
    }
    setIsEditingAvailability(false);
  };

  const handleAvailabilityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAvailabilitySave();
    } else if (e.key === "Escape") {
      setIsEditingAvailability(false);
    }
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
            onAvailabilityEdit={handleAvailabilityEdit}
            isEditingAvailability={isEditingAvailability}
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
              {metric.category === "AVAILABILITY" && (
                <div className="mt-2 flex items-center justify-center">
                  {isEditingAvailability && metric.id === expandedMetric ? (
                    <Input
                      value={tempAvailability}
                      onChange={(e) => setTempAvailability(e.target.value)}
                      className="h-6 text-xs w-16 mx-auto"
                      onBlur={handleAvailabilitySave}
                      onKeyDown={handleAvailabilityKeyDown}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-1 text-sm">
                      <span>{metric.value}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={handleAvailabilityEdit}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.tuesday} 
                onValueChange={(value) => onStatusChange(metric.id, 'tuesday', value)}
              />
              {metric.category === "AVAILABILITY" && (
                <div className="mt-2 text-sm text-gray-500 text-center">
                  {metric.value}
                </div>
              )}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.wednesday} 
                onValueChange={(value) => onStatusChange(metric.id, 'wednesday', value)}
              />
              {metric.category === "AVAILABILITY" && (
                <div className="mt-2 text-sm text-gray-500 text-center">
                  {metric.value}
                </div>
              )}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.thursday} 
                onValueChange={(value) => onStatusChange(metric.id, 'thursday', value)}
              />
              {metric.category === "AVAILABILITY" && (
                <div className="mt-2 text-sm text-gray-500 text-center">
                  {metric.value}
                </div>
              )}
            </TableCell>
            <TableCell className="text-center border-r border-gray-200 p-1">
              <StatusSelector 
                value={metric.status.friday} 
                onValueChange={(value) => onStatusChange(metric.id, 'friday', value)}
              />
              {metric.category === "AVAILABILITY" && (
                <div className="mt-2 text-sm text-gray-500 text-center">
                  {metric.value}
                </div>
              )}
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
