
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";

interface ArchivedAction {
  id: string;
  date: string;
  owner: string;
  issue: string;
  dueDate: string;
  completedDate: string;
  tier?: string;
}

interface ArchivedActionsDialogProps {
  archivedActions: ArchivedAction[];
}

const ArchivedActionsDialog = ({ archivedActions }: ArchivedActionsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Archive className="h-4 w-4" />
          View Archived ({archivedActions.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Archived CI Action Items</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Action Item</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archivedActions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="text-sm">{action.date}</TableCell>
                <TableCell className="text-sm">{action.owner}</TableCell>
                <TableCell className="text-sm">{action.issue}</TableCell>
                <TableCell className="text-sm">{action.dueDate}</TableCell>
                <TableCell className="text-sm">{action.completedDate}</TableCell>
                <TableCell>
                  <Badge variant="outline">{action.tier || "Tier 1"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {archivedActions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No archived action items yet.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArchivedActionsDialog;
