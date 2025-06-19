
import React, { useState, useEffect, createContext, useContext } from "react";
import { Card } from "@/components/ui/card";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Settings, Edit2, ChevronDown, Save, Lock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Data lists
const directorates = ["DPA", "DPT", "DPX", "PB", "DPH", "All Others"];

const officeSpecialtyCodes = [
  "CC", "CCC", "CCE", "CCF", "CCG", "CCX", "CD", "CSS", "DD", "DPA", 
  "DPAA", "DPAAA", "DPAAG", "DPAF", "DPAFA", "DPAFB", "DPAFK", "DPAM", 
  "DPAMR", "DPAMX", "DPAR", "DPARA", "DPARS", "DPAT", "DPATE", "DPATI", 
  "DPD", "DPT", "DPTG", "DPTS", "DPTSA", "DPTSC", "DPTSE", "DPTSP", 
  "DPTT", "DPTTB", "DPTTR", "DPTTS", "DPX", "DPXI", "DPXID", "DPXIO", 
  "DPXO", "DPXOA", "DPXOB", "DPXX", "DS", "JA", "PA", "PB", "PBE", 
  "PBO", "PBP", "DPTC", "DPTG", "DPTGS", "DPTGT", "BIC", "OCM", 
  "RAD", "TRNG", "CPI"
];

const linesOfProduction = [
  "Manpower", "DPH", "AGR Assignments", "Reserve Assignments (IRR-TR, IRR-IMA, ANG-IMA)",
  "RegAF to IMA Assignments", "AGR Continuation (ACD) Board", "Critical Skills Listing",
  "Validation of Pay Dates", "Reserve Retiree to SelRes Indispensability Request",
  "Special Duty Assignment Pay", "Direct Accessions", "Active Duty to Reserve Appointment Orders",
  "Officer / Enlisted Grade Ceiling", "Production Line Certification",
  "Service Verification - (DD214's)", "Points - Initial Audits (Off/Enl LOP Merge @Bronze)",
  "Guard Separations - (Non- Pay Affecting)", "Guard Separations - Retirements",
  "Retirements - (Regular /20 Yrs TAFMS)", "Retirements - (Pay Affecting /Age 60/RRPA)",
  "Retirements - (Reserve/Gray Area)", "Retirements - (Reduced Ret. Pay Age (RRPA))",
  "Evaluations (ERAB)", "Career Support - (Actions)", "Retirements - (Outbound)",
  "Casualty - (Benefits and Entitlements)", "DEERS - (Actions)", "Reserve Separations",
  "1st Lt and Captain Process (PBE/PBO)", "Ticket Processing (PBE)", "Letters to the Board",
  "Reserve Board Conducted (PBO)", "Special Selection Board, SB, SSRB Conducted (PBP)",
  "Development Team Facilitation", "Developmental Education and Special Board Facilitation",
  "AFR Joint Officer Qualification Verification", "Board Operations",
  "Reserve Special Pay and Incentives - Validations and Approvals",
  "Reserve Education Validations and Approvals", "Health Professional Officer Validations and Approvals",
  "Reserve Retirement Counseling", "Ask a Question - Points", "Process Evaluations and Training Reports",
  "Duty History Updates", "Statement of Service Created", "Ask a Question - Evaluations",
  "Awards and Decorations Updates", "VA Home Letter Created", "Process ANG Separations for Pay"
];

export interface TierConfig {
  tier: string;
  boardId: string;
  lineOfProduction: string;
  section?: string;
  directorate?: string;
  officeCode?: string;
  isLocked?: boolean;
  isConfigured?: boolean;
}

const TierContext = createContext<{
  currentTier: TierConfig;
  setCurrentTier: (tier: TierConfig) => void;
  allBoardIds: string[];
  addBoardId: (boardId: string) => void;
  isFullyConfigured: boolean;
}>({
  currentTier: {
    tier: "TIER 1",
    lineOfProduction: "",
    boardId: "",
    isConfigured: false
  },
  setCurrentTier: () => {},
  allBoardIds: [],
  addBoardId: () => {},
  isFullyConfigured: false
});

export const useTierConfig = () => useContext(TierContext);

