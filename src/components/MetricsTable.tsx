
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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
      notes: "Systems available throughout the week"
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
      notes: "4 DVs/wk | 4 DVs | = 4 total"
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
      notes: "3rd prty PV > Target"
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
      notes: "Overtime % above target on Friday"
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
      notes: "Training compliance on track"
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

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'yellow': return 'bg-yellow-400 hover:bg-yellow-500';
      case 'red': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-300 hover:bg-gray-400';
    }
  };
  
  const getCategoryHeader = (category: string) => {
    return (
      <div className="flex flex-col">
        <span className="font-bold">{category}</span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
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
                {getCategoryHeader(metric.category)}
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
