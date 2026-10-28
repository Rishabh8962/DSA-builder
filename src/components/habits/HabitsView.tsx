import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Smartphone,
  Info,
  Play,
  RotateCcw,
  ShieldCheck,
  Dumbbell,
  Moon,
  GraduationCap
} from 'lucide-react';
import { DailyHabits, UserSettings } from '../../types';
import { playNotificationChime } from '../../lib/notifications';
import { getLiveFormattedDate } from '../../lib/dateTime';

interface HabitsViewProps {
  habits: DailyHabits[];
  todayHabits: DailyHabits;
  onUpdateTodayHabits: (updated: DailyHabits) => void;
  streak: number;
  weeklyConsistency: number;
  userSettings: UserSettings;
  onOpenFocusModal: () => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  todayHabits,
  onUpdateTodayHabits,
  streak,
  weeklyConsistency,
  userSettings,
  onOpenFocusModal
}) => {
  const [socialMinutesInput, setSocialMinutesInput] = useState<string>(
    String(todayHabits.socialMediaMinutes ?? 30)
  );

  const toggleHabitKey = (key: keyof Omit<DailyHabits, 'date' | 'socialMediaMinutes' | 'quickNotes'>) => {
    const updated: DailyHabits = {
      ...todayHabits,
      [key]: !todayHabits[key]
    };
    onUpdateTodayHabits(updated);
    playNotificationChime('beep');
  };

  const handleSaveSocialMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(socialMinutesInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateTodayHabits({
        ...todayHabits,
        socialMediaMinutes: val
      });
      playNotificationChime('success');
    }
  };

  const habitItems = [
    {
      key: 'wakeUpOnTime' as const,
      title: 'Wake up on time (6:00 AM)',
      time: '6:00 AM',
      desc: 'Zero snoozing; instant hydration',
      icon: Clock,
      color: 'text-amber-400'
    },
    {
      key: 'morningGateSession' as const,
      title: 'Complete morning GATE session',
      time: '6:20–7:50 AM',
      desc: '90m core theory & mathematical problem solving',
      icon: GraduationCap,
      color: 'text-indigo-400'
    },
    {
      key: 'attendCollege' as const,
      title: 'Attend College with active break practice',
      time: '9:00 AM–5:00 PM',
      desc: 'Use breaks for quick flashcards or 5-10 aptitude problems',
      icon: ShieldCheck,
      color: 'text-blue-400'
    },
    {
      key: 'exerciseGym' as const,
      title: 'Gym & Physical Fitness Session',
      time: '6:00–8:00 PM',
      desc: 'Stamina, cardiovascular endurance, and mental reset',
      icon: Dumbbell,
      color: 'text-emerald-400'
    },
    {
      key: 'dsaPractice' as const,
      title: 'Complete DSA practice in Java',
      time: '8:40–9:40 PM',
      desc: '1-2 problems with clean code and edge cases tested',
      icon: Sparkles,
      color: 'text-teal-400'
    },
    {
      key: 'aptitudeRevision' as const,
      title: 'Complete aptitude & error-log review',
      time: '9:40–10:10 PM',
      desc: 'Formula revision and logging slips from today',
      icon: CheckCircle2,
      color: 'text-violet-400'
    },
    {
      key: 'sleepBy1030' as const,
      title: 'Sleep by 10:30 PM (7.5 hrs recovery)',
      time: '10:30 PM',
      desc: 'Non-negotiable brain recovery and memory retention',
      icon: Moon,
      color: 'text-purple-400'
    }
  ];

  const completedCount = habitItems.filter(h => todayHabits[h.key]).length;
  const isSocialOnTarget = (todayHabits.socialMediaMinutes || 0) <= userSettings.socialMediaLimitMinutes;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span>Habits &amp; Daily Discipline</span>
            </h1>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-amber-300 flex items-center gap-1 border border-amber-500/30">
              <Flame className={`h-3.5 w-3.5 ${streak > 0 ? 'fill-amber-400 text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{streak} Day Streak</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking for <span className="text-slate-200 font-semibold">{getLiveFormattedDate()}</span> • Build unshakeable daily consistency while curbing screen time to ≤30 minutes.
          </p>
        </div>

        <button
          onClick={onOpenFocusModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Launch Focus Timer</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Habits Done Today */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Today's Habits Completed</span>
            <span className="font-mono text-emerald-400 font-bold">{completedCount} / 7</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden my-2">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((completedCount / 7) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {completedCount >= 5 ? 'Excellent daily execution!' : 'Keep ticking off upcoming blocks'}
          </p>
        </div>

        {/* Weekly Consistency */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Weekly Discipline Score</span>
            <span className="font-mono text-indigo-400 font-bold">{weeklyConsistency}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden my-2">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${weeklyConsistency}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Calculated across previous 7 recorded check-in days
          </p>
        </div>

        {/* Social Media Target Status */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Social Media Target</span>
            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
              isSocialOnTarget ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isSocialOnTarget ? 'On Target (≤30m)' : 'Exceeded'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-white">
              {todayHabits.socialMediaMinutes || 0}
            </span>
            <span className="text-xs text-slate-400">/ 30 minutes daily limit</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Saves 2.5–4.5 hours daily for GATE study and gym recovery.
          </p>
        </div>
      </div>

      {/* Main Checklist */}
      <div className="rounded-2xl border border-slate-800 bg-[#0b1020] p-5">
        <h2 className="text-sm font-bold text-white mb-4">
          Daily Routine Checklist — October 27, 2026
        </h2>
        <div className="space-y-2.5">
          {habitItems.map(item => {
            const isDone = todayHabits[item.key];
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => toggleHabitKey(item.key)}
                className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                  isDone
                    ? 'border-emerald-500/30 bg-emerald-950/10 opacity-80'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">({item.time})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <Icon className={`h-4 w-4 ${isDone ? 'text-emerald-400' : item.color}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Wellbeing & Social Media Control Section */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-[#0c142e] to-[#0f1730] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-indigo-400" />
              <span>Digital Wellbeing & App Timer Setup (Android)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Browser apps cannot automatically monitor native Android screen time without device root or custom OS permissions. To reliably keep recreational apps to 30 minutes, configure Android Digital Wellbeing natively:
            </p>
          </div>

          <form onSubmit={handleSaveSocialMinutes} className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Log today:</span>
            <input
              type="number"
              min="0"
              max="720"
              value={socialMinutesInput}
              onChange={e => setSocialMinutesInput(e.target.value)}
              className="w-16 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white focus:outline-none font-mono text-center"
            />
            <span className="text-xs text-slate-400">mins</span>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Update
            </button>
          </form>
        </div>

        {/* Android Steps Box */}
        <div className="rounded-xl border border-slate-800 bg-[#090d1c] p-4 text-xs text-slate-300 space-y-2">
          <span className="font-semibold text-indigo-300 block">Recommended Android Setup:</span>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
            <li>Open Android <strong>Settings → Digital Wellbeing & parental controls</strong>.</li>
            <li>Tap <strong>Dashboard</strong>, find Instagram / YouTube / X, and set an <strong>App timer of 15 minutes each</strong>.</li>
            <li>Enable <strong>Bedtime mode</strong> scheduled for <strong>10:15 PM</strong> (turns screen grayscale and silences notifications).</li>
            <li>Turn off non-essential social notifications so study blocks between 6:20–7:50 AM and 8:40–9:40 PM remain uninterrupted.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
