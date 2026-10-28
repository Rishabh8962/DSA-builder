import {
  TimetableBlock,
  RoadmapPhase,
  GATESubject,
  DSAProblem,
  CompanyApplication,
  DailyHabits,
  ReminderSetting,
  UserSettings,
  MockTest,
  AppNotification,
  FocusSession
} from '../types';

import {
  DEFAULT_WEEKDAY_TIMETABLE,
  DEFAULT_SATURDAY_TIMETABLE,
  DEFAULT_SUNDAY_TIMETABLE,
  DEFAULT_ROADMAP_PHASES,
  DEFAULT_GATE_SUBJECTS,
  DEFAULT_DSA_PROBLEMS,
  DEFAULT_COMPANIES,
  DEFAULT_REMINDERS,
  DEFAULT_USER_SETTINGS,
  INITIAL_TODAY_HABITS,
  DEFAULT_FOCUS_SESSIONS
} from './initialData';
import { SUPER_ADMIN_CREDENTIALS } from './auth';

const BASE_KEYS = {
  WEEKDAY_TIMETABLE: 'preppilot_timetable_weekday',
  SATURDAY_TIMETABLE: 'preppilot_timetable_saturday',
  SUNDAY_TIMETABLE: 'preppilot_timetable_sunday',
  ROADMAP: 'preppilot_roadmap_phases',
  GATE_SUBJECTS: 'preppilot_gate_subjects',
  DSA_PROBLEMS: 'preppilot_dsa_problems',
  COMPANIES: 'preppilot_companies',
  MOCK_TESTS: 'preppilot_mock_tests',
  HABITS: 'preppilot_daily_habits',
  REMINDERS: 'preppilot_reminders',
  SETTINGS: 'preppilot_user_settings',
  NOTIFICATIONS: 'preppilot_notifications',
  FOCUS_SESSIONS: 'preppilot_focus_sessions'
};

