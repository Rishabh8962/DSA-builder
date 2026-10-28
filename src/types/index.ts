export type TimeSlotCategory = 'study' | 'college' | 'gym' | 'personal' | 'sleep' | 'revision';

export interface TimetableBlock {
  id: string;
  timeRange: string;
  startTime: string; // "06:00"
  endTime: string;   // "06:20"
  activity: string;
  description?: string;
  category: TimeSlotCategory;
  isEditable: boolean;
  repeatDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  hasReminder: boolean;
  reminderLeadMinutes: number;
  completedDate?: string; // YYYY-MM-DD if completed today
  isMissed?: boolean;
}

export interface DaySchedule {
  dayName: 'weekday' | 'saturday' | 'sunday';
  blocks: TimetableBlock[];
}

export type RoadmapPhaseId = 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5' | 'phase6' | 'phase7' | 'phase8';

export interface MilestoneItem {
  id: string;
  title: string;
  subjectType: 'GATE' | 'DSA' | 'Placement' | 'Review';
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface RoadmapPhase {
  id: RoadmapPhaseId;
  phaseNumber: number;
  name: string;
  subtitle: string;
  startDate: string; // "2026-10-27"
  endDate: string;   // "2026-11-08"
  description: string;
  gateFocus: string[];
  dsaFocus: string[];
  milestones: MilestoneItem[];
}

export type SubjectStatus = 'not_started' | 'learning' | 'revision' | 'completed';

export interface GATETopic {
  id: string;
  name: string;
  completed: boolean;
  pyqCount: number;
  pyqSolved: number;
  weak: boolean;
}

export interface GATESubject {
  id: string;
  name: string;
  shortCode: string;
  weightageEstimated: number; // typical marks out of 100
  status: SubjectStatus;
  syllabusPercent: number;
  lecturesDone: boolean;
  notesReady: boolean;
  pyqsAttempted: number;
  pyqAccuracy: number; // percentage
  weakTopics: string[];
  nextRevisionDate?: string;
  lastStudiedDate?: string;
  topics: GATETopic[];
}

export type DSADifficulty = 'Easy' | 'Medium' | 'Hard';
export type DSAStatus = 'Not Started' | 'Attempted' | 'Solved' | 'Needs Revision';

export interface DSAProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: DSADifficulty;
  platform: 'LeetCode' | 'GeeksforGeeks' | 'HackerRank' | 'CodeStudio' | 'Other';
  platformUrl?: string;
  status: DSAStatus;
  attempts: number;
  timeSpentMinutes: number;
  hintsUsed: boolean;
  mistakesNotes?: string;
  correctApproach?: string;
  solvedDate?: string;
  spacedRevisionDue?: string; // YYYY-MM-DD
  revisionStage: number; // 0=none, 1=1d, 2=3d, 3=7d, 4=14d, 5=mastered
}

export interface CompanyApplication {
  id: string;
  companyName: string;
  role: string;
  ctcOrStipend?: string;
  deadline?: string;
  eligibility: string;
  status: 'Wishlist' | 'Applied' | 'Online Assessment' | 'Technical Round' | 'HR Round' | 'Offer' | 'Rejected';
  assessmentDate?: string;
  interviewStages: string[];
  notes?: string;
  updatedAt: string;
}

export type MistakeType = 
  | 'concept_not_understood'
  | 'formula_forgotten'
  | 'calculation_mistake'
  | 'question_misread'
  | 'time_management'
  | 'guessing_careless';

export interface MockTest {
  id: string;
  testName: string;
  date: string;
  type: 'Diagnostic' | 'Subject Sectional' | 'Multi-Subject' | 'Full Length Mock';
  totalMarks: number;
  marksScored: number;
  positiveMarks: number;
  negativeMarks: number;
  timeTakenMinutes: number;
  accuracyPercent: number;
  weakTopics: string[];
  mistakeBreakdown: Record<MistakeType, number>;
  notes?: string;
}

export interface DailyHabits {
  date: string; // YYYY-MM-DD
  wakeUpOnTime: boolean;       // 6:00 AM
  morningGateSession: boolean; // 6:20 - 7:50 AM
  attendCollege: boolean;      // 9:00 AM - 5:00 PM
  dsaPractice: boolean;        // 8:40 - 9:40 PM
  aptitudeRevision: boolean;   // 9:40 - 10:10 PM
  exerciseGym: boolean;        // 6:00 - 8:00 PM
  sleepBy1030: boolean;        // 10:30 PM
  socialMediaMinutes: number;  // Target: <= 30 mins
  quickNotes?: string;
}

