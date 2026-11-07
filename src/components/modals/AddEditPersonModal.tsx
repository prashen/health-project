import React, { useState, useEffect } from 'react';
import { Person, RelationshipType } from '../../types';
import { X, Trash2 } from 'lucide-react';

interface AddEditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  personToEdit?: Person | null;
  onSave: (person: Person) => void;
  onDeletePerson?: (id: string) => void;
  canDelete?: boolean;
}

const AVATAR_COLORS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#e11d48', // Rose
  '#6366f1', // Indigo
];

export const AddEditPersonModal: React.FC<AddEditPersonModalProps> = ({
  isOpen,
  onClose,
  personToEdit,
  onSave,
  onDeletePerson,
  canDelete = false,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Daughter');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [birthDate, setBirthDate] = useState('2022-06-14');
  const [expectedLifespanYears, setExpectedLifespanYears] = useState(90);
  const [hasPassed, setHasPassed] = useState(false);
  const [passedDate, setPassedDate] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [bio, setBio] = useState('');
  const [currentHeightCm, setCurrentHeightCm] = useState<string>('');
  const [currentWeightKg, setCurrentWeightKg] = useState<string>('');

  useEffect(() => {
    if (personToEdit) {
      setName(personToEdit.name);
      setRelationship(personToEdit.relationship);
      setGender(personToEdit.gender);
      setBirthDate(personToEdit.birthDate);
      setExpectedLifespanYears(personToEdit.expectedLifespanYears || 90);
      setHasPassed(Boolean(personToEdit.passedDate));
      setPassedDate(personToEdit.passedDate || '');
      setBloodGroup(personToEdit.bloodGroup || 'O+');
      setAvatarColor(personToEdit.avatarColor || AVATAR_COLORS[0]);
      setBio(personToEdit.bio || '');
      setCurrentHeightCm(personToEdit.currentHeightCm ? String(personToEdit.currentHeightCm) : '');
      setCurrentWeightKg(personToEdit.currentWeightKg ? String(personToEdit.currentWeightKg) : '');
    } else {
      setName('');
      setRelationship('Daughter');
      setGender('female');
      setBirthDate(new Date().toISOString().split('T')[0]);
      setExpectedLifespanYears(95);
      setHasPassed(false);
      setPassedDate('');
      setBloodGroup('O+');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
      setBio('');
      setCurrentHeightCm('');
      setCurrentWeightKg('');
    }
  }, [personToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    const person: Person = {
      id: personToEdit?.id || `person-${Date.now()}`,
      name: name.trim(),
      relationship,
      gender,
      birthDate,
      expectedLifespanYears: Number(expectedLifespanYears) || 90,
      passedDate: hasPassed && passedDate ? passedDate : undefined,
      bloodGroup: bloodGroup.trim() || undefined,
      avatarColor,
      bio: bio.trim() || undefined,
      currentHeightCm: currentHeightCm ? parseFloat(currentHeightCm) : undefined,
      currentWeightKg: currentWeightKg ? parseFloat(currentWeightKg) : undefined,
    };

    onSave(person);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {personToEdit ? 'Edit Family Member Profile' : 'Add Family Member'}
            </h3>
            <p className="text-xs text-slate-500">
              Track their life start, lifespan trajectory, growth, and health
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Name & Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya, Roy, Clara..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Partner">Partner</option>
                <option value="Self">Self</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other Family / Friend</option>
              </select>
            </div>
          </div>

          {/* Biological Sex & Birth Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth (Life Start) *
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Biological Sex (for Growth Standards)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'female' | 'male' | 'other')}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Lifespan Horizon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Projected Lifespan (Years)
              </label>
              <input
                type="number"
                min="1"
                max="125"
                value={expectedLifespanYears}
                onChange={(e) => setExpectedLifespanYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Blood Group (optional)
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+, A+, B-, AB+"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono uppercase"
              />
            </div>
          </div>

          {/* Passed away toggle (for memorial / tracking late ancestors) */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasPassed}
                onChange={(e) => setHasPassed(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>In Loving Memory (Track as Completed Lifespan)</span>
            </label>

            {hasPassed && (
              <div className="mt-3">
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
                  Date of Passing (Life End)
                </label>
                <input
                  type="date"
                  value={passedDate}
                  onChange={(e) => setPassedDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Current Height & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={currentHeightCm}
                onChange={(e) => setCurrentHeightCm(e.target.value)}
                placeholder="e.g. 106.5"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(e.target.value)}
                placeholder="e.g. 17.4"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Color palette selector */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Profile Accent Theme
            </label>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAvatarColor(col)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    avatarColor === col ? 'scale-125 ring-2 ring-offset-2 ring-slate-800 dark:ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Bio notes */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              About & Notes
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cherished traits, favorite activities, life ambitions..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {personToEdit && canDelete && onDeletePerson ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete profile for ${personToEdit.name}? All associated records will be removed.`)) {
                    onDeletePerson(personToEdit.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Profile</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
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
                {personToEdit ? 'Save Changes' : 'Create Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
