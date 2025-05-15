
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
import SharePointExport from "./SharePointExport";
import SharePointEmbed from "./SharePointEmbed";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  currentTier?: string;
  boardId?: string;
}

const ExportOptions = ({ currentTier = "TIER 1", boardId = "" }: ExportOptionsProps) => {
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    enablePowerBI: false,
    syncToTier2: false,
    syncToTier3: false,
    syncToTier4: false,
    currentTier,
    currentBoardId: boardId
  });
  
  const { toast } = useToast();

  // Update settings when tier or board ID changes
  useEffect(() => {
    setSyncSettings(prev => ({
      ...prev,
      currentTier,
      currentBoardId: boardId
    }));
  }, [currentTier, boardId]);

  const shareBoard = () => {
    toast({
      title: "Board link copied",
      description: `${currentTier} board link (${boardId}) copied to clipboard!`,
    });
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
      description: `Syncing ${currentTier} data to workspace: ${syncSettings.powerBIWorkspace}`,
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
      description: `Syncing ${currentTier} data to: ${tiersList.join(", ")}`,
    });
    
    // Here would be the actual tier sync logic
    console.log("Syncing to higher tiers with settings:", syncSettings);
  };

  const handleSyncSettingsUpdate = (settings: SyncSettings) => {
    setSyncSettings(settings);
  };

  return (
    <div className="flex gap-2">
      <SharePointExport />
      
      <SharePointEmbed />
      
      {/* Only show sync options for Tiers 1-3 that can sync up */}
      {!currentTier.includes("TIER 4") && (
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
      )}
      
      <SyncSettingsDialog 
        initialSettings={syncSettings}
        onSettingsUpdate={handleSyncSettingsUpdate}
        currentTier={currentTier}
        currentBoardId={boardId}
      />
      
      <Button variant="ghost" onClick={shareBoard}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default ExportOptions;
