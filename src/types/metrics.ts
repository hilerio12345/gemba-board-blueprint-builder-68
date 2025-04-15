
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
}
