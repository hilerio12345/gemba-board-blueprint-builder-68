
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import { Metric } from "../../types/metrics";
import { Input } from "@/components/ui/input";

interface MetricHeaderProps {
  category: string;
  metric: Metric;
  expandedMetric: string | null;
  onValueChange: (metricId: string, increment: boolean) => void;
  onToggleExpanded: (metricId: string) => void;
  onThresholdChange: (metricId: string, thresholdType: string, value: string) => void;
  onGoalChange: (metricId: string, value: string) => void;
  onAvailabilityEdit?: () => void;
  isEditingAvailability?: boolean;
  tempAvailability?: string;
  setTempAvailability?: (value: string) => void;
  handleAvailabilitySave?: () => void;
  handleAvailabilityKeyDown?: (e: React.KeyboardEvent) => void;
  viewMode?: 'daily' | 'weekly' | 'monthly';
}

const MetricHeader = ({ 
  category, 
  metric, 
  expandedMetric, 
  onValueChange,
  onToggleExpanded,
  onThresholdChange,
  onGoalChange,
  onAvailabilityEdit,
  isEditingAvailability,
  tempAvailability,
  setTempAvailability,
  handleAvailabilitySave,
  handleAvailabilityKeyDown,
  viewMode = 'weekly'
}: MetricHeaderProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isValueHovered, setIsValueHovered] = useState(false);

  const startEditing = (field: string, initialValue: string) => {
    setEditingField(field);
    setTempValue(initialValue);
  };

  const handleSave = (field: string) => {
    if (field === 'goal') {
      onGoalChange(metric.id, tempValue);
    } else if (field === 'greenThreshold' || field === 'yellowThreshold' || field === 'redThreshold') {
      onThresholdChange(metric.id, field, tempValue);
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === "Enter") {
      handleSave(field);
    } else if (e.key === "Escape") {
      setEditingField(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-bold">{category}</span>
        {viewMode === 'daily' || category !== "AVAILABILITY" ? (
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onValueChange(metric.id, false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <span 
              className="text-sm font-medium cursor-pointer"
              onClick={category === "AVAILABILITY" ? onAvailabilityEdit : undefined}
              onMouseEnter={() => setIsValueHovered(true)}
              onMouseLeave={() => setIsValueHovered(false)}
            >
              {isEditingAvailability && category === "AVAILABILITY" && viewMode === 'daily' ? (
                <Input
                  value={tempAvailability}
                  onChange={(e) => setTempAvailability && setTempAvailability(e.target.value)}
                  className="h-6 text-xs w-16"
                  onBlur={handleAvailabilitySave}
                  onKeyDown={handleAvailabilityKeyDown}
                  autoFocus
                />
              ) : (
                metric.value
              )}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onValueChange(metric.id, true)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            {category === "AVAILABILITY" && viewMode === 'daily' && !isEditingAvailability && isValueHovered && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={onAvailabilityEdit}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Weekly view for AVAILABILITY has edit option in each day's cell */}
          </div>
        )}
      </div>
      <div 
        className="text-xs flex items-center mt-1"
        onMouseEnter={() => setIsHovered('goal')}
        onMouseLeave={() => setIsHovered(null)}
      >
        {editingField === 'goal' ? (
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="h-6 text-xs w-full"
            onBlur={() => handleSave('goal')}
            onKeyDown={(e) => handleKeyDown(e, 'goal')}
            autoFocus
          />
        ) : (
          <div className="flex items-center text-gray-500 w-full">
            <span className="mr-1">Goal:</span>
            <span>{metric.goal.replace('Goal: ', '')}</span>
            {isHovered === 'goal' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 opacity-100"
                onClick={() => startEditing('goal', metric.goal.replace('Goal: ', ''))}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
      {metric.greenThreshold && (
        <div className="text-xs text-gray-500 mt-2">
          <div 
            className="flex items-center"
            onMouseEnter={() => setIsHovered('green')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-1"></span>
            {editingField === 'greenThreshold' ? (
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="h-6 text-xs w-24"
                onBlur={() => handleSave('greenThreshold')}
                onKeyDown={(e) => handleKeyDown(e, 'greenThreshold')}
                autoFocus
              />
            ) : (
              <div className="flex items-center">
                <span>{metric.greenThreshold}</span>
                {isHovered === 'green' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => startEditing('greenThreshold', metric.greenThreshold || '')}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div 
            className="flex items-center"
            onMouseEnter={() => setIsHovered('yellow')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block mr-1"></span>
            {editingField === 'yellowThreshold' ? (
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="h-6 text-xs w-24"
                onBlur={() => handleSave('yellowThreshold')}
                onKeyDown={(e) => handleKeyDown(e, 'yellowThreshold')}
                autoFocus
              />
            ) : (
              <div className="flex items-center">
                <span>{metric.yellowThreshold}</span>
                {isHovered === 'yellow' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => startEditing('yellowThreshold', metric.yellowThreshold || '')}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div 
            className="flex items-center"
            onMouseEnter={() => setIsHovered('red')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-1"></span>
            {editingField === 'redThreshold' ? (
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="h-6 text-xs w-24"
                onBlur={() => handleSave('redThreshold')}
                onKeyDown={(e) => handleKeyDown(e, 'redThreshold')}
                autoFocus
              />
            ) : (
              <div className="flex items-center">
                <span>{metric.redThreshold}</span>
                {isHovered === 'red' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => startEditing('redThreshold', metric.redThreshold || '')}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 text-xs h-6"
        onClick={() => onToggleExpanded(metric.id)}
      >
        {expandedMetric === metric.id ? "Hide Graph" : "Show Graph"}
      </Button>
    </div>
  );
};

export default MetricHeader;
