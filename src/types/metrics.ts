
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
  department?: string; // Added department field
  fillRate?: number;   // Added fill rate field for staffing metrics
  totalAssigned?: number; // Total assigned positions
  filledPositions?: number; // Filled positions count
  effectiveFillRate?: number; // Effective fill rate percentage
  rpaAssigned?: number; // RPA/Interns assigned count
  augmentedFillRate?: number; // Augmented fill rate
  directorate?: string; // Added directorate field
  officeCode?: string; // Added office specialty code field
}