const SUPER_ADMIN_USER_ID = 'super-admin-rishabh';
let activeUserId = SUPER_ADMIN_USER_ID;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save key ${key} to storage`, err);
  }
}

export const StorageService = {
  setActiveUserId(userId?: string) {
    activeUserId = userId || SUPER_ADMIN_USER_ID;
  },

  getActiveUserId(): string {
    return activeUserId;
  },

  getKey(baseKey: string, customUserId?: string): string {
    const uid = customUserId || activeUserId;
    // Super Admin retains all original/existing data keys
    if (uid === SUPER_ADMIN_USER_ID || uid === SUPER_ADMIN_CREDENTIALS.email) {
      return baseKey;
    }
    return `${baseKey}_usr_${uid}`;
  },

  getWeekdayTimetable(userId?: string): TimetableBlock[] {
    return safeGet(this.getKey(BASE_KEYS.WEEKDAY_TIMETABLE, userId), DEFAULT_WEEKDAY_TIMETABLE);
  },
  saveWeekdayTimetable(data: TimetableBlock[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.WEEKDAY_TIMETABLE, userId), data);
  },

  getSaturdayTimetable(userId?: string): TimetableBlock[] {
    return safeGet(this.getKey(BASE_KEYS.SATURDAY_TIMETABLE, userId), DEFAULT_SATURDAY_TIMETABLE);
  },
  saveSaturdayTimetable(data: TimetableBlock[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.SATURDAY_TIMETABLE, userId), data);
  },

  getSundayTimetable(userId?: string): TimetableBlock[] {
    return safeGet(this.getKey(BASE_KEYS.SUNDAY_TIMETABLE, userId), DEFAULT_SUNDAY_TIMETABLE);
  },
  saveSundayTimetable(data: TimetableBlock[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.SUNDAY_TIMETABLE, userId), data);
  },

  getRoadmap(userId?: string): RoadmapPhase[] {
    return safeGet(this.getKey(BASE_KEYS.ROADMAP, userId), DEFAULT_ROADMAP_PHASES);
  },
  saveRoadmap(data: RoadmapPhase[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.ROADMAP, userId), data);
  },

  getGateSubjects(userId?: string): GATESubject[] {
    return safeGet(this.getKey(BASE_KEYS.GATE_SUBJECTS, userId), DEFAULT_GATE_SUBJECTS);
  },
  saveGateSubjects(data: GATESubject[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.GATE_SUBJECTS, userId), data);
  },

  getDSAProblems(userId?: string): DSAProblem[] {
    return safeGet(this.getKey(BASE_KEYS.DSA_PROBLEMS, userId), DEFAULT_DSA_PROBLEMS);
  },
  saveDSAProblems(data: DSAProblem[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.DSA_PROBLEMS, userId), data);
  },

  getCompanies(userId?: string): CompanyApplication[] {
    return safeGet(this.getKey(BASE_KEYS.COMPANIES, userId), DEFAULT_COMPANIES);
  },
  saveCompanies(data: CompanyApplication[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.COMPANIES, userId), data);
  },

  getMockTests(userId?: string): MockTest[] {
    return safeGet(this.getKey(BASE_KEYS.MOCK_TESTS, userId), []);
  },
  saveMockTests(data: MockTest[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.MOCK_TESTS, userId), data);
  },

  getHabits(userId?: string): DailyHabits[] {
    return safeGet(this.getKey(BASE_KEYS.HABITS, userId), [INITIAL_TODAY_HABITS]);
  },
  saveHabits(data: DailyHabits[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.HABITS, userId), data);
  },

  getReminders(userId?: string): ReminderSetting[] {
    return safeGet(this.getKey(BASE_KEYS.REMINDERS, userId), DEFAULT_REMINDERS);
  },
  saveReminders(data: ReminderSetting[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.REMINDERS, userId), data);
  },

  getSettings(userId?: string): UserSettings {
    return safeGet(this.getKey(BASE_KEYS.SETTINGS, userId), DEFAULT_USER_SETTINGS);
  },
  saveSettings(data: UserSettings, userId?: string) {
    safeSet(this.getKey(BASE_KEYS.SETTINGS, userId), data);
  },

  getNotifications(userId?: string): AppNotification[] {
    return safeGet(this.getKey(BASE_KEYS.NOTIFICATIONS, userId), [
      {
        id: 'notif-welcome',
        title: 'Welcome to PrepPilot OS',
        message: 'Your GATE 2027 & Placement OS is ready. Today is Day 1 (Oct 27, 2026)!',
        timestamp: '06:00 AM',
        read: false,
        type: 'info'
      }
    ]);
  },
  saveNotifications(data: AppNotification[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.NOTIFICATIONS, userId), data);
  },

  getFocusSessions(userId?: string): FocusSession[] {
    return safeGet(this.getKey(BASE_KEYS.FOCUS_SESSIONS, userId), DEFAULT_FOCUS_SESSIONS);
  },
  saveFocusSessions(data: FocusSession[], userId?: string) {
    safeSet(this.getKey(BASE_KEYS.FOCUS_SESSIONS, userId), data);
  },
  addFocusSession(session: FocusSession, userId?: string) {
    const existing = this.getFocusSessions(userId);
    const updated = [session, ...existing];
    this.saveFocusSessions(updated, userId);
    return updated;
  },

  exportAllData(userId?: string): string {
    const uid = userId || activeUserId;
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      userId: uid,
      weekdayTimetable: this.getWeekdayTimetable(uid),
      saturdayTimetable: this.getSaturdayTimetable(uid),
      sundayTimetable: this.getSundayTimetable(uid),
      roadmap: this.getRoadmap(uid),
      gateSubjects: this.getGateSubjects(uid),
      dsaProblems: this.getDSAProblems(uid),
      companies: this.getCompanies(uid),
      mockTests: this.getMockTests(uid),
      habits: this.getHabits(uid),
      reminders: this.getReminders(uid),
      settings: this.getSettings(uid),
      focusSessions: this.getFocusSessions(uid)
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonStr: string, userId?: string): boolean {
    const uid = userId || activeUserId;
    try {
      const data = JSON.parse(jsonStr);
      if (data.weekdayTimetable) this.saveWeekdayTimetable(data.weekdayTimetable, uid);
      if (data.saturdayTimetable) this.saveSaturdayTimetable(data.saturdayTimetable, uid);
      if (data.sundayTimetable) this.saveSundayTimetable(data.sundayTimetable, uid);
      if (data.roadmap) this.saveRoadmap(data.roadmap, uid);
      if (data.gateSubjects) this.saveGateSubjects(data.gateSubjects, uid);
      if (data.dsaProblems) this.saveDSAProblems(data.dsaProblems, uid);
      if (data.companies) this.saveCompanies(data.companies, uid);
      if (data.mockTests) this.saveMockTests(data.mockTests, uid);
      if (data.habits) this.saveHabits(data.habits, uid);
      if (data.reminders) this.saveReminders(data.reminders, uid);
      if (data.settings) this.saveSettings(data.settings, uid);
      if (data.focusSessions) this.saveFocusSessions(data.focusSessions, uid);
      return true;
    } catch (e) {
      console.error('Failed to parse import data', e);
      return false;
    }
  },

  resetAllData(userId?: string) {
    const uid = userId || activeUserId;
    if (uid === SUPER_ADMIN_USER_ID) {
      this.saveWeekdayTimetable(DEFAULT_WEEKDAY_TIMETABLE);
      this.saveSaturdayTimetable(DEFAULT_SATURDAY_TIMETABLE);
      this.saveSundayTimetable(DEFAULT_SUNDAY_TIMETABLE);
      this.saveRoadmap(DEFAULT_ROADMAP_PHASES);
      this.saveGateSubjects(DEFAULT_GATE_SUBJECTS);
      this.saveDSAProblems(DEFAULT_DSA_PROBLEMS);
      this.saveCompanies(DEFAULT_COMPANIES);
      this.saveMockTests([]);
      this.saveHabits([INITIAL_TODAY_HABITS]);
      this.saveReminders(DEFAULT_REMINDERS);
      this.saveSettings(DEFAULT_USER_SETTINGS);
      this.saveFocusSessions(DEFAULT_FOCUS_SESSIONS);
    } else {
      localStorage.removeItem(this.getKey(BASE_KEYS.WEEKDAY_TIMETABLE, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.SATURDAY_TIMETABLE, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.SUNDAY_TIMETABLE, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.ROADMAP, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.GATE_SUBJECTS, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.DSA_PROBLEMS, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.COMPANIES, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.MOCK_TESTS, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.HABITS, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.REMINDERS, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.SETTINGS, uid));
      localStorage.removeItem(this.getKey(BASE_KEYS.FOCUS_SESSIONS, uid));
    }
  }
};
