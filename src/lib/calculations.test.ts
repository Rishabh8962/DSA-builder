import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDaysRemaining,
  parseTimeToMinutes,
  calculateBlockDurationHours,
  calculateTodayStudyStats,
  calculateDSAStats,
  calculateOverallGateProgress,
  calculateNextSpacedRevisionDate,
  calculateDeepWorkHeatmap
} from './calculations';
import { TimetableBlock, DSAProblem, GATESubject, FocusSession } from '../types';

test('parseTimeToMinutes converts HH:MM properly', () => {
  assert.equal(parseTimeToMinutes('06:00'), 360);
  assert.equal(parseTimeToMinutes('06:20'), 380);
  assert.equal(parseTimeToMinutes('22:30'), 1350);
  assert.equal(parseTimeToMinutes('00:00'), 0);
});

test('calculateBlockDurationHours calculates hours correctly', () => {
  assert.equal(calculateBlockDurationHours('06:20', '07:50'), 1.5);
  assert.equal(calculateBlockDurationHours('20:40', '21:40'), 1.0);
  assert.equal(calculateBlockDurationHours('21:40', '22:10'), 0.5);
});

test('calculateTodayStudyStats aggregates study blocks accurately', () => {
  const blocks: TimetableBlock[] = [
    {
      id: '1',
      timeRange: '6:20–7:50 AM',
      startTime: '06:20',
      endTime: '07:50',
      activity: 'GATE focused study',
      category: 'study',
      isEditable: true,
      repeatDays: [1, 2, 3, 4, 5],
      hasReminder: true,
      reminderLeadMinutes: 5,
      completedDate: '2026-10-27'
    },
    {
      id: '2',
      timeRange: '8:40–9:40 PM',
      startTime: '20:40',
      endTime: '21:40',
      activity: 'DSA in Java',
      category: 'study',
      isEditable: true,
      repeatDays: [1, 2, 3, 4, 5],
      hasReminder: true,
      reminderLeadMinutes: 5
    },
    {
      id: '3',
      timeRange: '6:00–8:00 PM',
      startTime: '18:00',
      endTime: '20:00',
      activity: 'Gym and fitness',
      category: 'gym',
      isEditable: true,
      repeatDays: [1, 2, 3, 4, 5],
      hasReminder: true,
      reminderLeadMinutes: 5
    }
  ];

  const stats = calculateTodayStudyStats(blocks, '2026-10-27');
  // Planned study is 90 mins (1.5h) + 60 mins (1h) = 2.5h (gym is not study)
  assert.equal(stats.plannedHours, 2.5);
  // Completed is only block 1 = 1.5h
  assert.equal(stats.completedHours, 1.5);
  assert.equal(stats.percentage, 60);
});

test('calculateDSAStats starts with zero solved if all unattempted', () => {
  const sampleProblems: DSAProblem[] = [
    {
      id: '1',
      title: 'Two Sum',
      topic: 'Arrays',
      difficulty: 'Easy',
      platform: 'LeetCode',
      status: 'Not Started',
      attempts: 0,
      timeSpentMinutes: 0,
      hintsUsed: false,
      revisionStage: 0
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      topic: 'Stacks',
      difficulty: 'Easy',
      platform: 'LeetCode',
      status: 'Not Started',
      attempts: 0,
      timeSpentMinutes: 0,
      hintsUsed: false,
      revisionStage: 0
    }
  ];

  const stats = calculateDSAStats(sampleProblems);
  assert.equal(stats.total, 2);
  assert.equal(stats.solved, 0);
  assert.equal(stats.notStarted, 2);
  assert.equal(stats.percent, 0);
});

test('calculateOverallGateProgress averages syllabus percentages', () => {
  const subjects: Partial<GATESubject>[] = [
    { syllabusPercent: 20 },
    { syllabusPercent: 40 },
    { syllabusPercent: 60 }
  ];
  const progress = calculateOverallGateProgress(subjects as GATESubject[]);
  assert.equal(progress, 40);
});

