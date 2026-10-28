import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  FileText,
  UserCheck
} from 'lucide-react';
import { CompanyApplication, UserSettings } from '../../types';
import { calculateDaysRemaining } from '../../lib/calculations';
import { playNotificationChime } from '../../lib/notifications';

interface PlacementViewProps {
  companies: CompanyApplication[];
  onUpdateCompanies: (companies: CompanyApplication[]) => void;
  userSettings: UserSettings;
}

export const PlacementView: React.FC<PlacementViewProps> = ({
  companies,
  onUpdateCompanies,
  userSettings
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyApplication | null>(null);

  // New company form
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Software Development Engineer');
  const [ctc, setCtc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [eligibility, setEligibility] = useState('B.Tech CS/IT, >= 7.0 CGPA');
  const [notes, setNotes] = useState('');

  const placementDays = calculateDaysRemaining(userSettings.placementMilestoneDate);

  const statusColors: Record<string, string> = {
    'Wishlist': 'bg-slate-800 text-slate-300 border-slate-700',
    'Applied': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Online Assessment': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Technical Round': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'HR Round': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    'Offer': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Rejected': 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    const newCompany: CompanyApplication = {
      id: `comp-${Date.now()}`,
      companyName,
      role,
      ctcOrStipend: ctc || undefined,
      deadline: deadline || undefined,
      eligibility,
      status: 'Wishlist',
      interviewStages: ['OA', 'Technical 1', 'HR'],
      notes,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onUpdateCompanies([newCompany, ...companies]);
    setIsAddModalOpen(false);
    setCompanyName('');
    setCtc('');
    setNotes('');
    playNotificationChime('success');
  };

  const handleUpdateStatus = (companyId: string, status: any) => {
    const updated = companies.map(c => {
      if (c.id === companyId) {
        return { ...c, status, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return c;
    });
    onUpdateCompanies(updated);
    playNotificationChime(status === 'Offer' ? 'success' : 'beep');
  };

  const handleDeleteCompany = (id: string) => {
    onUpdateCompanies(companies.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-violet-400" />
              <span>Campus Placement Operating System</span>
            </h1>
            <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-violet-300">
              February 2027 Milestone
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Application tracking, eligibility filters, online assessments, and CS interview rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-800 bg-[#0d1326] px-4 py-2 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Placement Kickoff</span>
            <span className="text-xl font-bold font-mono text-violet-300">{placementDays} days</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/30 hover:bg-violet-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Track Company</span>
          </button>
        </div>
      </div>

      {/* Modules Checklist Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: 'DSA & Java Core', desc: 'Collections, OOPs, Multithreading', color: 'border-emerald-500/30 text-emerald-300' },
          { title: 'Core CS Essentials', desc: 'OS, DBMS, SQL, Computer Networks', color: 'border-indigo-500/30 text-indigo-300' },
          { title: 'Aptitude & Verbal', desc: 'Quant, Logical, Speed calculations', color: 'border-amber-500/30 text-amber-300' },
          { title: 'Resume & Projects', desc: 'System design, STAR framework explanation', color: 'border-violet-500/30 text-violet-300' }
        ].map((mod, i) => (
          <div key={i} className={`rounded-xl border bg-[#0c1224] p-3 ${mod.color}`}>
            <span className="text-xs font-bold block">{mod.title}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{mod.desc}</span>
          </div>
        ))}
      </div>

      {/* Companies Application CRM */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>Campus Drives & Applications ({companies.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Milestone planning list</span>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-8 text-center text-slate-400">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold">No company applications tracked yet</p>
            <p className="text-xs text-slate-500 mt-1">Add campus visit companies and dream drives to stay organized</p>
          </div>
        ) : (
          companies.map(comp => (
            <div
              key={comp.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-800 bg-[#0c1224] p-4 hover:border-slate-700 transition-all gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{comp.companyName}</h3>
                  <span className="text-xs text-slate-400">• {comp.role}</span>
                  {comp.ctcOrStipend && (
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold">
                      {comp.ctcOrStipend}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="text-[11px] font-mono">Criteria: {comp.eligibility}</span>
                  {comp.deadline && (
                    <span className="flex items-center gap-1 font-mono text-amber-400 text-[11px]">
                      <Calendar className="h-3 w-3" /> Deadline: {comp.deadline}
                    </span>
                  )}
                  {comp.notes && (
                    <span className="text-slate-300 text-[11px] italic">“{comp.notes}”</span>
                  )}
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <select
                  value={comp.status}
                  onChange={e => handleUpdateStatus(comp.id, e.target.value)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${statusColors[comp.status]}`}
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="Applied">Applied</option>
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="HR Round">HR Round</option>
                  <option value="Offer">Offer 🎉</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={() => handleDeleteCompany(comp.id)}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-rose-400 hover:bg-rose-950/30"
                  title="Delete company"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateCompany}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Track Company Drive</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Cisco / Google / Amazon / TCS Digital"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CTC or Stipend</label>
                <input
                  type="text"
                  value={ctc}
                  onChange={e => setCtc(e.target.value)}
                  placeholder="e.g. 15–20 LPA"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={e => setEligibility(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Preparation Focus</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Key rounds, coding assessment patterns, or referral status..."
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500"
              >
                Add Company
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
