/**
 * PrepPilot Live Date, Time, and Streak Engine
 * Provides real-time clock, dynamic day-of-week detection, and streak calculations.
 */

import { TimetableBlock, DailyHabits } from '../types';

/**
 * Returns formatted date string in YYYY-MM-DD (local time)
 */
export function getLiveDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns timetable day type based on real day of week:
 * 0 = Sunday -> 'sunday'
 * 6 = Saturday -> 'saturday'
 * 1..5 = Monday..Friday -> 'weekday'
 */
export function getLiveDayOfWeekType(date: Date = new Date()): 'weekday' | 'saturday' | 'sunday' {
  const day = date.getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'weekday';
}

/**
 * Returns human-readable day name (e.g., 'Wednesday')
 */
export function getLiveDayName(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Returns formatted full date string (e.g., 'Wednesday, 28 October 2026')
 */
export function getLiveFormattedDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Returns short formatted date (e.g., '28 Oct 2026')
 */
export function getLiveShortDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Returns live time in 12-hour format with AM/PM (e.g., '02:45:12 PM')
 */
export function getLiveFormattedTime(date: Date = new Date(), withSeconds: boolean = true): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: true
  });
}

/**
 * Returns current minutes elapsed since midnight (0..1439)
 */
export function getLiveMinutesOfDay(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Calculates preparation day counter since kick-off
 */
export function getPreparationDayNumber(
  startDateStr: string = '2026-10-27',
  currentDate: Date = new Date()
): { dayNumber: number; totalDays: number } {
  const start = new Date(startDateStr + 'T00:00:00');
  const now = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const diffTime = now.getTime() - start.getTime();
  const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dayNumber = Math.max(1, dayIndex + 1);
  return { dayNumber, totalDays: 156 };
}

/**
 * Determines if a habit log meets the consistency threshold
 */
export function isDayHabitsSuccessful(h: DailyHabits): boolean {
  if (!h) return false;
  let score = 0;
  if (h.wakeUpOnTime) score += 1;
  if (h.morningGateSession) score += 2; // High priority
  if (h.dsaPractice) score += 2;        // High priority
  if (h.aptitudeRevision) score += 1;
  if (h.exerciseGym) score += 1;
  if (h.sleepBy1030) score += 1;
  if (h.socialMediaMinutes <= 30) score += 1;
  return score >= 4;
}

/**
 * Robust live streak calculation:
 * - Checks today and counts backwards through previous consecutive calendar days.
 * - If today's goals are not yet completed, checks if yesterday was successful to keep the streak active.
 */
export function calculateLiveStreak(
  habitLogs: DailyHabits[],
  todayStr: string
): {
  currentStreak: number;
  weeklyConsistencyPercent: number;
  isTodayCompleted: boolean;
  streakStatus: 'active_today' | 'pending_today' | 'broken';
  statusMessage: string;
} {
  if (!habitLogs || habitLogs.length === 0) {
    return {
      currentStreak: 0,
      weeklyConsistencyPercent: 0,
      isTodayCompleted: false,
      streakStatus: 'broken',
      statusMessage: 'No habit history yet. Complete today’s goals to start your streak!'
    };
  }

  // Create date-to-habit map for O(1) lookups
  const map = new Map<string, DailyHabits>();
  habitLogs.forEach(h => map.set(h.date, h));

  const todayHabit = map.get(todayStr);
  const isTodayCompleted = todayHabit ? isDayHabitsSuccessful(todayHabit) : false;

  // Helper to shift a date by N days
  const getDateOffset = (baseStr: string, offsetDays: number): string => {
    const [y, m, d] = baseStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offsetDays);
    const yr = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const da = String(date.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  let streak = 0;
  let streakStatus: 'active_today' | 'pending_today' | 'broken' = 'broken';
  let statusMessage = '';

  if (isTodayCompleted) {
    // Today is already done: streak includes today + consecutive previous days
    streak = 1;
    streakStatus = 'active_today';
    statusMessage = 'Streak active! Today’s daily goals are completed.';

    let offset = -1;
    while (true) {
      const prevDate = getDateOffset(todayStr, offset);
      const prevLog = map.get(prevDate);
      if (prevLog && isDayHabitsSuccessful(prevLog)) {
        streak++;
        offset--;
      } else {
        break;
      }
    }
  } else {
    // Today is in progress: check yesterday
    const yesterdayDate = getDateOffset(todayStr, -1);
    const yesterdayLog = map.get(yesterdayDate);

    if (yesterdayLog && isDayHabitsSuccessful(yesterdayLog)) {
      streak = 1;
      streakStatus = 'pending_today';
      statusMessage = 'Streak in progress! Complete today’s GATE & DSA habits to extend your streak.';

      let offset = -2;
      while (true) {
        const prevDate = getDateOffset(todayStr, offset);
        const prevLog = map.get(prevDate);
        if (prevLog && isDayHabitsSuccessful(prevLog)) {
          streak++;
          offset--;
        } else {
          break;
        }
      }
    } else {
      streak = 0;
      streakStatus = 'broken';
      statusMessage = 'Streak broken or starting fresh. Complete today’s targets to ignite your streak!';
    }
  }

  // Calculate 7-day consistency over the last 7 calendar days
  let past7Count = 0;
  for (let i = 0; i < 7; i++) {
    const d = getDateOffset(todayStr, -i);
    const log = map.get(d);
    if (log && isDayHabitsSuccessful(log)) {
      past7Count++;
    }
  }
  const weeklyConsistencyPercent = Math.round((past7Count / 7) * 100);

  return {
    currentStreak: streak,
    weeklyConsistencyPercent,
    isTodayCompleted,
    streakStatus,
    statusMessage
  };
}

/**
 * Finds current active task and next task with countdown
 */
export function getLiveTaskStatus(
  blocks: TimetableBlock[],
  currentMinutesOfDay: number
): {
  currentTask: TimetableBlock | null;
  nextTask: TimetableBlock | null;
  minutesRemainingInCurrent: number;
  minutesUntilNext: number;
} {
  if (!blocks || blocks.length === 0) {
    return {
      currentTask: null,
      nextTask: null,
      minutesRemainingInCurrent: 0,
      minutesUntilNext: 0
    };
  }

  const parseTime = (str: string): number => {
    if (!str || !str.includes(':')) return 0;
    const [h, m] = str.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const sorted = [...blocks].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

  let currentTask: TimetableBlock | null = null;
  let nextTask: TimetableBlock | null = null;
  let minutesRemainingInCurrent = 0;
  let minutesUntilNext = 0;

  for (let i = 0; i < sorted.length; i++) {
    const b = sorted[i];
    const start = parseTime(b.startTime);
    let end = parseTime(b.endTime);
    if (end < start) end += 24 * 60; // Crosses midnight

    if (currentMinutesOfDay >= start && currentMinutesOfDay < end) {
      currentTask = b;
      minutesRemainingInCurrent = end - currentMinutesOfDay;
      nextTask = sorted[(i + 1) % sorted.length];
      const nextStart = parseTime(nextTask.startTime);
      minutesUntilNext = nextStart > currentMinutesOfDay ? nextStart - currentMinutesOfDay : (nextStart + 24 * 60) - currentMinutesOfDay;
      break;
    }

    if (currentMinutesOfDay < start && !nextTask) {
      nextTask = b;
      minutesUntilNext = start - currentMinutesOfDay;
    }
  }

  if (!nextTask && sorted.length > 0) {
    nextTask = sorted[0];
    const firstStart = parseTime(nextTask.startTime);
    minutesUntilNext = (firstStart + 24 * 60) - currentMinutesOfDay;
  }

  return {
    currentTask,
    nextTask,
    minutesRemainingInCurrent,
    minutesUntilNext
  };
}
