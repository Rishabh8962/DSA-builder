import {
  TimetableBlock,
  GATESubject,
  DSAProblem,
  DailyHabits,
  MockTest,
  FocusSession,
  DeepWorkDayCell,
  DeepWorkSummary,
  DeepWorkAnalyticsResult
} from '../types';

export function calculateDaysRemaining(targetDateStr: string, fromDate = new Date()): number {
  const target = new Date(targetDateStr + 'T00:00:00');
  const now = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function calculateBlockDurationHours(startTime: string, endTime: string): number {
  const start = parseTimeToMinutes(startTime);
  let end = parseTimeToMinutes(endTime);
  if (end < start) {
    // Crosses midnight, e.g., 22:30 to 06:00
    end += 24 * 60;
  }
  return Math.round(((end - start) / 60) * 10) / 10;
}

export function calculateTodayStudyStats(blocks: TimetableBlock[], todayDateStr: string) {
  const studyBlocks = blocks.filter(b => b.category === 'study' || b.category === 'revision');
  
  let plannedMinutes = 0;
  let completedMinutes = 0;

  for (const block of studyBlocks) {
    const durMins = parseTimeToMinutes(block.endTime) - parseTimeToMinutes(block.startTime);
    const duration = durMins > 0 ? durMins : (durMins + 24 * 60);
    plannedMinutes += duration;
    
    if (block.completedDate === todayDateStr) {
      completedMinutes += duration;
    }
  }

  const plannedHours = Math.round((plannedMinutes / 60) * 10) / 10;
  const completedHours = Math.round((completedMinutes / 60) * 10) / 10;
  const percentage = plannedHours > 0 ? Math.min(100, Math.round((completedHours / plannedHours) * 100)) : 0;

  return { plannedHours, completedHours, percentage };
}

export function getNextUpcomingTask(blocks: TimetableBlock[], currentMinutesOfDay: number): {
  currentTask: TimetableBlock | null;
  nextTask: TimetableBlock | null;
} {
  if (!blocks || blocks.length === 0) {
    return { currentTask: null, nextTask: null };
  }

  // Sort blocks by startTime
  const sorted = [...blocks].sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));

  let currentTask: TimetableBlock | null = null;
  let nextTask: TimetableBlock | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const b = sorted[i];
    const start = parseTimeToMinutes(b.startTime);
    let end = parseTimeToMinutes(b.endTime);
    if (end < start) end += 24 * 60; // sleep block

    if (currentMinutesOfDay >= start && currentMinutesOfDay < end) {
      currentTask = b;
      nextTask = sorted[(i + 1) % sorted.length];
      break;
    }

    if (currentMinutesOfDay < start && !nextTask) {
      nextTask = b;
    }
  }

  // If past all daytime tasks, next task is the first task tomorrow morning
  if (!nextTask && sorted.length > 0) {
    nextTask = sorted[0];
  }

  return { currentTask, nextTask };
}

export function calculateOverallGateProgress(subjects: GATESubject[]): number {
  if (!subjects || subjects.length === 0) return 0;
  const total = subjects.reduce((acc, sub) => acc + sub.syllabusPercent, 0);
  return Math.round(total / subjects.length);
}

export function calculateDSAStats(problems: DSAProblem[]) {
  const total = problems.length;
  const solved = problems.filter(p => p.status === 'Solved').length;
  const attempted = problems.filter(p => p.status === 'Attempted').length;
  const needsRevision = problems.filter(p => p.status === 'Needs Revision').length;
  const notStarted = problems.filter(p => p.status === 'Not Started').length;

  const easySolved = problems.filter(p => p.difficulty === 'Easy' && p.status === 'Solved').length;
  const mediumSolved = problems.filter(p => p.difficulty === 'Medium' && p.status === 'Solved').length;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard' && p.status === 'Solved').length;

  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

  return {
    total,
    solved,
    attempted,
    needsRevision,
    notStarted,
    easySolved,
    mediumSolved,
    hardSolved,
    percent
  };
}

