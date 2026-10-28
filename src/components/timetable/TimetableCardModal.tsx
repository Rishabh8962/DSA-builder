import React from 'react';
import { X, Printer, Download, Sparkles, Clock, ShieldCheck, Flame } from 'lucide-react';
import { TimetableBlock } from '../../types';

interface TimetableCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekdayBlocks: TimetableBlock[];
  saturdayBlocks: TimetableBlock[];
  sundayBlocks: TimetableBlock[];
}

export const TimetableCardModal: React.FC<TimetableCardModalProps> = ({
  isOpen,
  onClose,
  weekdayBlocks,
  saturdayBlocks,
  sundayBlocks
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-indigo-500/30 bg-[#070b16] p-6 sm:p-8 shadow-2xl relative text-slate-100 my-6">
        {/* Modal Controls (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-white">Printable Timetable Card & Desk Cheatsheet</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md transition-all"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close card"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Canvas */}
        <div className="space-y-6 bg-[#080d1a] border border-slate-800 rounded-2xl p-6 shadow-inner print:border-none print:p-0">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  PrepPilot Operating System
                </span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[9px] font-mono text-indigo-300">
                  IST (Asia/Kolkata)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                GATE CS 2027 & Placement Daily Schedule
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: 70+ Marks • Oct 27, 2026 to Mar 31, 2027
              </p>
            </div>

            <div className="text-right">
              <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 inline-flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>Social Media ≤30m / Day</span>
              </span>
            </div>
          </div>

          {/* Weekday Schedule Grid */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Weekday Routine (Monday to Friday)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {weekdayBlocks.map(block => {
                const isStudy = block.category === 'study' || block.category === 'revision';
                return (
                  <div
                    key={block.id}
                    className={`flex items-start justify-between rounded-xl border p-2.5 ${
                      isStudy
                        ? 'border-indigo-500/30 bg-indigo-950/20 text-white'
                        : 'border-slate-800/80 bg-slate-900/40 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold text-[11px] text-indigo-300 block">
                        {block.timeRange}
                      </span>
                      <span className="font-semibold block mt-0.5">{block.activity}</span>
                      {block.description && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {block.description}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 self-start">
                      {block.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekend Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block mb-1">
                Saturday Core Push
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• 2 Hours GATE focused theory & standard PYQ sets</li>
                <li>• 2 Hours DSA in Java deep problem solving</li>
                <li>• 1 Hour Quantitative Aptitude & Speed calculations</li>
                <li>• Weekly review & backlog catch-up</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
                Sunday Mock & Planning
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• 2 Hours GATE Practice Test or Sectional Mock</li>
                <li>• 90 Minutes DSA in Java practice</li>
                <li>• 30 Minutes Weekly planning for upcoming milestones</li>
                <li>• Error log analysis: Record calculation & concept slips</li>
              </ul>
            </div>
          </div>

          {/* Non-Negotiable Guardrails Footer */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-3 text-[11px] text-indigo-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <span>
                <strong>Protected Boundaries:</strong> 9:00 AM–5:00 PM College • 6:00–8:00 PM Gym • 10:30 PM Sleep. No study tasks scheduled over recovery.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
