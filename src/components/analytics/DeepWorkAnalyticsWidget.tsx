import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Plus,
  Play,
  CheckCircle2,
  Filter,
  X
} from 'lucide-react';
import { FocusSession, DeepWorkDayCell } from '../../types';
import { calculateDeepWorkHeatmap } from '../../lib/calculations';
import { getLiveDateString } from '../../lib/dateTime';

interface DeepWorkAnalyticsWidgetProps {
  sessions: FocusSession[];
  onAddSession?: (session: FocusSession) => void;
  onOpenFocusModal?: () => void;
  todayDateStr?: string;
}

export const DeepWorkAnalyticsWidget: React.FC<DeepWorkAnalyticsWidgetProps> = ({
  sessions,
  onAddSession,
  onOpenFocusModal,
  todayDateStr = getLiveDateString()
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'GATE' | 'DSA' | 'Aptitude' | 'Revision'>('ALL');
  const [selectedDay, setSelectedDay] = useState<DeepWorkDayCell | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Manual session logging form state
  const [logDate, setLogDate] = useState(todayDateStr);
  const [logDuration, setLogDuration] = useState(50);
  const [logCategory, setLogCategory] = useState<'GATE' | 'DSA' | 'Aptitude' | 'Revision'>('GATE');
  const [logTitle, setLogTitle] = useState('Deep Work Sprint');

  // Filter sessions if category filter is active
  const filteredSessions = selectedCategory === 'ALL'
    ? sessions
    : sessions.filter(s => s.category === selectedCategory);

  const { days, summary } = calculateDeepWorkHeatmap(filteredSessions, todayDateStr, 30);

  // Default selected day to today if none selected
  const activeDay = selectedDay || days.find(d => d.isToday) || days[days.length - 1];

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddSession) return;
    const newSession: FocusSession = {
      id: `f-${Date.now()}`,
      startTime: `${logDate}T12:00:00`,
      durationMinutes: logDuration,
      taskTitle: logTitle,
      category: logCategory,
      completed: true
    };
    onAddSession(newSession);
    setIsLogModalOpen(false);
    setLogTitle('Deep Work Sprint');
  };

  // Group days into columns of weeks (Mon-Sun or 7 days)
  // 30 days is about 4.3 weeks. Let's arrange them into a responsive matrix
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Intensity color mapper
  const getIntensityClasses = (level: number, isToday: boolean, isSelected: boolean) => {
    let bg = 'bg-slate-900/80 border-slate-800 text-slate-500';
    if (level === 1) bg = 'bg-indigo-950/80 border-indigo-800/60 text-indigo-300';
    else if (level === 2) bg = 'bg-indigo-800/70 border-indigo-600/70 text-indigo-100 shadow-sm shadow-indigo-900/30';
    else if (level === 3) bg = 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30';
    else if (level === 4) bg = 'bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 border-cyan-300 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-cyan-400/50';

    const selectedRing = isSelected ? 'ring-2 ring-violet-400 scale-105 z-10' : '';
    const todayIndicator = isToday ? 'outline outline-2 outline-offset-1 outline-cyan-400' : '';

    return `${bg} ${selectedRing} ${todayIndicator}`;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'GATE': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'DSA': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Aptitude': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Revision': return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      default: return 'text-slate-400 bg-slate-800/50 border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      {/* Top Banner with App Logo & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <img
              src="/assets/aistudio/Grindly__Plan__Practice__Progress_2398434e.png"
              alt="Grindly OS Logo"
              className="h-11 w-auto rounded-xl border border-indigo-500/40 shadow-md shadow-indigo-500/20 object-contain hover:border-indigo-400 transition-all"
              onError={(e) => {
                // Fallback graceful badge
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                <span>Deep Work &amp; Flow Heatmap</span>
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/30">
                Last 30 Days
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Flow-state hours logged through Pomodoro sprint &amp; deep focus sessions.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {onOpenFocusModal && (
            <button
              onClick={onOpenFocusModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start Timer</span>
            </button>
          )}

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Flow</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {/* Total Deep Work */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Flow Time</span>
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-mono">{summary.totalFlowHours}</span>
            <span className="text-xs text-slate-400">hours</span>
          </div>
          <div className="mt-1 text-[11px] text-indigo-400 flex items-center gap-1">
            <span>{summary.totalSessions} sessions logged</span>
          </div>
        </div>

        {/* Daily Flow Average */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily Flow Avg</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-mono">{summary.dailyAverageHours}</span>
            <span className="text-xs text-slate-400">hrs/day</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Target: 3.5 hrs daily study
          </div>
        </div>

        {/* Flow Streak */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Flow Streak</span>
            <Flame className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-300 font-mono">{summary.currentFlowStreak}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Best streak: {summary.longestFlowStreak} days
          </div>
        </div>

        {/* Peak Work Day */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Peak Deep Work</span>
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-cyan-300 font-mono">
              {summary.peakDay ? summary.peakDay.hours : 0}
            </span>
            <span className="text-xs text-slate-400">hrs</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            {summary.peakDay ? summary.peakDay.dayLabel : 'No logs yet'}
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-3 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          <span>Category Filter:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'GATE', 'DSA', 'Aptitude', 'Revision'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Focus' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 30-Day Heatmap Grid */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span>30-Day Consistency Grid ({days[0]?.dayLabel} – {days[days.length - 1]?.dayLabel})</span>
          </span>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span>Less</span>
            <div className="h-3 w-3 rounded bg-slate-900 border border-slate-800" title="0h" />
            <div className="h-3 w-3 rounded bg-indigo-950/80 border border-indigo-800/60" title="&lt;= 1h" />
            <div className="h-3 w-3 rounded bg-indigo-800/70 border border-indigo-600/70" title="&lt;= 2h" />
            <div className="h-3 w-3 rounded bg-indigo-600 border border-indigo-400" title="&lt;= 3.5h" />
            <div className="h-3 w-3 rounded bg-gradient-to-tr from-violet-600 to-cyan-400 border border-cyan-300" title="&gt; 3.5h (Deep Flow)" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap cells */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {days.map((day) => {
            const isSelected = activeDay?.date === day.date;
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all cursor-pointer ${getIntensityClasses(
                  day.intensityLevel,
                  day.isToday,
                  isSelected
                )}`}
                title={`${day.dayLabel} (${day.dayOfWeekName}): ${day.totalHours} hrs • ${day.sessionCount} sessions`}
              >
                <div className="flex items-center justify-between w-full text-[10px]">
                  <span className="opacity-70 font-mono">{day.dayOfWeekName}</span>
                  {day.isToday && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>

                <div className="my-1 text-sm font-black font-mono">
                  {day.totalHours > 0 ? `${day.totalHours}h` : '—'}
                </div>

                <div className="w-full flex items-center justify-between text-[9px] opacity-75">
                  <span>{day.dayLabel.split(' ')[1]}</span>
                  {day.sessionCount > 0 && (
                    <span className="font-mono">({day.sessionCount})</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile legend */}
        <div className="flex sm:hidden items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span>0h</span>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded bg-slate-900 border border-slate-800" />
            <div className="h-2.5 w-2.5 rounded bg-indigo-950 border border-indigo-800" />
            <div className="h-2.5 w-2.5 rounded bg-indigo-800 border border-indigo-600" />
            <div className="h-2.5 w-2.5 rounded bg-indigo-600 border border-indigo-400" />
            <div className="h-2.5 w-2.5 rounded bg-cyan-400 border border-cyan-300" />
          </div>
          <span>&gt;3.5h</span>
        </div>
      </div>

      {/* Selected Day Inspector Panel */}
      {activeDay && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {activeDay.dayOfWeekName}, {activeDay.dayLabel} {activeDay.date.split('-')[0]}
              </span>
              {activeDay.isToday && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Today
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-mono font-bold text-white">{activeDay.totalHours} hrs</span>
                <span className="text-slate-400">({activeDay.totalMinutes} mins)</span>
              </div>
              {activeDay.dominantCategory !== 'None' && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getCategoryColor(activeDay.dominantCategory)}`}>
                  Primary: {activeDay.dominantCategory}
                </span>
              )}
            </div>
          </div>

          {/* Sessions List */}
          <div className="mt-3">
            {activeDay.sessions.length === 0 ? (
              <div className="py-3 text-center text-xs text-slate-400">
                No flow sessions logged for this day. Click &ldquo;Log Flow&rdquo; above to record a study block!
              </div>
            ) : (
              <div className="space-y-2">
                {activeDay.sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/90 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-200">{s.taskTitle}</span>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{s.startTime.includes('T') ? s.startTime.split('T')[1].slice(0, 5) : s.startTime}</span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.2 rounded font-mono ${getCategoryColor(s.category)}`}>
                            {s.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 font-mono text-indigo-300 font-semibold">
                      +{s.durationMinutes}m
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Allocation Ratio Bar */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>30-Day Subject Distribution</span>
          </span>
          <span className="text-[11px]">
            Target Balance: 60% GATE • 30% DSA • 10% Aptitude
          </span>
        </div>

        {summary.totalFlowHours > 0 ? (
          <div>
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800">
              <div
                style={{ width: `${(summary.categoryBreakdown.GATE / summary.totalFlowHours) * 100}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`GATE: ${summary.categoryBreakdown.GATE}h`}
              />
              <div
                style={{ width: `${(summary.categoryBreakdown.DSA / summary.totalFlowHours) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`DSA: ${summary.categoryBreakdown.DSA}h`}
              />
              <div
                style={{ width: `${(summary.categoryBreakdown.Aptitude / summary.totalFlowHours) * 100}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Aptitude: ${summary.categoryBreakdown.Aptitude}h`}
              />
              <div
                style={{ width: `${(summary.categoryBreakdown.Revision / summary.totalFlowHours) * 100}%` }}
                className="bg-violet-500 h-full transition-all"
                title={`Revision: ${summary.categoryBreakdown.Revision}h`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-2 text-[11px]">
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                GATE: {summary.categoryBreakdown.GATE}h ({Math.round((summary.categoryBreakdown.GATE / summary.totalFlowHours) * 100)}%)
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                DSA: {summary.categoryBreakdown.DSA}h ({Math.round((summary.categoryBreakdown.DSA / summary.totalFlowHours) * 100)}%)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Aptitude: {summary.categoryBreakdown.Aptitude}h ({Math.round((summary.categoryBreakdown.Aptitude / summary.totalFlowHours) * 100)}%)
              </span>
              <span className="flex items-center gap-1 text-violet-400">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Revision: {summary.categoryBreakdown.Revision}h ({Math.round((summary.categoryBreakdown.Revision / summary.totalFlowHours) * 100)}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">No category data yet.</div>
        )}
      </div>

      {/* Manual Quick Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1326] p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Flow Session</h3>
                <p className="text-xs text-slate-400">Record a completed study session in your flow history</p>
              </div>
            </div>

            <form onSubmit={handleQuickLog} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Session Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Focus Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['GATE', 'DSA', 'Aptitude', 'Revision'] as const).map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setLogCategory(c)}
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                        logCategory === c
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Duration (minutes)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[25, 50, 90, 120].map(mins => (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => setLogDuration(mins)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        logDuration === mins
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="5"
                  max="360"
                  value={logDuration}
                  onChange={(e) => setLogDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Task / Topic Description</label>
                <input
                  type="text"
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  placeholder="e.g. Propositional Logic, LeetCode Two Pointers..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
                >
                  Save Flow Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
