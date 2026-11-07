import React, { useState } from 'react';
import { Person, GrowthRecord } from '../../types';
import { calculateAge } from '../../utils/lifeStages';
import { X, Ruler, Scale } from 'lucide-react';

interface AddGrowthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person;
  onSave: (record: GrowthRecord) => void;
}

export const AddGrowthRecordModal: React.FC<AddGrowthRecordModalProps> = ({
  isOpen,
  onClose,
  person,
  onSave,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const age = calculateAge(person.birthDate, date);
  const ageMonths = age.totalMonths;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !heightCm || !weightKg) return;

    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    const head = headCircumferenceCm ? parseFloat(headCircumferenceCm) : undefined;
    const bmi = h > 0 ? parseFloat((w / Math.pow(h / 100, 2)).toFixed(2)) : undefined;

    const newRecord: GrowthRecord = {
      id: `g-${Date.now()}`,
      personId: person.id,
      date,
      ageMonths,
      heightCm: h,
      weightKg: w,
      headCircumferenceCm: head,
      bmi,
      notes: notes.trim() || undefined,
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Log Growth Measurement
            </h3>
            <p className="text-xs text-slate-500">
              For {person.name} · Calculated Age: {age.formattedString} ({ageMonths} months)
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Measurement Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Length / Height (cm) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 106.5"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.05"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 17.4"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Head Circumference (cm) (optional)
            </label>
            <input
              type="number"
              step="0.1"
              value={headCircumferenceCm}
              onChange={(e) => setHeadCircumferenceCm(e.target.value)}
              placeholder="e.g. 50.1"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Clinical Notes / Doctor comments
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 4-year well checkup at clinic, healthy appetite"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