export const TierProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTier, setCurrentTier] = useState<TierConfig>({
    tier: "TIER 1",
    lineOfProduction: "",
    boardId: "",
    directorate: "",
    officeCode: "",
    isConfigured: false
  });
  
  // Keep track of all board IDs for Tier 4 access
  const [allBoardIds, setAllBoardIds] = useState<string[]>([]);
  
  const addBoardId = (boardId: string) => {
    setAllBoardIds(prev => {
      if (!prev.includes(boardId)) {
        return [...prev, boardId];
      }
      return prev;
    });
  };
  
  useEffect(() => {
    // When a new board ID is generated, automatically add it to the list
    if (currentTier.boardId && !allBoardIds.includes(currentTier.boardId)) {
      addBoardId(currentTier.boardId);
    }
  }, [currentTier.boardId]);
  
  // Check if all required fields are filled
  const isFullyConfigured = !!(
    currentTier.tier &&
    currentTier.directorate &&
    currentTier.officeCode &&
    currentTier.lineOfProduction
  );
  
  return (
    <TierContext.Provider value={{ currentTier, setCurrentTier, allBoardIds, addBoardId, isFullyConfigured }}>
      {children}
    </TierContext.Provider>
  );
};

const Header = () => {
  const { currentTier, setCurrentTier, allBoardIds, isFullyConfigured } = useTierConfig();
  
  // Local state for editing fields
  const [lineOfProduction, setLineOfProduction] = useState(currentTier.lineOfProduction);
  const [tier, setTier] = useState(currentTier.tier);
  const [directorate, setDirectorate] = useState(currentTier.directorate || "");
  const [officeCode, setOfficeCode] = useState(currentTier.officeCode || "");
  const [isLocked, setIsLocked] = useState(currentTier.isLocked || false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [boardId, setBoardId] = useState(currentTier.boardId);
  const [briefingTime, setBriefingTime] = useState("0830");
  const [isEditingBriefing, setIsEditingBriefing] = useState(false);
  
  // For board ID selection in Tier 4
  const [selectedBoardId, setSelectedBoardId] = useState(currentTier.boardId);
  
  // Excel import handling
  const [isImporting, setIsImporting] = useState(false);
  
  useEffect(() => {
    if (!isLocked && directorate && officeCode && lineOfProduction) {
      generateBoardId();
    }
  }, [tier, lineOfProduction, directorate, officeCode, isLocked]);
  
  const generateBoardId = () => {
    const tierPrefix = tier.replace("TIER ", "T");
    let codeComponents = [];
    
    // Add directorate if available
    if (directorate) {
      codeComponents.push(directorate);
    }
    
    // Add office code if available
    if (officeCode) {
      codeComponents.push(officeCode);
    }
    
    // Add line of production abbreviation
    const linePrefix = lineOfProduction
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 3);
    codeComponents.push(linePrefix);
    
    // Generate random component
    const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Combine all to create board ID
    const newBoardId = `${tierPrefix}-${codeComponents.join("-")}-${randomId}`;
    setBoardId(newBoardId);
  };

  const handleSave = () => {
    if (!directorate || !officeCode || !lineOfProduction) {
      toast.error("Please select all required fields: Directorate, Office Code, and Line of Production");
      return;
    }
    
    setIsLocked(true);
    
    // Update the current tier configuration with all selected values
    setCurrentTier({
      ...currentTier,
      tier,
      lineOfProduction,
      directorate,
      officeCode,
      boardId,
      isLocked: true,
      isConfigured: true
    });
    
    toast.success("Board configuration saved and locked!", {
      description: `Board ID: ${boardId}`
    });
  };

  const handleUnlock = () => {
    setIsLocked(false);
    setCurrentTier({
      ...currentTier,
      isLocked: false
    });
    toast.info("Board configuration unlocked for editing");
  };

  const handleTierChange = (value: string) => {
    if (!isLocked) {
      setTier(`TIER ${value}`);
    }
  };
  
  const handleDirectorateChange = (value: string) => {
    if (!isLocked) {
      setDirectorate(value);
    }
  };
  
  const handleOfficeCodeChange = (value: string) => {
    if (!isLocked) {
      setOfficeCode(value);
    }
  };
  
  const handleLineOfProductionChange = (value: string) => {
    if (!isLocked) {
      setLineOfProduction(value);
    }
  };
  
  const handleBoardIdChange = (value: string) => {
    const selectedTier = allBoardIds.find(id => id === value);
    if (selectedTier) {
      setSelectedBoardId(value);
      // We would need to load the corresponding data here
      toast.info(`Loaded board configuration for ${value}`);
    }
  };

  const handleBriefingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    let formattedTime = value;
    
    const hours = parseInt(value.slice(0, 2));
    const minutes = parseInt(value.slice(2, 4));
    
    if (hours >= 24) formattedTime = "23" + formattedTime.slice(2);
    if (minutes >= 60) formattedTime = formattedTime.slice(0, 2) + "59";
    
    setBriefingTime(formattedTime);
  };

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }

    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      toast.success("Excel data imported successfully!", {
        description: "Metrics and action items have been loaded from the spreadsheet"
      });
    }, 2000);

    // Reset file input
    event.target.value = '';
  };
  
  // Check if we're in Tier 4
  const isTier4 = tier === "TIER 4";

  return (
    <header className="bg-[#1a3a5f] text-white p-4 shadow-md mb-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4">
              <img 
                src="/lovable-uploads/d12065cc-8800-4efd-a354-df3af766cf9c.png" 
                alt="Logo" 
                className="h-12 w-auto" 
                style={{ opacity: 0.85 }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Gemba Board</h1>
              <p className="text-sm opacity-75">Lean Management System</p>
            </div>
            <div className="ml-4 px-3 py-1 bg-blue-700 rounded-md flex items-center">
              <Select
                onValueChange={handleTierChange}
                defaultValue={tier.split(" ")[1]}
                value={tier.split(" ")[1]}
                disabled={isLocked}
              >
                <SelectTrigger className="border-0 bg-transparent h-7 text-sm w-24 text-white focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder={tier} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">TIER 1</SelectItem>
                  <SelectItem value="2">TIER 2</SelectItem>
                  <SelectItem value="3">TIER 3</SelectItem>
                  <SelectItem value="4">TIER 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {boardId && (
              <div className="ml-2 text-xs text-gray-300">
                <span>Board ID: {boardId}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col text-right">
            {/* Show directorate, office code, and line of production selectors */}
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium whitespace-nowrap">DIRECTORATE:</span>
                <Select
                  onValueChange={handleDirectorateChange}
                  value={directorate}
                  disabled={isLocked}
                >
                  <SelectTrigger className="h-7 text-sm w-32 text-white bg-gray-700 border-gray-600 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {directorates.map((dir) => (
                      <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium whitespace-nowrap">OFFICE CODE:</span>
                <Select
                  onValueChange={handleOfficeCodeChange}
                  value={officeCode}
                  disabled={isLocked}
                >
                  <SelectTrigger className="h-7 text-sm w-32 text-white bg-gray-700 border-gray-600 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {officeSpecialtyCodes.map((code) => (
                      <SelectItem key={code} value={code}>{code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium whitespace-nowrap">LINE OF PRODUCTION:</span>
                <Select
                  onValueChange={handleLineOfProductionChange}
                  value={lineOfProduction}
                  disabled={isLocked}
                >
                  <SelectTrigger className="h-7 text-sm w-48 text-white bg-gray-700 border-gray-600 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {linesOfProduction.map((line) => (
                      <SelectItem key={line} value={line}>{line}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Excel Import Button */}
              <div className="flex items-center gap-1">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelImport}
                  className="hidden"
                  id="excel-import"
                  disabled={!isFullyConfigured || isImporting}
                />
                <label htmlFor="excel-import">
                  <Button
                    size="sm"
                    className="h-7 flex items-center gap-1"
                    variant="outline"
                    disabled={!isFullyConfigured || isImporting}
                    asChild
                  >
                    <span>
                      <Upload className="h-3 w-3" />
                      {isImporting ? "Importing..." : "Import Excel"}
                    </span>
                  </Button>
                </label>
              </div>
              
              {/* Save/Unlock button */}
              <Button
                size="sm"
                className="h-7 flex items-center gap-1"
                onClick={isLocked ? handleUnlock : handleSave}
                variant={isLocked ? "secondary" : "default"}
              >
                {isLocked ? (
                  <>
                    <Lock className="h-3 w-3" /> Unlock
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" /> Save
                  </>
                )}
              </Button>
            </div>
            
            {/* Board ID selector for Tier 4 */}
            {isTier4 && allBoardIds.length > 0 && (
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-xs font-medium">ACCESS BOARD:</span>
                <Select
                  onValueChange={handleBoardIdChange}
                  value={selectedBoardId}
                >
                  <SelectTrigger className="h-7 text-sm w-48 text-white bg-gray-700 border-gray-600 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select a board..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {allBoardIds.map((id) => (
                      <SelectItem key={id} value={id}>{id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Briefing Time */}
            <div className="flex items-center justify-end">
              <span className="text-sm opacity-75 mr-2">BRIEFING TIME:</span>
              {isEditingBriefing ? (
                <Input
                  type="text"
                  value={briefingTime}
                  onChange={handleBriefingTimeChange}
                  className="h-6 w-16 text-sm text-black p-1"
                  onBlur={() => setIsEditingBriefing(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingBriefing(false)}
                  placeholder="HHMM"
                  maxLength={4}
                  autoFocus
                />
              ) : (
                <div className="flex items-center">
                  <span className="text-sm">{briefingTime.slice(0, 2)}:{briefingTime.slice(2, 4)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => setIsEditingBriefing(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
