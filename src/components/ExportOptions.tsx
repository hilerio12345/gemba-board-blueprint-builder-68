
import { Button } from "@/components/ui/button";
import { Download, FileText, Share2, BarChart } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import SyncSettingsDialog, { SyncSettings } from "./SyncSettingsDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ExportOptions = () => {
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    enablePowerBI: false,
    syncToTier2: false,
    syncToTier3: false,
    syncToTier4: false
  });
  
  const { toast } = useToast();

  const exportToHTML = () => {
    // This would contain the SharePoint export logic
    alert("Exporting to HTML for SharePoint...");
  };

  const exportToExcel = () => {
    alert("Exporting to Excel...");
  };

  const shareBoard = () => {
    alert("Share board link copied to clipboard!");
  };

  const syncToPowerBI = () => {
    if (!syncSettings.enablePowerBI) {
      toast({
        title: "Power BI sync not configured",
        description: "Please configure Power BI settings first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Syncing to Power BI",
      description: `Syncing data to workspace: ${syncSettings.powerBIWorkspace}`,
    });
    
    // Here would be the actual Power BI sync logic
    console.log("Syncing to Power BI with settings:", syncSettings);
  };

  const syncToHigherTiers = () => {
    const tiersList = [];
    
    if (syncSettings.syncToTier2) tiersList.push("Tier 2");
    if (syncSettings.syncToTier3) tiersList.push("Tier 3");
    if (syncSettings.syncToTier4) tiersList.push("Tier 4");
    
    if (tiersList.length === 0) {
      toast({
        title: "No tier sync configured",
        description: "Please configure tier synchronization settings first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Syncing to higher tiers",
      description: `Syncing data to: ${tiersList.join(", ")}`,
    });
    
    // Here would be the actual tier sync logic
    console.log("Syncing to higher tiers with settings:", syncSettings);
  };

  const handleSyncSettingsUpdate = (settings: SyncSettings) => {
    setSyncSettings(settings);
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-blue-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={exportToHTML}>
            <FileText className="h-4 w-4 mr-2" />
            Export for SharePoint
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToExcel}>
            <FileText className="h-4 w-4 mr-2" />
            Export to Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-blue-200">
            <Share2 className="h-4 w-4 mr-2" />
            Sync
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sync Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={syncToPowerBI}>
            <BarChart className="h-4 w-4 mr-2" />
            Sync to Power BI
          </DropdownMenuItem>
          <DropdownMenuItem onClick={syncToHigherTiers}>
            <Share2 className="h-4 w-4 mr-2" />
            Sync to Higher Tiers
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <SyncSettingsDialog 
        initialSettings={syncSettings}
        onSettingsUpdate={handleSyncSettingsUpdate}
      />
      
      <Button variant="ghost" onClick={shareBoard}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default ExportOptions;
