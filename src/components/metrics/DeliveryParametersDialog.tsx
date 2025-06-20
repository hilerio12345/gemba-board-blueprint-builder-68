
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
import { Textarea } from "@/components/ui/textarea";
import { Truck, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Metric } from "../../types/metrics";

interface DeliveryParametersDialogProps {
  metric: Metric;
  onUpdate: (updatedMetric: Metric) => void;
}

const DeliveryParametersDialog = ({ metric, onUpdate }: DeliveryParametersDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryParams, setDeliveryParams] = useState(metric.deliveryParams || {
    targetPerWeek: 4,
    lostDeliveries: [],
    cumulativeDeliveries: 0,
    weeklyTarget: 4,
    monthlyTarget: 16
  });
  const { toast } = useToast();

  const handleSave = () => {
    const updatedMetric = {
      ...metric,
      deliveryParams
    };
    onUpdate(updatedMetric);
    toast({
      title: "Delivery parameters updated",
      description: "Delivery tracking parameters have been updated successfully",
    });
    setIsOpen(false);
  };

  const addLostDelivery = () => {
    setDeliveryParams(prev => ({
      ...prev,
      lostDeliveries: [
        ...prev.lostDeliveries,
        { day: "", reason: "", impact: "", mitigationPlan: "" }
      ]
    }));
  };

  const removeLostDelivery = (index: number) => {
    setDeliveryParams(prev => ({
      ...prev,
      lostDeliveries: prev.lostDeliveries.filter((_, i) => i !== index)
    }));
  };

  const updateLostDelivery = (index: number, field: string, value: string) => {
    setDeliveryParams(prev => ({
      ...prev,
      lostDeliveries: prev.lostDeliveries.map((delivery, i) => 
        i === index ? { ...delivery, [field]: value } : delivery
      )
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Truck className="h-3.5 w-3.5" />
          Delivery Params
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delivery Parameters</DialogTitle>
          <DialogDescription>
            Configure delivery targets, track lost deliveries, and set mitigation plans.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Target Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Weekly Target</Label>
              <Input
                type="number"
                value={deliveryParams.weeklyTarget}
                onChange={(e) => setDeliveryParams(prev => ({
                  ...prev,
                  weeklyTarget: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Target</Label>
              <Input
                type="number"
                value={deliveryParams.monthlyTarget}
                onChange={(e) => setDeliveryParams(prev => ({
                  ...prev,
                  monthlyTarget: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Cumulative Deliveries</Label>
              <Input
                type="number"
                value={deliveryParams.cumulativeDeliveries}
                onChange={(e) => setDeliveryParams(prev => ({
                  ...prev,
                  cumulativeDeliveries: parseInt(e.target.value) || 0
                }))}
              />
            </div>
          </div>

          {/* Lost Deliveries Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Lost Deliveries</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLostDelivery}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Lost Delivery
              </Button>
            </div>

            {deliveryParams.lostDeliveries.map((delivery, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium">Lost Delivery #{index + 1}</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLostDelivery(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Input
                      value={delivery.day}
                      onChange={(e) => updateLostDelivery(index, "day", e.target.value)}
                      placeholder="e.g., Monday, Tuesday"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Impact Level</Label>
                    <Input
                      value={delivery.impact}
                      onChange={(e) => updateLostDelivery(index, "impact", e.target.value)}
                      placeholder="e.g., High, Medium, Low"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    value={delivery.reason}
                    onChange={(e) => updateLostDelivery(index, "reason", e.target.value)}
                    placeholder="Describe the reason for the lost delivery"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Mitigation Plan</Label>
                  <Textarea
                    value={delivery.mitigationPlan}
                    onChange={(e) => updateLostDelivery(index, "mitigationPlan", e.target.value)}
                    placeholder="Describe the plan to prevent future occurrences"
                    rows={2}
                  />
                </div>
              </div>
            ))}

            {deliveryParams.lostDeliveries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No lost deliveries recorded</p>
                <p className="text-xs">Click "Add Lost Delivery" to track issues</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Parameters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryParametersDialog;

