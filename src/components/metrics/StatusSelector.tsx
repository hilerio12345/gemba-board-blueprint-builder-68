
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StatusSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const StatusSelector = ({ value, onValueChange }: StatusSelectorProps) => {
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'yellow': return 'bg-yellow-400 hover:bg-yellow-500';
      case 'red': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-300 hover:bg-gray-400';
    }
  };

  return (
    <Select 
      value={value} 
      onValueChange={onValueChange}
    >
      <SelectTrigger className={`w-full h-8 text-white font-medium ${getStatusColor(value)}`}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="green">Green</SelectItem>
        <SelectItem value="yellow">Yellow</SelectItem>
        <SelectItem value="red">Red</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelector;
