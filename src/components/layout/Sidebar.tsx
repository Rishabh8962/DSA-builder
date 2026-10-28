import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Compass,
  Code2,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  BarChart3,
  Settings,
  Layers,
  FileQuestion,
  Network,
  ShieldCheck,
  Cloud,
  Download,
  Smartphone
} from 'lucide-react';
import { UserProfile, AuthService } from '../../lib/auth';
import { isStandaloneApp } from '../../lib/pwa';

export type NavTab = 
  | 'dashboard'
  | 'timetable'
  | 'roadmap'
  | 'graph'
  | 'dsa'
  | 'gate'
  | 'flashcards'
  | 'placement'
  | 'interview'
  | 'tests'
  | 'habits'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  gateProgress: number;
  dsaSolved: number;
  currentUser?: UserProfile;
  onOpenAdminModal?: () => void;
  onOpenPwaModal?: () => void;
  onOpenGoogleCloudModal?: () => void;
  pendingApprovalsCount?: number;
}

export const NAV_ITEMS = [
  { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'timetable' as NavTab, label: 'My Timetable', icon: CalendarDays, badge: 'IST' },
  { id: 'roadmap' as NavTab, label: 'Study Roadmap', icon: Compass, badge: '8 Phases' },
  { id: 'graph' as NavTab, label: 'Prerequisite Graph', icon: Network, badge: 'DAG' },
  { id: 'dsa' as NavTab, label: 'DSA in Java', icon: Code2, badge: 'Practice' },
  { id: 'gate' as NavTab, label: 'GATE Prep', icon: BookOpen, badge: '12 Subjects' },
  { id: 'flashcards' as NavTab, label: 'Formula Deck', icon: Layers, badge: 'Breaks' },
  { id: 'placement' as NavTab, label: 'Placement OS', icon: Briefcase, badge: 'Feb/Mar' },
  { id: 'interview' as NavTab, label: 'Interview & STAR', icon: FileQuestion, badge: 'Prep' },
  { id: 'tests' as NavTab, label: 'Mock Tests & Errors', icon: GraduationCap, badge: null },
  { id: 'habits' as NavTab, label: 'Habits & Focus', icon: Sparkles, badge: '30m Social' },
  { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3, badge: null },
  { id: 'settings' as NavTab, label: 'Settings & Cloud', icon: Settings, badge: null },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  gateProgress,
  dsaSolved,
  currentUser,
  onOpenAdminModal,
  onOpenPwaModal,
  onOpenGoogleCloudModal,
  pendingApprovalsCount = 0
}) => {
  const isSuperAdmin = currentUser ? AuthService.isSuperAdmin(currentUser) : false;
  const isStandalone = isStandaloneApp();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-[#070b16] py-3.5 px-3 flex-shrink-0">
      {/* Brand Logo Header */}
      <div className="px-2 pb-3 mb-2 border-b border-slate-800/80">
        <img
          src="/assets/aistudio/Grindly__Plan__Practice__Progress_2398434e.png"
          alt="PrepPilot OS"
          className="w-full h-auto rounded-xl border border-indigo-500/30 shadow-md shadow-indigo-500/10 object-contain hover:border-indigo-400/60 transition-all cursor-pointer"
          onClick={() => onSelectTab('dashboard')}
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Target & Score Progress */}
      <div className="px-3 pb-3 border-b border-slate-800/80 mb-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Target Score</span>
          <span className="font-semibold text-indigo-400">{currentUser?.targetGateScore || 70}+ / 100</span>
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>GATE CS Syllabus</span>
            <span className="font-mono text-slate-200">{gateProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${Math.max(4, gateProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Super Admin Access Panel if Rishabh Gautam */}
      {isSuperAdmin && onOpenAdminModal && (
        <div className="mb-2">
          <button
            onClick={onOpenAdminModal}
            className="w-full flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-2 text-xs font-bold text-indigo-200 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>Admin Approvals</span>
            </div>
            {pendingApprovalsCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                {pendingApprovalsCount} new
              </span>
            ) : (
              <span className="text-[10px] text-indigo-300 font-mono">Active</span>
            )}
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-indigo-200 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA Install Card / Quick Link */}
      <div className="mt-auto pt-2.5 border-t border-slate-800/80 space-y-2">
        {onOpenPwaModal && (
          <button
            onClick={onOpenPwaModal}
            className={`w-full flex items-center justify-between rounded-xl p-2 text-xs transition-all ${
              isStandalone
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isStandalone ? (
                <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Download className="h-3.5 w-3.5 text-indigo-400" />
              )}
              <span className="font-semibold">
                {isStandalone ? 'App Mode Active' : 'Install Desktop App'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-1 rounded bg-slate-900/60">PWA</span>
          </button>
        )}

        <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">DSA Solved</span>
            <span className="font-mono font-semibold text-emerald-400">{dsaSolved}</span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Target: 60+ core patterns before GATE &amp; tests.
          </p>
        </div>
      </div>
    </aside>
  );
};
