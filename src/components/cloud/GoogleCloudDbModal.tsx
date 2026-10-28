import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Download,
  Key,
  Globe,
  Server,
  Layers,
  X,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import {
  GoogleCloudDbService,
  GoogleCloudConfig,
  DEFAULT_GCP_CONFIG
} from '../../lib/googleCloudDb';
import { UserProfile, AuthService, SUPER_ADMIN_CREDENTIALS } from '../../lib/auth';
import { StorageService } from '../../lib/storage';
import { playNotificationChime } from '../../lib/notifications';

interface GoogleCloudDbModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const GoogleCloudDbModal: React.FC<GoogleCloudDbModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [config, setConfig] = useState<GoogleCloudConfig>(GoogleCloudDbService.getConfig());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    GoogleCloudDbService.saveConfig(config);
    setSyncFeedback({
      success: true,
      message: 'Google Cloud Platform database settings saved successfully!'
    });
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);

    const snapshot = {
      weekdayTimetable: StorageService.getWeekdayTimetable(currentUser.id),
      saturdayTimetable: StorageService.getSaturdayTimetable(currentUser.id),
      sundayTimetable: StorageService.getSundayTimetable(currentUser.id),
      gateSubjects: StorageService.getGateSubjects(currentUser.id),
      dsaProblems: StorageService.getDSAProblems(currentUser.id),
      roadmap: StorageService.getRoadmap(currentUser.id),
      habits: StorageService.getHabits(currentUser.id),
      focusSessions: StorageService.getFocusSessions(currentUser.id)
    };

    const res = await GoogleCloudDbService.syncWithGoogleCloud(config, currentUser, snapshot);
    setIsSyncing(false);
    setSyncFeedback(res);
    setConfig(GoogleCloudDbService.getConfig());
    if (res.success) {
      playNotificationChime('success');
    }
  };

  const handleDownloadCloudSQL = () => {
    const sqlContent = GoogleCloudDbService.generateCloudSQLSchema();
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preppilot-gcp-cloudsql-${currentUser.name.replace(/\s+/g, '-').toLowerCase()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFirestoreJSON = () => {
    const allUsers = AuthService.getAllUsers();
    const adminData = {
      weekdayTimetable: StorageService.getWeekdayTimetable(),
      saturdayTimetable: StorageService.getSaturdayTimetable(),
      sundayTimetable: StorageService.getSundayTimetable(),
      gateSubjects: StorageService.getGateSubjects(),
      dsaProblems: StorageService.getDSAProblems(),
      roadmap: StorageService.getRoadmap(),
      mockTests: StorageService.getMockTests(),
      habits: StorageService.getHabits(),
      focusSessions: StorageService.getFocusSessions()
    };
    const jsonStr = GoogleCloudDbService.generateFirestoreExport(allUsers, adminData);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preppilot-firestore-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySQLSnippet = () => {
    navigator.clipboard.writeText(GoogleCloudDbService.generateCloudSQLSchema());
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Cloud Database &amp; Sync</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Firestore &amp; Cloud SQL
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cloud persistence, automated backups, and profile synchronization
            </p>
          </div>
        </div>

        {/* Sync Status Feedback */}
        {syncFeedback && (
          <div className={`mb-4 rounded-xl border p-3 text-xs flex items-center gap-2 ${
            syncFeedback.success
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}>
            {syncFeedback.success ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{syncFeedback.message}</span>
          </div>
        )}

        {/* Current Connection Status Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Database className="h-4 w-4 text-sky-400" />
                <span>Google Cloud Firestore Status</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Project: <strong className="text-white font-mono">{config.projectId}</strong> • Region: <span className="font-mono text-slate-300">{config.region}</span>
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Last Synced: {config.lastSyncTimestamp ? new Date(config.lastSyncTimestamp).toLocaleString() : 'Never'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 text-xs font-bold shadow-md shadow-sky-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* GCP Config Form */}
        <form onSubmit={handleSaveConfig} className="space-y-4 mb-6">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Google Cloud Platform Connection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GCP Project ID
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={config.projectId}
                  onChange={e => setConfig({ ...config, projectId: e.target.value })}
                  placeholder="e.g. preppilot-2027"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Firestore Database ID
              </label>
              <div className="relative">
                <Database className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={config.databaseId}
                  onChange={e => setConfig({ ...config, databaseId: e.target.value })}
                  placeholder="(default)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GCP API Key / Web Key (Optional)
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Region
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <select
                  value={config.region}
                  onChange={e => setConfig({ ...config, region: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="asia-south1">asia-south1 (Mumbai, India - Fastest)</option>
                  <option value="asia-south2">asia-south2 (Delhi, India)</option>
                  <option value="asia-southeast1">asia-southeast1 (Singapore)</option>
                  <option value="us-central1">us-central1 (Iowa, USA)</option>
                  <option value="europe-west1">europe-west1 (Belgium)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Save Google Cloud Credentials
            </button>
          </div>
        </form>

        {/* Database Migration & Export Tools */}
        <div className="border-t border-slate-800/80 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Google Cloud Database Export &amp; Scripts
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Generate production schemas for Google Cloud SQL (PostgreSQL) or Firestore Native.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadCloudSQL}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-sky-400" />
              <span>Export Cloud SQL (.sql)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadFirestoreJSON}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-amber-400" />
              <span>Export Firestore (.json)</span>
            </button>

            <button
              type="button"
              onClick={handleCopySQLSnippet}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors ml-auto"
            >
              {copiedSQL ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSQL ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
        </div>

        {/* Setup Tutorial Accordion / Guide */}
        <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs space-y-2 text-slate-300">
          <span className="font-bold text-indigo-300 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Quick Google Cloud Deployment Guide
          </span>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 pl-1 leading-relaxed">
            <li>Visit <strong className="text-slate-300">console.cloud.google.com</strong> and create a new project.</li>
            <li>In the search bar, open <strong className="text-slate-300">Firestore</strong> and choose <em>Native Mode</em> in region <span className="font-mono text-slate-300">asia-south1</span>.</li>
            <li>{SUPER_ADMIN_CREDENTIALS.name} is configured as the Super Admin root identity with email <span className="font-mono text-indigo-300">{SUPER_ADMIN_CREDENTIALS.email}</span>.</li>
            <li>Click <em>Sync Now</em> above to synchronize all local timetables, DSA problems, and GATE progress to your cloud instance.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
