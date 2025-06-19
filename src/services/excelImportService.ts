
import * as XLSX from 'xlsx';
import { Metric, ActionItem } from '../types/metrics';

export interface ExcelImportResult {
  metrics?: Metric[];
  actionItems?: ActionItem[];
  errors: string[];
}

export const importFromExcel = async (file: File): Promise<ExcelImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result: ExcelImportResult = { errors: [] };
        
        // Process Metrics sheet if it exists
        if (workbook.SheetNames.includes('Metrics')) {
          const metricsSheet = workbook.Sheets['Metrics'];
          const metricsData = XLSX.utils.sheet_to_json(metricsSheet);
          result.metrics = processMetricsData(metricsData);
        }
        
        // Process Action Items sheet if it exists
        if (workbook.SheetNames.includes('ActionItems') || workbook.SheetNames.includes('Action Items')) {
          const actionItemsSheetName = workbook.SheetNames.includes('ActionItems') ? 'ActionItems' : 'Action Items';
          const actionItemsSheet = workbook.Sheets[actionItemsSheetName];
          const actionItemsData = XLSX.utils.sheet_to_json(actionItemsSheet);
          result.actionItems = processActionItemsData(actionItemsData);
        }
        
        if (!result.metrics && !result.actionItems) {
          result.errors.push('No valid data sheets found. Please ensure your Excel file contains "Metrics" or "ActionItems" sheets.');
        }
        
        resolve(result);
      } catch (error) {
        resolve({
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`]
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  });
};

const processMetricsData = (data: any[]): Metric[] => {
  const metrics: Metric[] = [];
  
  data.forEach((row, index) => {
    try {
      const metric: Metric = {
        id: row.id || `imported-${index + 1}`,
        category: row.category || '',
        goal: row.goal || '',
        value: parseFloat(row.value) || 0,
        status: {
          monday: row.monday || 'gray',
          tuesday: row.tuesday || 'gray',
          wednesday: row.wednesday || 'gray',
          thursday: row.thursday || 'gray',
          friday: row.friday || 'gray'
        },
        notes: row.notes || '',
        greenThreshold: row.greenThreshold,
        yellowThreshold: row.yellowThreshold,
        redThreshold: row.redThreshold
      };
      
      if (metric.category) {
        metrics.push(metric);
      }
    } catch (error) {
      console.warn(`Error processing metric row ${index + 1}:`, error);
    }
  });
  
  return metrics;
};

const processActionItemsData = (data: any[]): ActionItem[] => {
  const actionItems: ActionItem[] = [];
  
  data.forEach((row, index) => {
    try {
      const actionItem: ActionItem = {
        id: row.id || `imported-action-${index + 1}`,
        date: row.date ? new Date(row.date) : new Date(),
        owner: row.owner || '',
        issue: row.issue || '',
        dueDate: row.dueDate ? new Date(row.dueDate) : new Date(),
        status: row.status || 'Open',
        tier: row.tier
      };
      
      if (actionItem.issue && actionItem.owner) {
        actionItems.push(actionItem);
      }
    } catch (error) {
      console.warn(`Error processing action item row ${index + 1}:`, error);
    }
  });
  
  return actionItems;
};

export const generateExcelTemplate = (): void => {
  const metricsTemplate = [
    {
      id: '1',
      category: 'AVAILABILITY',
      goal: 'Goal: 100%',
      value: 98,
      monday: 'green',
      tuesday: 'green',
      wednesday: 'yellow',
      thursday: 'green',
      friday: 'green',
      notes: 'Systems available throughout the week',
      greenThreshold: '≥ 98%',
      yellowThreshold: '90-97%',
      redThreshold: '< 90%'
    }
  ];
  
  const actionItemsTemplate = [
    {
      id: '1',
      date: '2025-04-10',
      owner: 'J. Smith',
      issue: 'Training documentation needs update',
      dueDate: '2025-04-17',
      status: 'In Progress',
      tier: 'Tier 1'
    }
  ];
  
  const wb = XLSX.utils.book_new();
  const metricsWs = XLSX.utils.json_to_sheet(metricsTemplate);
  const actionItemsWs = XLSX.utils.json_to_sheet(actionItemsTemplate);
  
  XLSX.utils.book_append_sheet(wb, metricsWs, 'Metrics');
  XLSX.utils.book_append_sheet(wb, actionItemsWs, 'ActionItems');
  
  XLSX.writeFile(wb, 'gemba-board-template.xlsx');
};
