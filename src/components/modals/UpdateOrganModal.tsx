import React, { useState, useEffect } from 'react';
import { OrganSystem, OrganHealthStatus } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface UpdateOrganModalProps {
  isOpen: boolean;
  onClose: () => void;
  organ: OrganSystem | null;
  onSave: (updated: OrganSystem) => void;
}

export const UpdateOrganModal: React.FC<UpdateOrganModalProps> = ({
  isOpen,
  onClose,
  organ,
  onSave,
}) => {
  const [status, setStatus] = useState<OrganHealthStatus>('optimal');
  const [scorePercent, setScorePercent] = useState<number>(95);
  const [lastCheckedDate, setLastCheckedDate] = useState('');
  const [nextScreeningDate, setNextScreeningDate] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [observationsStr, setObservationsStr] = useState('');

  useEffect(() => {
    if (organ) {
      setStatus(organ.status);
      setScorePercent(organ.scorePercent);
      setLastCheckedDate(organ.lastCheckedDate);
      setNextScreeningDate(organ.nextScreeningDate || '');
      setClinicalNotes(organ.clinicalNotes);
      setObservationsStr(organ.observations ? organ.observations.join('\n') : '');
    }
  }, [organ, isOpen]);

  if (!isOpen || !organ) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const observations = observationsStr
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updated: OrganSystem = {
      ...organ,
      status,
      scorePercent: Number(scorePercent),
      lastCheckedDate,
      nextScreeningDate: nextScreeningDate || undefined,
      clinicalNotes: clinicalNotes.trim(),
      observations,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update {organ.name} System Assessment
            </h3>
            <p className="text-xs text-slate-500">
              Record clinical findings, functional score, and checkup schedules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Clinical Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrganHealthStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="optimal">Optimal Function</option>
                <option value="nominal">Nominal / Healthy</option>
                <option value="monitoring">Under Clinical Observation</option>
                <option value="treatment">Treatment / Care Required</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Functional Health Score ({scorePercent}%)
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={scorePercent}
                onChange={(e) => setScorePercent(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Last Evaluated Date *
              </label>
              <input
                type="date"
                required
                value={lastCheckedDate}
                onChange={(e) => setLastCheckedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Next Screening Due
              </label>
              <input
                type="date"
                value={nextScreeningDate}
                onChange={(e) => setNextScreeningDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Physician / Clinical Assessment Notes
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Heart sounds normal, clear bilateral lungs, rapid capillary refill..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Clinical Observations (One observation per line)
            </label>
            <textarea
              rows={3}
              value={observationsStr}
              onChange={(e) => setObservationsStr(e.target.value)}
              placeholder="e.g.
Passes pediatric hearing screening
No exercise induced wheezing
Strong peripheral pulses"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Save Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