test('calculateDaysRemaining calculates future days correctly', () => {
  const baseDate = new Date('2026-10-27T10:00:00');
  const days = calculateDaysRemaining('2026-10-29', baseDate);
  assert.equal(days, 2);
});

test('calculateNextSpacedRevisionDate produces expected date', () => {
  const baseDate = new Date('2026-10-27T00:00:00');
  const nextDateStr = calculateNextSpacedRevisionDate(0, baseDate); // interval 1
  assert.equal(nextDateStr, '2026-10-28');
});

test('calculateDeepWorkHeatmap returns exactly 30 days for 30-day range', () => {
  const result = calculateDeepWorkHeatmap([], '2026-10-27', 30);
  assert.equal(result.days.length, 30);
  assert.equal(result.days[29].date, '2026-10-27');
  assert.equal(result.days[29].isToday, true);
  assert.equal(result.days[0].date, '2026-09-28');
  assert.equal(result.summary.totalFlowHours, 0);
  assert.equal(result.summary.totalSessions, 0);
  assert.equal(result.summary.currentFlowStreak, 0);
});

test('calculateDeepWorkHeatmap correctly aggregates sessions, intensity and dominant category', () => {
  const sessions: FocusSession[] = [
    {
      id: 's-1',
      startTime: '2026-10-27T06:20:00',
      durationMinutes: 90,
      taskTitle: 'GATE Discrete Math',
      category: 'GATE',
      completed: true
    },
    {
      id: 's-2',
      startTime: '2026-10-27T20:40:00',
      durationMinutes: 50,
      taskTitle: 'DSA Java Arrays',
      category: 'DSA',
      completed: true
    },
    {
      id: 's-3',
      startTime: '2026-10-26T06:20:00',
      durationMinutes: 90,
      taskTitle: 'GATE Linear Algebra',
      category: 'GATE',
      completed: true
    },
    {
      id: 's-4',
      startTime: '2026-10-25T14:00:00',
      durationMinutes: 45,
      taskTitle: 'Aptitude Practice',
      category: 'Aptitude',
      completed: true
    }
  ];

  const result = calculateDeepWorkHeatmap(sessions, '2026-10-27', 30);
  
  // Total minutes: 90 + 50 + 90 + 45 = 275 minutes = 4.6 hours
  assert.equal(result.summary.totalFlowMinutes, 275);
  assert.equal(result.summary.totalFlowHours, 4.6);
  assert.equal(result.summary.totalSessions, 4);

  // Today (Oct 27) has 140 minutes -> intensityLevel 3 (121-210m), dominant GATE
  const todayCell = result.days[29];
  assert.equal(todayCell.date, '2026-10-27');
  assert.equal(todayCell.totalMinutes, 140);
  assert.equal(todayCell.totalHours, 2.3);
  assert.equal(todayCell.intensityLevel, 3);
  assert.equal(todayCell.dominantCategory, 'GATE');
  assert.equal(todayCell.sessionCount, 2);

  // Oct 26 has 90 mins -> intensityLevel 2 (61-120m)
  const yesterdayCell = result.days[28];
  assert.equal(yesterdayCell.date, '2026-10-26');
  assert.equal(yesterdayCell.intensityLevel, 2);

  // Oct 25 has 45 mins -> intensityLevel 1 (1-60m)
  const day25Cell = result.days[27];
  assert.equal(day25Cell.date, '2026-10-25');
  assert.equal(day25Cell.intensityLevel, 1);

  // Streak: Oct 25, 26, 27 all have flow -> 3 days streak
  assert.equal(result.summary.currentFlowStreak, 3);

  // Category breakdown
  assert.equal(result.summary.categoryBreakdown.GATE, 3.0); // 180m = 3h
  assert.equal(result.summary.categoryBreakdown.DSA, 0.8);  // 50m = 0.8h
  assert.equal(result.summary.categoryBreakdown.Aptitude, 0.8); // 45m = 0.75 -> 0.8h
});

