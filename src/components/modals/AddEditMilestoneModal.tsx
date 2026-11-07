import React, { useState, useEffect } from 'react';
import { Person, Milestone, Category, MilestoneStatus, MilestoneImportance } from '../../types';
import { calculateAge } from '../../utils/lifeStages';
import { X, Calendar, MapPin, Tag } from 'lucide-react';

interface AddEditMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person;
  categories: Category[];
  milestoneToEdit?: Milestone | null;
  onSave: (milestone: Milestone) => void;
}

export const AddEditMilestoneModal: React.FC<AddEditMilestoneModalProps> = ({
  isOpen,
  onClose,
  person,
  categories,
  milestoneToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-cognitive');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<MilestoneStatus>('completed');
  const [importance, setImportance] = useState<MilestoneImportance>('key');
  const [location, setLocation] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (milestoneToEdit) {
      setTitle(milestoneToEdit.title);
      setDate(milestoneToEdit.date);
      setCategoryId(milestoneToEdit.categoryId);
      setDescription(milestoneToEdit.description);
      setStatus(milestoneToEdit.status);
      setImportance(milestoneToEdit.importance);
      setLocation(milestoneToEdit.location || '');
      setTagsStr(milestoneToEdit.tags ? milestoneToEdit.tags.join(', ') : '');
      setDueDate(milestoneToEdit.dueDate || '');
    } else {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId(categories[0]?.id || 'cat-cognitive');
      setDescription('');
      setStatus('completed');
      setImportance('key');
      setLocation('');
      setTagsStr('');
      setDueDate('');
    }
  }, [milestoneToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const agePreview = calculateAge(person.birthDate, date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const savedMilestone: Milestone = {
      id: milestoneToEdit?.id || `m-${Date.now()}`,
      personId: person.id,
      title: title.trim(),
      date,
      categoryId,
      description: description.trim(),
      status,
      importance,
      location: location.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      dueDate: dueDate || undefined,
      completedDate: status === 'completed' ? date : undefined,
    };

    onSave(savedMilestone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {milestoneToEdit ? 'Edit Life Milestone' : 'Record New Milestone'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Milestone Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. First Independent Steps, High School Graduation, Stopped nursing..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Date & Age preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Calculated Age at Milestone
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-mono font-medium">
                {agePreview.formattedString}
              </div>
            </div>
          </div>

          {/* Category & Importance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Importance Level
              </label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as MilestoneImportance)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="major">★ Major Milestone</option>
                <option value="key">Key Achievement</option>
                <option value="routine">Routine Memory</option>
              </select>
            </div>
          </div>

          {/* Status & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Progress Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="planned">Planned Ahead</option>
                <option value="deadline">Scheduled Deadline</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Optional Due Date / Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description & Narrative */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description & Memories
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened? What did it feel like? How did they react? Record the story..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Location (optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mount Sinai Hospital, Living Room, Lincoln Park"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="e.g. speech, motor, birthday, pediatric"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
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
              {milestoneToEdit ? 'Save Changes' : 'Record Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
