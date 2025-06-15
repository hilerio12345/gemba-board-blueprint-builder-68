
export interface Metric {
  id: string;
  category: string;
  goal: string;
  value: number;
  status: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
  notes: string;
  greenThreshold?: string;
  yellowThreshold?: string;
  redThreshold?: string;
  availability?: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
  };
  dayValues?: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
  };
  department?: string;
  fillRate?: number;
  totalAssigned?: number;
  filledPositions?: number;
  effectiveFillRate?: number;
  rpaAssigned?: number;
  augmentedFillRate?: number;
  directorate?: string;
  officeCode?: string;
  boardId?: string;
  lineOfProduction?: string;
}

export interface ActionItem {
  id: string;
  date: Date;
  owner: string;
  issue: string;
  dueDate: Date;
  status: string;
}
