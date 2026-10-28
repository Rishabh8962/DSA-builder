import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Calendar,
  Plus,
  BookOpen,
  Code2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RoadmapPhase, MilestoneItem } from '../../types';
import { playNotificationChime } from '../../lib/notifications';

interface RoadmapViewProps {
  phases: RoadmapPhase[];
  onUpdatePhases: (phases: RoadmapPhase[]) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ phases, onUpdatePhases }) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string>('phase1'); // Phase 1 active today (Oct 27)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneType, setNewMilestoneType] = useState<'GATE' | 'DSA' | 'Placement' | 'Review'>('GATE');
  const [activeAddPhaseId, setActiveAddPhaseId] = useState<string | null>(null);

  const handleToggleMilestone = (phaseId: string, milestoneId: string) => {
    const updated = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          milestones: phase.milestones.map(m => {
            if (m.id === milestoneId) {
              const nextStatus = !m.completed;
              return {
                ...m,
                completed: nextStatus,
                completedAt: nextStatus ? new Date().toISOString() : undefined
              };
            }
            return m;
          })
        };
      }
      return phase;
    });

    onUpdatePhases(updated);
    playNotificationChime('beep');
  };

  const handleAddMilestone = (phaseId: string) => {
    if (!newMilestoneTitle.trim()) return;

    const newMilestone: MilestoneItem = {
      id: `milestone-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      subjectType: newMilestoneType,
      completed: false
    };

    const updated = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          milestones: [...phase.milestones, newMilestone]
        };
      }
      return phase;
    });

    onUpdatePhases(updated);
    setNewMilestoneTitle('');
    setActiveAddPhaseId(null);
    playNotificationChime('success');
  };

  // Overall milestone calculations
  const totalMilestones = phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = phases.reduce(
    (acc, p) => acc + p.milestones.filter(m => m.completed).length,
    0
  );
  const overallRoadmapPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-400" />
              <span>Study Roadmap (Oct 27, 2026 – Mar 31, 2027)</span>
            </h1>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-300">
              Phase 1 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured 8-phase timeline covering the entire official GATE CS syllabus and placement readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Milestones Completed</span>
            <span className="text-base font-bold text-white font-mono">
              {completedMilestones} <span className="text-slate-500 text-xs font-normal">/ {totalMilestones}</span>
            </span>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 font-mono text-sm font-bold text-indigo-300">
            {overallRoadmapPercent}%
          </div>
        </div>
      </div>

      {/* Phase Cards Timeline */}
      <div className="space-y-4">
        {phases.map((phase, idx) => {
          const isExpanded = expandedPhaseId === phase.id;
          const completedInPhase = phase.milestones.filter(m => m.completed).length;
          const totalInPhase = phase.milestones.length;
          const phasePercent = totalInPhase > 0 ? Math.round((completedInPhase / totalInPhase) * 100) : 0;
          const isPhase1 = phase.id === 'phase1';

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border transition-all ${
                isPhase1
                  ? 'border-indigo-500/40 bg-[#0c142e] shadow-lg shadow-indigo-950/40'
                  : 'border-slate-800 bg-[#0b1020]'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedPhaseId(isExpanded ? '' : phase.id)}
                className="flex items-center justify-between p-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                    isPhase1
                      ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md'
                      : phasePercent === 100
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    P{phase.phaseNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-white">{phase.name}</h2>
                      <span className="text-xs text-slate-400 hidden sm:inline">— {phase.subtitle}</span>
                      {isPhase1 && (
                        <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
                          Current Focus
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3 text-indigo-400" />
                      {phase.startDate} to {phase.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[11px] font-mono text-slate-300">
                      {completedInPhase} / {totalInPhase} done
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${phasePercent}%` }}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="border-t border-slate-800/80 p-4 pt-3 space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {phase.description}
                  </p>

                  {/* Dual columns: GATE Focus & DSA Focus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3">
                      <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                        <span>GATE Syllabus Target</span>
                      </h3>
                      <ul className="space-y-1.5">
                        {phase.gateFocus.map((item, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
                      <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
                        <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>DSA in Java Target</span>
                      </h3>
                      <ul className="space-y-1.5">
                        {phase.dsaFocus.map((item, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Actionable Milestones
                      </span>
                      <button
                        onClick={() => setActiveAddPhaseId(activeAddPhaseId === phase.id ? null : phase.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    {/* Add Milestone Inline Form */}
                    {activeAddPhaseId === phase.id && (
                      <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-indigo-500/30 bg-slate-900 p-2.5">
                        <input
                          type="text"
                          value={newMilestoneTitle}
                          onChange={e => setNewMilestoneTitle(e.target.value)}
                          placeholder="Milestone description..."
                          className="flex-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <select
                          value={newMilestoneType}
                          onChange={e => setNewMilestoneType(e.target.value as any)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white"
                        >
                          <option value="GATE">GATE</option>
                          <option value="DSA">DSA</option>
                          <option value="Placement">Placement</option>
                          <option value="Review">Review</option>
                        </select>
                        <button
                          onClick={() => handleAddMilestone(phase.id)}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {phase.milestones.map(m => {
                        const typeColors: Record<string, string> = {
                          GATE: 'bg-indigo-500/20 text-indigo-300',
                          DSA: 'bg-emerald-500/20 text-emerald-300',
                          Placement: 'bg-violet-500/20 text-violet-300',
                          Review: 'bg-amber-500/20 text-amber-300'
                        };

                        return (
                          <div
                            key={m.id}
                            onClick={() => handleToggleMilestone(phase.id, m.id)}
                            className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition-all ${
                              m.completed
                                ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                                  m.completed
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : 'border-slate-700 bg-slate-800'
                                }`}
                              >
                                {m.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                              </div>
                              <span className={`text-xs ${m.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                {m.title}
                              </span>
                            </div>

                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold font-mono ${typeColors[m.subjectType] || typeColors.GATE}`}>
                              {m.subjectType}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
