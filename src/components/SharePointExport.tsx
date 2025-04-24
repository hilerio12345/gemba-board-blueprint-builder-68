
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
import { useToast } from "@/hooks/use-toast";

const SharePointExport = () => {
  const [copied, setCopied] = useState(false);
  const { currentTier } = useTierConfig();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const { toast } = useToast();

  // Use the embedded template instead of trying to load it from file system
  const getHtmlTemplate = () => {
    // This is a simplified version of the template from gemba-sharepoint.html
    let template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gemba Board - SharePoint Version</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      background-color: #f9f9f9;
    }
    
    .header {
      background-color: #1a3a5f;
      color: white;
      padding: 15px 20px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    
    .header p {
      margin: 5px 0 0;
      opacity: 0.8;
      font-size: 14px;
    }
    
    .metrics-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      background-color: #fff;
      border: 1px solid #ddd;
    }
    
    .metrics-table th {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    
    .metrics-table td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    
    .category-cell {
      font-weight: bold;
      text-align: left;
      background-color: #f8f8f8;
    }
    
    .goal-text {
      display: block;
      font-size: 12px;
      color: #666;
      font-weight: normal;
    }
    
    .status-green {
      background-color: #4CAF50;
      color: white;
      padding: 5px;
      border-radius: 3px;
    }
    
    .status-yellow {
      background-color: #FFEB3B;
      color: black;
      padding: 5px;
      border-radius: 3px;
    }
    
    .status-red {
      background-color: #F44336;
      color: white;
      padding: 5px;
      border-radius: 3px;
    }
    
    .action-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border: 1px solid #ddd;
    }
    
    .action-table th {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
    }
    
    .action-table td {
      border: 1px solid #ddd;
      padding: 10px;
    }
    
    .action-header {
      background-color: #f5f5f5;
      padding: 10px;
      margin: 20px 0 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .action-header h2 {
      margin: 0;
      font-size: 18px;
    }
    
    .action-subtitle {
      text-align: center;
      margin-bottom: 15px;
      font-size: 14px;
    }
    
    .action-note {
      font-size: 12px;
      color: #666;
    }
    
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #777;
      border-top: 1px solid #eee;
      padding-top: 15px;
    }
    
    .status {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    
    .threshold-indicator {
      display: flex;
      align-items: center;
      font-size: 11px;
      margin-top: 2px;
    }
    
    .threshold-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
    }
    
    .sync-info {
      margin: 15px 0;
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #eaeaea;
      border-radius: 4px;
      font-size: 12px;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>Gemba Board - Tier 1</h1>
    <p>Lean Management System</p>
  </div>
  
  <h2>Daily Metrics Status</h2>
  
  <table class="metrics-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="category-cell">
          AVAILABILITY
          <span class="goal-text">Goal: 100%</span>
        </td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-yellow">Yellow</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td>Systems available throughout the week</td>
      </tr>
      <tr>
        <td class="category-cell">
          DELIVERY
          <span class="goal-text">Goal: 4</span>
        </td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-red">Red</span></td>
        <td><span class="status-yellow">Yellow</span></td>
        <td>4 DVs/wk | 4 DVs | = 4 total</td>
      </tr>
      <tr>
        <td class="category-cell">
          QUALITY
          <span class="goal-text">Goal: 75%</span>
        </td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-yellow">Yellow</span></td>
        <td><span class="status-yellow">Yellow</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td>3rd prty PV > Target</td>
      </tr>
      <tr>
        <td class="category-cell">
          COST
          <span class="goal-text">Goal: &lt;5%</span>
        </td>
        <td><span class="status-yellow">Yellow</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-red">Red</span></td>
        <td>Overtime % above target on Friday</td>
      </tr>
      <tr>
        <td class="category-cell">
          PEOPLE
          <span class="goal-text">Goal: 95%</span>
        </td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-green">Green</span></td>
        <td><span class="status-yellow">Yellow</span></td>
        <td>Training compliance on track</td>
      </tr>
    </tbody>
  </table>
  
  <div class="action-header">
    <h2>CI Action Items</h2>
  </div>
  
  <div class="action-subtitle">
    Better Every Day – Focus on what you can do today to improve for tomorrow
    <br>
    <span class="action-note">No action should be longer than 7 days!</span>
  </div>
  
  <table class="action-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Action Owner</th>
        <th>Action Item / Issue</th>
        <th>Due Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2025-04-10</td>
        <td>J. Smith</td>
        <td>Training documentation needs update</td>
        <td>2025-04-17</td>
        <td>In Progress</td>
      </tr>
      <tr>
        <td>2025-04-11</td>
        <td>R. Johnson</td>
        <td>System availability tracking tool calibration</td>
        <td>2025-04-18</td>
        <td>Complete</td>
      </tr>
      <tr>
        <td>2025-04-12</td>
        <td>T. Williams</td>
        <td>Quality metrics reporting inconsistency</td>
        <td>2025-04-19</td>
        <td>In Progress</td>
      </tr>
    </tbody>
  </table>
  
  <div class="footer">
    <p>Gemba Board Blueprint Builder | Version 1.0</p>
    <p>Electronic Gemba Board for multi-tiered Lean Management System | SharePoint-compatible</p>
    <p>Board #BOARD_ID</p>
  </div>

</body>
</html>`;
    
    // Replace placeholders with current tier info
    template = template.replace('Gemba Board - Tier 1', `Gemba Board - ${currentTier.tier}`);
    template = template.replace('Board #BOARD_ID', `Board #${currentTier.boardId}`);
    
    return template;
  };

  const copyToClipboard = () => {
    try {
      const template = getHtmlTemplate();
      navigator.clipboard.writeText(template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "HTML copied to clipboard",
        description: "You can now paste it into a SharePoint page"
      });
    } catch (err) {
      console.error("Failed to copy HTML:", err);
      toast({
        title: "Failed to copy HTML",
        description: "Please try the download option instead",
        variant: "destructive"
      });
    }
  };

  const downloadHTML = () => {
    try {
      const template = getHtmlTemplate();
      const element = document.createElement('a');
      const file = new Blob([template], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `gemba_board_${currentTier.tier.toLowerCase().replace(' ', '_')}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "HTML file downloaded",
        description: "You can now upload it to SharePoint"
      });
    } catch (err) {
      console.error("Failed to download HTML:", err);
      toast({
        title: "Failed to download HTML file",
        description: "An error occurred during file creation",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    if (!date?.from || !date?.to) return;
    
    try {
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
      
      toast({
        title: "Excel file downloaded",
        description: "Metrics data has been exported to Excel"
      });
    } catch (err) {
      console.error("Failed to export Excel:", err);
      toast({
        title: "Failed to export Excel file",
        description: "An error occurred during file creation",
        variant: "destructive"
      });
    }
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
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy HTML"}
                </Button>
                <Button onClick={downloadHTML}>
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML File
                </Button>
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
