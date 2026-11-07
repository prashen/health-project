import React, { useState } from 'react';
import { Person, DeadlineItem, Category, DeadlineStatus } from '../types';
import { formatISODate, getDaysDifference } from '../utils/lifeStages';
import { 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  CheckSquare, 
  Square,
  ShieldAlert,
  Search
} from 'lucide-react';

interface DeadlinesAndStatusViewProps {
  person: Person;
  deadlines: DeadlineItem[];
  categories: Category[];
  onOpenAddDeadline: () => void;
  onToggleCompleteDeadline: (id: string) => void;
  onDeleteDeadline: (id: string) => void;
}

export const DeadlinesAndStatusView: React.FC<DeadlinesAndStatusViewProps> = ({
  person,
  deadlines,
  categories,
  onOpenAddDeadline,
  onToggleCompleteDeadline,
  onDeleteDeadline,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [search, setSearch] = useState('');

  const personDeadlines = deadlines.filter(d => d.personId === person.id);

  const categoryMap = new Map<string, Category>();
  categories.forEach(c => categoryMap.set(c.id, c));

  const filteredDeadlines = personDeadlines.filter((d) => {
    if (filter === 'pending' && d.status === 'completed') return false;
    if (filter === 'completed' && d.status !== 'completed') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.notes?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getUrgencyBadge = (item: DeadlineItem) => {
    if (item.status === 'completed') {
      return (
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed</span>
        </span>
      );
    }

    const diffDays = getDaysDifference(item.dueDate);

    if (diffDays < 0) {
      return (
        <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold font-mono tabular-nums flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          <span>{Math.abs(diffDays)} days overdue</span>
        </span>
      );
    }

    if (diffDays === 0) {
      return (
        <span className="text-xs text-amber-600 dark:text-amber-400 font-bold font-mono">
          Due today!
        </span>
      );
    }

    if (diffDays <= 7) {
      return (
        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium font-mono tabular-nums">
          Due in {diffDays} days
        </span>
      );
    }

    if (diffDays <= 30) {
      return (
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium font-mono tabular-nums">
          Due in {diffDays} days
        </span>
      );
    }

    return (
      <span className="text-xs text-slate-500 font-mono tabular-nums">
        Due in {diffDays} days
      </span>
    );
  };

  const pendingCount = personDeadlines.filter(d => d.status !== 'completed').length;
  const overdueCount = personDeadlines.filter(d => d.status !== 'completed' && getDaysDifference(d.dueDate) < 0).length;

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Health Checkup Deadlines & Milestone Schedules
              </h2>
              <span className="text-xs text-slate-500">
                · {person.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Keep track of mandatory developmental screenings, pediatric booster vaccines, school registrations, and preventative doctor visits.
            </p>
          </div>

          <button
            onClick={onOpenAddDeadline}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deadline</span>
          </button>
        </div>

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Pending Tasks</div>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
              {pendingCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Overdue Alerts</div>
            <div className={`text-base font-bold font-mono tabular-nums mt-0.5 ${overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              {overdueCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Next Milestone Exam</div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 truncate">
              {personDeadlines.find(d => d.status !== 'completed')?.title || 'All caught up!'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Completed Archive</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
              {personDeadlines.filter(d => d.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs w-full sm:w-auto">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Active & Upcoming ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({personDeadlines.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Completed ({personDeadlines.filter(d => d.status === 'completed').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {filteredDeadlines.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
            No deadlines match your current filter. You're all caught up!
          </div>
        ) : (
          filteredDeadlines.map((item) => {
            const isCompleted = item.status === 'completed';
            const cat = categoryMap.get(item.categoryId);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Left: Checkbox + Content */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleCompleteDeadline(item.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    {/* Unboxed metadata (Anti-slop rule §1.A) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
                      <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        Due: {formatISODate(item.dueDate)}
                      </span>
                      {cat && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span style={{ color: cat.color }} className="font-medium">
                            {cat.name}
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className={`text-[10px] font-semibold uppercase ${
                        item.priority === 'high' ? 'text-rose-500' : item.priority === 'medium' ? 'text-amber-500' : 'text-slate-400'
                      }`}>
                        {item.priority} Priority
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold tracking-tight ${
                      isCompleted ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                    }`}>
                      {item.title}
                    </h4>

                    {item.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Countdown badge & delete action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    {getUrgencyBadge(item)}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete deadline "${item.title}"?`)) {
                        onDeleteDeadline(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
