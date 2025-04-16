import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ActionItem {
  id: string;
  date: string;
  owner: string;
  issue: string;
  dueDate: string;
  status: string;
}

const ActionItemsLog = () => {
  const initialItems: ActionItem[] = [
    {
      id: "1",
      date: "2025-04-10",
      owner: "J. Smith",
      issue: "Training documentation needs update",
      dueDate: "2025-04-17",
      status: "IP"
    },
    {
      id: "2",
      date: "2025-04-11",
      owner: "R. Johnson",
      issue: "System availability tracking tool calibration",
      dueDate: "2025-04-18",
      status: "C"
    },
    {
      id: "3",
      date: "2025-04-12",
      owner: "T. Williams",
      issue: "Quality metrics reporting inconsistency",
      dueDate: "2025-04-19",
      status: "IP"
    }
  ];

  const [actionItems, setActionItems] = useState<ActionItem[]>(initialItems);
  const [newItem, setNewItem] = useState<ActionItem>({
    id: "",
    date: new Date().toISOString().split('T')[0],
    owner: "",
    issue: "",
    dueDate: "",
    status: "NS"
  });

  const handleAddNewItem = () => {
    if (!newItem.owner || !newItem.issue || !newItem.dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in Owner, Action Item, and Due Date fields.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedNewItem = {
      ...newItem,
      id: (actionItems.length + 1).toString()
    };
    
    setActionItems([...actionItems, updatedNewItem]);
    
    setNewItem({
      id: "",
      date: new Date().toISOString().split('T')[0],
      owner: "",
      issue: "",
      dueDate: "",
      status: "NS"
    });
    
    toast({
      title: "Action item added",
      description: "New CI action item has been added successfully."
    });
  };

  const handleItemChange = (id: string, field: keyof ActionItem, value: string) => {
    setActionItems(actionItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id));
    
    toast({
      title: "Action item deleted",
      description: "The CI action item has been removed."
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'C': return 'bg-green-100 text-green-800 border-green-500';
      case 'IP': return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'NS': return 'bg-gray-100 text-gray-800 border-gray-500';
      case 'OD': return 'bg-red-100 text-red-800 border-red-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'C': return 'Complete';
      case 'IP': return 'In Progress';
      case 'NS': return 'Not Started';
      case 'OD': return 'Overdue';
      default: return status;
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="p-2 bg-gray-50 border-b text-center text-sm font-medium">
        <p>Better Every Day – Focus on what you can do today to improve for tomorrow</p>
        <p className="text-xs text-gray-600">No action should be longer than 7 days!</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[150px]">Action Owner</TableHead>
            <TableHead>Action Item / Issue</TableHead>
            <TableHead className="w-[120px]">Due Date</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actionItems.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="p-1">
                <Input 
                  type="date"
                  value={item.date} 
                  onChange={(e) => handleItemChange(item.id, 'date', e.target.value)} 
                  className="h-8"
                />
              </TableCell>
              <TableCell className="p-1">
                <Input 
                  value={item.owner} 
                  onChange={(e) => handleItemChange(item.id, 'owner', e.target.value)} 
                  className="h-8"
                />
              </TableCell>
              <TableCell className="p-1">
                <Input 
                  value={item.issue} 
                  onChange={(e) => handleItemChange(item.id, 'issue', e.target.value)} 
                  className="h-8"
                />
              </TableCell>
              <TableCell className="p-1">
                <Input 
                  type="date"
                  value={item.dueDate} 
                  onChange={(e) => handleItemChange(item.id, 'dueDate', e.target.value)} 
                  className="h-8"
                />
              </TableCell>
              <TableCell className="p-1">
                <Select 
                  value={item.status} 
                  onValueChange={(value) => handleItemChange(item.id, 'status', value)}
                >
                  <SelectTrigger className={`h-8 text-sm border ${getStatusBadgeColor(item.status)}`}>
                    <SelectValue placeholder="Status">
                      {getStatusText(item.status)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NS">Not Started</SelectItem>
                    <SelectItem value="IP">In Progress</SelectItem>
                    <SelectItem value="C">Complete</SelectItem>
                    <SelectItem value="OD">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="p-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteItem(item.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          <TableRow className="bg-gray-50">
            <TableCell className="p-1">
              <Input 
                type="date"
                value={newItem.date} 
                onChange={(e) => setNewItem({...newItem, date: e.target.value})} 
                className="h-8"
              />
            </TableCell>
            <TableCell className="p-1">
              <Input 
                value={newItem.owner} 
                onChange={(e) => setNewItem({...newItem, owner: e.target.value})} 
                className="h-8"
                placeholder="Owner"
              />
            </TableCell>
            <TableCell className="p-1">
              <Input 
                value={newItem.issue} 
                onChange={(e) => setNewItem({...newItem, issue: e.target.value})} 
                className="h-8"
                placeholder="Action Item / Issue"
              />
            </TableCell>
            <TableCell className="p-1">
              <Input 
                type="date"
                value={newItem.dueDate} 
                onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})} 
                className="h-8"
              />
            </TableCell>
            <TableCell className="p-1">
              <Select 
                value={newItem.status} 
                onValueChange={(value) => setNewItem({...newItem, status: value})}
              >
                <SelectTrigger className={`h-8 text-sm border ${getStatusBadgeColor(newItem.status)}`}>
                  <SelectValue placeholder="Status">
                    {getStatusText(newItem.status)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NS">Not Started</SelectItem>
                  <SelectItem value="IP">In Progress</SelectItem>
                  <SelectItem value="C">Complete</SelectItem>
                  <SelectItem value="OD">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="p-1">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleAddNewItem}
                className="h-8 w-8 bg-green-50 hover:bg-green-100 border-green-200"
                title="Add new action item"
              >
                <Plus className="h-4 w-4 text-green-600" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      {/* Add hidden placeholder for future tier integration */}
      {/* <!-- TIER_INTEGRATION: This is where CI Action items will be aggregated to Tier 2 dashboards --> */}
    </div>
  );
};

export default ActionItemsLog;
