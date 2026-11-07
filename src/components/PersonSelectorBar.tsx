import React from 'react';
import { Person } from '../types';
import { calculateAge } from '../utils/lifeStages';
import { Plus, Users, Edit3, Heart } from 'lucide-react';

interface PersonSelectorBarProps {
  people: Person[];
  activePersonId: string;
  onSelectPerson: (id: string) => void;
  onOpenAddPerson: () => void;
  onOpenEditPerson: (person: Person) => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
}

export const PersonSelectorBar: React.FC<PersonSelectorBarProps> = ({
  people,
  activePersonId,
  onSelectPerson,
  onOpenAddPerson,
  onOpenEditPerson,
  isCompareMode,
  onToggleCompareMode,
}) => {
  const activePerson = people.find(p => p.id === activePersonId) || people[0];

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Family Member Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {people.map((person) => {
            const isSelected = !isCompareMode && person.id === activePersonId;
            const age = calculateAge(person.birthDate, person.passedDate);
            return (
              <button
                key={person.id}
                onClick={() => {
                  if (isCompareMode) onToggleCompareMode();
                  onSelectPerson(person.id);
                }}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left transition-all shrink-0 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0"
                  style={{ backgroundColor: person.avatarColor }}
                >
                  {person.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                    <span>{person.name}</span>
                    <span className="text-[10px] font-normal text-slate-600 dark:text-slate-300">
                      ({person.relationship})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono tabular-nums leading-tight">
                    {age.formattedString}
                  </div>
                </div>
              </button>
            );
          })}

          <button
            onClick={onOpenAddPerson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Family Member</span>
          </button>
        </div>

        {/* View Toggle: Single Profile vs Family Overlaid Comparison */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={onToggleCompareMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isCompareMode
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Compare Family Lifespans</span>
          </button>

          {!isCompareMode && activePerson && (
            <button
              onClick={() => onOpenEditPerson(activePerson)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Edit Profile"
              aria-label="Edit Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
