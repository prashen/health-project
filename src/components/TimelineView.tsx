import React, { useState, useMemo } from 'react';
import { Person, Milestone, Category, MilestoneStatus } from '../types';
import { calculateAge, formatISODate } from '../utils/lifeStages';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Tag, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  AlertCircle,
  FolderHeart
} from 'lucide-react';

interface TimelineViewProps {
  person: Person;
  milestones: Milestone[];
  categories: Category[];
  onOpenAddMilestone: () => void;
  onEditMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
  onToggleStatus: (id: string, newStatus: MilestoneStatus) => void;
  onOpenCategoryManager: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  person,
  milestones,
  categories,
  onOpenAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onToggleStatus,
  onOpenCategoryManager,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter and sort milestones chronologically (or reverse)
  const filteredMilestones = useMemo(() => {
    return milestones
      .filter((m) => {
        if (selectedCategory !== 'all' && m.categoryId !== selectedCategory) return false;
        if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
        if (selectedImportance !== 'all' && m.importance !== selectedImportance) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchDesc = m.description.toLowerCase().includes(q);
          const matchLocation = m.location?.toLowerCase().includes(q);
          const matchTags = m.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchLocation && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [milestones, selectedCategory, selectedStatus, selectedImportance, searchQuery]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach(c => map.set(c.id, c));
    return map;
  }, [categories]);

  return (
    <div className="space-y-6">
      
      {/* Controls & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milestones, memories, first words, checkups..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCategoryManager}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
            >
              <FolderHeart className="w-3.5 h-3.5 text-indigo-500" />
              <span>Customize Categories</span>
            </button>

            <button
              onClick={onOpenAddMilestone}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>
        </div>

        {/* Category & Status Filter Tabs */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          {/* Categories Pill/Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Categories ({milestones.length})
            </button>

            {categories.map((cat) => {
              const count = milestones.filter(m => m.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70 font-mono tabular-nums">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="planned">Planned Ahead</option>
              <option value="deadline">Deadlines</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Visual Timeline Path */}
      {filteredMilestones.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No milestones match your current filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search query, selecting another category, or add a new milestone to {person.name}'s life story.
          </p>
          <button
            onClick={onOpenAddMilestone}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            Add First Milestone
          </button>
        </div>
      ) : (
        <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-300 before:to-slate-200 dark:before:via-slate-700 dark:before:to-slate-800">
          {filteredMilestones.map((milestone) => {
            const cat = categoryMap.get(milestone.categoryId);
            const ageAtTime = calculateAge(person.birthDate, milestone.date);
            const isCompleted = milestone.status === 'completed';
            const isDeadline = milestone.status === 'deadline';

            return (
              <div key={milestone.id} className="relative group">
                
                {/* Visual Node Pin on Path */}
                <div
                  className={`absolute -left-6 md:-left-10 top-4 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs z-10 transition-transform group-hover:scale-110 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isDeadline
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-indigo-500 text-white'
                  }`}
                  style={cat && !isCompleted && !isDeadline ? { backgroundColor: cat.color } : {}}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isDeadline ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Milestone Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
                  
                  {/* Clean unboxed metadata with separators (Anti-slop rule §1.A) */}
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatISODate(milestone.date)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-medium">
                        Age: {ageAtTime.formattedString}
                      </span>
                      {cat && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 font-medium" style={{ color: cat.color }}>
                            {cat.name}
                          </span>
                        </>
                      )}
                      {milestone.importance === 'major' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            ★ Major Life Event
                          </span>
                        </>
                      )}
                    </div>

                    {/* Action Menu / Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const nextStatus: MilestoneStatus = 
                            milestone.status === 'completed' ? 'planned' : 'completed';
                          onToggleStatus(milestone.id, nextStatus);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                        title="Toggle completion status"
                      >
                        {isCompleted ? 'Completed' : milestone.status === 'deadline' ? 'Deadline' : 'Mark Complete'}
                      </button>

                      <button
                        onClick={() => onEditMilestone(milestone)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Milestone"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete milestone "${milestone.title}"?`)) {
                            onDeleteMilestone(milestone.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Footnote Metadata: Location, tags, deadline reminder */}
                  {(milestone.location || (milestone.tags && milestone.tags.length > 0) || milestone.dueDate) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        {milestone.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{milestone.location}</span>
                          </span>
                        )}
                        {milestone.tags && milestone.tags.length > 0 && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <span>{milestone.tags.join(', ')}</span>
                          </span>
                        )}
                      </div>

                      {milestone.dueDate && (
                        <div className="flex items-center gap-1 font-mono text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Due: {formatISODate(milestone.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
