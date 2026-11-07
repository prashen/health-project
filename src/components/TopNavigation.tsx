import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sparkles, 
  MoreVertical,
  Activity
} from 'lucide-react';
import { AppState, exportDataAsJSON, importDataFromJSON, resetToDemoData } from '../utils/storage';

interface TopNavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddMilestone: () => void;
  appState: AppState;
  onStateUpdate: (newState: AppState) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddMilestone,
  appState,
  onStateUpdate,
  isDark,
  onToggleDark,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = () => {
    exportDataAsJSON(appState);
    setMenuOpen(false);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importDataFromJSON(file);
      onStateUpdate(imported);
      setMenuOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to import JSON archive.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Reset all family data back to initial sample records? Any custom data will be replaced.')) {
      const reset = resetToDemoData();
      onStateUpdate(reset);
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            VitaPath
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'overview'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Life Overview
          </button>
          <button
            onClick={() => onSelectTab('timeline')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'timeline'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Milestone Timeline
          </button>
          <button
            onClick={() => onSelectTab('growth_health')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'growth_health'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Growth & Health
          </button>
          <button
            onClick={() => onSelectTab('organ_systems')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'organ_systems'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Organ Functions
          </button>
          <button
            onClick={() => onSelectTab('deadlines')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'deadlines'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Deadlines & Status
          </button>
        </nav>

        {/* Zone 3: 1 primary action button + utility dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Data Archive & Settings"
              aria-label="Data menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Data Backup
                </div>
                <button
                  onClick={handleExport}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Export Family Archive (JSON)
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Restore / Import Archive
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  accept=".json"
                  className="hidden"
                />
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  onClick={handleReset}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Sample Data
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenAddMilestone}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelectTab('overview')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 ${
            currentTab === 'overview'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('timeline')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 ${
            currentTab === 'timeline'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => onSelectTab('growth_health')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 ${
            currentTab === 'growth_health'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Growth & Health
        </button>
        <button
          onClick={() => onSelectTab('organ_systems')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 ${
            currentTab === 'organ_systems'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Organ Functions
        </button>
        <button
          onClick={() => onSelectTab('deadlines')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 ${
            currentTab === 'deadlines'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Deadlines
        </button>
      </div>
    </header>
  );
};
