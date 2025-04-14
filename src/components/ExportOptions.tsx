
import { Button } from "@/components/ui/button";
import { Download, FileText, Share2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const ExportOptions = () => {
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
      
      <Button variant="ghost" onClick={shareBoard}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default ExportOptions;
