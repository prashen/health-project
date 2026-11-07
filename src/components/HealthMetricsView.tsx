import React, { useState } from 'react';
import { Person, HealthMetricLog } from '../types';
import { formatISODate } from '../utils/lifeStages';
import { Plus, Heart, Activity, Moon, Zap, Thermometer, Droplet, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';

interface HealthMetricsViewProps {
  person: Person;
  healthLogs: HealthMetricLog[];
  onOpenAddHealthLog: () => void;
  onDeleteHealthLog: (id: string) => void;
}

export const HealthMetricsView: React.FC<HealthMetricsViewProps> = ({
  person,
  healthLogs,
  onOpenAddHealthLog,
  onDeleteHealthLog,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const personLogs = healthLogs
    .filter(l => l.personId === person.id)
    .filter(l => selectedType === 'all' || l.type === selectedType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Activity className="w-4 h-4 text-rose-500" />;
      case 'resting_hr': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'blood_sugar': return <Droplet className="w-4 h-4 text-amber-500" />;
      case 'sleep_hours': return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'steps': return <Zap className="w-4 h-4 text-emerald-500" />;
      case 'body_temp': return <Thermometer className="w-4 h-4 text-orange-500" />;
      case 'spo2': return <Activity className="w-4 h-4 text-cyan-500" />;
      default: return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            <span>Optimal</span>
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 dark:text-indigo-400">
            <span>Nominal</span>
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Monitor</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Alert</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Biometric Vitals & Clinical Health Telemetry</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking ongoing physiological parameters, cardiovascular tone, sleep cycles, and daily activity.
          </p>
        </div>

        <button
          onClick={onOpenAddHealthLog}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Health Metric</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {['all', 'blood_pressure', 'resting_hr', 'sleep_hours', 'blood_sugar', 'spo2', 'steps'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium capitalize ${
              selectedType === type
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Health Vitals Table */}
      {personLogs.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          No health logs recorded yet for {person.name}. Click "Log Health Metric" to record vitals like blood pressure, resting heart rate, or sleep.
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3 text-right">Value</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Clinical Assessment</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {personLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {formatISODate(log.date)}
                  </td>
                  <td className="py-2.5 px-3 flex items-center gap-2 whitespace-nowrap">
                    {getMetricIcon(log.type)}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {log.value} <span className="text-[10px] font-normal text-slate-500">{log.unit}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-sm truncate">
                    {log.notes || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this health metric log?')) {
                          onDeleteHealthLog(log.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
