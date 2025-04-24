import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, FileExcel } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getMetricsForDate } from "@/services/metricsService";
import * as XLSX from 'xlsx';

const SharePointExport = () => {
  const [copied, setCopied] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gemba Board</title>
  <style>
    /* SharePoint-compatible styles */
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.5;
    }
    .gemba-board {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .gemba-board th {
      background-color: #f0f0f0;
      text-align: center;
      padding: 8px;
      border: 1px solid #ddd;
    }
    .gemba-board td {
      padding: 8px;
      border: 1px solid #ddd;
      text-align: center;
    }
    .category {
      font-weight: bold;
      text-align: left;
      background-color: #f8f8f8;
    }
    .status-green {
      background-color: #4CAF50;
      color: white;
    }
    .status-yellow {
      background-color: #FFEB3B;
      color: black;
    }
    .status-red {
      background-color: #F44336;
      color: white;
    }
    .header {
      background-color: #1a3a5f;
      color: white;
      padding: 15px;
      margin-bottom: 20px;
    }
    .action-log {
      width: 100%;
      border-collapse: collapse;
    }
    .action-log th {
      background-color: #f0f0f0;
      padding: 8px;
      border: 1px solid #ddd;
    }
    .action-log td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    .action-title {
      background-color: #1a3a5f;
      color: white;
      padding: 8px 15px;
      margin-top: 30px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <!-- This is an exportable version of the Gemba Board for SharePoint -->
  <!-- Header Section -->
  <div class="header">
    <h1>Gemba Board - Tier 1</h1>
    <p>Lean Management System</p>
  </div>

  <!-- Metrics Table -->
  <table class="gemba-board">
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
        <td class="category">AVAILABILITY<br><span style="font-size: 0.8em;">Goal: 100%</span></td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-yellow">Yellow</td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td>Systems available throughout the week</td>
      </tr>
      <tr>
        <td class="category">DELIVERY<br><span style="font-size: 0.8em;">Goal: 4</span></td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-red">Red</td>
        <td class="status-yellow">Yellow</td>
        <td>4 DVs/wk | 4 DVs | = 4 total</td>
      </tr>
      <tr>
        <td class="category">QUALITY<br><span style="font-size: 0.8em;">Goal: 75%</span></td>
        <td class="status-green">Green</td>
        <td class="status-yellow">Yellow</td>
        <td class="status-yellow">Yellow</td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td>3rd prty PV > Target</td>
      </tr>
      <tr>
        <td class="category">COST<br><span style="font-size: 0.8em;">Goal: <5%</span></td>
        <td class="status-yellow">Yellow</td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-red">Red</td>
        <td>Overtime % above target on Friday</td>
      </tr>
      <tr>
        <td class="category">PEOPLE<br><span style="font-size: 0.8em;">Goal: 95%</span></td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-green">Green</td>
        <td class="status-yellow">Yellow</td>
        <td>Training compliance on track</td>
      </tr>
    </tbody>
  </table>

  <!-- CI Action Items -->
  <div class="action-title">CI Action Items</div>
  <div style="text-align: center; margin-bottom: 10px;">
    <p>Better Every Day – Focus on what you can do today to improve for tomorrow</p>
    <p style="font-size: 0.8em;">No action should be longer than 7 days!</p>
  </div>
  
  <table class="action-log">
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

  <!-- Hidden placeholders for tier integration -->
  <!-- TIER_INTEGRATION: Metrics aggregation point for Tier 2 -->
  <!-- TIER_INTEGRATION: Action items rollup for Tier 2 -->
</body>
</html>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHTML = () => {
    const element = document.createElement('a');
    const file = new Blob([htmlTemplate], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = "gemba_board_sharepoint.html";
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
          Export Options
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export Gemba Board</DialogTitle>
          <DialogDescription>
            Export your Gemba Board data in different formats
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="excel">Excel Export</TabsTrigger>
            <TabsTrigger value="html">HTML Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="excel" className="mt-4">
            <div className="space-y-4">
              <div className="grid w-full gap-2">
                <Label>Select Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <FileExcel className="mr-2 h-4 w-4" />
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
                <FileExcel className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="html" className="mt-4">
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto h-96 text-sm">
                {htmlTemplate}
              </pre>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? "Copied!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button onClick={downloadHTML}>Download HTML</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SharePointExport;
