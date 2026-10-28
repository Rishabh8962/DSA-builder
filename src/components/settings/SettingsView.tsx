import React, { useState } from 'react';
import {
  Settings,
  Bell,
  BellRing,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Database,
  Volume2,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cloud,
  Smartphone,
  ExternalLink,
  Users
} from 'lucide-react';
import { UserSettings, ReminderSetting } from '../../types';
import { StorageService } from '../../lib/storage';
import { SUPER_ADMIN_CREDENTIALS } from '../../lib/auth';
import {
  requestWebPushPermission,
  sendBrowserNotification,
  playNotificationChime,
  createInAppNotification
} from '../../lib/notifications';
import { UserProfile, AuthService } from '../../lib/auth';
import { GoogleCloudDbService } from '../../lib/googleCloudDb';
import { isStandaloneApp } from '../../lib/pwa';

interface SettingsViewProps {
  settings: UserSettings;
  reminders: ReminderSetting[];
  onUpdateSettings: (newSettings: UserSettings) => void;
  onUpdateReminders: (newReminders: ReminderSetting[]) => void;
  onResetAllData: () => void;
  currentUser?: UserProfile;
  onOpenGoogleCloudModal?: () => void;
  onOpenPwaModal?: () => void;
  onOpenAdminModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  reminders,
  onUpdateSettings,
  onUpdateReminders,
  onResetAllData,
  currentUser,
  onOpenGoogleCloudModal,
  onOpenPwaModal,
  onOpenAdminModal
}) => {
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [testNotifSuccess, setTestNotifSuccess] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isSuperAdmin = currentUser ? AuthService.isSuperAdmin(currentUser) : false;
  const isStandalone = isStandaloneApp();
  const gcpConfig = GoogleCloudDbService.getConfig();

  const handleRequestPermission = async () => {
    const perm = await requestWebPushPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      onUpdateSettings({ ...settings, notificationsEnabled: true });
      playNotificationChime('success');
    }
  };

  const handleSendTestNotification = () => {
    playNotificationChime('success');

    // 1. In-app alert
    const notif = createInAppNotification(
      'PrepPilot Test Notification',
      'Reminders are operating normally on Asia/Kolkata timezone!',
      'reminder'
    );
    const existing = StorageService.getNotifications(currentUser?.id);
    StorageService.saveNotifications([notif, ...existing], currentUser?.id);

    // 2. Browser Push
    sendBrowserNotification(
      'PrepPilot Alert: GATE Study Time',
      '6:20 AM: Time to begin morning GATE CS study block (90 mins)!'
    );

    setTestNotifSuccess(true);
    setTimeout(() => setTestNotifSuccess(false), 4000);
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onUpdateReminders(updated);
    StorageService.saveReminders(updated, currentUser?.id);
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportAllData(currentUser?.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preppilot-backup-${currentUser?.name?.replace(/\s+/g, '-').toLowerCase() || 'data'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const ok = StorageService.importAllData(content, currentUser?.id);
        if (ok) {
          window.location.reload();
        } else {
          alert('Invalid backup JSON format');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-400" />
          <span>System Settings &amp; Cloud Database</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          PWA installation, Google Cloud Firestore sync, IST study timetable, and notification triggers
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Settings successfully saved!</span>
        </div>
      )}

      {/* PWA & Installable App Status Card */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-violet-950/40 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Progressive Web App (PWA)</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isStandalone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {isStandalone ? 'Installed (Standalone App)' : 'Browser Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Install PrepPilot as a native application on Windows, Mac, Android, and iOS for zero-distraction preparation.
              </p>
            </div>
          </div>

          {onOpenPwaModal && (
            <button
              onClick={onOpenPwaModal}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-center"
            >
              <Download className="h-4 w-4" />
              <span>{isStandalone ? 'View App Status' : 'Install Desktop App'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Super Admin Status Card */}
      {isSuperAdmin && (
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#0d1428] to-[#121c38] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Super Admin Access
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                {currentUser?.name || SUPER_ADMIN_CREDENTIALS.name} ({currentUser?.email || SUPER_ADMIN_CREDENTIALS.email})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All existing timetables and master data are assigned to your profile. You control user registrations and access approvals.
              </p>
            </div>

            {onOpenAdminModal && (
              <button
                onClick={onOpenAdminModal}
                className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 px-4 py-2 text-xs font-bold transition-all self-start sm:self-center"
              >
                <Users className="h-4 w-4 text-indigo-400" />
                <span>Manage User Approvals</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Core Schedule Rules */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>Timezone &amp; Fixed Constraints</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Timezone</label>
              <input
                type="text"
                disabled
                value={settings.timezone}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Locked to Indian Standard Time (IST)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College Commitment</label>
              <input
                type="text"
                disabled
                value={settings.collegeSchedule}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Mon–Fri 9:00 AM – 5:00 PM (Untouchable)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gym &amp; Sleep Windows</label>
              <input
                type="text"
                disabled
                value={`${settings.gymDuration} | ${settings.sleepSchedule}`}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Gym 6–8 PM, Sleep 10:30 PM–6:00 AM</span>
            </div>
          </div>
        </div>

        {/* Notifications & Push Section */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-400" />
                <span>Web Push Notifications &amp; Sound</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chimes and browser push alerts at transition intervals
              </p>
            </div>

            <div className="flex items-center gap-2">
              {notificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500"
                >
                  Enable Browser Push
                </button>
              )}
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <BellRing className="h-3.5 w-3.5 text-amber-400" />
                <span>Test Alert</span>
              </button>
            </div>
          </div>

          {testNotifSuccess && (
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Test notification and audio chime triggered!
            </p>
          )}

          {/* Active Reminder Toggles */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-300 block mb-2">Automated Transition Reminders</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reminders.map(rem => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">{rem.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rem.time} • {rem.description}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rem.enabled}
                    onChange={() => handleToggleReminder(rem.id)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Google Cloud Platform Database & Persistence Section */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cloud className="h-4 w-4 text-sky-400" />
                <span>Google Cloud Database (Firestore &amp; Cloud SQL)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-tenant database engine with offline-first local replicas and Google Cloud sync.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                GCP: {gcpConfig.projectId}
              </span>
              {onOpenGoogleCloudModal && (
                <button
                  type="button"
                  onClick={onOpenGoogleCloudModal}
                  className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Cloud Settings</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Database Service</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">Cloud Firestore (Native)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Default Region</span>
              <span className="font-semibold text-slate-200 mt-0.5 block font-mono">{gcpConfig.region} (Mumbai)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Super Admin Owner</span>
              <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                Rishabh Gautam
              </span>
            </div>
          </div>
        </div>

        {/* Data Backup & Reset */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Data Portability &amp; Emergency Reset</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Full Backup (JSON)</span>
            </button>

            <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              <span>Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all timetables, subjects, and habits to initial default template?')) {
                  onResetAllData();
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 ml-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