export function calculateHabitStreak(habitLogs: DailyHabits[], todayStr: string): {
  currentStreak: number;
  weeklyConsistencyPercent: number;
} {
  if (!habitLogs || habitLogs.length === 0) {
    return { currentStreak: 0, weeklyConsistencyPercent: 0 };
  }

  // Sort descending by date
  const sorted = [...habitLogs].sort((a, b) => b.date.localeCompare(a.date));
  
  // A day is marked consistent if key core habits (morning gate + dsa + sleep on time or >= 5 habits true) are met
  const isDaySuccessful = (h: DailyHabits) => {
    let count = 0;
    if (h.wakeUpOnTime) count++;
    if (h.morningGateSession) count += 2; // key habit
    if (h.dsaPractice) count += 2;        // key habit
    if (h.aptitudeRevision) count++;
    if (h.exerciseGym) count++;
    if (h.sleepBy1030) count++;
    if (h.socialMediaMinutes <= 30) count++;
    return count >= 4;
  };

  let streak = 0;
  for (const log of sorted) {
    if (isDaySuccessful(log)) {
      streak++;
    } else {
      break;
    }
  }

  // Weekly consistency (last 7 recorded days)
  const last7 = sorted.slice(0, 7);
  const successfulDays = last7.filter(isDaySuccessful).length;
  const weeklyConsistencyPercent = last7.length > 0 
    ? Math.round((successfulDays / last7.length) * 100) 
    : 0;

  return { currentStreak: streak, weeklyConsistencyPercent };
}

export function calculateNextSpacedRevisionDate(currentStage: number, fromDate = new Date()): string {
  // Spaced revision intervals: Stage 1 = +1 day, Stage 2 = +3 days, Stage 3 = +7 days, Stage 4 = +14 days
  const intervals = [1, 3, 7, 14, 30];
  const daysToAdd = intervals[Math.min(currentStage, intervals.length - 1)];
  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return nextDate.toISOString().split('T')[0];
}

export function findNextRecoverySlot(blocks: TimetableBlock[]): TimetableBlock | null {
  // Finds the next study or revision block available today or tomorrow
  const availableSlots = blocks.filter(b => b.category === 'study' || b.category === 'revision');
  if (availableSlots.length > 0) {
    // pick first slot that isn't already completed today
    return availableSlots[0];
  }
  return null;
}

export function calculateMockTestAnalytics(tests: MockTest[]) {
  if (!tests || tests.length === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      highestScore: 0,
      averageAccuracy: 0,
      totalNegativeMarks: 0,
      commonMistakes: [] as { category: string; count: number }[]
    };
  }

  const totalTests = tests.length;
  const totalScore = tests.reduce((acc, t) => acc + t.marksScored, 0);
  const highestScore = Math.max(...tests.map(t => t.marksScored));
  const averageAccuracy = Math.round(tests.reduce((acc, t) => acc + t.accuracyPercent, 0) / totalTests);
  const totalNegativeMarks = Math.round(tests.reduce((acc, t) => acc + t.negativeMarks, 0) * 100) / 100;

  const mistakeTotals: Record<string, number> = {
    'Concept not understood': 0,
    'Formula forgotten': 0,
    'Calculation mistake': 0,
    'Question misread': 0,
    'Time management': 0,
    'Guessing / careless': 0
  };

  for (const t of tests) {
    if (t.mistakeBreakdown) {
      mistakeTotals['Concept not understood'] += t.mistakeBreakdown.concept_not_understood || 0;
      mistakeTotals['Formula forgotten'] += t.mistakeBreakdown.formula_forgotten || 0;
      mistakeTotals['Calculation mistake'] += t.mistakeBreakdown.calculation_mistake || 0;
      mistakeTotals['Question misread'] += t.mistakeBreakdown.question_misread || 0;
      mistakeTotals['Time management'] += t.mistakeBreakdown.time_management || 0;
      mistakeTotals['Guessing / careless'] += t.mistakeBreakdown.guessing_careless || 0;
    }
  }

  const commonMistakes = Object.entries(mistakeTotals)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalTests,
    averageScore: Math.round((totalScore / totalTests) * 10) / 10,
    highestScore,
    averageAccuracy,
    totalNegativeMarks,
    commonMistakes
  };
}

