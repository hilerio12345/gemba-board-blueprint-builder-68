
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Settings, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [lineOfProduction, setLineOfProduction] = useState("STANDARD DD214s");
  const [tier, setTier] = useState("TIER 1");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTier, setIsEditingTier] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleTierSave = () => {
    setIsEditingTier(false);
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
              {isEditingTier ? (
                <Input
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="h-7 text-sm w-24 text-black"
                  onBlur={handleTierSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTierSave()}
                  autoFocus
                />
              ) : (
                <div className="flex items-center">
                  <span className="font-semibold">{tier}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => setIsEditingTier(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
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
