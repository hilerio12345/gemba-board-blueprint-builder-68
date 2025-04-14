import { useState } from "react";
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
import MetricParametersDialog, { MetricParameter } from "./MetricParametersDialog";

interface Metric {
  id: string;
  category: string;
  goal: string;
  status: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
  notes: string;
  greenThreshold?: string;
  yellowThreshold?: string;
  redThreshold?: string;
}

const MetricsTable = () => {
  const initialMetrics: Metric[] = [
    {
      id: "1",
      category: "AVAILABILITY",
      goal: "Goal: 100%",
      status: {
        monday: "green",
        tuesday: "green",
        wednesday: "yellow",
        thursday: "green",
        friday: "green",
      },
      notes: "Systems available throughout the week",
      greenThreshold: "≥ 98%",
      yellowThreshold: "90-97%",
      redThreshold: "< 90%"
    },
    {
      id: "2",
      category: "DELIVERY",
      goal: "Goal: 4",
      status: {
        monday: "green",
        tuesday: "green",
        wednesday: "green",
        thursday: "red",
        friday: "yellow",
      },
      notes: "4 DVs/wk | 4 DVs | = 4 total",
      greenThreshold: "≥ 4",
      yellowThreshold: "3",
      redThreshold: "< 3"
    },
    {
      id: "3",
      category: "QUALITY",
      goal: "Goal: 75%",
      status: {
        monday: "green",
        tuesday: "yellow",
        wednesday: "yellow",
        thursday: "green",
        friday: "green",
      },
      notes: "3rd prty PV > Target",
      greenThreshold: "≥ 75%",
      yellowThreshold: "65-74%",
      redThreshold: "< 65%"
    },
    {
      id: "4",
      category: "COST",
      goal: "Goal: <5%",
      status: {
        monday: "yellow",
        tuesday: "green",
        wednesday: "green",
        thursday: "green",
        friday: "red",
      },
      notes: "Overtime % above target on Friday",
      greenThreshold: "< 5%",
      yellowThreshold: "5-7%",
      redThreshold: "> 7%"
    },
    {
      id: "5",
      category: "PEOPLE",
      goal: "Goal: 95%",
      status: {
        monday: "green",
        tuesday: "green",
        wednesday: "green",
        thursday: "green",
        friday: "yellow",
      },
      notes: "Training compliance on track",
      greenThreshold: "≥ 95%",
      yellowThreshold: "85-94%",
      redThreshold: "< 85%"
    },
  ];

  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);

  const handleStatusChange = (metricId: string, day: keyof Metric['status'], value: string) => {
    setMetrics(metrics.map(metric => {
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
    }));
  };

  const handleNotesChange = (metricId: string, value: string) => {
    setMetrics(metrics.map(metric => {
      if (metric.id === metricId) {
        return {
          ...metric,
          notes: value
        };
      }
      return metric;
    }));
  };

  const handleParametersUpdate = (parameters: MetricParameter[]) => {
    setMetrics(metrics.map((metric, index) => {
      const parameter = parameters[index];
      return {
        ...metric,
        goal: parameter.goal,
        greenThreshold: parameter.greenThreshold,
        yellowThreshold: parameter.yellowThreshold,
        redThreshold: parameter.redThreshold
      };
    }));
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'yellow': return 'bg-yellow-400 hover:bg-yellow-500';
      case 'red': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-300 hover:bg-gray-400';
    }
  };
  
  const getCategoryHeader = (category: string, metric: Metric) => {
    return (
      <div className="flex flex-col">
        <span className="font-bold">{category}</span>
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
            <TableRow key={metric.id} className="hover:bg-gray-50">
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MetricsTable;
