
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, FileSpreadsheet } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getMetricsForDate } from "@/services/metricsService";
import * as XLSX from 'xlsx';
import { useTierConfig } from "./Header";

const SharePointExport = () => {
  const [copied, setCopied] = useState(false);
  const { currentTier } = useTierConfig();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // Get the template from the separate file
  const getHtmlTemplate = () => {
    const htmlContent = new XMLHttpRequest();
    htmlContent.open("GET", "/src/html-template/gemba-sharepoint.html", false);
    htmlContent.send(null);
    
    // Replace placeholders with current tier info
    let template = htmlContent.responseText;
    template = template.replace('Gemba Board - Tier 1', `Gemba Board - ${currentTier.tier}`);
    template = template.replace('Board #T2-789', `Board #${currentTier.boardId}`);
    
    return template;
  };

  const copyToClipboard = () => {
    const template = getHtmlTemplate();
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHTML = () => {
    const template = getHtmlTemplate();
    const element = document.createElement('a');
    const file = new Blob([template], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `gemba_board_${currentTier.tier.toLowerCase().replace(' ', '_')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportToExcel = () => {
    if (!date?.from || !date?.to) return;
    
    const metrics: any[] = [];
    let currentDate = new Date(date.from);
    
    while (currentDate <= date.to) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const dayMetrics = getMetricsForDate(dateKey);
      
      dayMetrics.forEach(metric => {
        metrics.push({
          Date: format(currentDate, 'yyyy-MM-dd'),
          Category: metric.category,
          Value: metric.value,
          Goal: metric.goal,
          Notes: metric.notes,
          Status: Object.values(metric.status).join(', '),
          'Monday Value': metric.dayValues?.monday || metric.availability?.monday || '',
          'Tuesday Value': metric.dayValues?.tuesday || metric.availability?.tuesday || '',
          'Wednesday Value': metric.dayValues?.wednesday || metric.availability?.wednesday || '',
          'Thursday Value': metric.dayValues?.thursday || metric.availability?.thursday || '',
          'Friday Value': metric.dayValues?.friday || metric.availability?.friday || '',
        });
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const ws = XLSX.utils.json_to_sheet(metrics);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Metrics");
    
    XLSX.writeFile(wb, `gemba_metrics_${format(date.from, 'yyyy-MM-dd')}_to_${format(date.to, 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          SharePoint Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export for SharePoint</DialogTitle>
          <DialogDescription>
            Download a standalone HTML file that can be uploaded to SharePoint without external dependencies
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html">SharePoint HTML</TabsTrigger>
            <TabsTrigger value="excel">Excel Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="html" className="mt-4">
            <div>
              <p className="text-sm text-gray-500 mb-4">
                This will generate a standalone HTML file that can be uploaded directly to SharePoint. 
                The file contains all necessary styles and does not require any external dependencies.
              </p>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? "Copied!" : "Copy HTML"}
                </Button>
                <Button onClick={downloadHTML}>Download HTML File</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="excel" className="mt-4">
            <div className="space-y-4">
              <div className="grid w-full gap-2">
                <Label>Select Date Range for Excel Export</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button 
                onClick={exportToExcel}
                disabled={!date?.from || !date?.to}
                className="w-full"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SharePointExport;
