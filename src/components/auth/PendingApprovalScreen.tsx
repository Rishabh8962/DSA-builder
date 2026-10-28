import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  UserCheck,
  RefreshCw,
  LogOut,
  Mail,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Key
} from 'lucide-react';
import { UserProfile, SUPER_ADMIN_CREDENTIALS, AuthService } from '../../lib/auth';

interface PendingApprovalScreenProps {
  user: UserProfile;
  onRefreshUser: () => void;
  onLogout: () => void;
  onOpenAdminLogin: () => void;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  user,
  onRefreshUser,
  onLogout,
  onOpenAdminLogin
}) => {
  const [checking, setChecking] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleCheckStatus = () => {
    setChecking(true);
    setStatusFeedback(null);
    setTimeout(() => {
      onRefreshUser();
      setChecking(false);
      const allUsers = AuthService.getAllUsers();
      const current = allUsers.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (current && current.status === 'approved') {
        setStatusFeedback('Your ID and account have been approved! Loading workspace...');
      } else {
        setStatusFeedback('Still under review. Please notify Super Admin to approve your account.');
      }
    }, 700);
  };

  const isRejected = user.status === 'rejected';

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient decorative blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto text-center space-y-6">
        {/* Animated Badge Icon */}
        <div className="inline-flex relative items-center justify-center">
          <div className={`h-20 w-20 rounded-2xl flex items-center justify-center shadow-2xl border ${
            isRejected
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-rose-500/20'
              : 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-amber-500/20 animate-pulse'
          }`}>
            {isRejected ? <ShieldAlert className="h-10 w-10" /> : <Lock className="h-10 w-10" />}
          </div>
          <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-slate-700 bg-slate-900 text-slate-300 shadow">
            {isRejected ? 'Access Restricted' : 'Security Approval Gate'}
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {isRejected ? 'Account Access Restricted' : 'Account Pending Super Admin Approval'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {isRejected
              ? 'Your account request was declined. Please contact the administrator for clarification.'
              : 'All timetables, GATE CS subjects, and DSA trackers remain locked until your student ID & credentials are reviewed and approved by the Super Admin.'}
          </p>
        </div>

        {/* Student Credential Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224]/90 p-5 backdrop-blur-md shadow-2xl text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{user.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isRejected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {isRejected ? 'Status: Rejected' : 'Status: Pending Approval'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Assigned Super Admin</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                {SUPER_ADMIN_CREDENTIALS.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                {SUPER_ADMIN_CREDENTIALS.email}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Student ID &amp; Target</span>
              <span className="font-semibold text-slate-200 font-mono truncate block">
                {user.id}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                Target Score: {user.targetGateScore || 70}+
              </span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Multi-Tenant Access Gate</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              To guarantee individual timetable privacy and maintain multi-tenant integrity, new student profiles must be approved by Super Admin {SUPER_ADMIN_CREDENTIALS.name}. Once approved, you will have immediate access upon login.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Refresh Check */}
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
            <span>Check Approval Status</span>
          </button>

          {/* Switch to Super Admin Login with Password */}
          <button
            onClick={onOpenAdminLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all"
            title="Sign in with Super Admin credentials to approve student accounts"
          >
            <Key className="h-4 w-4 text-indigo-400" />
            <span>Super Admin Sign In</span>
          </button>

          {/* Log Out */}
          <button
            onClick={onLogout}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {statusFeedback && (
          <p className="text-xs text-indigo-300 animate-fade-in flex items-center justify-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> {statusFeedback}
          </p>
        )}
      </div>
    </div>
  );
};
