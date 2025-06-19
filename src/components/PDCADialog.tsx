
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface PDCAData {
  plan: string;
  do: string;
  check: string;
  act: string;
}

interface PDCADialogProps {
  actionItemId: string;
  initialData?: PDCAData;
  onSave: (id: string, data: PDCAData) => void;
}

const PDCADialog = ({ actionItemId, initialData, onSave }: PDCADialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdcaData, setPdcaData] = useState<PDCAData>(
    initialData || { plan: "", do: "", check: "", act: "" }
  );

  const handleSave = () => {
    onSave(actionItemId, pdcaData);
    setIsOpen(false);
    toast({
      title: "PDCA Updated",
      description: "Plan-Do-Check-Act cycle has been saved successfully."
    });
  };

  const PDCACircle = () => (
    <div className="relative w-16 h-16 rounded-full border-4 border-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
      <div className="absolute inset-2 rounded-full border-2 border-blue-400">
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-xs font-bold text-blue-800">P</div>
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 text-xs font-bold text-blue-800">D</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 text-xs font-bold text-blue-800">C</div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 text-xs font-bold text-blue-800">A</div>
        </div>
      </div>
      <div className="text-xs font-bold text-blue-900">PDCA</div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <PDCACircle />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Plan-Do-Check-Act Cycle</DialogTitle>
          <DialogDescription>
            Document your continuous improvement process using the PDCA methodology.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">Plan</Badge>
            <Textarea
              placeholder="What needs to be done? Define the plan..."
              value={pdcaData.plan}
              onChange={(e) => setPdcaData({ ...pdcaData, plan: e.target.value })}
              className="h-24"
            />
          </div>
          <div>
            <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">Do</Badge>
            <Textarea
              placeholder="Execute the plan. What actions were taken?"
              value={pdcaData.do}
              onChange={(e) => setPdcaData({ ...pdcaData, do: e.target.value })}
              className="h-24"
            />
          </div>
          <div>
            <Badge variant="outline" className="mb-2 bg-yellow-50 text-yellow-700 border-yellow-200">Check</Badge>
            <Textarea
              placeholder="Verify results. What was learned?"
              value={pdcaData.check}
              onChange={(e) => setPdcaData({ ...pdcaData, check: e.target.value })}
              className="h-24"
            />
          </div>
          <div>
            <Badge variant="outline" className="mb-2 bg-purple-50 text-purple-700 border-purple-200">Act</Badge>
            <Textarea
              placeholder="Standardize or adjust. What's the next step?"
              value={pdcaData.act}
              onChange={(e) => setPdcaData({ ...pdcaData, act: e.target.value })}
              className="h-24"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save PDCA</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDCADialog;
