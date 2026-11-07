import React, { useState, useMemo } from 'react';
import { Person, Milestone } from '../types';
import { calculateAge, getCurrentLifeStage, formatISODate } from '../utils/lifeStages';
import { Calendar, Users, Sparkles, ChevronRight, Info } from 'lucide-react';

interface FamilyComparisonTimelineProps {
  people: Person[];
  milestones: Milestone[];
  onSelectPerson: (id: string) => void;
}

export const FamilyComparisonTimeline: React.FC<FamilyComparisonTimelineProps> = ({
  people,
  milestones,
  onSelectPerson,
}) => {
  const currentYear = new Date().getFullYear();

  // Find min birth year and max target year
  const { minYear, maxYear } = useMemo(() => {
    let min = currentYear;
    let max = currentYear + 60;
    people.forEach((p) => {
      const bYear = new Date(p.birthDate).getFullYear();
      if (bYear < min) min = bYear;
      const targetEndYear = bYear + (p.expectedLifespanYears || 90);
      if (targetEndYear > max) max = targetEndYear;
    });
    return { minYear: Math.max(1950, min - 2), maxYear: Math.min(2120, max + 2) };
  }, [people, currentYear]);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Group milestones by year
  const milestonesByYear = useMemo(() => {
    const map = new Map<number, Milestone[]>();
    milestones.forEach((m) => {
      const y = new Date(m.date).getFullYear();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(m);
    });
    return map;
  }, [milestones]);

  const milestonesInSelectedYear = milestonesByYear.get(selectedYear) || [];

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Multi-Generational Synchronized Matrix</span>
            </div>
            <h2 className="text-xl font-bold mt-1 tracking-tight">
              Shared Family Lifespan & Generational Horizon
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Track how your daughter's life path intertwines with yours over time. Explore ages across generations at any calendar year from {minYear} to {maxYear}.
            </p>
          </div>

          {/* Year Scrubber Dial */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shrink-0 text-center">
            <div className="text-[10px] uppercase font-mono text-indigo-200">Selected Calendar Year</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white my-0.5">
              {selectedYear}
            </div>
            <div className="text-[10px] text-slate-300">
              {selectedYear === currentYear ? 'Current Year' : selectedYear > currentYear ? `+${selectedYear - currentYear} yrs in future` : `${currentYear - selectedYear} yrs ago`}
            </div>
          </div>
        </div>

        {/* Interactive Year Slider */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-400 mb-2">
            <span>{minYear}</span>
            <span className="text-indigo-300 font-semibold">{selectedYear}</span>
            <span>{maxYear}</span>
          </div>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          {/* Quick Year Jump Buttons */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
            {[2022, 2026, 2030, 2040, 2050, 2060].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono tabular-nums transition-colors ${
                  selectedYear === yr
                    ? 'bg-indigo-500 text-white font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {yr} {yr === 2022 ? '(Daughter Born)' : yr === 2026 ? '(Today)' : yr === 2040 ? '(Daughter 18)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized People Cards at Selected Year */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Family Age & Stage Snapshot in {selectedYear}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {people.map((person) => {
            const birthYear = new Date(person.birthDate).getFullYear();
            const targetEndYear = birthYear + (person.expectedLifespanYears || 90);
            const isBorn = selectedYear >= birthYear;
            const isExceeded = selectedYear > targetEndYear;
            const ageInYear = isBorn ? selectedYear - birthYear : 0;
            const stage = getCurrentLifeStage(ageInYear);

            return (
              <div
                key={person.id}
                onClick={() => onSelectPerson(person.id)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0"
                      style={{ backgroundColor: person.avatarColor }}
                    >
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {person.name}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300">
                        {person.relationship}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                    b. {birthYear}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/60">
                  {!isBorn ? (
                    <div className="text-xs font-medium text-slate-400 dark:text-slate-500 italic">
                      Not yet born (born in {birthYear - selectedYear} yrs)
                    </div>
                  ) : isExceeded ? (
                    <div className="text-xs font-medium text-slate-500">
                      Beyond target lifespan ({targetEndYear})
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                          Age {ageInYear}
                        </span>
                        <span 
                          className="text-xs font-semibold"
                          style={{ color: stage.color }}
                        >
                          {stage.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {stage.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lifespan Bars Parallel Overlay */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
          Parallel Lifespan Horizons ({minYear} – {maxYear})
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Visual comparison showing where each family member's journey started, active overlap periods, and shared milestones.
        </p>

        <div className="space-y-6">
          {people.map((person) => {
            const birthYear = new Date(person.birthDate).getFullYear();
            const endYear = birthYear + (person.expectedLifespanYears || 90);
            
            const totalSpan = maxYear - minYear;
            const leftPct = ((birthYear - minYear) / totalSpan) * 100;
            const widthPct = ((endYear - birthYear) / totalSpan) * 100;
            const currentPositionPct = ((selectedYear - minYear) / totalSpan) * 100;

            const personMilestones = milestones.filter(m => m.personId === person.id);

            return (
              <div key={person.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: person.avatarColor }} 
                    />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {person.name} ({person.relationship})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    {birthYear} → {endYear} ({person.expectedLifespanYears}y target)
                  </span>
                </div>

                {/* Bar Container */}
                <div className="relative w-full h-7 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-visible">
                  {/* Active lifespan bar */}
                  <div
                    className="absolute top-0 bottom-0 rounded-lg opacity-85 shadow-xs transition-all"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      backgroundColor: person.avatarColor,
                    }}
                  >
                    {/* Milestone Dots on Person's Bar */}
                    {personMilestones.map((m) => {
                      const mYear = new Date(m.date).getFullYear();
                      const dotPct = ((mYear - birthYear) / (endYear - birthYear)) * 100;
                      if (dotPct < 0 || dotPct > 100) return null;
                      return (
                        <div
                          key={m.id}
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-xs cursor-pointer hover:scale-150 transition-transform"
                          style={{ left: `${dotPct}%` }}
                          title={`${m.title} (${mYear})`}
                        />
                      );
                    })}
                  </div>

                  {/* Selected Year Indicator Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-indigo-600 dark:bg-indigo-400 z-10"
                    style={{ left: `${currentPositionPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Year Milestones highlight */}
        {milestonesInSelectedYear.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Milestones Recorded in {selectedYear}:
            </h4>
            <div className="space-y-2">
              {milestonesInSelectedYear.map((m) => {
                const author = people.find(p => p.id === m.personId);
                return (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {m.title}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 text-[11px] ml-2">
                        · {author?.name} · {formatISODate(m.date)}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {m.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
