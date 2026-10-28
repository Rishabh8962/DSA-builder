import React, { useState } from 'react';
import {
  Code2,
  ExternalLink,
  Plus,
  Search,
  CheckCircle2,
  RotateCw,
  Clock,
  BookOpen,
  Calendar,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { DSAProblem, DSADifficulty, DSAStatus } from '../../types';
import { calculateDSAStats, calculateNextSpacedRevisionDate } from '../../lib/calculations';
import { getLiveDateString } from '../../lib/dateTime';
import { playNotificationChime } from '../../lib/notifications';

interface DSAViewProps {
  problems: DSAProblem[];
  onUpdateProblems: (problems: DSAProblem[]) => void;
  dailyTarget: number;
}

export const DSAView: React.FC<DSAViewProps> = ({
  problems,
  onUpdateProblems,
  dailyTarget
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'revision'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProblem, setEditingProblem] = useState<DSAProblem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New problem form state
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Arrays & Hashing');
  const [newDifficulty, setNewDifficulty] = useState<DSADifficulty>('Easy');
  const [newPlatform, setNewPlatform] = useState<'LeetCode' | 'GeeksforGeeks' | 'HackerRank' | 'CodeStudio' | 'Other'>('LeetCode');
  const [newUrl, setNewUrl] = useState('');

  const stats = calculateDSAStats(problems);

  // Filtered problems list
  const filteredProblems = problems.filter(p => {
    if (activeTab === 'revision') {
      return p.status === 'Needs Revision' || (p.spacedRevisionDue && p.spacedRevisionDue <= '2026-10-31');
    }
    const matchesTopic = selectedTopic === 'All' || p.topic.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesDiff && matchesSearch;
  });

  // Unique topics
  const topicsList = ['All', 'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Binary Search', 'Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs & BFS/DFS', 'Dynamic Programming'];

  const handleUpdateStatus = (problem: DSAProblem, newStatus: DSAStatus) => {
    const updated = problems.map(p => {
      if (p.id === problem.id) {
        const nextStage = newStatus === 'Solved' ? Math.min(4, p.revisionStage + 1) : p.revisionStage;
        const nextRevision = newStatus === 'Solved' ? calculateNextSpacedRevisionDate(nextStage) : undefined;
        return {
          ...p,
          status: newStatus,
          solvedDate: newStatus === 'Solved' ? getLiveDateString() : p.solvedDate,
          revisionStage: nextStage,
          spacedRevisionDue: nextRevision
        };
      }
      return p;
    });

    onUpdateProblems(updated);
    playNotificationChime(newStatus === 'Solved' ? 'success' : 'beep');
  };

  const handleSaveProblemDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;

    const updated = problems.map(p => (p.id === editingProblem.id ? editingProblem : p));
    onUpdateProblems(updated);
    setEditingProblem(null);
    playNotificationChime('success');
  };

  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newProblem: DSAProblem = {
      id: `dsa-${Date.now()}`,
      title: newTitle,
      topic: newTopic,
      difficulty: newDifficulty,
      platform: newPlatform,
      platformUrl: newUrl || undefined,
      status: 'Not Started',
      attempts: 0,
      timeSpentMinutes: 0,
      hintsUsed: false,
      revisionStage: 0
    };

    onUpdateProblems([newProblem, ...problems]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewUrl('');
    playNotificationChime('success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Code2 className="h-5 w-5 text-emerald-400" />
            <span>DSA in Java Practice Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Topic-wise curated problems, space/time complexity notes, and spaced repetition (1d, 3d, 7d, 14d).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Problem</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Total Solved</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{stats.solved}</span>
          <span className="text-[10px] text-slate-500 block">/ {stats.total} total</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Daily Target</span>
          <span className="text-2xl font-bold font-mono text-indigo-400">{dailyTarget}</span>
          <span className="text-[10px] text-slate-500 block">probs / college day</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Dec 31 Target</span>
          <span className="text-2xl font-bold font-mono text-amber-400">50–65</span>
          <span className="text-[10px] text-slate-500 block">Foundation milestone</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Needs Revision</span>
          <span className="text-2xl font-bold font-mono text-violet-400">{stats.needsRevision}</span>
          <span className="text-[10px] text-slate-500 block">Spaced queue</span>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`border-b-2 py-2 text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              All Practice Problems ({problems.length})
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`border-b-2 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'revision'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Spaced Revision Queue ({problems.filter(p => p.status === 'Needs Revision').length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'all' && (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search problem title or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              {topicsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        )}
      </div>

      {/* Problems List */}
      <div className="space-y-2.5">
        {filteredProblems.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-8 text-center text-slate-400">
            <Code2 className="h-8 w-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold">No problems match your current filter</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the topic or difficulty filter</p>
          </div>
        ) : (
          filteredProblems.map(problem => {
            const diffColors: Record<string, string> = {
              Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
              Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
            };

            const statusColors: Record<string, string> = {
              'Solved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
              'Attempted': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              'Needs Revision': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
              'Not Started': 'bg-slate-800 text-slate-400 border-slate-700'
            };

            return (
              <div
                key={problem.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-800 bg-[#0c1224] p-3.5 hover:border-slate-700 transition-all gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {problem.title}
                      </span>
                      <span className={`rounded border px-1.5 py-0.2 text-[10px] font-semibold ${diffColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {problem.topic}
                      </span>
                      {problem.platformUrl && (
                        <a
                          href={problem.platformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-indigo-400 inline-flex items-center gap-0.5 text-[10px]"
                        >
                          <span>{problem.platform}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      {problem.timeSpentMinutes > 0 && (
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-slate-500" />
                          {problem.timeSpentMinutes} mins
                        </span>
                      )}
                      {problem.attempts > 0 && (
                        <span>Attempts: {problem.attempts}</span>
                      )}
                      {problem.spacedRevisionDue && (
                        <span className="text-violet-400 font-mono flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Revise: {problem.spacedRevisionDue} (Stage {problem.revisionStage})
                        </span>
                      )}
                      {problem.mistakesNotes && (
                        <span className="text-amber-400 flex items-center gap-1 truncate max-w-xs">
                          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                          <span>{problem.mistakesNotes}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Switcher & Edit Notes */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <select
                    value={problem.status}
                    onChange={e => handleUpdateStatus(problem, e.target.value as DSAStatus)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${statusColors[problem.status]}`}
                  >
                    <option value="Not Started" className="bg-slate-900 text-slate-300">Not Started</option>
                    <option value="Attempted" className="bg-slate-900 text-amber-300">Attempted</option>
                    <option value="Solved" className="bg-slate-900 text-emerald-300">Solved</option>
                    <option value="Needs Revision" className="bg-slate-900 text-violet-300">Needs Revision</option>
                  </select>

                  <button
                    onClick={() => setEditingProblem(problem)}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Notes & Errors
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Notes / Approach Modal */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveProblemDetails}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Problem Log: {editingProblem.title}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time Spent (mins)</label>
                <input
                  type="number"
                  min="0"
                  value={editingProblem.timeSpentMinutes || 0}
                  onChange={e => setEditingProblem({ ...editingProblem, timeSpentMinutes: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attempts Count</label>
                <input
                  type="number"
                  min="0"
                  value={editingProblem.attempts || 0}
                  onChange={e => setEditingProblem({ ...editingProblem, attempts: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span>Mistake Analysis & Edge Cases Encountered</span>
              </label>
              <textarea
                value={editingProblem.mistakesNotes || ''}
                onChange={e => setEditingProblem({ ...editingProblem, mistakesNotes: e.target.value })}
                placeholder="e.g. Missed duplicate values, integer overflow, or off-by-one pointer index..."
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-indigo-400" />
                <span>Correct Approach & Java Implementation Idea</span>
              </label>
              <textarea
                value={editingProblem.correctApproach || ''}
                onChange={e => setEditingProblem({ ...editingProblem, correctApproach: e.target.value })}
                placeholder="e.g. Used HashMap for O(n) lookup instead of brute force O(n^2)..."
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hintsCheck"
                checked={editingProblem.hintsUsed || false}
                onChange={e => setEditingProblem({ ...editingProblem, hintsUsed: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="hintsCheck" className="text-xs text-slate-300">
                Looked at solution editorial or hints
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingProblem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Save Notes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Problem Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateProblem}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Add DSA Problem</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Subarray Sum Equals K"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic</label>
                <select
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {topicsList.filter(t => t !== 'All').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={e => setNewDifficulty(e.target.value as DSADifficulty)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
                <select
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="CodeStudio">CodeStudio</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Problem URL (optional)</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://leetcode.com/..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
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
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Add Problem
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
