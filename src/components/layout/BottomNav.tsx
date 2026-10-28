import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Compass,
  Code2,
  Menu,
  X,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  BarChart3,
  Network,
  Settings,
  ShieldCheck,
  Cloud,
  Download,
  Smartphone
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { UserProfile, AuthService } from '../../lib/auth';
import { isStandaloneApp } from '../../lib/pwa';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser?: UserProfile;
  onOpenAdminModal?: () => void;
  onOpenPwaModal?: () => void;
  onOpenGoogleCloudModal?: () => void;
  pendingApprovalsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAdminModal,
  onOpenPwaModal,
  onOpenGoogleCloudModal,
  pendingApprovalsCount = 0
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isSuperAdmin = currentUser ? AuthService.isSuperAdmin(currentUser) : false;
  const isStandalone = isStandaloneApp();

  const primaryItems = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'timetable' as NavTab, label: 'Timetable', icon: CalendarDays },
    { id: 'roadmap' as NavTab, label: 'Roadmap', icon: Compass },
    { id: 'dsa' as NavTab, label: 'DSA', icon: Code2 },
  ];

  const secondaryItems = [
    { id: 'graph' as NavTab, label: 'Prerequisite Graph (GATE & DSA)', icon: Network },
    { id: 'gate' as NavTab, label: 'GATE Preparation (12 Subjects)', icon: BookOpen },
    { id: 'flashcards' as NavTab, label: 'College Break Formula Deck', icon: BookOpen },
    { id: 'placement' as NavTab, label: 'Placement OS & Companies', icon: Briefcase },
    { id: 'interview' as NavTab, label: 'Interview Prep & STAR Projects', icon: Briefcase },
    { id: 'tests' as NavTab, label: 'Mock Tests & Error Log', icon: GraduationCap },
    { id: 'habits' as NavTab, label: 'Habits & Digital Wellbeing', icon: Sparkles },
    { id: 'analytics' as NavTab, label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings & Notifications', icon: Settings },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setDrawerOpen(false)}
        >
          <div 
            className="absolute bottom-16 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-slate-800 bg-[#0c1222] p-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-sm font-bold text-white">All Modules &amp; Tools</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick App Actions in Drawer */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {onOpenPwaModal && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenPwaModal();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold"
                >
                  <Download className="h-4 w-4 text-indigo-400" />
                  <span>{isStandalone ? 'PWA Running' : 'Install App'}</span>
                </button>
              )}

              {onOpenGoogleCloudModal && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenGoogleCloudModal();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-semibold"
                >
                  <Cloud className="h-4 w-4 text-sky-400" />
                  <span>Cloud DB</span>
                </button>
              )}

              {isSuperAdmin && onOpenAdminModal && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenAdminModal();
                  }}
                  className="col-span-2 flex items-center justify-between p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-200 text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-400" />
                    <span>Super Admin Approvals</span>
                  </div>
                  {pendingApprovalsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                      {pendingApprovalsCount} pending
                    </span>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {secondaryItems.map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs font-medium transition-all ${
                      active
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 bg-slate-900/60 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-indigo-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-800 bg-[#090e1c]/95 px-2 backdrop-blur-lg lg:hidden">
        {primaryItems.map(item => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors ${
                active ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-indigo-400 scale-110' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors ${
            drawerOpen || secondaryItems.some(i => i.id === currentTab)
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="h-5 w-5 text-slate-500" />
          <span>More</span>
          {isSuperAdmin && pendingApprovalsCount > 0 && (
            <span className="absolute top-1 right-2.5 h-2 w-2 rounded-full bg-amber-400" />
          )}
        </button>
      </nav>
    </>
  );
};
