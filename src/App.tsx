import React, { useState, useEffect } from 'react';
import { 
  Person, 
  Milestone, 
  Category, 
  GrowthRecord, 
  HealthMetricLog, 
  OrganSystem, 
  DeadlineItem,
  MilestoneStatus 
} from './types';
import { loadStoredData, saveStoredData, AppState } from './utils/storage';
import { TopNavigation } from './components/TopNavigation';
import { PersonSelectorBar } from './components/PersonSelectorBar';
import { LifePathSummaryCard } from './components/LifePathSummaryCard';
import { TimelineView } from './components/TimelineView';
import { FamilyComparisonTimeline } from './components/FamilyComparisonTimeline';
import { GrowthChartsView } from './components/GrowthChartsView';
import { HealthMetricsView } from './components/HealthMetricsView';
import { OrganSystemsView } from './components/OrganSystemsView';
import { DeadlinesAndStatusView } from './components/DeadlinesAndStatusView';

// Modals
import { AddEditMilestoneModal } from './components/modals/AddEditMilestoneModal';
import { AddEditPersonModal } from './components/modals/AddEditPersonModal';
import { CategoryManagerModal } from './components/modals/CategoryManagerModal';
import { AddGrowthRecordModal } from './components/modals/AddGrowthRecordModal';
import { AddHealthMetricModal } from './components/modals/AddHealthMetricModal';
import { UpdateOrganModal } from './components/modals/UpdateOrganModal';
import { AddDeadlineModal } from './components/modals/AddDeadlineModal';

