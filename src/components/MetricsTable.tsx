import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import MetricParametersDialog, { MetricParameter } from "./MetricParametersDialog";
import MetricsLineGraph from "./MetricsLineGraph";
import { useDateContext } from "../contexts/DateContext";
import { Metric } from "../types/metrics";
import { getMetricsForDate, updateMetricsForDate } from "../services/metricsService";

const MetricsTable = () => {
  const { dateKey } = useDateContext();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  
  useEffect(() => {
    const loadedMetrics = getMetricsForDate(dateKey);
    setMetrics(loadedMetrics);
  }, [dateKey]);

  const generateTrendData = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return [];
    
    const statusToValue = {
      green: metric.value * 1.05,
      yellow: metric.value * 0.9,
      red: metric.value * 0.75
    };
    
    return [
      { day: "Mon", value: statusToValue[metric.status.monday as keyof typeof statusToValue] || metric.value },
      { day: "Tue", value: statusToValue[metric.status.tuesday as keyof typeof statusToValue] || metric.value },
      { day: "Wed", value: statusToValue[metric.status.wednesday as keyof typeof statusToValue] || metric.value },
      { day: "Thu", value: statusToValue[metric.status.thursday as keyof typeof statusToValue] || metric.value },
      { day: "Fri", value: statusToValue[metric.status.friday as keyof typeof statusToValue] || metric.value },
    ];
  };

  const handleStatusChange = (metricId: string, day: keyof Metric['status'], value: string) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        return {
          ...metric,
          status: {
            ...metric.status,
            [day]: value
          }
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };

  const handleNotesChange = (metricId: string, value: string) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        return {
          ...metric,
          notes: value
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };

  const handleParametersUpdate = (parameters: MetricParameter[]) => {
    const updatedMetrics = metrics.map((metric, index) => {
      const parameter = parameters[index];
      return {
        ...metric,
        goal: parameter.goal,
        greenThreshold: parameter.greenThreshold,
        yellowThreshold: parameter.yellowThreshold,
        redThreshold: parameter.redThreshold
      };
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };
  
  const handleValueChange = (metricId: string, increment: boolean) => {
    const updatedMetrics = metrics.map(metric => {
      if (metric.id === metricId) {
        let newValue = increment ? metric.value + 1 : metric.value - 1;
        if (newValue < 0) newValue = 0;
        
        return {
          ...metric,
          value: newValue
        };
      }
      return metric;
    });
    
    setMetrics(updatedMetrics);
    updateMetricsForDate(dateKey, updatedMetrics);
  };

  const toggleExpanded = (metricId: string) => {
    setExpandedMetric(expandedMetric === metricId ? null : metricId);
    setTimeout(() => {
      console.log("Graph toggled for metric:", metricId);
    }, 100);
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'yellow': return 'bg-yellow-400 hover:bg-yellow-500';
      case 'red': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-300 hover:bg-gray-400';
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
  
  const getCategoryHeader = (category: string, metric: Metric) => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="font-bold">{category}</span>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => handleValueChange(metric.id, false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{metric.value}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => handleValueChange(metric.id, true)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {metric.greenThreshold && (
          <div className="text-xs text-gray-500 mt-2">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-1"></span>
              <span>{metric.greenThreshold}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block mr-1"></span>
              <span>{metric.yellowThreshold}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-1"></span>
              <span>{metric.redThreshold}</span>
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 text-xs h-6"
          onClick={() => toggleExpanded(metric.id)}
        >
          {expandedMetric === metric.id ? "Hide Graph" : "Show Graph"}
        </Button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end">
        <MetricParametersDialog 
          initialParameters={metrics.map(metric => ({
            category: metric.category,
            goal: metric.goal,
            greenThreshold: metric.greenThreshold,
            yellowThreshold: metric.yellowThreshold,
            redThreshold: metric.redThreshold
          }))}
          onParametersUpdate={handleParametersUpdate}
        />
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[180px] border-r">Category</TableHead>
            <TableHead className="text-center border-r">Monday</TableHead>
            <TableHead className="text-center border-r">Tuesday</TableHead>
            <TableHead className="text-center border-r">Wednesday</TableHead>
            <TableHead className="text-center border-r">Thursday</TableHead>
            <TableHead className="text-center border-r">Friday</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <React.Fragment key={metric.id}>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium border-r bg-gray-50">
                  {getCategoryHeader(metric.category, metric)}
                  <div className="text-xs text-gray-500 mt-1">{metric.goal}</div>
                </TableCell>
                
                <TableCell className="text-center border-r border-gray-200 p-1">
                  <Select 
                    value={metric.status.monday} 
                    onValueChange={(value) => handleStatusChange(metric.id, 'monday', value)}
                  >
                    <SelectTrigger className={`w-full h-8 text-white font-medium ${getStatusColor(metric.status.monday)}`}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center border-r border-gray-200 p-1">
                  <Select 
                    value={metric.status.tuesday} 
                    onValueChange={(value) => handleStatusChange(metric.id, 'tuesday', value)}
                  >
                    <SelectTrigger className={`w-full h-8 text-white font-medium ${getStatusColor(metric.status.tuesday)}`}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center border-r border-gray-200 p-1">
                  <Select 
                    value={metric.status.wednesday} 
                    onValueChange={(value) => handleStatusChange(metric.id, 'wednesday', value)}
                  >
                    <SelectTrigger className={`w-full h-8 text-white font-medium ${getStatusColor(metric.status.wednesday)}`}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center border-r border-gray-200 p-1">
                  <Select 
                    value={metric.status.thursday} 
                    onValueChange={(value) => handleStatusChange(metric.id, 'thursday', value)}
                  >
                    <SelectTrigger className={`w-full h-8 text-white font-medium ${getStatusColor(metric.status.thursday)}`}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center border-r border-gray-200 p-1">
                  <Select 
                    value={metric.status.friday} 
                    onValueChange={(value) => handleStatusChange(metric.id, 'friday', value)}
                  >
                    <SelectTrigger className={`w-full h-8 text-white font-medium ${getStatusColor(metric.status.friday)}`}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                
                <TableCell className="p-1">
                  <Input 
                    value={metric.notes} 
                    onChange={(e) => handleNotesChange(metric.id, e.target.value)} 
                    className="h-8"
                  />
                </TableCell>
              </TableRow>
              {expandedMetric === metric.id && (
                <TableRow>
                  <TableCell colSpan={7} className="p-4 bg-gray-50">
                    <MetricsLineGraph 
                      category={metric.category}
                      data={generateTrendData(metric.id)}
                      color={getMetricColor(metric.category)}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MetricsTable;
