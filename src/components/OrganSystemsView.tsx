import React, { useState } from 'react';
import { Person, OrganSystem, OrganHealthStatus } from '../types';
import { formatISODate } from '../utils/lifeStages';
import { 
  Heart, 
  Wind, 
  Brain, 
  Apple, 
  Droplet, 
  Bone, 
  ShieldCheck, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Activity
} from 'lucide-react';

interface OrganSystemsViewProps {
  person: Person;
  organSystems: OrganSystem[];
  onOpenUpdateOrgan: (organ: OrganSystem) => void;
}

export const OrganSystemsView: React.FC<OrganSystemsViewProps> = ({
  person,
  organSystems,
  onOpenUpdateOrgan,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const personOrgans = organSystems.filter(o => o.personId === person.id);

  const filteredOrgans = personOrgans.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const getOrganIcon = (name: string) => {
    switch (name) {
      case 'Cardiovascular': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Respiratory': return <Wind className="w-5 h-5 text-sky-500" />;
      case 'Nervous & Cognitive': return <Brain className="w-5 h-5 text-indigo-500" />;
      case 'Digestive & Metabolic': return <Apple className="w-5 h-5 text-amber-500" />;
      case 'Renal & Urinary': return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'Musculoskeletal': return <Bone className="w-5 h-5 text-slate-500" />;
      case 'Immune & Lymphatic': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Sensory (Vision/Hearing/Dental)': return <Eye className="w-5 h-5 text-purple-500" />;
      default: return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: OrganHealthStatus) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal Function</span>
          </span>
        );
      case 'nominal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <span>Nominal / Healthy</span>
          </span>
        );
      case 'monitoring':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Under Clinical Observation</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Requires Medical Attention</span>
          </span>
        );
    }
  };

  const avgScore = personOrgans.length > 0
    ? Math.round(personOrgans.reduce((a, b) => a + b.scorePercent, 0) / personOrgans.length)
    : 95;

  return (
    <div className="space-y-6">
      
      {/* Header Card with Overall System Health */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Physiological Body Systems & Organ Functions
              </h2>
              <span className="text-xs text-slate-500">
                · {person.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Clinical tracking of vital organ systems across the lifespan, including cardiovascular rhythm, neurodevelopment, respiratory status, musculoskeletal alignment, and metabolic tone.
            </p>
          </div>

          {/* Aggregate Organ Index */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg font-mono">
              {avgScore}%
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Overall Systems Index</div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                {avgScore >= 90 ? 'All Systems Robust' : 'Nominal Monitoring'}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-300">
                {personOrgans.length} systems assessed
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Systems ({personOrgans.length})
            </button>
            <button
              onClick={() => setFilterStatus('optimal')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'optimal'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Optimal ({personOrgans.filter(o => o.status === 'optimal').length})
            </button>
            <button
              onClick={() => setFilterStatus('monitoring')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'monitoring'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Observation ({personOrgans.filter(o => o.status === 'monitoring').length})
            </button>
          </div>
        </div>
      </div>

      {/* Organ Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrgans.map((organ) => (
          <div
            key={organ.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                    {getOrganIcon(organ.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      {organ.name}
                    </h3>
                    <div className="mt-0.5">
                      {getStatusBadge(organ.status)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {organ.scorePercent}%
                    </span>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300">Health Index</div>
                  </div>

                  <button
                    onClick={() => onOpenUpdateOrgan(organ)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Update Organ Assessment"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary Key Metrics */}
              {organ.primaryMetrics && organ.primaryMetrics.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {organ.primaryMetrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 truncate">{m.label}</div>
                      <div className="font-semibold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5 text-[11px] truncate">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Clinical Notes */}
              <div className="mt-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="font-medium text-slate-800 dark:text-slate-200">Doctor Note: </span>
                {organ.clinicalNotes}
              </div>

              {/* Clinical Observations Bullet Points */}
              {organ.observations && organ.observations.length > 0 && (
                <div className="mt-3 space-y-1">
                  {organ.observations.map((obs, i) => (
                    <div key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Dates */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <div>
                Last evaluated: {formatISODate(organ.lastCheckedDate)}
              </div>
              {organ.nextScreeningDate && (
                <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                  Next exam: {formatISODate(organ.nextScreeningDate)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