import { ArrowRight, Sparkles, Heart, Activity, Calendar } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadStoredData());
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('vitapath_theme_v1') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modals state
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGrowthModalOpen, setIsGrowthModalOpen] = useState(false);
  const [isHealthMetricModalOpen, setIsHealthMetricModalOpen] = useState(false);
  const [isOrganModalOpen, setIsOrganModalOpen] = useState(false);
  const [editingOrgan, setEditingOrgan] = useState<OrganSystem | null>(null);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);

  // Sync dark class on html root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vitapath_theme_v1', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vitapath_theme_v1', 'light');
    }
  }, [isDark]);

  // Auto-save state to localStorage
  useEffect(() => {
    saveStoredData(appState);
  }, [appState]);

  const activePerson = appState.people.find(p => p.id === appState.activePersonId) || appState.people[0];

  // Handlers for Person
  const handleSelectPerson = (id: string) => {
    setAppState(prev => ({ ...prev, activePersonId: id }));
  };

  const handleSavePerson = (person: Person) => {
    setAppState(prev => {
      const exists = prev.people.some(p => p.id === person.id);
      const updatedPeople = exists
        ? prev.people.map(p => p.id === person.id ? person : p)
        : [...prev.people, person];
      return {
        ...prev,
        people: updatedPeople,
        activePersonId: person.id,
      };
    });
  };

  const handleDeletePerson = (id: string) => {
    if (appState.people.length <= 1) {
      alert('You must have at least one family profile in the tracker.');
      return;
    }
    setAppState(prev => {
      const updatedPeople = prev.people.filter(p => p.id !== id);
      const nextActiveId = updatedPeople[0].id;
      return {
        ...prev,
        people: updatedPeople,
        activePersonId: nextActiveId,
        milestones: prev.milestones.filter(m => m.personId !== id),
        growthRecords: prev.growthRecords.filter(g => g.personId !== id),
        healthLogs: prev.healthLogs.filter(h => h.personId !== id),
        organSystems: prev.organSystems.filter(o => o.personId !== id),
        deadlines: prev.deadlines.filter(d => d.personId !== id),
      };
    });
  };

  // Handlers for Milestones
  const handleSaveMilestone = (milestone: Milestone) => {
    setAppState(prev => {
      const exists = prev.milestones.some(m => m.id === milestone.id);
      const updated = exists
        ? prev.milestones.map(m => m.id === milestone.id ? milestone : m)
        : [...prev.milestones, milestone];
      return { ...prev, milestones: updated };
    });
  };

  const handleDeleteMilestone = (id: string) => {
    setAppState(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id),
    }));
  };

  const handleToggleMilestoneStatus = (id: string, newStatus: MilestoneStatus) => {
    setAppState(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => m.id === id ? { ...m, status: newStatus } : m),
    }));
  };

  // Handlers for Categories
  const handleAddCategory = (category: Category) => {
    setAppState(prev => ({
      ...prev,
      categories: [...prev.categories, category],
    }));
  };

  const handleDeleteCategory = (id: string) => {
    setAppState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
      milestones: prev.milestones.map(m => m.categoryId === id ? { ...m, categoryId: prev.categories[0].id } : m),
    }));
  };

  // Handlers for Growth Records
  const handleSaveGrowthRecord = (record: GrowthRecord) => {
    setAppState(prev => {
      const exists = prev.growthRecords.some(r => r.id === record.id);
      const updated = exists
        ? prev.growthRecords.map(r => r.id === record.id ? record : r)
        : [...prev.growthRecords, record];
      
      // Also sync currentHeightCm / currentWeightKg on person if latest
      const updatedPeople = prev.people.map(p => {
        if (p.id === record.personId) {
          return {
            ...p,
            currentHeightCm: record.heightCm,
            currentWeightKg: record.weightKg,
          };
        }
        return p;
      });

      return {
        ...prev,
        growthRecords: updated,
        people: updatedPeople,
      };
    });
  };

  const handleDeleteGrowthRecord = (id: string) => {
    setAppState(prev => ({
      ...prev,
      growthRecords: prev.growthRecords.filter(r => r.id !== id),
    }));
  };

  // Handlers for Health Logs
  const handleSaveHealthLog = (log: HealthMetricLog) => {
    setAppState(prev => ({
      ...prev,
      healthLogs: [log, ...prev.healthLogs],
    }));
  };

  const handleDeleteHealthLog = (id: string) => {
    setAppState(prev => ({
      ...prev,
      healthLogs: prev.healthLogs.filter(h => h.id !== id),
    }));
  };

  // Handlers for Organ Systems
  const handleSaveOrganSystem = (updated: OrganSystem) => {
    setAppState(prev => ({
      ...prev,
      organSystems: prev.organSystems.map(o => o.id === updated.id ? updated : o),
    }));
  };

  // Handlers for Deadlines
  const handleSaveDeadline = (deadline: DeadlineItem) => {
    setAppState(prev => ({
      ...prev,
      deadlines: [...prev.deadlines, deadline],
    }));
  };

  const handleToggleCompleteDeadline = (id: string) => {
    setAppState(prev => ({
      ...prev,
      deadlines: prev.deadlines.map(d => {
        if (d.id === id) {
          const isCompleted = d.status === 'completed';
          return {
            ...d,
            status: isCompleted ? 'pending' : 'completed',
            completedAt: isCompleted ? undefined : new Date().toISOString(),
          };
        }
        return d;
      }),
    }));
  };

  const handleDeleteDeadline = (id: string) => {
    setAppState(prev => ({
      ...prev,
      deadlines: prev.deadlines.filter(d => d.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      
      {/* Top 3-Zone Navigation */}
      <TopNavigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setIsCompareMode(false);
          setCurrentTab(tab);
        }}
        onOpenAddMilestone={() => {
          setEditingMilestone(null);
          setIsMilestoneModalOpen(true);
        }}
        appState={appState}
        onStateUpdate={setAppState}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />

      {/* Person Selector and Comparison Toggle Strip */}
      <PersonSelectorBar
        people={appState.people}
        activePersonId={appState.activePersonId}
        onSelectPerson={handleSelectPerson}
        onOpenAddPerson={() => {
          setEditingPerson(null);
          setIsPersonModalOpen(true);
        }}
        onOpenEditPerson={(person) => {
          setEditingPerson(person);
          setIsPersonModalOpen(true);
        }}
        isCompareMode={isCompareMode}
        onToggleCompareMode={() => setIsCompareMode(!isCompareMode)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {isCompareMode ? (
          <FamilyComparisonTimeline
            people={appState.people}
            milestones={appState.milestones}
            onSelectPerson={(id) => {
              handleSelectPerson(id);
              setIsCompareMode(false);
              setCurrentTab('overview');
            }}
          />
        ) : (
          <>
            {/* Top Life Path Card */}
            <LifePathSummaryCard
              person={activePerson}
              milestones={appState.milestones.filter(m => m.personId === activePerson.id)}
              organSystems={appState.organSystems.filter(o => o.personId === activePerson.id)}
              deadlines={appState.deadlines.filter(d => d.personId === activePerson.id)}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />

            {/* Tab: Overview */}
            {currentTab === 'overview' && (
              <div className="space-y-8">
                
                {/* 2-Column Split: Recent Milestones & Key Deadlines */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Recent Milestones Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Key Milestones & Memories
                          </h3>
                        </div>
                        <button
                          onClick={() => setCurrentTab('timeline')}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                        >
                          <span>All Milestones</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                        {appState.milestones
                          .filter(m => m.personId === activePerson.id)
                          .slice(-4)
                          .reverse()
                          .map((m) => (
                            <div key={m.id} className="py-3 text-xs">
                              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-0.5">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {m.date}
                                </span>
                                <span className="capitalize text-indigo-600 dark:text-indigo-400">
                                  {m.status.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 dark:text-white text-xs">
                                {m.title}
                              </div>
                              <div className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                                {m.description}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingMilestone(null);
                        setIsMilestoneModalOpen(true);
                      }}
                      className="mt-4 w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-center"
                    >
                      + Record New Milestone for {activePerson.name}
                    </button>
                  </div>

                  {/* Upcoming Deadlines & Routine Care Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-rose-500" />
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Upcoming Checkups & Deadlines
                          </h3>
                        </div>
                        <button
                          onClick={() => setCurrentTab('deadlines')}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                        >
                          <span>Manage All</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                        {appState.deadlines
                          .filter(d => d.personId === activePerson.id && d.status !== 'completed')
                          .slice(0, 4)
                          .map((d) => (
                            <div key={d.id} className="py-3 text-xs flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[11px] font-mono text-slate-500">
                                  Due: {d.dueDate}
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                                  {d.title}
                                </div>
                                {d.notes && (
                                  <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                                    {d.notes}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => handleToggleCompleteDeadline(d.id)}
                                className="px-2 py-1 text-[11px] rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-emerald-100 transition-colors shrink-0"
                              >
                                Complete
                              </button>
                            </div>
                          ))}
                        {appState.deadlines.filter(d => d.personId === activePerson.id && d.status !== 'completed').length === 0 && (
                          <div className="py-6 text-center text-xs text-slate-400">
                            No pending deadlines. Everything is up to date!
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsDeadlineModalOpen(true)}
                      className="mt-4 w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-center"
                    >
                      + Schedule Checkup or Deadline
                    </button>
                  </div>
                </div>

                {/* Growth and Organ Health Quick Strip */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span>Health Evolution & Growth Trajectory</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Clinical percentile curves, biometrics, and 8-system physiological evaluation.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentTab('growth_health')}
                        className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        Open Growth Charts
                      </button>
                      <button
                        onClick={() => setCurrentTab('organ_systems')}
                        className="px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl transition-colors"
                      >
                        Inspect Organ Systems
                      </button>
                    </div>
                  </div>

                  {/* Organ preview bar */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {appState.organSystems
                      .filter(o => o.personId === activePerson.id)
                      .slice(0, 4)
                      .map((organ) => (
                        <div
                          key={organ.id}
                          onClick={() => {
                            setEditingOrgan(organ);
                            setIsOrganModalOpen(true);
                          }}
                          className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-400 transition-colors"
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                            <span className="truncate">{organ.name}</span>
                            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                              {organ.scorePercent}%
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 capitalize mt-0.5">
                            {organ.status}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Milestone Timeline */}
            {currentTab === 'timeline' && (
              <TimelineView
                person={activePerson}
                milestones={appState.milestones.filter(m => m.personId === activePerson.id)}
                categories={appState.categories}
                onOpenAddMilestone={() => {
                  setEditingMilestone(null);
                  setIsMilestoneModalOpen(true);
                }}
                onEditMilestone={(m) => {
                  setEditingMilestone(m);
                  setIsMilestoneModalOpen(true);
                }}
                onDeleteMilestone={handleDeleteMilestone}
                onToggleStatus={handleToggleMilestoneStatus}
                onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
              />
            )}

            {/* Tab: Growth & Health */}
            {currentTab === 'growth_health' && (
              <div className="space-y-8">
                <GrowthChartsView
                  person={activePerson}
                  growthRecords={appState.growthRecords}
                  onOpenAddGrowthRecord={() => setIsGrowthModalOpen(true)}
                  onDeleteGrowthRecord={handleDeleteGrowthRecord}
                />

                <HealthMetricsView
                  person={activePerson}
                  healthLogs={appState.healthLogs}
                  onOpenAddHealthLog={() => setIsHealthMetricModalOpen(true)}
                  onDeleteHealthLog={handleDeleteHealthLog}
                />
              </div>
            )}

            {/* Tab: Organ Functions */}
            {currentTab === 'organ_systems' && (
              <OrganSystemsView
                person={activePerson}
                organSystems={appState.organSystems}
                onOpenUpdateOrgan={(organ) => {
                  setEditingOrgan(organ);
                  setIsOrganModalOpen(true);
                }}
              />
            )}

            {/* Tab: Deadlines & Status */}
            {currentTab === 'deadlines' && (
              <DeadlinesAndStatusView
                person={activePerson}
                deadlines={appState.deadlines}
                categories={appState.categories}
                onOpenAddDeadline={() => setIsDeadlineModalOpen(true)}
                onToggleCompleteDeadline={handleToggleCompleteDeadline}
                onDeleteDeadline={handleDeleteDeadline}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            VitaPath Family Life & Health Telemetry · Continuous Lifespan Archive
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WHO Growth Standards Grounded</span>
            <span>·</span>
            <span>Local Encrypted Storage</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isMilestoneModalOpen && (
        <AddEditMilestoneModal
          isOpen={isMilestoneModalOpen}
          onClose={() => {
            setIsMilestoneModalOpen(false);
            setEditingMilestone(null);
          }}
          person={activePerson}
          categories={appState.categories}
          milestoneToEdit={editingMilestone}
          onSave={handleSaveMilestone}
        />
      )}

      {isPersonModalOpen && (
        <AddEditPersonModal
          isOpen={isPersonModalOpen}
          onClose={() => {
            setIsPersonModalOpen(false);
            setEditingPerson(null);
          }}
          personToEdit={editingPerson}
          onSave={handleSavePerson}
          onDeletePerson={handleDeletePerson}
          canDelete={appState.people.length > 1}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryManagerModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={appState.categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {isGrowthModalOpen && (
        <AddGrowthRecordModal
          isOpen={isGrowthModalOpen}
          onClose={() => setIsGrowthModalOpen(false)}
          person={activePerson}
          onSave={handleSaveGrowthRecord}
        />
      )}

      {isHealthMetricModalOpen && (
        <AddHealthMetricModal
          isOpen={isHealthMetricModalOpen}
          onClose={() => setIsHealthMetricModalOpen(false)}
          person={activePerson}
          onSave={handleSaveHealthLog}
        />
      )}

      {isOrganModalOpen && (
        <UpdateOrganModal
          isOpen={isOrganModalOpen}
          onClose={() => {
            setIsOrganModalOpen(false);
            setEditingOrgan(null);
          }}
          organ={editingOrgan}
          onSave={handleSaveOrganSystem}
        />
      )}

      {isDeadlineModalOpen && (
        <AddDeadlineModal
          isOpen={isDeadlineModalOpen}
          onClose={() => setIsDeadlineModalOpen(false)}
          person={activePerson}
          categories={appState.categories}
          onSave={handleSaveDeadline}
        />
      )}
    </div>
  );
}
