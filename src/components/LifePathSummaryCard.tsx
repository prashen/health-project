import React from 'react';
import { Person, Milestone, OrganSystem, DeadlineItem } from '../types';
import { getLifeProgress, STANDARD_LIFE_STAGES, formatISODate } from '../utils/lifeStages';
import { Heart, Activity, Calendar, Award, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LifePathSummaryCardProps {
  person: Person;
  milestones: Milestone[];
  organSystems: OrganSystem[];
  deadlines: DeadlineItem[];
  onNavigateToTab: (tab: string) => void;
}

export const LifePathSummaryCard: React.FC<LifePathSummaryCardProps> = ({
  person,
  milestones,
  organSystems,
  deadlines,
  onNavigateToTab,
}) => {
  const { 
    ageDetail, 
    currentAgeDecimal, 
    lifespanTarget, 
    progressPercent, 
    remainingYears, 
    currentStage, 
    isPassed 
  } = getLifeProgress(person);

  const completedMilestones = milestones.filter(m => m.status === 'completed');
  const upcomingDeadlines = deadlines.filter(d => d.status !== 'completed');
  
  // Calculate aggregate organ health score
  const avgOrganScore = organSystems.length > 0 
    ? Math.round(organSystems.reduce((acc, curr) => acc + curr.scorePercent, 0) / organSystems.length)
    : 95;

  const birthYear = new Date(person.birthDate).getFullYear();
  const endYear = person.passedDate 
    ? new Date(person.passedDate).getFullYear() 
    : birthYear + lifespanTarget;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0"
            style={{ backgroundColor: person.avatarColor }}
          >
            {person.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {person.name}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                · {person.relationship} · {person.gender}
              </span>
              {person.bloodGroup && (
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  · Blood: {person.bloodGroup}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {person.bio || 'Tracking life journey, health evolution, and cherished milestones.'}
            </p>
          </div>
        </div>

        {/* Quick Vital Snapshot */}
        <div className="flex items-center gap-6 self-start md:self-auto text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          {person.currentHeightCm && (
            <div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300 uppercase tracking-wider">Height</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {person.currentHeightCm} cm
              </div>
            </div>
          )}
          {person.currentWeightKg && (
            <div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300 uppercase tracking-wider">Weight</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {person.currentWeightKg} kg
              </div>
            </div>
          )}
          <div>
            <div className="text-[10px] text-slate-600 dark:text-slate-300 uppercase tracking-wider">Organ Health</div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{avgOrganScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Life Path Bar */}
      <div className="py-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 dark:text-white font-semibold">Life Path Trajectory</span>
            <span>·</span>
            <span>Current Stage: <strong className="text-indigo-600 dark:text-indigo-400">{currentStage.name}</strong></span>
          </div>
          <div className="font-mono tabular-nums text-slate-500">
            {progressPercent.toFixed(1)}% Journey Elapsed
          </div>
        </div>

        {/* Visual Progress Track */}
        <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          {STANDARD_LIFE_STAGES.map((stage) => {
            const stageSpan = Math.min(stage.maxAge, lifespanTarget) - stage.minAge;
            if (stageSpan <= 0) return null;
            const widthPct = (stageSpan / lifespanTarget) * 100;
            return (
              <div
                key={stage.name}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: stage.color,
                  opacity: currentAgeDecimal >= stage.minAge ? 0.85 : 0.25,
                }}
                className="h-full transition-opacity border-r border-white/20"
                title={`${stage.name} (${stage.minAge}-${stage.maxAge} yrs)`}
              />
            );
          })}
        </div>

        {/* Life Path Markers */}
        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-300 mt-2">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Birth: </span>
            {formatISODate(person.birthDate)} ({birthYear})
          </div>
          <div className="text-center font-medium text-indigo-600 dark:text-indigo-400">
            ▲ Today ({ageDetail.formattedString} old)
          </div>
          <div className="text-right">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isPassed ? 'Passed' : 'Target'}: 
            </span>{' '}
            {endYear} (~{lifespanTarget} yrs)
          </div>
        </div>

        {/* Current Stage Guidance */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: currentStage.color }} 
            />
            <div className="text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white font-medium">{currentStage.name} phase:</strong>{' '}
              {currentStage.description}
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('timeline')}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View Milestones</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Grid Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Chronological Age</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {ageDetail.years}y {ageDetail.months}m
          </div>
          <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono tabular-nums mt-0.5">
            {ageDetail.totalDays.toLocaleString()} days lived
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Key Milestones</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {completedMilestones.length}
          </div>
          <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono tabular-nums mt-0.5">
            {milestones.length - completedMilestones.length} planned ahead
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>Upcoming Deadlines</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {upcomingDeadlines.length}
          </div>
          <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono tabular-nums mt-0.5">
            Checkups & enrollments
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Projected Horizon</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ~{remainingYears.toFixed(0)} yrs
          </div>
          <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono tabular-nums mt-0.5">
            Target lifespan {lifespanTarget}y
          </div>
        </div>
      </div>
    </div>
  );
};
