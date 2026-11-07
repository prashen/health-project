import { 
  Person, 
  Category, 
  Milestone, 
  GrowthRecord, 
  HealthMetricLog, 
  OrganSystem, 
  DeadlineItem 
} from '../types';
import { 
  INITIAL_PEOPLE, 
  INITIAL_CATEGORIES, 
  INITIAL_MILESTONES, 
  INITIAL_GROWTH_RECORDS, 
  INITIAL_HEALTH_LOGS, 
  INITIAL_ORGAN_SYSTEMS, 
  INITIAL_DEADLINES 
} from '../data/initialData';

const STORAGE_KEYS = {
  PEOPLE: 'vitapath_people_v1',
  CATEGORIES: 'vitapath_categories_v1',
  MILESTONES: 'vitapath_milestones_v1',
  GROWTH: 'vitapath_growth_v1',
  HEALTH_LOGS: 'vitapath_health_logs_v1',
  ORGAN_SYSTEMS: 'vitapath_organ_systems_v1',
  DEADLINES: 'vitapath_deadlines_v1',
  ACTIVE_PERSON_ID: 'vitapath_active_person_id_v1',
  THEME: 'vitapath_theme_v1',
};

export interface AppState {
  people: Person[];
  categories: Category[];
  milestones: Milestone[];
  growthRecords: GrowthRecord[];
  healthLogs: HealthMetricLog[];
  organSystems: OrganSystem[];
  deadlines: DeadlineItem[];
  activePersonId: string;
}

export function loadStoredData(): AppState {
  try {
    const peopleStr = localStorage.getItem(STORAGE_KEYS.PEOPLE);
    const categoriesStr = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const milestonesStr = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    const growthStr = localStorage.getItem(STORAGE_KEYS.GROWTH);
    const healthLogsStr = localStorage.getItem(STORAGE_KEYS.HEALTH_LOGS);
    const organSystemsStr = localStorage.getItem(STORAGE_KEYS.ORGAN_SYSTEMS);
    const deadlinesStr = localStorage.getItem(STORAGE_KEYS.DEADLINES);
    const activePersonIdStr = localStorage.getItem(STORAGE_KEYS.ACTIVE_PERSON_ID);

    const people: Person[] = peopleStr ? JSON.parse(peopleStr) : INITIAL_PEOPLE;
    const categories: Category[] = categoriesStr ? JSON.parse(categoriesStr) : INITIAL_CATEGORIES;
    const milestones: Milestone[] = milestonesStr ? JSON.parse(milestonesStr) : INITIAL_MILESTONES;
    const growthRecords: GrowthRecord[] = growthStr ? JSON.parse(growthStr) : INITIAL_GROWTH_RECORDS;
    const healthLogs: HealthMetricLog[] = healthLogsStr ? JSON.parse(healthLogsStr) : INITIAL_HEALTH_LOGS;
    const organSystems: OrganSystem[] = organSystemsStr ? JSON.parse(organSystemsStr) : INITIAL_ORGAN_SYSTEMS;
    const deadlines: DeadlineItem[] = deadlinesStr ? JSON.parse(deadlinesStr) : INITIAL_DEADLINES;
    const activePersonId = activePersonIdStr && people.some(p => p.id === activePersonIdStr) 
      ? activePersonIdStr 
      : people[0]?.id || 'person-maya';

    return {
      people,
      categories,
      milestones,
      growthRecords,
      healthLogs,
      organSystems,
      deadlines,
      activePersonId,
    };
  } catch (err) {
    console.error('Error reading localStorage, reverting to initial data', err);
    return {
      people: INITIAL_PEOPLE,
      categories: INITIAL_CATEGORIES,
      milestones: INITIAL_MILESTONES,
      growthRecords: INITIAL_GROWTH_RECORDS,
      healthLogs: INITIAL_HEALTH_LOGS,
      organSystems: INITIAL_ORGAN_SYSTEMS,
      deadlines: INITIAL_DEADLINES,
      activePersonId: 'person-maya',
    };
  }
}

export function saveStoredData(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(state.people));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(state.categories));
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(state.milestones));
    localStorage.setItem(STORAGE_KEYS.GROWTH, JSON.stringify(state.growthRecords));
    localStorage.setItem(STORAGE_KEYS.HEALTH_LOGS, JSON.stringify(state.healthLogs));
    localStorage.setItem(STORAGE_KEYS.ORGAN_SYSTEMS, JSON.stringify(state.organSystems));
    localStorage.setItem(STORAGE_KEYS.DEADLINES, JSON.stringify(state.deadlines));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PERSON_ID, state.activePersonId);
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function exportDataAsJSON(state: AppState) {
  const exportPayload = {
    appName: 'VitaPath Family Archive',
    exportedAt: new Date().toISOString(),
    version: '1.0',
    data: state,
  };
  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vitapath_family_archive_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        const data = parsed.data || parsed;
        if (!data.people || !Array.isArray(data.people)) {
          throw new Error('Invalid archive format: missing people array.');
        }
        resolve({
          people: data.people,
          categories: data.categories || INITIAL_CATEGORIES,
          milestones: data.milestones || [],
          growthRecords: data.growthRecords || [],
          healthLogs: data.healthLogs || [],
          organSystems: data.organSystems || [],
          deadlines: data.deadlines || [],
          activePersonId: data.activePersonId || data.people[0]?.id || 'person-maya',
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function resetToDemoData(): AppState {
  localStorage.removeItem(STORAGE_KEYS.PEOPLE);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.MILESTONES);
  localStorage.removeItem(STORAGE_KEYS.GROWTH);
  localStorage.removeItem(STORAGE_KEYS.HEALTH_LOGS);
  localStorage.removeItem(STORAGE_KEYS.ORGAN_SYSTEMS);
  localStorage.removeItem(STORAGE_KEYS.DEADLINES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_PERSON_ID);
  return {
    people: INITIAL_PEOPLE,
    categories: INITIAL_CATEGORIES,
    milestones: INITIAL_MILESTONES,
    growthRecords: INITIAL_GROWTH_RECORDS,
    healthLogs: INITIAL_HEALTH_LOGS,
    organSystems: INITIAL_ORGAN_SYSTEMS,
    deadlines: INITIAL_DEADLINES,
    activePersonId: 'person-maya',
  };
}
