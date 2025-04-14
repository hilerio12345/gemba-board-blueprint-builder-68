
import { Card } from "@/components/ui/card";

const Header = () => {
  return (
    <header className="bg-[#1a3a5f] text-white p-4 shadow-md">
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
          </div>
          
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium">PROGRAM BRIEFED: STANDARD DD214s</span>
            <span className="text-sm opacity-75">BRIEFING TIME: 0830</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
