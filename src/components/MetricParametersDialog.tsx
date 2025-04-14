
import { useState } from "react";
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

export interface MetricParameter {
  category: string;
  goal: string;
  greenThreshold?: string;
  yellowThreshold?: string;
  redThreshold?: string;
}

interface MetricParametersDialogProps {
  initialParameters: MetricParameter[];
  onParametersUpdate: (parameters: MetricParameter[]) => void;
}

const MetricParametersDialog = ({ 
  initialParameters, 
  onParametersUpdate 
}: MetricParametersDialogProps) => {
  const [parameters, setParameters] = useState<MetricParameter[]>(initialParameters);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

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
            Configure the goal and threshold parameters for each metric category.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {parameters.map((parameter, index) => (
            <div key={index} className="grid gap-3">
              <div className="font-semibold text-lg border-b pb-1">{parameter.category}</div>
              
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
