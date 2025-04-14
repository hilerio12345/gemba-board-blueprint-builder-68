
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

const ExportHtml = () => {
  const [isExporting, setIsExporting] = useState(false);

  const generateSharePointHtml = () => {
    setIsExporting(true);
    
    // This would contain the actual HTML generation logic
    const html = `<!DOCTYPE html>
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
    
    /* Status indicators */
    .status {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
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
      <tr>
        <td colspan="5" style="text-align: center;">
          <button style="padding: 5px 10px; background: #f0f0f0; border: 1px solid #ddd; cursor: pointer;">
            Add New Action Item
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  
  <div class="footer">
    <p>Gemba Board Blueprint Builder | Version 1.0</p>
    <p>Electronic Gemba Board for multi-tiered Lean Management System | SharePoint-compatible</p>
    <!-- TIER_INTEGRATION: This is where data will be sent to Tier 2 dashboards -->
    <!-- TIER_INTEGRATION: This is where aggregated metrics will be compiled -->
  </div>

</body>
</html>`;
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([html], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = "gemba_board_sharepoint.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setIsExporting(false);
  };

  return (
    <Button 
      onClick={generateSharePointHtml}
      disabled={isExporting}
      variant="outline"
      className="border-blue-200"
    >
      <FileDown className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "Export HTML"}
    </Button>
  );
};

export default ExportHtml;