export interface ReminderSetting {
  id: string;
  title: string;
  time: string; // "06:00"
  enabled: boolean;
  leadMinutes: number; // e.g. 0 or 5 mins before
  repeatDays: number[];
  category: 'routine' | 'study' | 'rest' | 'bedtime';
  description: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'recovery' | 'milestone' | 'info';
  actionUrl?: string;
}

export interface FocusSession {
  id: string;
  startTime: string;
  durationMinutes: number;
  taskTitle: string;
  category: 'GATE' | 'DSA' | 'Aptitude' | 'Revision';
  completed: boolean;
}

export interface DeepWorkDayCell {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Oct 27"
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  dayOfWeekName: string; // "Tue"
  totalMinutes: number;
  totalHours: number; // e.g. 2.5
  sessionCount: number;
  intensityLevel: 0 | 1 | 2 | 3 | 4; // 0: 0h, 1: <=1h, 2: <=2h, 3: <=3.5h, 4: >3.5h
  dominantCategory: 'GATE' | 'DSA' | 'Aptitude' | 'Revision' | 'None';
  sessions: FocusSession[];
  isToday: boolean;
}

export interface DeepWorkSummary {
  totalFlowHours: number;
  totalFlowMinutes: number;
  totalSessions: number;
  dailyAverageHours: number;
  currentFlowStreak: number;
  longestFlowStreak: number;
  daysWithFlow: number;
  peakDay: { date: string; dayLabel: string; hours: number } | null;
  categoryBreakdown: {
    GATE: number;
    DSA: number;
    Aptitude: number;
    Revision: number;
  };
  targetAchievementRate: number; // % of days where daily target was met (>= 3.5 hrs)
}

export interface DeepWorkAnalyticsResult {
  days: DeepWorkDayCell[];
  summary: DeepWorkSummary;
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  front: string; // Question or formula name
  back: string;  // Formula, explanation, or code snippet
  mastered: boolean;
  lastReviewed?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Java & OOP' | 'DBMS & SQL' | 'Operating Systems' | 'Computer Networks' | 'System Design Basics';
  question: string;
  answer: string;
  codeSnippet?: string;
  importance: 'High' | 'Must Know' | 'Medium';
  mastered: boolean;
}

export interface STARProject {
  id: string;
  title: string;
  techStack: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  keyInterviewTakeaway: string;
}

export type GraphNodeDomain =
  | 'Math & Discrete'
  | 'DSA & Java'
  | 'Systems & OS'
  | 'Database & Architecture'
  | 'Theory & Compilers'
  | 'General Aptitude';

export type GraphNodeStatus = 'locked' | 'unlocked' | 'in_progress' | 'mastered';

export type DynamicNodeStatus = 'mastered' | 'in_progress' | 'prerequisite_gap' | 'ready';

export interface NodeRealtimeMetrics {
  missingPrerequisites: { id: string; title: string; status: GraphNodeStatus }[];
  hasPrerequisiteGap: boolean;
  dynamicStatus: DynamicNodeStatus;
  difficultyScore: number; // 0 to 100
  difficultyLevel: 'Foundational' | 'Moderate' | 'Challenging' | 'Advanced Hard';
  gateWeightage: number;
  gateSyllabusPercent: number;
  gatePyqsAttempted: number;
  gatePyqAccuracy: number;
  gateWeakTopics: string[];
  hasGateWeakness: boolean;
  dsaTotalProblems: number;
  dsaSolvedProblems: number;
  dsaAttemptedProblems: number;
  dsaEasyCount: number;
  dsaMediumCount: number;
  dsaHardCount: number;
  dsaSolvedRate: number; // 0 to 100
  progressPercent: number; // 0 to 100
}

export interface DependencyGraphNode {
  id: string;
  title: string;
  domain: GraphNodeDomain;
  gateSubject: string;
  dsaTopic?: string;
  weightageMarks?: number;
  summary: string;
  keyConcepts: string[];
  linkedDSAProblems: string[];
  prerequisites: string[]; // Node IDs required before starting this
  status: GraphNodeStatus;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface UserSettings {
  targetGateScore: number;     // 70+
  gateExamDate: string;        // "2027-02-06"
  placementMilestoneDate: string; // "2027-02-01"
  dailyStudyTargetHours: number; // 3.5
  collegeSchedule: string;     // "9:00 AM - 5:00 PM"
  gymDuration: string;         // "6:00 PM - 8:00 PM"
  sleepSchedule: string;       // "10:30 PM - 6:00 AM"
  timezone: string;            // "Asia/Kolkata"
  dsaDailyTarget: number;      // 1-2 problems
  socialMediaLimitMinutes: number; // 30
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  supabaseConnected: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}
