import { useState, useEffect } from "react";
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
import { Trash2, Plus, Archive, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDCADialog from "./PDCADialog";
import ArchivedActionsDialog from "./ArchivedActionsDialog";
import { useTierConfig } from "./Header";

interface ActionItem {
  id: string;
  date: string;
  owner: string;
  issue: string;
  dueDate: string;
  status: string;
  tier?: string;
  pdcaData?: {
    plan: string;
    do: string;
    check: string;
    act: string;
  };
}

interface ArchivedAction {
  id: string;
  date: string;
  owner: string;
  issue: string;
  dueDate: string;
  completedDate: string;
  tier?: string;
}

const ActionItemsLog = () => {
  const { currentTier } = useTierConfig();
  const tierLevel = parseInt(currentTier.tier.split(' ')[1]);
  
  const initialItems: ActionItem[] = [
    {
      id: "1",
      date: "2025-04-03", // 8 days ago (yellow)
      owner: "J. Smith",
      issue: "Training documentation needs update",
      dueDate: "2025-04-17",
      status: "IP",
      tier: "Tier 1"
    },
    {
      id: "2",
      date: "2025-03-28", // 15 days ago (red)
      owner: "R. Johnson",
      issue: "System availability tracking tool calibration",
      dueDate: "2025-04-18",
      status: "C",
      tier: "Tier 1"
    },
    {
      id: "3",
      date: "2025-04-12",
      owner: "T. Williams",
      issue: "Quality metrics reporting inconsistency",
      dueDate: "2025-04-19",
      status: "IP",
      tier: "Tier 2"
    }
  ];

  const [actionItems, setActionItems] = useState<ActionItem[]>(initialItems);
  const [archivedActions, setArchivedActions] = useState<ArchivedAction[]>([]);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [newItem, setNewItem] = useState<ActionItem>({
    id: "",
    date: new Date().toISOString().split('T')[0],
    owner: "",
    issue: "",
    dueDate: "",
    status: "NS",
    tier: `Tier ${tierLevel}`
  });

  // Debug logging
  useEffect(() => {
    console.log("ActionItemsLog - Initial items:", initialItems);
    console.log("ActionItemsLog - Current actionItems:", actionItems);
    console.log("ActionItemsLog - New item state:", newItem);
  }, [actionItems, newItem]);

  // Calculate days since creation for color coding
  const getDaysSinceCreation = (dateString: string) => {
    const creationDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get row color based on age
  const getRowColor = (item: ActionItem) => {
    if (item.status === 'C') return '';
    const days = getDaysSinceCreation(item.date);
    if (days >= 14) return 'bg-red-50 border-l-4 border-l-red-500';
    if (days >= 7) return 'bg-yellow-50 border-l-4 border-l-yellow-500';
    return '';
  };

  // Get urgency indicator
  const getUrgencyIndicator = (item: ActionItem) => {
    if (item.status === 'C') return null;
    const days = getDaysSinceCreation(item.date);
    if (days >= 14) return (
      <span title={`${days} days old - Overdue!`}>
        <AlertTriangle className="h-4 w-4 text-red-500" />
      </span>
    );
    if (days >= 7) return (
      <span title={`${days} days old - Action needed`}>
        <Clock className="h-4 w-4 text-yellow-500" />
      </span>
    );
    return null;
  };

  // Filter items based on tier level
  const getFilteredItems = () => {
    if (tierLevel === 1) {
      return actionItems.filter(item => item.tier === 'Tier 1' || !item.tier);
    }
    // Higher tiers can see items from lower tiers
    const maxTier = tierLevel;
    return actionItems.filter(item => {
      if (!item.tier) return true;
      const itemTier = parseInt(item.tier.split(' ')[1]);
      return itemTier <= maxTier;
    });
  };

  const handleAddNewItem = () => {
    console.log("Adding new item with owner:", newItem.owner);
    
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
      id: (actionItems.length + 1).toString(),
      tier: `Tier ${tierLevel}`
    };
    
    console.log("Updated new item before adding:", updatedNewItem);
    
    setActionItems([...actionItems, updatedNewItem]);
    
    setNewItem({
      id: "",
      date: new Date().toISOString().split('T')[0],
      owner: "",
      issue: "",
      dueDate: "",
      status: "NS",
      tier: `Tier ${tierLevel}`
    });
    
    toast({
      title: "Action item added",
      description: "New CI action item has been added successfully."
    });
  };

  const handleItemChange = (id: string, field: keyof ActionItem, value: string) => {
    console.log(`Updating item ${id}, field ${field} to:`, value);
    
    setActionItems(actionItems.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          [field]: value
        };
        console.log("Updated item:", updatedItem);
        return updatedItem;
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

  const handleArchiveItem = (id: string) => {
    const itemToArchive = actionItems.find(item => item.id === id);
    if (itemToArchive && itemToArchive.status === 'C') {
      const archivedItem: ArchivedAction = {
        id: itemToArchive.id,
        date: itemToArchive.date,
        owner: itemToArchive.owner,
        issue: itemToArchive.issue,
        dueDate: itemToArchive.dueDate,
        completedDate: new Date().toISOString().split('T')[0],
        tier: itemToArchive.tier
      };
      
      setArchivedActions([...archivedActions, archivedItem]);
      setActionItems(actionItems.filter(item => item.id !== id));
      
      toast({
        title: "Action item archived",
        description: "The completed CI action item has been archived."
      });
    } else {
      toast({
        title: "Cannot archive",
        description: "Only completed action items can be archived.",
        variant: "destructive"
      });
    }
  };

  const handlePDCASave = (id: string, pdcaData: any) => {
    setActionItems(actionItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          pdcaData
        };
      }
      return item;
    }));
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

  // Monthly view component
  const MonthlyActionView = () => {
    const filteredItems = getFilteredItems();
    const monthlyData = filteredItems.reduce((acc, item) => {
      const month = new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {} as Record<string, ActionItem[]>);

    return (
      <div className="space-y-4">
        {Object.entries(monthlyData).map(([month, items]) => (
          <div key={month} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">{month}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <div key={item.id} className={`p-3 border rounded-md ${getRowColor(item)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">{item.tier}</Badge>
                    {getUrgencyIndicator(item)}
                  </div>
                  <div className="text-sm font-medium mb-1">{item.owner}</div>
                  <div className="text-xs text-gray-600 mb-2">{item.issue}</div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                    <span className="text-xs text-gray-500">Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const filteredItems = getFilteredItems();

  console.log("Rendering with filtered items:", filteredItems);

  return (
    <div className="overflow-x-auto">
      <div className="p-2 bg-gray-50 border-b text-center text-sm font-medium">
        <p>Better Every Day – Focus on what you can do today to improve for tomorrow</p>
        <p className="text-xs text-gray-600">No action should be longer than 7 days!</p>
      </div>
      
      <div className="p-4 border-b flex justify-between items-center">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'weekly' | 'monthly')}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <ArchivedActionsDialog archivedActions={archivedActions} />
          {tierLevel > 1 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Viewing Tiers 1-{tierLevel}
            </Badge>
          )}
        </div>
      </div>

      {viewMode === 'weekly' ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[150px]">Action Owner</TableHead>
              <TableHead>Action Item / Issue</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[80px]">PDCA</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              console.log("Rendering item:", item, "Owner value:", item.owner);
              return (
                <TableRow key={item.id} className={`hover:bg-gray-50 ${getRowColor(item)}`}>
                  <TableCell className="p-1">
                    <div className="flex items-center gap-2">
                      <Input 
                        type="date"
                        value={item.date} 
                        onChange={(e) => handleItemChange(item.id, 'date', e.target.value)} 
                        className="h-8"
                      />
                      {getUrgencyIndicator(item)}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input 
                      value={item.owner || ""} 
                      onChange={(e) => handleItemChange(item.id, 'owner', e.target.value)} 
                      className="h-8"
                      placeholder="Owner name"
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
                    <PDCADialog 
                      actionItemId={item.id}
                      initialData={item.pdcaData}
                      onSave={handlePDCASave}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <div className="flex gap-1">
                      {item.status === 'C' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleArchiveItem(item.id)}
                          className="h-8 w-8"
                          title="Archive completed item"
                        >
                          <Archive className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            
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
                  onChange={(e) => {
                    console.log("New item owner changed to:", e.target.value);
                    setNewItem({...newItem, owner: e.target.value});
                  }} 
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
              <TableCell className="p-1"></TableCell>
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
      ) : (
        <MonthlyActionView />
      )}
      
      {/* Add hidden placeholder for future tier integration */}
      {/* <!-- TIER_INTEGRATION: This is where CI Action items will be aggregated to Tier 2 dashboards --> */}
    </div>
  );
};

export default ActionItemsLog;
