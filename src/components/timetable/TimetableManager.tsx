import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Bell,
  BellOff,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { TimetableBlock, TimeSlotCategory } from '../../types';
import { playNotificationChime } from '../../lib/notifications';
import { getLiveDateString, getLiveDayOfWeekType } from '../../lib/dateTime';

interface TimetableManagerProps {
  weekdayBlocks: TimetableBlock[];
  saturdayBlocks: TimetableBlock[];
  sundayBlocks: TimetableBlock[];
  todayDateStr?: string;
  liveDayType?: 'weekday' | 'saturday' | 'sunday';
  onUpdateWeekday: (blocks: TimetableBlock[]) => void;
  onUpdateSaturday: (blocks: TimetableBlock[]) => void;
  onUpdateSunday: (blocks: TimetableBlock[]) => void;
  onResetTimetables: () => void;
  onOpenRecoveryModal: () => void;
}

export const TimetableManager: React.FC<TimetableManagerProps> = ({
  weekdayBlocks,
  saturdayBlocks,
  sundayBlocks,
  todayDateStr = getLiveDateString(),
  liveDayType = getLiveDayOfWeekType(),
  onUpdateWeekday,
  onUpdateSaturday,
  onUpdateSunday,
  onResetTimetables,
  onOpenRecoveryModal
}) => {
  const [activeTab, setActiveTab] = useState<'weekday' | 'saturday' | 'sunday'>(liveDayType);
  const [editingBlock, setEditingBlock] = useState<TimetableBlock | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New block form state
  const [newActivity, setNewActivity] = useState('');
  const [newStartTime, setNewStartTime] = useState('06:20');
  const [newEndTime, setNewEndTime] = useState('07:50');
  const [newCategory, setNewCategory] = useState<TimeSlotCategory>('study');
  const [newDescription, setNewDescription] = useState('');
  const [newReminder, setNewReminder] = useState(true);

  const getCurrentBlocks = () => {
    if (activeTab === 'weekday') return weekdayBlocks;
    if (activeTab === 'saturday') return saturdayBlocks;
    return sundayBlocks;
  };

  const updateCurrentBlocks = (newBlocks: TimetableBlock[]) => {
    if (activeTab === 'weekday') onUpdateWeekday(newBlocks);
    else if (activeTab === 'saturday') onUpdateSaturday(newBlocks);
    else onUpdateSunday(newBlocks);
  };

  const handleToggleComplete = (id: string) => {
    const current = getCurrentBlocks();
    const updated = current.map(b => {
      if (b.id === id) {
        return {
          ...b,
          completedDate: b.completedDate === todayDateStr ? undefined : todayDateStr
        };
      }
      return b;
    });
    updateCurrentBlocks(updated);
    playNotificationChime('beep');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;
    const current = getCurrentBlocks();
    const updated = current.map(b => (b.id === editingBlock.id ? editingBlock : b));
    updateCurrentBlocks(updated);
    setEditingBlock(null);
    playNotificationChime('success');
  };

  const handleAddNewBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity) return;

    const newBlock: TimetableBlock = {
      id: `custom-block-${Date.now()}`,
      timeRange: `${newStartTime}–${newEndTime}`,
      startTime: newStartTime,
      endTime: newEndTime,
      activity: newActivity,
      description: newDescription,
      category: newCategory,
      isEditable: true,
      repeatDays: activeTab === 'weekday' ? [1, 2, 3, 4, 5] : activeTab === 'saturday' ? [6] : [0],
      hasReminder: newReminder,
      reminderLeadMinutes: 5
    };

    const current = getCurrentBlocks();
    const combined = [...current, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime));
    updateCurrentBlocks(combined);

    setIsAddModalOpen(false);
    setNewActivity('');
    setNewDescription('');
    playNotificationChime('success');
  };

  const handleDeleteBlock = (id: string) => {
    const current = getCurrentBlocks();
    const filtered = current.filter(b => b.id !== id);
    updateCurrentBlocks(filtered);
  };

  const badgeColors: Record<string, string> = {
    study: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    college: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    gym: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    personal: 'bg-slate-800 text-slate-400 border-slate-700',
    sleep: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    revision: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
  };

  const currentBlocks = getCurrentBlocks();

  return (
    <div className="space-y-6">
      {/* Top Header & Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-400" />
            <span>My Timetable & Agenda</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Strict IST schedule tailored for college (9–5), gym (6–8), and 10:30 PM sleep discipline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRecoveryModal}
            className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Quick Recovery</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex gap-2">
          {(['weekday', 'saturday', 'sunday'] as const).map(tab => {
            const isToday = tab === liveDayType;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 py-2.5 px-4 text-xs font-bold capitalize transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab === 'weekday' ? 'Weekday (Mon–Fri)' : tab === 'saturday' ? 'Saturday Schedule' : 'Sunday Schedule'}</span>
                {isToday && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    TODAY
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onResetTimetables}
          className="text-[11px] text-slate-500 hover:text-slate-300 hover:underline px-2"
        >
          Reset to default template
        </button>
      </div>

      {/* Schedule Info Box */}
      <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-xs text-indigo-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          <span>
            {activeTab === 'weekday'
              ? 'Weekday focus: 90m morning GATE session + 60m evening DSA in Java + 30m aptitude/error revision.'
              : activeTab === 'saturday'
              ? 'Saturday focus: 2h GATE theory + 2h DSA deep problem solving + 60m aptitude + weekly review.'
              : 'Sunday focus: 2h GATE practice test/mock + 90m DSA + 30m weekly planning & error log analysis.'}
          </span>
        </div>
      </div>

      {/* Schedule Blocks List */}
      <div className="space-y-3">
        {currentBlocks.map(block => {
          const isDone = block.completedDate === todayDateStr;
          return (
            <div
              key={block.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border p-4 transition-all gap-3 ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                  : 'border-slate-800 bg-[#0c1224] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(block.id)}
                  className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
                    isDone
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-700 bg-slate-800/80 hover:border-indigo-400'
                  }`}
                  aria-label="Toggle completion"
                >
                  {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      {block.timeRange}
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[9px] uppercase font-mono font-semibold ${badgeColors[block.category] || badgeColors.personal}`}>
                      {block.category}
                    </span>
                    {block.hasReminder && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400" title="Reminder enabled">
                        <Bell className="h-3 w-3 text-amber-400" />
                        <span className="hidden sm:inline">Alert</span>
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm font-bold mt-1 ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {block.activity}
                  </h3>
                  {block.description && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {block.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setEditingBlock(block)}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Edit block"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBlock(block.id)}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-rose-400 hover:bg-rose-950/40"
                  title="Delete block"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Edit Schedule Block</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Title</label>
              <input
                type="text"
                required
                value={editingBlock.activity}
                onChange={e => setEditingBlock({ ...editingBlock, activity: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time (24h)</label>
                <input
                  type="time"
                  required
                  value={editingBlock.startTime}
                  onChange={e => setEditingBlock({ ...editingBlock, startTime: e.target.value, timeRange: `${e.target.value}–${editingBlock.endTime}` })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Time (24h)</label>
                <input
                  type="time"
                  required
                  value={editingBlock.endTime}
                  onChange={e => setEditingBlock({ ...editingBlock, endTime: e.target.value, timeRange: `${editingBlock.startTime}–${e.target.value}` })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={editingBlock.category}
                onChange={e => setEditingBlock({ ...editingBlock, category: e.target.value as TimeSlotCategory })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="study">Study (GATE / DSA)</option>
                <option value="college">College</option>
                <option value="gym">Gym / Fitness</option>
                <option value="revision">Aptitude & Revision</option>
                <option value="personal">Personal / Routine / Meals</option>
                <option value="sleep">Sleep</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Notes</label>
              <textarea
                value={editingBlock.description || ''}
                onChange={e => setEditingBlock({ ...editingBlock, description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editReminder"
                checked={editingBlock.hasReminder}
                onChange={e => setEditingBlock({ ...editingBlock, hasReminder: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="editReminder" className="text-xs text-slate-300 font-medium">
                Trigger Reminder Alert for this block
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingBlock(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddNewBlock}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Add Schedule Slot ({activeTab})</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Name</label>
              <input
                type="text"
                required
                value={newActivity}
                onChange={e => setNewActivity(e.target.value)}
                placeholder="e.g. Algorithms Graph Practice"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  value={newStartTime}
                  onChange={e => setNewStartTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                <input
                  type="time"
                  required
                  value={newEndTime}
                  onChange={e => setNewEndTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as TimeSlotCategory)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="study">Study (GATE / DSA)</option>
                <option value="college">College</option>
                <option value="gym">Gym / Fitness</option>
                <option value="revision">Aptitude & Revision</option>
                <option value="personal">Personal / Routine</option>
                <option value="sleep">Sleep</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Focus</label>
              <textarea
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Key goals or topics for this block..."
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newReminder"
                checked={newReminder}
                onChange={e => setNewReminder(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="newReminder" className="text-xs text-slate-300 font-medium">
                Set Reminder Alert
              </label>
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
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Add Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
