
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
import { CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Metric } from "../../types/metrics";

interface DailyUpdateDialogProps {
  metrics: Metric[];
  onUpdate: (updatedMetrics: Metric[]) => void;
  currentDate: string;
}

const DailyUpdateDialog = ({ metrics, onUpdate, currentDate }: DailyUpdateDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dailyData, setDailyData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const handleSave = () => {
    const updatedMetrics = metrics.map(metric => {
      const metricData = dailyData[metric.id];
      if (!metricData) return metric;

      // Update day values based on current day of week
      const today = new Date(currentDate);
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
      const mappedDay = dayOfWeek === 'sunday' ? 'monday' : dayOfWeek === 'saturday' ? 'friday' : dayOfWeek;

      const updatedMetric = { ...metric };

      // Update main value
      if (metricData.value !== undefined) {
        updatedMetric.value = parseFloat(metricData.value);
      }

      // Update day-specific values
      if (metric.category === "AVAILABILITY" && updatedMetric.availability) {
        updatedMetric.availability = {
          ...updatedMetric.availability,
          [mappedDay as keyof typeof updatedMetric.availability]: metricData.value || metric.value
        };
      } else if (updatedMetric.dayValues) {
        updatedMetric.dayValues = {
          ...updatedMetric.dayValues,
          [mappedDay as keyof typeof updatedMetric.dayValues]: metricData.value || metric.value
        };
      }

      // Update notes
      if (metricData.notes) {
        updatedMetric.notes = metricData.notes;
      }

      // Update delivery-specific data
      if (metric.category === "DELIVERY" && metricData.deliveries !== undefined) {
        if (!updatedMetric.deliveryParams) {
          updatedMetric.deliveryParams = {
            targetPerWeek: 4,
            lostDeliveries: [],
            cumulativeDeliveries: 0,
            weeklyTarget: 4,
            monthlyTarget: 16
          };
        }
        updatedMetric.deliveryParams.cumulativeDeliveries = parseInt(metricData.deliveries) || 0;
      }

      return updatedMetric;
    });

    onUpdate(updatedMetrics);
    toast({
      title: "Daily data updated",
      description: `Metrics updated for ${new Date(currentDate).toLocaleDateString()}`,
    });
    setIsOpen(false);
    setDailyData({});
  };

  const updateMetricData = (metricId: string, field: string, value: any) => {
    setDailyData(prev => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        [field]: value
      }
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "AVAILABILITY": return "🟢";
      case "DELIVERY": return "🚚";
      case "QUALITY": return "⭐";
      case "COST": return "💰";
      case "PEOPLE": return "👥";
      default: return "📊";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Daily Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Metrics Update</DialogTitle>
          <DialogDescription>
            Update today's metrics data. Changes will flow into weekly and monthly views.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
            <strong>Date:</strong> {new Date(currentDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          {metrics.map((metric) => (
            <div key={metric.id} className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(metric.category)}</span>
                {metric.category}
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Today's Value</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder={metric.value.toString()}
                    value={dailyData[metric.id]?.value || ''}
                    onChange={(e) => updateMetricData(metric.id, 'value', e.target.value)}
                  />
                </div>

                {metric.category === "DELIVERY" && (
                  <div className="space-y-2">
                    <Label>Deliveries Today</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={dailyData[metric.id]?.deliveries || ''}
                      onChange={(e) => updateMetricData(metric.id, 'deliveries', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder={`Add notes for ${metric.category} today...`}
                  value={dailyData[metric.id]?.notes || ''}
                  onChange={(e) => updateMetricData(metric.id, 'notes', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Daily Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyUpdateDialog;

