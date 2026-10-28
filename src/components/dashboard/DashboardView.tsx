import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Code2,
  BookOpen,
  ArrowRight,
  Smartphone,
  ChevronRight,
  Calculator,
  Layers,
  Printer,
  RotateCw,
  Network
} from 'lucide-react';
import {
  TimetableBlock,
  GATESubject,
  DSAProblem,
  DailyHabits,
  UserSettings
} from '../../types';
import {
  calculateDaysRemaining,
  calculateTodayStudyStats,
  getNextUpcomingTask,
  calculateDSAStats,
  calculateOverallGateProgress
} from '../../lib/calculations';
import { playNotificationChime } from '../../lib/notifications';

interface DashboardViewProps {
  weekdayBlocks: TimetableBlock[];
  saturdayBlocks: TimetableBlock[];
  sundayBlocks: TimetableBlock[];
  gateSubjects: GATESubject[];
  dsaProblems: DSAProblem[];
  todayHabits: DailyHabits;
  userSettings: UserSettings;
  streak: number;
  weeklyConsistency: number;
  onToggleBlockComplete: (blockId: string) => void;
  onOpenFocusModal: () => void;
  onOpenRecoveryModal: () => void;
  onOpenCalculator: () => void;
  onOpenWallpaperCard: () => void;
  onUpdateSocialMedia: (minutes: number) => void;
  onNavigateTab: (tab: any) => void;
  onMarkProblemRevised: (problemId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  weekdayBlocks,
  saturdayBlocks,
  sundayBlocks,
  gateSubjects,
  dsaProblems,
  todayHabits,
  userSettings,
  streak,
  weeklyConsistency,
  onToggleBlockComplete,
  onOpenFocusModal,
  onOpenRecoveryModal,
  onOpenCalculator,
  onOpenWallpaperCard,
  onUpdateSocialMedia,
  onNavigateTab,
  onMarkProblemRevised
}) => {
  const [socialInput, setSocialInput] = useState<string>(String(todayHabits.socialMediaMinutes || ''));

  // Day determination: 2026-10-27 is a Tuesday
  const todayDateStr = '2026-10-27';
  const gateDaysRemaining = calculateDaysRemaining(userSettings.gateExamDate);
  const placementDaysRemaining = calculateDaysRemaining(userSettings.placementMilestoneDate);

  // Active timetable blocks for today (Tuesday = weekday)
  const activeBlocks = weekdayBlocks;

  // Study hours stats
  const studyStats = calculateTodayStudyStats(activeBlocks, todayDateStr);

  // Upcoming task
  const currentMinutesOfDay = 380; // 06:20 AM
  const { currentTask, nextTask } = getNextUpcomingTask(activeBlocks, currentMinutesOfDay);

  // DSA and GATE stats
  const dsaStats = calculateDSAStats(dsaProblems);
  const gateProgress = calculateOverallGateProgress(gateSubjects);

  // Spaced repetition due problems
  const dueProblems = dsaProblems.filter(p => p.status === 'Needs Revision' || (p.spacedRevisionDue && p.spacedRevisionDue <= '2026-10-28'));

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(socialInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateSocialMedia(val);
      playNotificationChime('beep');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-[#0c142e] via-[#10193d] to-[#15173b] p-5 lg:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Day 1 of 156 • October 27, 2026</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Welcome to PrepPilot, Rishabh.
            </h1>
            <p className="mt-1 text-xs lg:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Targeting <span className="text-indigo-400 font-semibold">70+ marks</span> in GATE CS 2027 and campus placement readiness. You have 9 AM–5 PM college and 6–8 PM gym—every focused minute counts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenFocusModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Focus Session</span>
            </button>
            <button
              onClick={onOpenRecoveryModal}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-600/10 px-3 py-2.5 text-xs font-semibold text-violet-300 hover:bg-violet-600/20 transition-all"
              title="Reschedule missed study blocks"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Quick Recovery</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Quick Launch Power Tools Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={onOpenCalculator}
          className="flex items-center gap-2.5 rounded-xl border border-indigo-500/30 bg-[#0c1329] p-3 text-left hover:border-indigo-500/60 hover:bg-[#101a38] transition-all"
        >
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">GATE Calculator</span>
            <span className="text-[10px] text-slate-400 block">TCS iON Simulator</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('flashcards')}
          className="flex items-center gap-2.5 rounded-xl border border-violet-500/30 bg-[#0c1329] p-3 text-left hover:border-violet-500/60 hover:bg-[#101a38] transition-all"
        >
          <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Formula Deck</span>
            <span className="text-[10px] text-slate-400 block">College break recall</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('interview')}
          className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-[#0c1329] p-3 text-left hover:border-emerald-500/60 hover:bg-[#101a38] transition-all"
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Interview Prep</span>
            <span className="text-[10px] text-slate-400 block">STAR & Core CS</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('graph')}
          className="flex items-center gap-2.5 rounded-xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/30 to-[#0c1329] p-3 text-left hover:border-indigo-500/70 hover:bg-[#101a38] transition-all"
        >
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Prerequisite DAG</span>
            <span className="text-[10px] text-indigo-300/80 block">GATE & DSA Map</span>
          </div>
        </button>

        <button
          onClick={onOpenWallpaperCard}
          className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-[#0c1329] p-3 text-left hover:border-slate-700 hover:bg-[#101a38] transition-all"
        >
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
            <Printer className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Print Schedule</span>
            <span className="text-[10px] text-slate-400 block">Wall / Phone Card</span>
          </div>
        </button>
      </div>

      {/* Today's Spaced Revision Due Widget */}
      {dueProblems.length > 0 && (
        <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/20 via-[#0e1633] to-[#0c1224] p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Spaced Revision Queue Due Today ({dueProblems.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('dsa')}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {dueProblems.slice(0, 3).map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/70 text-xs"
              >
                <div>
                  <span className="font-semibold text-white block truncate max-w-[180px]">{p.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.topic} • Stage {p.revisionStage}</span>
                </div>
                <button
                  onClick={() => onMarkProblemRevised(p.id)}
                  className="rounded-lg bg-violet-600/30 border border-violet-500/40 px-2 py-1 text-[10px] font-semibold text-violet-200 hover:bg-violet-600/50"
                >
                  Mark Revised
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Countdowns & Key Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* GATE 2027 Countdown */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1326] p-4 shadow-lg hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">GATE CS 2027</span>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
              Target 70+
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{gateDaysRemaining}</span>
            <span className="text-xs text-slate-400">days to go</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Exam target date: {userSettings.gateExamDate} (configurable in Settings)
          </p>
        </div>

        {/* Placement Countdown */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1326] p-4 shadow-lg hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Campus Placements</span>
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-mono text-violet-300">
              Feb Milestone
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{placementDaysRemaining}</span>
            <span className="text-xs text-slate-400">days to go</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Milestone: Feb 1, 2027 (Java DSA & Aptitude)
          </p>
        </div>

        {/* Today's Study Hours */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1326] p-4 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Today's Study</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
              {studyStats.percentage}% done
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{studyStats.completedHours}h</span>
            <span className="text-xs text-slate-400">/ {studyStats.plannedHours}h planned</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${studyStats.percentage}%` }}
            />
          </div>
        </div>

        {/* Social Media Target */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1326] p-4 shadow-lg hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Social Media Cap</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              (todayHabits.socialMediaMinutes || 0) <= userSettings.socialMediaLimitMinutes
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}>
              Target: ≤{userSettings.socialMediaLimitMinutes}m
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-white">
                {todayHabits.socialMediaMinutes || 0}
              </span>
              <span className="text-xs text-slate-400">mins used</span>
            </div>
            <form onSubmit={handleSaveSocial} className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="720"
                value={socialInput}
                onChange={e => setSocialInput(e.target.value)}
                placeholder="mins"
                className="w-14 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500"
              >
                Log
              </button>
            </form>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
            <Smartphone className="h-3 w-3 text-indigo-400" />
            Down from 3-5 hours daily habit
          </p>
        </div>
      </div>

      {/* Live Upcoming Task Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-[#0e1633] p-4 lg:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-400 border border-indigo-500/30">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  Current / Next Agenda Slot
                </span>
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                  IST
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                {currentTask ? currentTask.activity : (nextTask ? nextTask.activity : 'Rest & Wind Down')}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentTask ? currentTask.timeRange : (nextTask ? nextTask.timeRange : '10:30 PM–6:00 AM')}
                {' • '}
                <span className="text-slate-400">
                  {currentTask?.description || nextTask?.description || 'Get adequate sleep for brain recovery'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentTask && (
              <button
                onClick={() => {
                  playNotificationChime('success');
                  onToggleBlockComplete(currentTask.id);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  currentTask.completedDate === todayDateStr
                    ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{currentTask.completedDate === todayDateStr ? 'Completed' : 'Mark Completed'}</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('timetable')}
              className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white px-2 py-1"
            >
              <span>View Full Schedule</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Timetable + Progress Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Timetable Checklist */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0b1020] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-sm lg:text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Today's Schedule & Check-ins</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Weekday routine with protected College (9–5), Gym (6–8), and Sleep (10:30 PM)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {activeBlocks.map(block => {
              const isDone = block.completedDate === todayDateStr;
              const isStudy = block.category === 'study' || block.category === 'revision';
              
              const badgeColors: Record<string, string> = {
                study: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                college: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                gym: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                personal: 'bg-slate-800 text-slate-400 border-slate-700',
                sleep: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                revision: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
              };

              return (
                <div
                  key={block.id}
                  className={`flex items-start justify-between rounded-xl border p-3 transition-all ${
                    isDone
                      ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                      : isStudy
                      ? 'border-indigo-500/20 bg-[#0d1429] hover:border-indigo-500/40'
                      : 'border-slate-800/80 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        playNotificationChime('beep');
                        onToggleBlockComplete(block.id);
                      }}
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-700 bg-slate-800/60 hover:border-indigo-400'
                      }`}
                      aria-label={`Mark ${block.activity} as complete`}
                    >
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {block.activity}
                        </span>
                        <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase font-mono font-medium ${badgeColors[block.category] || badgeColors.personal}`}>
                          {block.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {block.timeRange}
                      </p>
                      {block.description && (
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {block.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reschedule trigger if missed */}
                  {!isDone && isStudy && (
                    <button
                      onClick={onOpenRecoveryModal}
                      className="text-[10px] text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors"
                      title="Reschedule if missed"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span className="hidden sm:inline">Reschedule</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Readiness Summary & Quick Jump */}
        <div className="space-y-4">
          {/* Consistency Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0b1020] p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Weekly Discipline</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </h3>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-extrabold text-white font-mono">{streak}</span>
                <span className="text-xs text-slate-400 ml-1.5">days streak</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-400 font-mono">{weeklyConsistency}%</span>
                <span className="text-[11px] text-slate-400 block">Consistency</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Consistently hitting morning GATE session + evening DSA in Java ensures high retention and placement readiness.
            </p>
          </div>

          {/* GATE CS Quick Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0b1020] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span>GATE CS 2027 Syllabus</span>
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400">{gateProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${Math.max(4, gateProgress)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              12 subjects tracked with lecture, notes, and PYQs accuracy.
            </p>
            <button
              onClick={() => onNavigateTab('gate')}
              className="mt-3 w-full rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-1.5 text-center text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all"
            >
              Open GATE Subject Tracker
            </button>
          </div>

          {/* DSA Practice Quick Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0b1020] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span>DSA in Java</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {dsaStats.solved} / {dsaStats.total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 mb-2">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.max(3, dsaStats.percent)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Target: 1–2 problems daily on college days. Starts with 0 unattempted.
            </p>
            <button
              onClick={() => onNavigateTab('dsa')}
              className="mt-3 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-center text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              Open DSA Tracker & Spaced Repetition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
