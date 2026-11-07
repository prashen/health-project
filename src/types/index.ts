export type RelationshipType = 
  | 'Daughter' 
  | 'Son' 
  | 'Father' 
  | 'Mother' 
  | 'Partner' 
  | 'Self' 
  | 'Grandparent' 
  | 'Sibling' 
  | 'Other';

export interface Person {
  id: string;
  name: string;
  relationship: RelationshipType;
  gender: 'female' | 'male' | 'other';
  birthDate: string; // YYYY-MM-DD
  expectedLifespanYears: number; // default 85-95
  passedDate?: string; // optional if deceased
  bloodGroup?: string;
  avatarColor: string;
  bio?: string;
  currentHeightCm?: number;
  currentWeightKg?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string; // hex or tailwind token
  icon: string;
  description?: string;
  isDefault?: boolean;
}

export type MilestoneStatus = 'completed' | 'in_progress' | 'planned' | 'deadline';
export type MilestoneImportance = 'major' | 'key' | 'routine';

export interface Milestone {
  id: string;
  personId: string;
  title: string;
  date: string; // YYYY-MM-DD
  categoryId: string;
  description: string;
  status: MilestoneStatus;
  importance: MilestoneImportance;
  ageAtMilestoneYears?: number;
  tags?: string[];
  location?: string;
  notes?: string;
  dueDate?: string;
  completedDate?: string;
}

export interface GrowthRecord {
  id: string;
  personId: string;
  date: string; // YYYY-MM-DD
  ageMonths: number;
  heightCm: number;
  weightKg: number;
  headCircumferenceCm?: number;
  bmi?: number;
  percentileHeight?: number;
  percentileWeight?: number;
  notes?: string;
}

export type HealthMetricType = 
  | 'blood_pressure' 
  | 'resting_hr' 
  | 'blood_sugar' 
  | 'sleep_hours' 
  | 'steps' 
  | 'body_temp' 
  | 'spo2' 
  | 'custom';

export type MetricStatus = 'optimal' | 'normal' | 'attention' | 'alert';

export interface HealthMetricLog {
  id: string;
  personId: string;
  date: string; // YYYY-MM-DD
  type: HealthMetricType;
  label: string;
  value: string; // e.g. "118/76" or "72"
  numericValue?: number; // for charts
  unit: string;
  status: MetricStatus;
  notes?: string;
}

export type OrganSystemName = 
  | 'Cardiovascular' 
  | 'Respiratory' 
  | 'Nervous & Cognitive' 
  | 'Digestive & Metabolic' 
  | 'Renal & Urinary' 
  | 'Musculoskeletal' 
  | 'Immune & Lymphatic' 
  | 'Sensory (Vision/Hearing/Dental)';

export type OrganHealthStatus = 'optimal' | 'nominal' | 'monitoring' | 'treatment';

export interface OrganSystem {
  id: string;
  personId: string;
  name: OrganSystemName;
  status: OrganHealthStatus;
  scorePercent: number; // 0 - 100
  lastCheckedDate: string;
  nextScreeningDate?: string;
  primaryMetrics: {
    label: string;
    value: string;
    status: 'normal' | 'attention';
  }[];
  clinicalNotes: string;
  observations: string[];
}

export type DeadlinePriority = 'high' | 'medium' | 'low';
export type DeadlineStatus = 'pending' | 'approaching' | 'completed' | 'overdue';

export interface DeadlineItem {
  id: string;
  personId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  categoryId: string;
  priority: DeadlinePriority;
  status: DeadlineStatus;
  notes?: string;
  linkedMilestoneId?: string;
  completedAt?: string;
}
