import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles
} from 'lucide-react';
import { GATESubject, SubjectStatus } from '../../types';
import { calculateOverallGateProgress } from '../../lib/calculations';
import { playNotificationChime } from '../../lib/notifications';

interface GATETableProps {
  subjects: GATESubject[];
  onUpdateSubjects: (subjects: GATESubject[]) => void;
}

export const GATETable: React.FC<GATETableProps> = ({ subjects, onUpdateSubjects }) => {
  const [expandedSubjId, setExpandedSubjId] = useState<string | null>('subj-1');
  const [newWeakTopic, setNewWeakTopic] = useState<{ [subjectId: string]: string }>({});

  const overallProgress = calculateOverallGateProgress(subjects);
  const totalPYQs = subjects.reduce((acc, s) => acc + s.pyqsAttempted, 0);

  const handleUpdateSubjectField = (id: string, updates: Partial<GATESubject>) => {
    const updated = subjects.map(s => {
      if (s.id === id) {
        return { ...s, ...updates };
      }
      return s;
    });
    onUpdateSubjects(updated);
  };

  const handleToggleTopic = (subjectId: string, topicId: string) => {
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        const updatedTopics = s.topics.map(t => {
          if (t.id === topicId) return { ...t, completed: !t.completed };
          return t;
        });
        const completedCount = updatedTopics.filter(t => t.completed).length;
        const autoPercent = Math.round((completedCount / updatedTopics.length) * 100);
        return {
          ...s,
          topics: updatedTopics,
          syllabusPercent: autoPercent,
          status: autoPercent === 100 ? 'completed' : autoPercent > 0 ? 'learning' : s.status
        };
      }
      return s;
    });
    onUpdateSubjects(updated);
    playNotificationChime('beep');
  };

  const handleAddWeakTopic = (subjectId: string) => {
    const text = newWeakTopic[subjectId]?.trim();
    if (!text) return;

    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          weakTopics: [...(s.weakTopics || []), text]
        };
      }
      return s;
    });

    onUpdateSubjects(updated);
    setNewWeakTopic(prev => ({ ...prev, [subjectId]: '' }));
    playNotificationChime('success');
  };

  const handleRemoveWeakTopic = (subjectId: string, topicName: string) => {
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          weakTopics: (s.weakTopics || []).filter(w => w !== topicName)
        };
      }
      return s;
    });
    onUpdateSubjects(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span>GATE Computer Science 2027 Subject Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking all 12 official syllabus subjects, lecture notes, PYQs, and topic-level weak areas.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 px-3.5 py-1.5 text-center">
            <span className="text-[10px] text-indigo-300 font-semibold uppercase block">Syllabus Covered</span>
            <span className="text-xl font-bold font-mono text-white">{overallProgress}%</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total PYQs</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{totalPYQs}</span>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-3">
        {subjects.map(subject => {
          const isExpanded = expandedSubjId === subject.id;
          const statusColors: Record<SubjectStatus, string> = {
            not_started: 'bg-slate-800 text-slate-400 border-slate-700',
            learning: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
            revision: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
            completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          };

          return (
            <div
              key={subject.id}
              className={`rounded-2xl border transition-all ${
                isExpanded ? 'border-indigo-500/40 bg-[#0c1224] shadow-xl' : 'border-slate-800 bg-[#0a0f1d]'
              }`}
            >
              {/* Header Card */}
              <div
                onClick={() => setExpandedSubjId(isExpanded ? null : subject.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 font-mono text-xs font-bold text-indigo-300 border border-slate-700">
                    {subject.shortCode}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-white">{subject.name}</h2>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                        ~{subject.weightageEstimated} marks
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="font-mono">PYQs: {subject.pyqsAttempted} attempted</span>
                      {subject.pyqAccuracy > 0 && (
                        <span className="font-mono text-emerald-400">{subject.pyqAccuracy}% accuracy</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold capitalize font-mono ${statusColors[subject.status]}`}>
                    {subject.status.replace('_', ' ')}
                  </span>

                  <div className="w-24 hidden md:block">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="font-mono">{subject.syllabusPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${subject.syllabusPercent}%` }}
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

              {/* Detailed Breakdown */}
              {isExpanded && (
                <div className="border-t border-slate-800/80 p-4 space-y-4">
                  {/* Status & Inputs Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">Status</label>
                      <select
                        value={subject.status}
                        onChange={e => handleUpdateSubjectField(subject.id, { status: e.target.value as SubjectStatus })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="learning">Learning</option>
                        <option value="revision">Revision</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                        Syllabus Progress ({subject.syllabusPercent}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={subject.syllabusPercent}
                        onChange={e => handleUpdateSubjectField(subject.id, { syllabusPercent: Number(e.target.value) })}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">PYQ Questions Solved</label>
                      <input
                        type="number"
                        min="0"
                        value={subject.pyqsAttempted}
                        onChange={e => handleUpdateSubjectField(subject.id, { pyqsAttempted: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1">Next Revision Date</label>
                      <input
                        type="date"
                        value={subject.nextRevisionDate || ''}
                        onChange={e => handleUpdateSubjectField(subject.id, { nextRevisionDate: e.target.value })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Notes & Lectures toggles */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.lecturesDone}
                        onChange={e => handleUpdateSubjectField(subject.id, { lecturesDone: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                      />
                      <span>Lectures Completed</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subject.notesReady}
                        onChange={e => handleUpdateSubjectField(subject.id, { notesReady: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                      />
                      <span>Short Revision Notes Prepared</span>
                    </label>
                  </div>

                  {/* Weak Topics Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                      <span>Weak Areas & Mistakes Log</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {subject.weakTopics && subject.weakTopics.length > 0 ? (
                        subject.weakTopics.map(w => (
                          <span
                            key={w}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300"
                          >
                            <span>{w}</span>
                            <button
                              onClick={() => handleRemoveWeakTopic(subject.id, w)}
                              className="text-amber-400 hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No weak topics logged yet</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 max-w-sm">
                      <input
                        type="text"
                        placeholder="Add weak topic (e.g. BCNF decomposition)..."
                        value={newWeakTopic[subject.id] || ''}
                        onChange={e => setNewWeakTopic({ ...newWeakTopic, [subject.id]: e.target.value })}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddWeakTopic(subject.id)}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Official Syllabus Topic Checklist */}
                  <div>
                    <span className="block text-xs font-semibold text-slate-300 mb-2">
                      Official GATE Syllabus Topic Checklist
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {subject.topics.map(topic => (
                        <div
                          key={topic.id}
                          onClick={() => handleToggleTopic(subject.id, topic.id)}
                          className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition-all ${
                            topic.completed
                              ? 'border-emerald-500/30 bg-emerald-950/10'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                                topic.completed
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : 'border-slate-700 bg-slate-800'
                              }`}
                            >
                              {topic.completed && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                            <span className={`text-xs ${topic.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                              {topic.name}
                            </span>
                          </div>
                          {topic.weak && (
                            <span className="rounded bg-rose-500/20 px-1 py-0.5 text-[9px] font-semibold text-rose-300">
                              Weak
                            </span>
                          )}
                        </div>
                      ))}
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
