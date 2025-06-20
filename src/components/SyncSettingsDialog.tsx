
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Share } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

export interface SyncSettings {
  enablePowerBI: boolean;
  powerBIWorkspace?: string;
  powerBIDataset?: string;
  syncToTier2: boolean;
  tier2BoardId?: string;
  syncToTier3: boolean;
  tier3BoardId?: string;
  syncToTier4: boolean;
  tier4BoardId?: string;
  currentTier?: string;
  currentBoardId?: string;
}

interface SyncSettingsDialogProps {
  initialSettings: SyncSettings;
  onSettingsUpdate: (settings: SyncSettings) => void;
  currentTier?: string;
  currentBoardId?: string;
}

const SyncSettingsDialog = ({ 
  initialSettings, 
  onSettingsUpdate,
  currentTier = "TIER 1", 
  currentBoardId = ""
}: SyncSettingsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SyncSettings>({
    defaultValues: {
      ...initialSettings,
      currentTier,
      currentBoardId
    }
  });

  // Update form when tier or board ID changes
  useEffect(() => {
    form.setValue("currentTier", currentTier);
    form.setValue("currentBoardId", currentBoardId);
  }, [currentTier, currentBoardId, form]);

  const handleSave = (data: SyncSettings) => {
    onSettingsUpdate({
      ...data,
      currentTier,
      currentBoardId
    });
    
    toast({
      title: "Sync settings updated",
      description: `Your ${currentTier} board synchronization settings have been updated successfully`,
    });
    
    setIsOpen(false);
  };

  // Function to determine which tier options to show based on current tier
  const showTierOptions = () => {
    const tierNumber = parseInt(currentTier.split(" ")[1]);
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-md">Tier Synchronization</h3>
        
        {tierNumber === 1 && (
          <>
            <FormField
              control={form.control}
              name="syncToTier2"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="text-base">Sync to Tier 2</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("syncToTier2") && (
              <FormField
                control={form.control}
                name="tier2BoardId"
                render={({ field }) => (
                  <FormItem className="ml-4">
                    <FormLabel>Tier 2 Board ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="T2-XXXXX" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </>
        )}
        
        {tierNumber <= 2 && (
          <>
            <FormField
              control={form.control}
              name="syncToTier3"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="text-base">Sync to Tier 3</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("syncToTier3") && (
              <FormField
                control={form.control}
                name="tier3BoardId"
                render={({ field }) => (
                  <FormItem className="ml-4">
                    <FormLabel>Tier 3 Board ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="T3-XXXXX" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </>
        )}
        
        {tierNumber <= 3 && (
          <>
            <FormField
              control={form.control}
              name="syncToTier4"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="text-base">Sync to Tier 4</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("syncToTier4") && (
              <FormField
                control={form.control}
                name="tier4BoardId"
                render={({ field }) => (
                  <FormItem className="ml-4">
                    <FormLabel>Tier 4 Board ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="T4-XXXXX" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </>
        )}
        
        {/* Show receiving boards section for Tier 2-4 */}
        {tierNumber > 1 && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-md mb-2">Receiving Boards</h3>
            <p className="text-sm text-gray-500 mb-4">
              This {currentTier} board can receive data from lower tier boards.
            </p>
            
            {/* This would typically be a table or list of connected boards */}
            <div className="bg-gray-50 p-3 rounded-md border text-sm">
              <p className="text-gray-500">Board ID: {currentBoardId}</p>
              <p className="text-gray-500">Connected boards: None</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Share className="h-3.5 w-3.5" />
          Sync Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentTier} Synchronization Settings</DialogTitle>
          <DialogDescription>
            Configure how this {currentTier} Gemba Board syncs with Power BI and other tier boards.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="space-y-4 border-b pb-4">
              <h3 className="font-medium text-md">Power BI Integration</h3>
              
              <FormField
                control={form.control}
                name="enablePowerBI"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Power BI Sync</FormLabel>
                      <FormDescription>
                        Sync metrics and actions to Power BI dashboard
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.watch("enablePowerBI") && (
                <div className="grid grid-cols-2 gap-4 ml-4 mt-2">
                  <FormField
                    control={form.control}
                    name="powerBIWorkspace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="powerBIDataset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dataset ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            
            {/* Show tier options based on current tier */}
            {showTierOptions()}
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SyncSettingsDialog;
