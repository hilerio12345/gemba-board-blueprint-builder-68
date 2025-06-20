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
  // New delivery parameters
  deliveryParams?: {
    targetPerWeek: number;
    lostDeliveries: Array<{
      day: string;
      reason: string;
      impact: string;
      mitigationPlan: string;
    }>;
    cumulativeDeliveries: number;
    weeklyTarget: number;
    monthlyTarget: number;
  };
  // Quality parameters
  qualityParams?: {
    defectRate: number;
    customerSatisfaction: number;
    reworkRate: number;
    testPassRate: number;
  };
  // Cost parameters
  costParams?: {
    budgetVariance: number;
    overtimeHours: number;
    resourceUtilization: number;
    costPerDelivery: number;
  };
  // People parameters
  peopleParams?: {
    teamSatisfaction: number;
    trainingCompliance: number;
    attendanceRate: number;
    turnoverRate: number;
  };
}

export interface ActionItem {
  id: string;
  date: Date;
  owner: string;
  issue: string;
  dueDate: Date;
  status: string;
  tier?: string;
  pdcaData?: {
    plan: string;
    do: string;
    check: string;
    act: string;
  };
}

export interface ArchivedAction {
  id: string;
  date: string;
  owner: string;
  issue: string;
  dueDate: string;
  completedDate: string;
  tier?: string;
}
