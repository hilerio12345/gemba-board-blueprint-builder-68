import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface MetricParameter {
  category: string;
  goal: string;
  greenThreshold?: string;
  yellowThreshold?: string;
  redThreshold?: string;
  graphView?: 'weekly' | 'monthly';
  graphType?: 'line' | 'bar';
}

interface MetricParametersDialogProps {
  initialParameters: MetricParameter[];
  onParametersUpdate: (parameters: MetricParameter[]) => void;
}

const MetricParametersDialog = ({ initialParameters, onParametersUpdate }: MetricParametersDialogProps) => {
  const [parameters, setParameters] = useState<MetricParameter[]>(initialParameters);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setParameters(initialParameters);
  }, [initialParameters]);

  const handleParameterChange = (index: number, field: string, value: string) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = {
      ...updatedParameters[index],
      [field]: value
    };
    setParameters(updatedParameters);
  };

  const handleSave = () => {
    onParametersUpdate(parameters);
    toast({
      title: "Parameters updated",
      description: "Metric parameters have been updated successfully",
    });
    setIsOpen(false);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "AVAILABILITY": return "bg-blue-500";
      case "DELIVERY": return "bg-purple-500";
      case "QUALITY": return "bg-green-500";
      case "COST": return "bg-orange-500";
      case "PEOPLE": return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Settings2 className="h-3.5 w-3.5" />
          Set Parameters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Metric Parameters</DialogTitle>
          <DialogDescription>
            Configure the goal, threshold parameters, and graph settings for each metric category.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {parameters.map((parameter, index) => (
            <div key={index} className="grid gap-3">
              <div className={`font-semibold text-lg border-b pb-1 flex items-center gap-2`}>
                <span className={`w-4 h-4 rounded-full ${getCategoryColor(parameter.category)}`}></span>
                {parameter.category}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`goal-${index}`}>Goal</Label>
                  <Input
                    id={`goal-${index}`}
                    value={parameter.goal}
                    onChange={(e) => handleParameterChange(index, "goal", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`green-${index}`} className="text-green-600">Green Threshold</Label>
                    <Input
                      id={`green-${index}`}
                      value={parameter.greenThreshold || ""}
                      placeholder="≥ 95%"
                      onChange={(e) => handleParameterChange(index, "greenThreshold", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`yellow-${index}`} className="text-yellow-600">Yellow Threshold</Label>
                    <Input
                      id={`yellow-${index}`}
                      value={parameter.yellowThreshold || ""}
                      placeholder="85-94%"
                      onChange={(e) => handleParameterChange(index, "yellowThreshold", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`red-${index}`} className="text-red-600">Red Threshold</Label>
                    <Input
                      id={`red-${index}`}
                      value={parameter.redThreshold || ""}
                      placeholder="< 85%"
                      onChange={(e) => handleParameterChange(index, "redThreshold", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label>Graph View</Label>
                  <Select
                    value={parameter.graphView || 'weekly'}
                    onValueChange={(value) => handleParameterChange(index, 'graphView', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Graph Type</Label>
                  <Select
                    value={parameter.graphType || 'line'}
                    onValueChange={(value) => handleParameterChange(index, 'graphType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line Graph</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Threshold Visualization</h4>
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <div className="h-2 bg-red-500 rounded-l"></div>
                  <div className="h-2 bg-yellow-400"></div>
                  <div className="h-2 bg-green-500 rounded-r"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  <p className="mb-1">
                    <span className="font-medium">Green threshold:</span> Values {parameter.category === "COST" ? "below" : "at or above"} this level are considered good.
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Yellow threshold:</span> Values in this range require attention.
                  </p>
                  <p>
                    <span className="font-medium">Red threshold:</span> Values {parameter.category === "COST" ? "above" : "below"} this level indicate problems.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Parameters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MetricParametersDialog;
