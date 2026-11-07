import React, { useState } from 'react';
import { Person, HealthMetricLog, HealthMetricType, MetricStatus } from '../../types';
import { X } from 'lucide-react';

interface AddHealthMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person;
  onSave: (log: HealthMetricLog) => void;
}

export const AddHealthMetricModal: React.FC<AddHealthMetricModalProps> = ({
  isOpen,
  onClose,
  person,
  onSave,
}) => {
  const [type, setType] = useState<HealthMetricType>('blood_pressure');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('mmHg');
  const [status, setStatus] = useState<MetricStatus>('optimal');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleTypeChange = (newType: HealthMetricType) => {
    setType(newType);
    switch (newType) {
      case 'blood_pressure':
        setUnit('mmHg');
        setValue('118/76');
        break;
      case 'resting_hr':
        setUnit('bpm');
        setValue('65');
        break;
      case 'blood_sugar':
        setUnit('mg/dL');
        setValue('92');
        break;
      case 'sleep_hours':
        setUnit('hrs');
        setValue('8.0');
        break;
      case 'steps':
        setUnit('steps');
        setValue('10000');
        break;
      case 'body_temp':
        setUnit('°F');
        setValue('98.6');
        break;
      case 'spo2':
        setUnit('%');
        setValue('99');
        break;
      default:
        setUnit('');
        setValue('');
    }
  };

  const getLabelForType = (t: HealthMetricType) => {
    switch (t) {
      case 'blood_pressure': return 'Blood Pressure';
      case 'resting_hr': return 'Resting Heart Rate';
      case 'blood_sugar': return 'Fasting Blood Glucose';
      case 'sleep_hours': return 'Sleep Duration';
      case 'steps': return 'Daily Step Count';
      case 'body_temp': return 'Body Temperature';
      case 'spo2': return 'Oxygen Saturation';
      default: return 'Custom Biometric';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const parsedNum = parseFloat(value.split('/')[0]);

    const newLog: HealthMetricLog = {
      id: `h-${Date.now()}`,
      personId: person.id,
      date,
      type,
      label: getLabelForType(type),
      value: value.trim(),
      numericValue: !isNaN(parsedNum) ? parsedNum : undefined,
      unit,
      status,
      notes: notes.trim() || undefined,
    };

    onSave(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Log Health Vital
            </h3>
            <p className="text-xs text-slate-500">
              For {person.name} ({person.relationship})
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
              Metric Type
            </label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as HealthMetricType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="blood_pressure">Blood Pressure (mmHg)</option>
              <option value="resting_hr">Resting Heart Rate (bpm)</option>
              <option value="sleep_hours">Sleep Duration (hrs)</option>
              <option value="blood_sugar">Blood Glucose (mg/dL)</option>
              <option value="spo2">Oxygen Saturation SpO2 (%)</option>
              <option value="body_temp">Body Temperature (°F)</option>
              <option value="steps">Daily Step Count</option>
              <option value="custom">Other Custom Metric</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Measured Value *
              </label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 118/76 or 72"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. mmHg, bpm, hrs"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date Recorded *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Clinical Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MetricStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="optimal">Optimal / Ideal</option>
                <option value="normal">Normal / Standard</option>
                <option value="attention">Needs Attention / Monitor</option>
                <option value="alert">Alert / Out of Range</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Context Notes (e.g. post-exercise, morning fasting)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Taken right after waking up, relaxed posture"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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
              Save Vital
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
