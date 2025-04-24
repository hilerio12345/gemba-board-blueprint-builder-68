import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Settings, Edit2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TierConfig {
  tier: string;
  boardId: string;
  lineOfProduction: string;
  section?: string;
}

// Create a context to share tier information throughout the app
export const useTierConfig = () => {
  const [currentTier, setCurrentTier] = useState<TierConfig>({
    tier: "TIER 1",
    lineOfProduction: "STANDARD DD214s",
    boardId: "T1-STD-" + Math.random().toString(36).substring(2, 8)
  });
  
  return { currentTier, setCurrentTier };
};

const Header = () => {
  const [lineOfProduction, setLineOfProduction] = useState("STANDARD DD214s");
  const [tier, setTier] = useState("TIER 1");
  const [isEditing, setIsEditing] = useState(false);
  const [boardId, setBoardId] = useState("");
  
  useEffect(() => {
    // Generate a board ID based on both tier and line of production
    const prefix = tier.replace("TIER ", "T");
    const linePrefix = lineOfProduction
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase();
    const randomId = Math.random().toString(36).substring(2, 6);
    setBoardId(`${prefix}-${linePrefix}-${randomId}`);
  }, [tier, lineOfProduction]);

  const handleSave = () => {
    setIsEditing(false);
    // Regenerate board ID when line of production changes
    const prefix = tier.replace("TIER ", "T");
    const linePrefix = lineOfProduction
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase();
    const randomId = Math.random().toString(36).substring(2, 6);
    setBoardId(`${prefix}-${linePrefix}-${randomId}`);
  };

  const handleTierChange = (value: string) => {
    setTier(`TIER ${value}`);
  };

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
            <div className="ml-2 text-xs text-gray-300">
              <span>Board ID: {boardId}</span>
            </div>
          </div>
          
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm font-medium">LINE OF PRODUCTION:</span>
              {isEditing ? (
                <Input
                  value={lineOfProduction}
                  onChange={(e) => setLineOfProduction(e.target.value)}
                  className="h-7 text-sm w-44 text-black"
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                />
              ) : (
                <div className="flex items-center">
                  <span className="text-sm font-medium">{lineOfProduction}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <span className="text-sm opacity-75">BRIEFING TIME: 0830</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
