import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  X,
  Search,
  Filter,
  AlertCircle,
  Building,
  Target,
  Mail,
  User,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AuthService, UserProfile, SUPER_ADMIN_CREDENTIALS } from '../../lib/auth';
import { playNotificationChime } from '../../lib/notifications';

interface AdminManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserStatusChange: () => void;
  onSwitchUserSession?: (user: UserProfile) => void;
}

export const AdminManagementModal: React.FC<AdminManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserStatusChange,
  onSwitchUserSession
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSuperAdmin = AuthService.isSuperAdmin(currentUser);
  const allUsers = AuthService.getAllUsers();

  const pendingCount = allUsers.filter(u => u.status === 'pending').length;
  const approvedCount = allUsers.filter(u => u.status === 'approved').length;

  const filteredUsers = allUsers.filter(u => {
    if (filter === 'pending' && u.status !== 'pending') return false;
    if (filter === 'approved' && u.status !== 'approved') return false;
    if (filter === 'rejected' && u.status !== 'rejected') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.college && u.college.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleApprove = (userId: string, userName: string) => {
    const ok = AuthService.approveUser(userId, currentUser);
    if (ok) {
      playNotificationChime('success');
      setActionMessage(`Approved access for ${userName}! Their timetable and features are now unlocked.`);
      setTimeout(() => setActionMessage(null), 4000);
      onUserStatusChange();
    }
  };

  const handleReject = (userId: string, userName: string) => {
    const ok = AuthService.rejectUser(userId, currentUser);
    if (ok) {
      playNotificationChime('beep');
      setActionMessage(`Revoked / rejected access for ${userName}.`);
      setTimeout(() => setActionMessage(null), 4000);
      onUserStatusChange();
    }
  };

  const handleDelete = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete user ${userName}?`)) {
      const ok = AuthService.deleteUser(userId, currentUser);
      if (ok) {
        setActionMessage(`Deleted user profile ${userName}.`);
        setTimeout(() => setActionMessage(null), 4000);
        onUserStatusChange();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Super Admin Control Center</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Rishabh Gautam
                </span>
              </div>
              <p className="text-xs text-slate-400">
                User approvals, profile isolation, and multi-tenant security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Message Banner */}
        {actionMessage && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="text-[11px] text-slate-400 block">Total Users</span>
            <span className="text-xl font-bold text-white mt-1 block">{allUsers.length}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10">
            <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 block">
              <Clock className="h-3 w-3" /> Pending Approvals
            </span>
            <span className="text-xl font-bold text-amber-400 mt-1 block">{pendingCount}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 block">
              <CheckCircle2 className="h-3 w-3" /> Approved Students
            </span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">{approvedCount}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10">
            <span className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 block">
              <ShieldCheck className="h-3 w-3" /> Super Admin
            </span>
            <span className="text-xs font-mono text-indigo-200 mt-1.5 block truncate">
              {SUPER_ADMIN_CREDENTIALS.email}
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors flex items-center gap-1.5 ${
                  filter === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{tab}</span>
                {tab === 'pending' && pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search user, email, college..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Users Table / List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No users matching current filter.
            </div>
          ) : (
            filteredUsers.map(user => {
              const isAdmin = user.role === 'super_admin';
              const isPending = user.status === 'pending';
              const isApproved = user.status === 'approved';

              return (
                <div
                  key={user.id}
                  className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isAdmin
                        ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                        : isPending
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{user.name}</span>
                        {isAdmin && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Super Admin
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isPending
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {user.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-500" />
                          {user.email}
                        </span>
                        {user.college && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Building className="h-3 w-3 text-slate-500" />
                            {user.college}
                          </span>
                        )}
                        <span className="text-emerald-400">
                          Target: {user.targetGateScore || 70}+
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {/* Approve Button */}
                    {!isAdmin && !isApproved && (
                      <button
                        onClick={() => handleApprove(user.id, user.name)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                        title="Approve profile and unlock timetables"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Revoke Button */}
                    {!isAdmin && isApproved && (
                      <button
                        onClick={() => handleReject(user.id, user.name)}
                        className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1.5 text-xs font-semibold transition-colors"
                        title="Revoke access (locks timetables again)"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Revoke</span>
                      </button>
                    )}

                    {/* Switch User Session (for testing/support) */}
                    {onSwitchUserSession && (
                      <button
                        onClick={() => onSwitchUserSession(user)}
                        className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 text-xs font-semibold transition-colors"
                        title="Switch active session to this user"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    )}

                    {/* Delete User */}
                    {!isAdmin && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