export function calculateDeepWorkHeatmap(
  sessions: FocusSession[],
  referenceDateStr: string = '2026-10-27',
  daysCount: number = 30
): DeepWorkAnalyticsResult {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Parse reference date at UTC midnight
  const [refYear, refMonth, refDay] = referenceDateStr.split('-').map(Number);
  const refDate = new Date(Date.UTC(refYear, refMonth - 1, refDay, 12, 0, 0));

  // Map sessions by normalized YYYY-MM-DD
  const sessionsByDate: Record<string, FocusSession[]> = {};
  for (const session of sessions) {
    if (session.completed === false) continue;
    const dateKey = session.startTime.split('T')[0];
    if (!sessionsByDate[dateKey]) {
      sessionsByDate[dateKey] = [];
    }
    sessionsByDate[dateKey].push(session);
  }

  const days: DeepWorkDayCell[] = [];
  let totalFlowMinutes = 0;
  let totalSessions = 0;
  let daysWithFlow = 0;
  let peakDay: { date: string; dayLabel: string; hours: number } | null = null;
  let maxDayMinutes = 0;

  const categoryMinutes: Record<'GATE' | 'DSA' | 'Aptitude' | 'Revision', number> = {
    GATE: 0,
    DSA: 0,
    Aptitude: 0,
    Revision: 0
  };

  // Generate days in chronological order: from (daysCount - 1) days ago to referenceDate
  for (let i = daysCount - 1; i >= 0; i--) {
    const curDate = new Date(refDate.getTime() - i * 24 * 60 * 60 * 1000);
    const y = curDate.getUTCFullYear();
    const m = String(curDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(curDate.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const dayOfWeek = curDate.getUTCDay();
    const dayLabel = `${monthNames[curDate.getUTCMonth()]} ${curDate.getUTCDate()}`;
    const isToday = dateStr === referenceDateStr;

    const daySessions = sessionsByDate[dateStr] || [];
    let dayTotalMinutes = 0;
    const catCounts: Record<string, number> = {};

    for (const s of daySessions) {
      dayTotalMinutes += s.durationMinutes || 0;
      catCounts[s.category] = (catCounts[s.category] || 0) + (s.durationMinutes || 0);
      if (s.category in categoryMinutes) {
        categoryMinutes[s.category as keyof typeof categoryMinutes] += (s.durationMinutes || 0);
      }
    }

    let dominantCategory: DeepWorkDayCell['dominantCategory'] = 'None';
    let maxCatDuration = 0;
    for (const [cat, dur] of Object.entries(catCounts)) {
      if (dur > maxCatDuration) {
        maxCatDuration = dur;
        dominantCategory = cat as DeepWorkDayCell['dominantCategory'];
      }
    }

    // Intensity levels:
    // 0: 0m
    // 1: 1-60m (<= 1 hr)
    // 2: 61-120m (<= 2 hrs)
    // 3: 121-210m (<= 3.5 hrs)
    // 4: >210m (> 3.5 hrs)
    let intensityLevel: DeepWorkDayCell['intensityLevel'] = 0;
    if (dayTotalMinutes > 210) intensityLevel = 4;
    else if (dayTotalMinutes > 120) intensityLevel = 3;
    else if (dayTotalMinutes > 60) intensityLevel = 2;
    else if (dayTotalMinutes > 0) intensityLevel = 1;

    const dayHours = Math.round((dayTotalMinutes / 60) * 10) / 10;
    totalFlowMinutes += dayTotalMinutes;
    totalSessions += daySessions.length;
    if (dayTotalMinutes > 0) {
      daysWithFlow++;
      if (dayTotalMinutes > maxDayMinutes) {
        maxDayMinutes = dayTotalMinutes;
        peakDay = {
          date: dateStr,
          dayLabel,
          hours: dayHours
        };
      }
    }

    days.push({
      date: dateStr,
      dayLabel,
      dayOfWeek,
      dayOfWeekName: dayNames[dayOfWeek],
      totalMinutes: dayTotalMinutes,
      totalHours: dayHours,
      sessionCount: daySessions.length,
      intensityLevel,
      dominantCategory,
      sessions: daySessions,
      isToday
    });
  }

  // Calculate streaks
  let currentFlowStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].totalMinutes > 0) {
      currentFlowStreak++;
    } else {
      // If today has no sessions yet, allow streak from yesterday
      if (i === days.length - 1) {
        continue;
      }
      break;
    }
  }

  let longestFlowStreak = 0;
  let tempStreak = 0;
  for (const day of days) {
    if (day.totalMinutes > 0) {
      tempStreak++;
      if (tempStreak > longestFlowStreak) {
        longestFlowStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  const totalFlowHours = Math.round((totalFlowMinutes / 60) * 10) / 10;
  const dailyAverageHours = daysCount > 0 ? Math.round((totalFlowHours / daysCount) * 10) / 10 : 0;
  const targetDaysCount = days.filter(d => d.totalMinutes >= 210).length;
  const targetAchievementRate = daysCount > 0 ? Math.round((targetDaysCount / daysCount) * 100) : 0;

  const categoryBreakdown = {
    GATE: Math.round((categoryMinutes.GATE / 60) * 10) / 10,
    DSA: Math.round((categoryMinutes.DSA / 60) * 10) / 10,
    Aptitude: Math.round((categoryMinutes.Aptitude / 60) * 10) / 10,
    Revision: Math.round((categoryMinutes.Revision / 60) * 10) / 10
  };

  return {
    days,
    summary: {
      totalFlowHours,
      totalFlowMinutes,
      totalSessions,
      dailyAverageHours,
      currentFlowStreak,
      longestFlowStreak,
      daysWithFlow,
      peakDay,
      categoryBreakdown,
      targetAchievementRate
    }
  };
}

