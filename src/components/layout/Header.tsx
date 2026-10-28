import React, { useState, useEffect } from 'react';
import {
  Bell,
  Play,
  Moon,
  Sun,
  Flame,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  User,
  Download,
  Cloud,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { AppNotification, DailyHabits } from '../../types';
import { StorageService } from '../../lib/storage';
import { playNotificationChime } from '../../lib/notifications';
import { UserProfile, AuthService } from '../../lib/auth';
import { isStandaloneApp } from '../../lib/pwa';

interface HeaderProps {
  onOpenFocusModal: () => void;
  onOpenRecoveryModal: () => void;
  streak: number;
  todayHabits: DailyHabits;
  currentUser: UserProfile;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAdminModal: () => void;
  onOpenGoogleCloudModal: () => void;
  onOpenPwaModal: () => void;
  onLogout: () => void;
  pendingApprovalsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFocusModal,
  onOpenRecoveryModal,
  streak,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAdminModal,
  onOpenGoogleCloudModal,
  onOpenPwaModal,
  onLogout,
  pendingApprovalsCount = 0
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(isStandaloneApp());
    setNotifications(StorageService.getNotifications(currentUser?.id));

    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTimeStr(new Intl.DateTimeFormat('en-IN', options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const isSuperAdmin = AuthService.isSuperAdmin(currentUser);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated, currentUser?.id);
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-[#090e1c]/95 px-3 py-2.5 backdrop-blur-md lg:px-6">
      {/* Left: Branding & IST live clock */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0 cursor-pointer" onClick={onOpenPwaModal}>
          <img
            src="/assets/aistudio/Grindly__Plan__Practice__Progress_2398434e.png"
            alt="PrepPilot OS Logo"
            className="h-9 w-auto max-w-[130px] sm:max-w-[170px] rounded-xl border border-indigo-500/40 shadow-lg shadow-indigo-500/20 object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white lg:text-lg">PrepPilot</h1>
            <span className="hidden rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 sm:inline-block">
              GATE &amp; Placement OS
            </span>
            {isStandalone && (
              <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                <Sparkles className="h-2.5 w-2.5" /> PWA Installed
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Clock className="h-3 w-3 text-indigo-400" />
            <span>IST: {currentTimeStr || '06:00:00 AM'}</span>
            <span className="hidden md:inline text-slate-500">• Oct 27, 2026 (Day 1)</span>
          </p>
        </div>
      </div>

      {/* Right: Quick actions, notifications, streak, focus, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA Install Button */}
        {!isStandalone ? (
          <button
            onClick={onOpenPwaModal}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 transition-all shadow-sm"
            title="Install PrepPilot as a Desktop or Mobile App"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        ) : (
          <button
            onClick={onOpenPwaModal}
            className="hidden sm:flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300"
            title="App installed (PWA Standalone Mode)"
          >
            <Smartphone className="h-3 w-3" />
            <span>App Mode</span>
          </button>
        )}

        {/* Google Cloud DB Sync Button */}
        <button
          onClick={onOpenGoogleCloudModal}
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1.5 text-xs font-semibold text-sky-300 transition-all"
          title="Google Cloud Platform Database & Sync Status"
        >
          <Cloud className="h-3.5 w-3.5 text-sky-400" />
          <span>Cloud DB</span>
        </button>

        {/* Streak Badge */}
        <div 
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300"
          title={`${streak} Day Streak`}
        >
          <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>{streak}d</span>
        </div>

        {/* Quick Recovery Button */}
        <button
          onClick={onOpenRecoveryModal}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/20 transition-colors"
          title="Reschedule missed study sessions"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Recovery</span>
        </button>

        {/* Start Focus Session */}
        <button
          onClick={() => {
            playNotificationChime('beep');
            onOpenFocusModal();
          }}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span className="hidden xs:inline">Focus</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-[#0f172a] p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-xs font-semibold text-slate-200">Alerts &amp; Reminders</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-800/40">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No alerts at this moment</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`pt-2 text-xs ${n.read ? 'opacity-70' : 'opacity-100'}`}>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="hidden sm:inline-flex rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 px-2.5 py-1.5 transition-all text-left"
          >
            <div className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs ${
              isSuperAdmin
                ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
            }`}>
              {currentUser?.name?.charAt(0).toUpperCase() || 'R'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-tight truncate max-w-[110px]">
                {currentUser?.name || 'Rishabh Gautam'}
              </span>
              <span className="text-[10px] text-indigo-400 font-mono block leading-none">
                {isSuperAdmin ? 'Super Admin' : 'Student'}
              </span>
            </div>
            {isSuperAdmin && pendingApprovalsCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            )}
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-[#0f172a] p-2 shadow-2xl z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <span className="font-bold text-white block truncate">{currentUser?.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">{currentUser?.email}</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    isSuperAdmin ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {isSuperAdmin ? 'SUPER ADMIN' : 'STUDENT'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Target: {currentUser?.targetGateScore || 70}+
                  </span>
                </div>
              </div>

              {/* Super Admin Control Center Option */}
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenAdminModal();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-indigo-400" />
                    <span>Admin Approvals</span>
                  </span>
                  {pendingApprovalsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                      {pendingApprovalsCount} new
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onOpenProfileModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>My Profile &amp; Goals</span>
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onOpenGoogleCloudModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Cloud className="h-4 w-4 text-sky-400" />
                <span>Google Cloud Database</span>
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onOpenPwaModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Download className="h-4 w-4 text-emerald-400" />
                <span>Install Desktop/Mobile App</span>
              </button>

              <div className="border-t border-slate-800/80 my-1" />

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>Switch / Sign In Another User</span>
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
