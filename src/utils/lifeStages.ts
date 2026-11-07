import { Person } from '../types';

export interface AgeDetail {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  formattedString: string;
}

export interface LifeStage {
  name: string;
  minAge: number;
  maxAge: number;
  color: string;
  description: string;
}

export const STANDARD_LIFE_STAGES: LifeStage[] = [
  { name: 'Infancy', minAge: 0, maxAge: 2, color: '#06b6d4', description: 'Early sensory-motor development, bonding & physical growth' },
  { name: 'Early Childhood', minAge: 2, maxAge: 5, color: '#3b82f6', description: 'Language fluency, imaginative play & foundational motor coordination' },
  { name: 'Middle Childhood', minAge: 5, maxAge: 12, color: '#6366f1', description: 'Primary education, social relationships & cognitive reasoning' },
  { name: 'Adolescence', minAge: 12, maxAge: 18, color: '#8b5cf6', description: 'Identity exploration, secondary schooling & physical maturation' },
  { name: 'Young Adulthood', minAge: 18, maxAge: 30, color: '#ec4899', description: 'Higher learning, career launch, independence & life partnership' },
  { name: 'Prime Adulthood', minAge: 30, maxAge: 50, color: '#f59e0b', description: 'Career mastery, family nurturing, leadership & mentorship' },
  { name: 'Mature Adulthood', minAge: 50, maxAge: 65, color: '#10b981', description: 'Consolidation of wisdom, legacy planning & active longevity' },
  { name: 'Golden Years', minAge: 65, maxAge: 85, color: '#14b8a6', description: 'Retirement, lifelong passions, grandparenting & reflection' },
  { name: 'Centenarian Legacy', minAge: 85, maxAge: 120, color: '#64748b', description: 'Centenarian longevity, generational storytelling & living heritage' },
];

export function calculateAge(birthDateStr: string, targetDateStr?: string): AgeDetail {
  const birth = new Date(birthDateStr);
  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
    return { years: 0, months: 0, days: 0, totalMonths: 0, totalDays: 0, formattedString: '0 days' };
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = target.getTime() - birth.getTime();
  const totalDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const totalMonths = Math.max(0, years * 12 + months);

  let formatted = '';
  if (years > 0) {
    formatted = `${years} yr${years === 1 ? '' : 's'}${months > 0 ? `, ${months} mo${months === 1 ? '' : 's'}` : ''}`;
  } else if (months > 0) {
    formatted = `${months} mo${months === 1 ? '' : 's'}${days > 0 ? `, ${days} d` : ''}`;
  } else {
    formatted = `${days} day${days === 1 ? '' : 's'}`;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalMonths,
    totalDays,
    formattedString: formatted,
  };
}

export function getCurrentLifeStage(ageYears: number): LifeStage {
  for (const stage of STANDARD_LIFE_STAGES) {
    if (ageYears >= stage.minAge && ageYears < stage.maxAge) {
      return stage;
    }
  }
  return STANDARD_LIFE_STAGES[STANDARD_LIFE_STAGES.length - 1];
}

export function getLifeProgress(person: Person) {
  const endDateStr = person.passedDate || undefined;
  const ageDetail = calculateAge(person.birthDate, endDateStr);
  const currentAgeDecimal = ageDetail.years + ageDetail.months / 12 + ageDetail.days / 365.25;
  const lifespanTarget = person.expectedLifespanYears || 90;
  const progressPercent = Math.min(100, Math.max(0, (currentAgeDecimal / lifespanTarget) * 100));
  const remainingYears = Math.max(0, lifespanTarget - currentAgeDecimal);

  const currentStage = getCurrentLifeStage(currentAgeDecimal);

  return {
    ageDetail,
    currentAgeDecimal,
    lifespanTarget,
    progressPercent,
    remainingYears,
    currentStage,
    isPassed: Boolean(person.passedDate),
  };
}

export function formatISODate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getDaysDifference(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  const now = new Date();
  // Strip hours
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((targetDay - currentDay) / (1000 * 60 * 60 * 24));
}
