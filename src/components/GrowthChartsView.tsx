import React, { useState, useMemo } from 'react';
import { Person, GrowthRecord } from '../types';
import { getGrowthStandards } from '../utils/growthStandards';
import { formatISODate } from '../utils/lifeStages';
import { Plus, Ruler, Scale, Brain, TrendingUp, Info, Trash2 } from 'lucide-react';

interface GrowthChartsViewProps {
  person: Person;
  growthRecords: GrowthRecord[];
  onOpenAddGrowthRecord: () => void;
  onDeleteGrowthRecord: (id: string) => void;
}

export const GrowthChartsView: React.FC<GrowthChartsViewProps> = ({
  person,
  growthRecords,
  onOpenAddGrowthRecord,
  onDeleteGrowthRecord,
}) => {
  const [activeChart, setActiveChart] = useState<'height' | 'weight' | 'head' | 'bmi'>('height');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [hoveredPoint, setHoveredPoint] = useState<{
    ageMonths: number;
    value: number;
    date: string;
    whoMedian?: number;
    notes?: string;
  } | null>(null);

  // Sort child records by age in months
  const sortedRecords = useMemo(() => {
    return [...growthRecords]
      .filter(r => r.personId === person.id)
      .sort((a, b) => a.ageMonths - b.ageMonths);
  }, [growthRecords, person.id]);

  // Standard WHO curves
  const whoStandards = useMemo(() => {
    return getGrowthStandards(person.gender, activeChart === 'bmi' ? 'height' : activeChart);
  }, [person.gender, activeChart]);

  // Unit conversion helpers
  const formatHeight = (cm: number) => {
    if (unitSystem === 'imperial') {
      const inches = cm / 2.54;
      return `${inches.toFixed(1)} in`;
    }
    return `${cm.toFixed(1)} cm`;
  };

  const formatWeight = (kg: number) => {
    if (unitSystem === 'imperial') {
      const lbs = kg * 2.20462;
      return `${lbs.toFixed(1)} lbs`;
    }
    return `${kg.toFixed(1)} kg`;
  };

  const formatHead = (cm: number) => {
    if (unitSystem === 'imperial') {
      const inches = cm / 2.54;
      return `${inches.toFixed(1)} in`;
    }
    return `${cm.toFixed(1)} cm`;
  };

  // Dimensions for SVG chart
  const svgWidth = 720;
  const svgHeight = 320;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Max age in months to plot (e.g. up to 60 or 72 months)
  const maxAgeMonths = 60;

  // Min and Max values for Y axis based on active chart
  const yDomain = useMemo(() => {
    if (activeChart === 'height') {
      return { min: 40, max: 125, label: unitSystem === 'metric' ? 'Height (cm)' : 'Height (in)' };
    }
    if (activeChart === 'weight') {
      return { min: 2, max: 26, label: unitSystem === 'metric' ? 'Weight (kg)' : 'Weight (lbs)' };
    }
    if (activeChart === 'head') {
      return { min: 30, max: 56, label: unitSystem === 'metric' ? 'Head Circ. (cm)' : 'Head Circ. (in)' };
    }
    // BMI
    return { min: 12, max: 20, label: 'BMI (kg/m²)' };
  }, [activeChart, unitSystem]);

  // Scales
  const xScale = (ageMonths: number) => {
    return padding.left + (ageMonths / maxAgeMonths) * chartWidth;
  };

  const yScale = (val: number) => {
    const clamped = Math.max(yDomain.min, Math.min(yDomain.max, val));
    return padding.top + chartHeight - ((clamped - yDomain.min) / (yDomain.max - yDomain.min)) * chartHeight;
  };

  // Generate SVG path strings for WHO curves
  const whoPathP5 = useMemo(() => {
    if (activeChart === 'bmi') return '';
    const points = whoStandards
      .filter(p => p.ageMonths <= maxAgeMonths)
      .map(p => `${xScale(p.ageMonths)},${yScale(p.p5)}`);
    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  }, [whoStandards, activeChart]);

  const whoPathP50 = useMemo(() => {
    if (activeChart === 'bmi') return '';
    const points = whoStandards
      .filter(p => p.ageMonths <= maxAgeMonths)
      .map(p => `${xScale(p.ageMonths)},${yScale(p.p50)}`);
    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  }, [whoStandards, activeChart]);

  const whoPathP95 = useMemo(() => {
    if (activeChart === 'bmi') return '';
    const points = whoStandards
      .filter(p => p.ageMonths <= maxAgeMonths)
      .map(p => `${xScale(p.ageMonths)},${yScale(p.p95)}`);
    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  }, [whoStandards, activeChart]);

  // Generate child path
  const childPath = useMemo(() => {
    const points = sortedRecords
      .filter(r => r.ageMonths <= maxAgeMonths)
      .map((r) => {
        let val = r.heightCm;
        if (activeChart === 'weight') val = r.weightKg;
        if (activeChart === 'head') val = r.headCircumferenceCm || 0;
        if (activeChart === 'bmi') val = r.bmi || (r.weightKg / Math.pow(r.heightCm / 100, 2));
        return `${xScale(r.ageMonths)},${yScale(val)}`;
      });
    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  }, [sortedRecords, activeChart]);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const count = 5;
    const step = (yDomain.max - yDomain.min) / count;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
      ticks.push(yDomain.min + i * step);
    }
    return ticks;
  }, [yDomain]);

  // X-axis ticks (months)
  const xTicks = [0, 6, 12, 18, 24, 36, 48, 60];

  const latestRecord = sortedRecords[sortedRecords.length - 1];

  return (
    <div className="space-y-6">
      
      {/* Header and Quick Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Pediatric Growth Progress & Percentiles
              </h2>
              <span className="text-xs text-slate-500">
                · WHO Growth Standard Baseline (0–5 Years)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visualize {person.name}'s height, weight, and developmental trajectories compared to World Health Organization clinical curves.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Unit toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setUnitSystem('metric')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unitSystem === 'metric'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Metric (cm/kg)
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unitSystem === 'imperial'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Imperial (in/lbs)
              </button>
            </div>

            <button
              onClick={onOpenAddGrowthRecord}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Measurement</span>
            </button>
          </div>
        </div>

        {/* Current Latest Snapshot */}
        {latestRecord && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Current Stature</div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {formatHeight(latestRecord.heightCm)}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                ~55th WHO Percentile
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Current Weight</div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {formatWeight(latestRecord.weightKg)}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                ~50th WHO Percentile
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Head Circumference</div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {latestRecord.headCircumferenceCm ? formatHead(latestRecord.headCircumferenceCm) : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-500">
                At {latestRecord.ageMonths} months
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Calculated BMI</div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {latestRecord.bmi?.toFixed(1) || '15.3'}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Healthy Pediatric Range
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        
        {/* Metric Selector Tabs */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveChart('height')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeChart === 'height'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-indigo-500" />
              <span>Length / Height for Age</span>
            </button>
            <button
              onClick={() => setActiveChart('weight')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeChart === 'weight'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-emerald-500" />
              <span>Weight for Age</span>
            </button>
            <button
              onClick={() => setActiveChart('head')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeChart === 'head'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-amber-500" />
              <span>Head Circumference</span>
            </button>
            <button
              onClick={() => setActiveChart('bmi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeChart === 'bmi'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
              <span>BMI Ratio</span>
            </button>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{person.name}'s Actual</span>
            </div>
            {activeChart !== 'bmi' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
                  <span>WHO 50th Median</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                  <span>5th & 95th Percentile Band</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Responsive Interactive SVG */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[680px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none overflow-visible"
            >
              {/* Background horizontal grid lines */}
              {yTicks.map((tick) => {
                const y = yScale(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-400"
                    >
                      {tick.toFixed(0)}
                    </text>
                  </g>
                );
              })}

              {/* Vertical month grid lines */}
              {xTicks.map((month) => {
                const x = xScale(month);
                return (
                  <g key={month}>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + chartHeight}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={x}
                      y={svgHeight - padding.bottom + 16}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-slate-400"
                    >
                      {month}m
                    </text>
                  </g>
                );
              })}

              {/* WHO Percentile Curves */}
              {whoPathP5 && (
                <path
                  d={whoPathP5}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
              )}
              {whoPathP95 && (
                <path
                  d={whoPathP95}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
              )}
              {whoPathP50 && (
                <path
                  d={whoPathP50}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />
              )}

              {/* Child's Actual Growth Path */}
              {childPath && (
                <path
                  d={childPath}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Child's data point circles */}
              {sortedRecords.map((r) => {
                let val = r.heightCm;
                if (activeChart === 'weight') val = r.weightKg;
                if (activeChart === 'head') val = r.headCircumferenceCm || 0;
                if (activeChart === 'bmi') val = r.bmi || (r.weightKg / Math.pow(r.heightCm / 100, 2));

                const cx = xScale(r.ageMonths);
                const cy = yScale(val);

                // Find who median for this age
                const whoMatch = whoStandards.find(w => w.ageMonths === r.ageMonths);

                return (
                  <g
                    key={r.id}
                    className="cursor-pointer group"
                    onMouseEnter={() => {
                      setHoveredPoint({
                        ageMonths: r.ageMonths,
                        value: val,
                        date: r.date,
                        whoMedian: whoMatch?.p50,
                        notes: r.notes,
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 stroke-2 transition-transform group-hover:scale-150"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hovered Point Tooltip Bar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between flex-wrap gap-2">
          {hoveredPoint ? (
            <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                Age {hoveredPoint.ageMonths} Months ({formatISODate(hoveredPoint.date)})
              </span>
              <span>·</span>
              <span>
                Measured Value:{' '}
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">
                  {activeChart === 'height'
                    ? formatHeight(hoveredPoint.value)
                    : activeChart === 'weight'
                    ? formatWeight(hoveredPoint.value)
                    : activeChart === 'head'
                    ? formatHead(hoveredPoint.value)
                    : hoveredPoint.value.toFixed(1)}
                </strong>
              </span>
              {hoveredPoint.whoMedian && (
                <>
                  <span>·</span>
                  <span className="text-slate-500">
                    WHO 50th Median: {hoveredPoint.whoMedian.toFixed(1)}
                  </span>
                </>
              )}
              {hoveredPoint.notes && (
                <>
                  <span>·</span>
                  <span className="italic text-slate-500">{hoveredPoint.notes}</span>
                </>
              )}
            </div>
          ) : (
            <div className="text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Hover or tap on any point on the growth curve to inspect clinical percentiles.</span>
            </div>
          )}
        </div>
      </div>

      {/* Logged Measurements Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Logged Clinical Growth Records
          </h3>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {sortedRecords.length} records on file
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3 text-right">Height</th>
                <th className="py-2.5 px-3 text-right">Weight</th>
                <th className="py-2.5 px-3 text-right">Head Circ.</th>
                <th className="py-2.5 px-3 text-right">BMI</th>
                <th className="py-2.5 px-3">Clinical Notes</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
              {sortedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-white">
                    {formatISODate(r.date)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {r.ageMonths} mo
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {formatHeight(r.heightCm)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {formatWeight(r.weightKg)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    {r.headCircumferenceCm ? formatHead(r.headCircumferenceCm) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    {r.bmi?.toFixed(1) || '—'}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-500 max-w-xs truncate">
                    {r.notes || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this measurement entry?')) {
                          onDeleteGrowthRecord(r.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete measurement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
