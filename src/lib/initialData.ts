import {
  TimetableBlock,
  RoadmapPhase,
  GATESubject,
  DSAProblem,
  CompanyApplication,
  DailyHabits,
  ReminderSetting,
  UserSettings,
  FocusSession
} from '../types';

export const DEFAULT_WEEKDAY_TIMETABLE: TimetableBlock[] = [
  {
    id: 'block-wd-1',
    timeRange: '6:00–6:20 AM',
    startTime: '06:00',
    endTime: '06:20',
    activity: 'Wake up and morning routine',
    description: 'Hydrate, light stretching, brush, get into focused headspace',
    category: 'personal',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-wd-2',
    timeRange: '6:20–7:50 AM',
    startTime: '06:20',
    endTime: '07:50',
    activity: 'GATE focused study (90 mins)',
    description: 'Deep work on core syllabus topic (Maths/Algorithms/DBMS) when brain is fresh',
    category: 'study',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-wd-3',
    timeRange: '7:50–9:00 AM',
    startTime: '07:50',
    endTime: '09:00',
    activity: 'Breakfast, getting ready, and commute',
    description: 'Nutritious meal, travel to college without stress',
    category: 'personal',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-wd-4',
    timeRange: '9:00 AM–5:00 PM',
    startTime: '09:00',
    endTime: '17:00',
    activity: 'College',
    description: 'Attend classes. During breaks: quick flashcards, formulas, or 5–10 aptitude questions',
    category: 'college',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-wd-5',
    timeRange: '5:00–6:00 PM',
    startTime: '17:00',
    endTime: '18:00',
    activity: 'Commute, snack, and rest',
    description: 'Decompress from college, healthy snack, mental reset',
    category: 'personal',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-wd-6',
    timeRange: '6:00–8:00 PM',
    startTime: '18:00',
    endTime: '20:00',
    activity: 'Gym and fitness',
    description: 'Strength workout, physical health, stamina building',
    category: 'gym',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-wd-7',
    timeRange: '8:00–8:40 PM',
    startTime: '20:00',
    endTime: '20:40',
    activity: 'Dinner and shower',
    description: 'High protein dinner, shower, wind into evening session',
    category: 'personal',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-wd-8',
    timeRange: '8:40–9:40 PM',
    startTime: '20:40',
    endTime: '21:40',
    activity: 'DSA in Java (60 mins)',
    description: 'Solve 1-2 curated problems on current topic, trace dry runs on paper',
    category: 'study',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-wd-9',
    timeRange: '9:40–10:10 PM',
    startTime: '21:40',
    endTime: '22:10',
    activity: 'Aptitude, revision, and error-log review',
    description: '10 aptitude questions + review formulas + record today mistakes',
    category: 'revision',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-wd-10',
    timeRange: '10:10–10:30 PM',
    startTime: '22:10',
    endTime: '22:30',
    activity: 'Prepare for tomorrow and wind down',
    description: 'Pack bag, set clothes, screen off, review tomorrow timetable',
    category: 'personal',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-wd-11',
    timeRange: '10:30 PM–6:00 AM',
    startTime: '22:30',
    endTime: '06:00',
    activity: 'Sleep (7.5 hours recovery)',
    description: 'Crucial for memory consolidation and cognitive speed',
    category: 'sleep',
    isEditable: true,
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: false,
    reminderLeadMinutes: 0
  }
];

export const DEFAULT_SATURDAY_TIMETABLE: TimetableBlock[] = [
  {
    id: 'block-sat-1',
    timeRange: '7:00–9:00 AM',
    startTime: '07:00',
    endTime: '09:00',
    activity: 'GATE Focused Study (2 hours)',
    description: 'Challenging topic theory & standard PYQ problem set',
    category: 'study',
    isEditable: true,
    repeatDays: [6],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-sat-2',
    timeRange: '9:00–10:00 AM',
    startTime: '09:00',
    endTime: '10:00',
    activity: 'Breakfast & morning break',
    description: 'Relaxed breakfast and fresh air',
    category: 'personal',
    isEditable: true,
    repeatDays: [6],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sat-3',
    timeRange: '10:00 AM–12:00 PM',
    startTime: '10:00',
    endTime: '12:00',
    activity: 'DSA in Java Deep Practice (2 hours)',
    description: 'Solve 2-3 medium difficulty problems and write clean Java code',
    category: 'study',
    isEditable: true,
    repeatDays: [6],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-sat-4',
    timeRange: '12:00–1:00 PM',
    startTime: '12:00',
    endTime: '13:00',
    activity: 'Aptitude or Revision (60 mins)',
    description: 'Quantitative aptitude sets & speed practice',
    category: 'revision',
    isEditable: true,
    repeatDays: [6],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sat-5',
    timeRange: '1:00–3:00 PM',
    startTime: '13:00',
    endTime: '15:00',
    activity: 'Lunch & leisure / rest',
    description: 'Unwind without guilt',
    category: 'personal',
    isEditable: true,
    repeatDays: [6],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sat-6',
    timeRange: '3:00–4:30 PM',
    startTime: '15:00',
    endTime: '16:30',
    activity: 'Weekly Review & Backlog Catchup',
    description: 'Assess week progress, notes consolidation, clear any pending topics',
    category: 'revision',
    isEditable: true,
    repeatDays: [6],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-sat-7',
    timeRange: '6:00–8:00 PM',
    startTime: '18:00',
    endTime: '20:00',
    activity: 'Gym and fitness',
    description: 'Weekend gym session',
    category: 'gym',
    isEditable: true,
    repeatDays: [6],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-sat-8',
    timeRange: '8:00–10:30 PM',
    startTime: '20:00',
    endTime: '22:30',
    activity: 'Dinner, reading & relaxation',
    description: 'Personal time, light reading, wind down',
    category: 'personal',
    isEditable: true,
    repeatDays: [6],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sat-9',
    timeRange: '10:30 PM–6:30 AM',
    startTime: '22:30',
    endTime: '06:30',
    activity: 'Sleep',
    description: 'Restorative weekend rest',
    category: 'sleep',
    isEditable: true,
    repeatDays: [6],
    hasReminder: false,
    reminderLeadMinutes: 0
  }
];

export const DEFAULT_SUNDAY_TIMETABLE: TimetableBlock[] = [
  {
    id: 'block-sun-1',
    timeRange: '7:30–9:30 AM',
    startTime: '07:30',
    endTime: '09:30',
    activity: 'GATE Practice Test or Sectional Mock (2 hours)',
    description: 'Timed sectional test or full revision session under exam conditions',
    category: 'study',
    isEditable: true,
    repeatDays: [0],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-sun-2',
    timeRange: '9:30–10:30 AM',
    startTime: '09:30',
    endTime: '10:30',
    activity: 'Breakfast & Routine',
    description: 'Relaxed breakfast',
    category: 'personal',
    isEditable: true,
    repeatDays: [0],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sun-3',
    timeRange: '10:30 AM–12:00 PM',
    startTime: '10:30',
    endTime: '12:00',
    activity: 'DSA in Java (90 mins)',
    description: 'Solve 2 problems, test edge cases, focus on space-time efficiency',
    category: 'study',
    isEditable: true,
    repeatDays: [0],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-sun-4',
    timeRange: '12:00–12:30 PM',
    startTime: '12:00',
    endTime: '12:30',
    activity: 'Weekly Planning (30 mins)',
    description: 'Review roadmap milestones, set upcoming week targets',
    category: 'revision',
    isEditable: true,
    repeatDays: [0],
    hasReminder: true,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sun-5',
    timeRange: '12:30–1:30 PM',
    startTime: '12:30',
    endTime: '13:30',
    activity: 'Review Mistakes & Update Error Log',
    description: 'Analyze Sunday mock, document calculation & concept slips',
    category: 'revision',
    isEditable: true,
    repeatDays: [0],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sun-6',
    timeRange: '1:30–6:00 PM',
    startTime: '13:30',
    endTime: '18:00',
    activity: 'Lunch, hobbies, personal time',
    description: 'Guilt-free family, friends, or hobby time',
    category: 'personal',
    isEditable: true,
    repeatDays: [0],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sun-7',
    timeRange: '6:00–8:00 PM',
    startTime: '18:00',
    endTime: '20:00',
    activity: 'Gym & recovery',
    description: 'Physical workout to recharge for the coming week',
    category: 'gym',
    isEditable: true,
    repeatDays: [0],
    hasReminder: true,
    reminderLeadMinutes: 5
  },
  {
    id: 'block-sun-8',
    timeRange: '8:00–10:30 PM',
    startTime: '20:00',
    endTime: '22:30',
    activity: 'Dinner & wind down',
    description: 'Early night preparation for Monday 6 AM routine',
    category: 'personal',
    isEditable: true,
    repeatDays: [0],
    hasReminder: false,
    reminderLeadMinutes: 0
  },
  {
    id: 'block-sun-9',
    timeRange: '10:30 PM–6:00 AM',
    startTime: '22:30',
    endTime: '06:00',
    activity: 'Sleep',
    description: 'Rest for Monday wake-up',
    category: 'sleep',
    isEditable: true,
    repeatDays: [0],
    hasReminder: false,
    reminderLeadMinutes: 0
  }
];

export const DEFAULT_ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase1',
    phaseNumber: 1,
    name: 'Foundation',
    subtitle: 'Diagnostic test & Core Mathematical Grounds',
    startDate: '2026-10-27',
    endDate: '2026-11-08',
    description: 'Establish baseline diagnostics, begin discrete mathematics and engineering mathematics, set up Java collections and solve 10-15 beginner problems.',
    gateFocus: [
      'Take initial diagnostic test (GATE CS syllabus)',
      'Begin Discrete Mathematics (Propositional logic, sets, relations)',
      'Begin Engineering Mathematics (Linear Algebra: Matrices & Determinants)',
      'Revise C / Java programming fundamentals',
      'Start recording mistakes & weak concepts in Error Log'
    ],
    dsaFocus: [
      'Java fundamentals and Collections framework',
      'Time and space complexity analysis (Big-O, Omega, Theta)',
      'Arrays and Strings basics',
      'Solve 10–15 beginner problems'
    ],
    milestones: [
      { id: 'm-1-1', title: 'Take full diagnostic test to identify baseline strengths & weaknesses', subjectType: 'Review', completed: false },
      { id: 'm-1-2', title: 'Complete Propositional Logic & Truth Tables in Discrete Maths', subjectType: 'GATE', completed: false },
      { id: 'm-1-3', title: 'Linear Algebra: Eigenvalues & Matrix rank practice', subjectType: 'GATE', completed: false },
      { id: 'm-1-4', title: 'Solve 15 beginner Java problems on Arrays and Strings', subjectType: 'DSA', completed: false },
      { id: 'm-1-5', title: 'Set up mistake log book / error register', subjectType: 'Review', completed: false }
    ]
  },
  {
    id: 'phase2',
    phaseNumber: 2,
    name: 'Core Foundations',
    subtitle: 'Algorithms, Data Structures & Two Pointers',
    startDate: '2026-11-09',
    endDate: '2026-11-22',
    description: 'Deep dive into discrete math relations, graphs, basic algorithms, general aptitude, and DSA two-pointer/sliding-window patterns.',
    gateFocus: [
      'Discrete Mathematics: Graph theory, Combinatorics, Recurrences',
      'Algorithms & Data Structures: Asymptotic notation, stacks, queues',
      'Engineering Mathematics: Calculus (Limits, continuity, maxima/minima)',
      'General Aptitude: Numerical computation & percentages'
    ],
    dsaFocus: [
      'Searching and sorting algorithms',
      'Binary search variations & edge cases',
      'Two pointers technique',
      'Sliding window patterns',
      'Solve 12–18 problems'
    ],
    milestones: [
      { id: 'm-2-1', title: 'Complete Graph Theory fundamentals in Discrete Maths', subjectType: 'GATE', completed: false },
      { id: 'm-2-2', title: 'Asymptotic notation & master theorem recurrences', subjectType: 'GATE', completed: false },
      { id: 'm-2-3', title: 'Master Binary Search on answer space', subjectType: 'DSA', completed: false },
      { id: 'm-2-4', title: 'Solve 15 Two Pointers & Sliding Window problems', subjectType: 'DSA', completed: false },
      { id: 'm-2-5', title: 'Attempt 20 PYQ questions on Discrete Maths', subjectType: 'GATE', completed: false }
    ]
  },
  {
    id: 'phase3',
    phaseNumber: 3,
    name: 'DBMS & Basic Problem Solving',
    subtitle: 'Relational Model, SQL, Normalization & Linked Lists',
    startDate: '2026-11-23',
    endDate: '2026-12-06',
    description: 'Comprehensive database concepts, SQL queries, normalization, transactions, and recursion with linked data structures.',
    gateFocus: [
      'DBMS: ER model, Relational model, Relational algebra, SQL',
      'Normalization (1NF, 2NF, 3NF, BCNF) & Dependency preservation',
      'Transactions, Serializability, Concurrency control, Indexing (B/B+ Trees)',
      'Topic-wise previous-year questions (PYQs)'
    ],
    dsaFocus: [
      'Linked lists (Singly, Doubly, Fast & Slow pointers)',
      'Stacks and queues applications (Monotonic stack, expression eval)',
      'Recursion fundamentals',
      'Solve 12–15 problems'
    ],
    milestones: [
      { id: 'm-3-1', title: 'Complete BCNF/3NF decomposition & losslessness', subjectType: 'GATE', completed: false },
      { id: 'm-3-2', title: 'Solve 30 PYQs on Relational Algebra & SQL queries', subjectType: 'GATE', completed: false },
      { id: 'm-3-3', title: 'Implement Singly & Doubly Linked List problems in Java', subjectType: 'DSA', completed: false },
      { id: 'm-3-4', title: 'Master Monotonic Stack patterns (Next Greater Element)', subjectType: 'DSA', completed: false },
      { id: 'm-3-5', title: 'DBMS Sectional Mock test', subjectType: 'Review', completed: false }
    ]
  },
  {
    id: 'phase4',
    phaseNumber: 4,
    name: 'Operating Systems & Trees',
    subtitle: 'Processes, CPU Scheduling, Virtual Memory & Trees',
    startDate: '2026-12-07',
    endDate: '2026-12-20',
    description: 'Master OS process sync, semaphores, paging, deadlocks alongside binary trees, traversals, and hashing.',
    gateFocus: [
      'Processes, threads, and CPU scheduling algorithms',
      'Synchronization (Semaphores, Peterson algorithm) and Deadlocks',
      'Memory management, Paging, Page replacement, Virtual memory',
      'Solve topic-wise OS PYQs (2010–2026)'
    ],
    dsaFocus: [
      'Trees: Traversals (Inorder, Preorder, Postorder, Level order)',
      'Binary Search Trees (BST validation, LCA)',
      'Hashing (Hash maps, sets, collision handling)',
      'Basic recursion & backtracking',
      'Solve 12–15 problems'
    ],
    milestones: [
      { id: 'm-4-1', title: 'Complete Semaphores & Deadlock Banker’s algorithm', subjectType: 'GATE', completed: false },
      { id: 'm-4-2', title: 'Virtual Memory & Multi-level Paging calculations', subjectType: 'GATE', completed: false },
      { id: 'm-4-3', title: 'Solve 15 Tree traversal & BST problems in Java', subjectType: 'DSA', completed: false },
      { id: 'm-4-4', title: 'Solve 35 OS Previous Year Questions', subjectType: 'GATE', completed: false },
      { id: 'm-4-5', title: 'Operating Systems Sectional Mock test', subjectType: 'Review', completed: false }
    ]
  },
  {
    id: 'phase5',
    phaseNumber: 5,
    name: 'Networking & Consolidation',
    subtitle: 'Computer Networks, Graphs & 50-65 DSA Target Milestone',
    startDate: '2026-12-21',
    endDate: '2026-12-31',
    description: 'Computer networks layers, Digital logic, Graph traversals (BFS/DFS), introductory Dynamic Programming, and reaching the first 50-65 DSA problem target.',
    gateFocus: [
      'Computer Networks: IPv4/IPv6, Subnetting, TCP/UDP, Flow & Congestion control',
      'Digital Logic: Boolean minimization, K-Maps, Multiplexers, Counters',
      'Review all completed subjects: Maths, DBMS, OS',
      'Complete relevant PYQs'
    ],
    dsaFocus: [
      'Introductory graphs, BFS, and DFS traversals',
      'Introduction to Dynamic Programming (1D memoization/tabulation)',
      'Revise previous DSA topics & edge cases',
      'Solve 8–12 additional problems (Hit 50–65 cumulative target)'
    ],
    milestones: [
      { id: 'm-5-1', title: 'Subnetting & TCP Congestion window calculations', subjectType: 'GATE', completed: false },
      { id: 'm-5-2', title: 'Reach cumulative 50–65 solved DSA problems by Dec 31', subjectType: 'DSA', completed: false },
      { id: 'm-5-3', title: 'Digital Logic K-Map & Flip-Flop excitation tables', subjectType: 'GATE', completed: false },
      { id: 'm-5-4', title: 'End of Year Comprehensive Subject Revision', subjectType: 'Review', completed: false }
    ]
  },
  {
    id: 'phase6',
    phaseNumber: 6,
    name: 'GATE Intensive Preparation',
    subtitle: 'Full Syllabus Coverage, Sectional Tests & Full Mocks',
    startDate: '2027-01-01',
    endDate: '2027-01-31',
    description: 'January intensive push: TOC, Compiler Design, COA, full-length mocks, error correction, formula revision, with 45-60 min daily DSA maintenance.',
    gateFocus: [
      'Theory of Computation (DFA/NFA, Regular expressions, CFL, Turing machines)',
      'Compiler Design (LL(1), LR parsing, syntax-directed translation, runtime)',
      'Computer Organization & Architecture (Pipelining, Cache memory, addressing modes)',
      'Daily subject revision & PYQs',
      'Full-length 3-hour mock tests with error analysis',
      'Formula handbook revision'
    ],
    dsaFocus: [
      'Maintain 45–60 minutes daily Java DSA practice',
      'Practice standard coding assessment patterns',
      'Flexibility on full mock test days'
    ],
    milestones: [
      { id: 'm-6-1', title: 'Complete Theory of Computation & Pumping Lemma', subjectType: 'GATE', completed: false },
      { id: 'm-6-2', title: 'Complete Compiler Parsing (LL, LR, LALR)', subjectType: 'GATE', completed: false },
      { id: 'm-6-3', title: 'COA: Pipelining hazards & Cache mapping formulas', subjectType: 'GATE', completed: false },
      { id: 'm-6-4', title: 'Attempt 4 Full-Length GATE CS Mock Tests', subjectType: 'Review', completed: false },
      { id: 'm-6-5', title: 'Comprehensive Error Log analysis: zero repeat errors', subjectType: 'Review', completed: false }
    ]
  },
  {
    id: 'phase7',
    phaseNumber: 7,
    name: 'GATE Exam & Placement Transition',
    subtitle: 'Exam Focus, Peak Performance & Shift to Campus Hiring',
    startDate: '2027-02-01',
    endDate: '2027-02-28',
    description: 'Keep GATE as primary focus until exam date. Prioritize calm sleep, short notes, weak areas. Switch immediately after exam to placement hiring prep.',
    gateFocus: [
      'Short notes & formula revision',
      'Light mock analysis; do not start new massive topics',
      'Rest & peak mental readiness for exam day (target: 70+ marks)',
      'Post-exam: review answers and archive GATE materials'
    ],
    dsaFocus: [
      'Post-exam: Resume intensive 2 hours daily DSA in Java',
      'Aptitude speed tests for placement screening tests',
      'Core CS interview revision (OOPs, SQL, OS, CN)'
    ],
    milestones: [
      { id: 'm-7-1', title: 'GATE CS 2027 Exam Day: Aim for 70+ Marks', subjectType: 'GATE', completed: false },
      { id: 'm-7-2', title: 'Post-Exam: Update Resume with Projects & Skills', subjectType: 'Placement', completed: false },
      { id: 'm-7-3', title: 'Campus Placement Prep Kick-off: 2 hrs DSA daily', subjectType: 'DSA', completed: false },
      { id: 'm-7-4', title: 'Complete Java OOPs concepts & design patterns review', subjectType: 'Placement', completed: false }
    ]
  },
  {
    id: 'phase8',
    phaseNumber: 8,
    name: 'Placement Preparation & Campus Drives',
    subtitle: 'Coding Contests, Aptitude, System Design & Interviews',
    startDate: '2027-03-01',
    endDate: '2027-03-31',
    description: 'Intensive interview readiness: live coding practice, timed assessments, company application tracking, and HR mock interviews.',
    gateFocus: [
      'GATE results check and counseling awareness (COAP / CCMT)'
    ],
    dsaFocus: [
      'Daily DSA: Arrays, Strings, Trees, Graphs, DP',
      'Timed 60-minute coding assessments',
      'Explain solutions out loud with optimal space-time complexities'
    ],
    milestones: [
      { id: 'm-8-1', title: 'Solve 40 placement-specific interview coding problems', subjectType: 'DSA', completed: false },
      { id: 'm-8-2', title: 'Complete Aptitude mock tests (Quantitative, Logical, Verbal)', subjectType: 'Placement', completed: false },
      { id: 'm-8-3', title: 'Conduct 2 technical mock interviews (Projects & Core CS)', subjectType: 'Placement', completed: false },
      { id: 'm-8-4', title: 'Track 10+ company applications, OA dates, and follow-ups', subjectType: 'Placement', completed: false }
    ]
  }
];

export const DEFAULT_GATE_SUBJECTS: GATESubject[] = [
  {
    id: 'subj-1',
    name: 'Engineering Mathematics',
    shortCode: 'EM',
    weightageEstimated: 8,
    status: 'learning',
    syllabusPercent: 15,
    lecturesDone: false,
    notesReady: true,
    pyqsAttempted: 12,
    pyqAccuracy: 75,
    weakTopics: ['Eigenvalues & Cayley-Hamilton', 'Multivariable Maxima/Minima'],
    nextRevisionDate: '2026-11-02',
    lastStudiedDate: '2026-10-27',
    topics: [
      { id: 'em-1', name: 'Matrices, Determinants & System of Linear Equations', completed: true, pyqCount: 20, pyqSolved: 16, weak: false },
      { id: 'em-2', name: 'Eigenvalues, Eigenvectors & Cayley-Hamilton Theorem', completed: false, pyqCount: 25, pyqSolved: 10, weak: true },
      { id: 'em-3', name: 'Calculus: Limits, Continuity, Differentiability', completed: false, pyqCount: 18, pyqSolved: 5, weak: false },
      { id: 'em-4', name: 'Definite Integrals & Maxima/Minima', completed: false, pyqCount: 15, pyqSolved: 0, weak: true },
      { id: 'em-5', name: 'Probability: Conditional, Bayes, Discrete & Continuous Distributions', completed: false, pyqCount: 30, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-2',
    name: 'Discrete Mathematics',
    shortCode: 'DM',
    weightageEstimated: 7,
    status: 'learning',
    syllabusPercent: 20,
    lecturesDone: false,
    notesReady: true,
    pyqsAttempted: 15,
    pyqAccuracy: 80,
    weakTopics: ['Generating functions', 'Group theory'],
    nextRevisionDate: '2026-11-04',
    lastStudiedDate: '2026-10-27',
    topics: [
      { id: 'dm-1', name: 'Propositional & First Order Logic', completed: true, pyqCount: 25, pyqSolved: 20, weak: false },
      { id: 'dm-2', name: 'Sets, Relations, Functions, Partial Orders & Lattices', completed: false, pyqCount: 30, pyqSolved: 12, weak: false },
      { id: 'dm-3', name: 'Groups, Monoids & Algebraic Structures', completed: false, pyqCount: 15, pyqSolved: 4, weak: true },
      { id: 'dm-4', name: 'Graph Theory: Connectivity, Planarity, Coloring, Trees', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'dm-5', name: 'Combinatorics: Counting, Permutations, Recurrences & Generating Functions', completed: false, pyqCount: 25, pyqSolved: 0, weak: true }
    ]
  },
  {
    id: 'subj-3',
    name: 'Digital Logic',
    shortCode: 'DL',
    weightageEstimated: 6,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'dl-1', name: 'Boolean Algebra, Logic Gates & Minimization (K-Maps)', completed: false, pyqCount: 20, pyqSolved: 0, weak: false },
      { id: 'dl-2', name: 'Combinational Circuits: Adders, Multiplexers, Decoders', completed: false, pyqCount: 25, pyqSolved: 0, weak: false },
      { id: 'dl-3', name: 'Sequential Circuits: Latches, Flip-Flops, Counters, State Diagrams', completed: false, pyqCount: 30, pyqSolved: 0, weak: false },
      { id: 'dl-4', name: 'Number Representations: Fixed, Floating Point, 2s Complement', completed: false, pyqCount: 15, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-4',
    name: 'Computer Organization & Architecture',
    shortCode: 'COA',
    weightageEstimated: 8,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'coa-1', name: 'Machine Instructions & Addressing Modes', completed: false, pyqCount: 25, pyqSolved: 0, weak: false },
      { id: 'coa-2', name: 'ALU, Data-Path & Control Unit Design', completed: false, pyqCount: 20, pyqSolved: 0, weak: false },
      { id: 'coa-3', name: 'Instruction Pipelining & Hazard Resolution', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'coa-4', name: 'Memory Hierarchy: Cache Mapping, Hit Time, Miss Penalty', completed: false, pyqCount: 40, pyqSolved: 0, weak: false },
      { id: 'coa-5', name: 'I/O Interface: Interrupts, DMA & Bus Arbitration', completed: false, pyqCount: 15, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-5',
    name: 'Programming & Data Structures',
    shortCode: 'PDS',
    weightageEstimated: 10,
    status: 'learning',
    syllabusPercent: 25,
    lecturesDone: false,
    notesReady: true,
    pyqsAttempted: 18,
    pyqAccuracy: 85,
    weakTopics: ['Pointer arithmetic in C', 'Tree reconstructions'],
    nextRevisionDate: '2026-11-05',
    lastStudiedDate: '2026-10-27',
    topics: [
      { id: 'pds-1', name: 'Programming in C: Functions, Recursion, Scope, Pointers', completed: true, pyqCount: 30, pyqSolved: 25, weak: true },
      { id: 'pds-2', name: 'Arrays, Stacks, Queues & Linked Lists', completed: false, pyqCount: 35, pyqSolved: 15, weak: false },
      { id: 'pds-3', name: 'Trees, Binary Search Trees & AVL Trees', completed: false, pyqCount: 40, pyqSolved: 5, weak: true },
      { id: 'pds-4', name: 'Binary Heaps & Priority Queues', completed: false, pyqCount: 20, pyqSolved: 0, weak: false },
      { id: 'pds-5', name: 'Graph Representations (Adjacency Matrix & List)', completed: false, pyqCount: 15, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-6',
    name: 'Algorithms',
    shortCode: 'ALGO',
    weightageEstimated: 8,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'algo-1', name: 'Asymptotic Analysis & Recurrence Relations', completed: false, pyqCount: 30, pyqSolved: 0, weak: false },
      { id: 'algo-2', name: 'Searching, Sorting & Hashing', completed: false, pyqCount: 30, pyqSolved: 0, weak: false },
      { id: 'algo-3', name: 'Divide-and-Conquer & Greedy Techniques', completed: false, pyqCount: 25, pyqSolved: 0, weak: false },
      { id: 'algo-4', name: 'Dynamic Programming (LCS, 0/1 Knapsack, Matrix Chain)', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'algo-5', name: 'Graph Algorithms: BFS, DFS, MST (Prim/Kruskal), Shortest Paths (Dijkstra/Bellman-Ford)', completed: false, pyqCount: 40, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-7',
    name: 'Theory of Computation',
    shortCode: 'TOC',
    weightageEstimated: 8,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'toc-1', name: 'Regular Expressions & Finite Automata (DFA, NFA, Min-DFA)', completed: false, pyqCount: 40, pyqSolved: 0, weak: false },
      { id: 'toc-2', name: 'Context-Free Grammars & Push-down Automata (PDA)', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'toc-3', name: 'Pumping Lemma & Closure Properties of Languages', completed: false, pyqCount: 30, pyqSolved: 0, weak: false },
      { id: 'toc-4', name: 'Turing Machines & Decidability / Undecidability', completed: false, pyqCount: 35, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-8',
    name: 'Compiler Design',
    shortCode: 'CD',
    weightageEstimated: 5,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'cd-1', name: 'Lexical Analysis & Regular Expressions in Compilers', completed: false, pyqCount: 15, pyqSolved: 0, weak: false },
      { id: 'cd-2', name: 'Parsing: Top-Down (LL1) & Bottom-Up (LR0, SLR1, CLR1, LALR1)', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'cd-3', name: 'Syntax-Directed Translation (SDT, S-attributed, L-attributed)', completed: false, pyqCount: 20, pyqSolved: 0, weak: false },
      { id: 'cd-4', name: 'Intermediate Code Generation, Runtime Environments & Code Optimization', completed: false, pyqCount: 25, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-9',
    name: 'Operating Systems',
    shortCode: 'OS',
    weightageEstimated: 10,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'os-1', name: 'System Calls, Processes & Threads (User vs Kernel)', completed: false, pyqCount: 25, pyqSolved: 0, weak: false },
      { id: 'os-2', name: 'CPU Scheduling Algorithms & Metrics', completed: false, pyqCount: 30, pyqSolved: 0, weak: false },
      { id: 'os-3', name: 'Synchronization, Critical Section, Semaphores & Deadlocks', completed: false, pyqCount: 40, pyqSolved: 0, weak: false },
      { id: 'os-4', name: 'Memory Management, Paging, Page Replacement & Virtual Memory', completed: false, pyqCount: 45, pyqSolved: 0, weak: false },
      { id: 'os-5', name: 'File Systems & Disk Scheduling (SCAN, C-SCAN, SSTF)', completed: false, pyqCount: 20, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-10',
    name: 'Databases (DBMS)',
    shortCode: 'DBMS',
    weightageEstimated: 8,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'db-1', name: 'ER-Model & Relational Model', completed: false, pyqCount: 20, pyqSolved: 0, weak: false },
      { id: 'db-2', name: 'Relational Algebra & Tuple Relational Calculus', completed: false, pyqCount: 30, pyqSolved: 0, weak: false },
      { id: 'db-3', name: 'SQL: Queries, Aggregations, Nested Queries & Joins', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'db-4', name: 'Normalization & Functional Dependencies (1NF, 2NF, 3NF, BCNF)', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'db-5', name: 'Transactions, Serializability, Concurrency Control & Indexing (B/B+ Trees)', completed: false, pyqCount: 40, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-11',
    name: 'Computer Networks',
    shortCode: 'CN',
    weightageEstimated: 8,
    status: 'not_started',
    syllabusPercent: 0,
    lecturesDone: false,
    notesReady: false,
    pyqsAttempted: 0,
    pyqAccuracy: 0,
    weakTopics: [],
    topics: [
      { id: 'cn-1', name: 'OSI & TCP/IP Model Layers, Packet vs Circuit Switching', completed: false, pyqCount: 20, pyqSolved: 0, weak: false },
      { id: 'cn-2', name: 'Data Link Layer: Framing, Error Detection (CRC), Sliding Window & MAC (CSMA/CD)', completed: false, pyqCount: 35, pyqSolved: 0, weak: false },
      { id: 'cn-3', name: 'Network Layer: IPv4, Subnetting, CIDR, Routing Algorithms (DVR, LSR)', completed: false, pyqCount: 45, pyqSolved: 0, weak: false },
      { id: 'cn-4', name: 'Transport Layer: TCP/UDP, Flow Control, Congestion Control', completed: false, pyqCount: 40, pyqSolved: 0, weak: false },
      { id: 'cn-5', name: 'Application Layer: DNS, SMTP, HTTP, FTP', completed: false, pyqCount: 20, pyqSolved: 0, weak: false }
    ]
  },
  {
    id: 'subj-12',
    name: 'General Aptitude',
    shortCode: 'GA',
    weightageEstimated: 15,
    status: 'learning',
    syllabusPercent: 10,
    lecturesDone: false,
    notesReady: true,
    pyqsAttempted: 20,
    pyqAccuracy: 85,
    weakTopics: ['Spatial visualization', 'Vocabulary analogies'],
    topics: [
      { id: 'ga-1', name: 'Verbal Aptitude: Grammar, Vocabulary, Comprehension', completed: false, pyqCount: 30, pyqSolved: 15, weak: true },
      { id: 'ga-2', name: 'Quantitative Aptitude: Data Interpretation, Percentages, Ratios', completed: false, pyqCount: 40, pyqSolved: 10, weak: false },
      { id: 'ga-3', name: 'Analytical Aptitude: Logic Deduction, Number Series, Syllogisms', completed: false, pyqCount: 30, pyqSolved: 0, weak: false },
      { id: 'ga-4', name: 'Spatial Aptitude: 2D & 3D Shape Transformation, Paper Folding', completed: false, pyqCount: 20, pyqSolved: 0, weak: true }
    ]
  }
];

export const DEFAULT_DSA_PROBLEMS: DSAProblem[] = [
  // Beginner Foundations (All unattempted as per prompt instructions)
  {
    id: 'dsa-1',
    title: 'Two Sum',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/two-sum/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-2',
    title: 'Best Time to Buy and Sell Stock',
    topic: 'Arrays & Two Pointers',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-3',
    title: 'Contains Duplicate',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/contains-duplicate/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-4',
    title: 'Valid Anagram',
    topic: 'Strings & Hashing',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/valid-anagram/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-5',
    title: 'Valid Palindrome',
    topic: 'Strings & Two Pointers',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/valid-palindrome/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-6',
    title: 'Binary Search',
    topic: 'Binary Search',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/binary-search/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-7',
    title: 'Search in Rotated Sorted Array',
    topic: 'Binary Search',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-8',
    title: '3Sum',
    topic: 'Arrays & Two Pointers',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/3sum/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-9',
    title: 'Container With Most Water',
    topic: 'Two Pointers',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/container-with-most-water/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-10',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Sliding Window',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-11',
    title: 'Reverse Linked List',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-12',
    title: 'Merge Two Sorted Lists',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-13',
    title: 'Linked List Cycle',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-14',
    title: 'Valid Parentheses',
    topic: 'Stacks & Queues',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/valid-parentheses/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-15',
    title: 'Invert Binary Tree',
    topic: 'Trees',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-16',
    title: 'Maximum Depth of Binary Tree',
    topic: 'Trees',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-17',
    title: 'Lowest Common Ancestor of a BST',
    topic: 'Trees',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-18',
    title: 'Number of Islands',
    topic: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/number-of-islands/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-19',
    title: 'Climbing Stairs',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/climbing-stairs/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  },
  {
    id: 'dsa-20',
    title: 'Coin Change',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformUrl: 'https://leetcode.com/problems/coin-change/',
    status: 'Not Started',
    attempts: 0,
    timeSpentMinutes: 0,
    hintsUsed: false,
    revisionStage: 0
  }
];

export const DEFAULT_COMPANIES: CompanyApplication[] = [
  {
    id: 'comp-1',
    companyName: 'Target Tech / Enterprise Drive',
    role: 'Software Development Engineer - Intern + FTE',
    ctcOrStipend: '18–24 LPA / 60k/month',
    deadline: '2027-02-15',
    eligibility: 'B.Tech CS/IT, >= 7.0 CGPA, No active backlogs',
    status: 'Wishlist',
    interviewStages: ['Online Coding (3 questions)', 'Technical 1 (DSA & Java)', 'Technical 2 (OS, DBMS, Projects)', 'HR Round'],
    notes: 'Focus on Java Collections, indexing in SQL, and multi-threading.',
    updatedAt: '2026-10-27'
  },
  {
    id: 'comp-2',
    companyName: 'Fintech Systems Drive',
    role: 'Graduate Software Engineer',
    ctcOrStipend: '14–18 LPA',
    deadline: '2027-02-28',
    eligibility: 'B.Tech >= 7.5 CGPA, strong algorithmic background',
    status: 'Wishlist',
    interviewStages: ['Aptitude + DSA Test', 'Technical Round 1', 'Technical Round 2', 'Managerial'],
    notes: 'High weightage on ACID transactions, banking SQL queries, and graphs.',
    updatedAt: '2026-10-27'
  }
];

export const DEFAULT_REMINDERS: ReminderSetting[] = [
  { id: 'rem-1', title: 'Wake Up & Hydrate', time: '06:00', enabled: true, leadMinutes: 0, repeatDays: [1, 2, 3, 4, 5], category: 'routine', description: 'Kickstart morning momentum' },
  { id: 'rem-2', title: 'Start GATE Morning Session', time: '06:20', enabled: true, leadMinutes: 5, repeatDays: [1, 2, 3, 4, 5], category: 'study', description: '90-minute uninterrupted study block' },
  { id: 'rem-3', title: 'College Departure Reminder', time: '08:55', enabled: true, leadMinutes: 5, repeatDays: [1, 2, 3, 4, 5], category: 'routine', description: 'Commute and prepare for college classes' },
  { id: 'rem-4', title: 'Rest & Evening Snack', time: '17:00', enabled: true, leadMinutes: 0, repeatDays: [1, 2, 3, 4, 5], category: 'rest', description: 'Decompress from college' },
  { id: 'rem-5', title: 'Gym & Fitness Session', time: '18:00', enabled: true, leadMinutes: 5, repeatDays: [1, 2, 3, 4, 5], category: 'routine', description: 'Workout time' },
  { id: 'rem-6', title: 'DSA Practice in Java', time: '20:40', enabled: true, leadMinutes: 5, repeatDays: [1, 2, 3, 4, 5], category: 'study', description: 'Solve 1-2 curated problems' },
  { id: 'rem-7', title: 'Aptitude & Error-Log Review', time: '21:40', enabled: true, leadMinutes: 0, repeatDays: [1, 2, 3, 4, 5], category: 'study', description: 'Review formulas and log mistakes' },
  { id: 'rem-8', title: 'Wind Down & Sleep Routine', time: '22:10', enabled: true, leadMinutes: 0, repeatDays: [1, 2, 3, 4, 5], category: 'bedtime', description: 'Screen off and prepare for 10:30 PM sleep' }
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  targetGateScore: 72,
  gateExamDate: '2027-02-06',
  placementMilestoneDate: '2027-02-01',
  dailyStudyTargetHours: 3.5,
  collegeSchedule: '9:00 AM - 5:00 PM',
  gymDuration: '6:00 PM - 8:00 PM',
  sleepSchedule: '10:30 PM - 6:00 AM',
  timezone: 'Asia/Kolkata',
  dsaDailyTarget: 2,
  socialMediaLimitMinutes: 30,
  notificationsEnabled: false,
  soundEnabled: true,
  theme: 'dark',
  supabaseConnected: false
};

export const INITIAL_TODAY_HABITS: DailyHabits = {
  date: '2026-10-27',
  wakeUpOnTime: true,
  morningGateSession: true,
  attendCollege: false,
  dsaPractice: false,
  aptitudeRevision: false,
  exerciseGym: false,
  sleepBy1030: false,
  socialMediaMinutes: 15,
  quickNotes: 'Day 1 of PrepPilot preparation journey!'
};

export const DEFAULT_FOCUS_SESSIONS: FocusSession[] = [
  // Oct 27 (Today)
  { id: 'f-1', startTime: '2026-10-27T06:20:00', durationMinutes: 90, taskTitle: 'GATE Discrete Mathematics & Propositional Logic', category: 'GATE', completed: true },
  { id: 'f-2', startTime: '2026-10-27T20:40:00', durationMinutes: 50, taskTitle: 'Java Two Pointers & Two Sum', category: 'DSA', completed: true },

  // Oct 26
  { id: 'f-3', startTime: '2026-10-26T06:20:00', durationMinutes: 90, taskTitle: 'Linear Algebra: Eigenvalues & Vector Spaces', category: 'GATE', completed: true },
  { id: 'f-4', startTime: '2026-10-26T20:40:00', durationMinutes: 50, taskTitle: 'DSA Array Reversal & In-place Manipulations', category: 'DSA', completed: true },
  { id: 'f-5', startTime: '2026-10-26T21:40:00', durationMinutes: 25, taskTitle: 'Aptitude: Number Systems & Modular Arithmetic', category: 'Aptitude', completed: true },

  // Oct 25 (Sunday)
  { id: 'f-6', startTime: '2026-10-25T07:00:00', durationMinutes: 90, taskTitle: 'Sunday GATE Math Diagnostic Practice', category: 'Revision', completed: true },
  { id: 'f-7', startTime: '2026-10-25T15:00:00', durationMinutes: 50, taskTitle: 'Binary Search Edge Cases & Java Implementation', category: 'DSA', completed: true },
  { id: 'f-8', startTime: '2026-10-25T21:00:00', durationMinutes: 25, taskTitle: 'Error Log & Spaced Revision Review', category: 'Revision', completed: true },

  // Oct 24 (Saturday)
  { id: 'f-9', startTime: '2026-10-24T09:00:00', durationMinutes: 90, taskTitle: 'Graph Theory & Relations in Discrete Math', category: 'GATE', completed: true },
  { id: 'f-10', startTime: '2026-10-24T14:00:00', durationMinutes: 90, taskTitle: 'Recursion Call Stack & Backtracking Foundations', category: 'DSA', completed: true },
  { id: 'f-11', startTime: '2026-10-24T17:00:00', durationMinutes: 50, taskTitle: 'Permutations, Combinations & Probability', category: 'Aptitude', completed: true },

  // Oct 23
  { id: 'f-12', startTime: '2026-10-23T06:20:00', durationMinutes: 90, taskTitle: 'Calculus: Limits, Continuity & Maxima', category: 'GATE', completed: true },
  { id: 'f-13', startTime: '2026-10-23T20:40:00', durationMinutes: 50, taskTitle: 'Sliding Window Fixed Size Problems', category: 'DSA', completed: true },

  // Oct 22
  { id: 'f-14', startTime: '2026-10-22T06:20:00', durationMinutes: 90, taskTitle: 'Set Theory, Relations & Posets', category: 'GATE', completed: true },
  { id: 'f-15', startTime: '2026-10-22T20:40:00', durationMinutes: 50, taskTitle: 'Prefix Sums & Range Sum Queries in Java', category: 'DSA', completed: true },

  // Oct 21
  { id: 'f-16', startTime: '2026-10-21T06:20:00', durationMinutes: 90, taskTitle: 'Matrix Inverses, Rank & System of Equations', category: 'GATE', completed: true },
  { id: 'f-17', startTime: '2026-10-21T20:40:00', durationMinutes: 50, taskTitle: 'Java Fast I/O & Array Edge Cases', category: 'DSA', completed: true },

  // Oct 20
  { id: 'f-18', startTime: '2026-10-20T06:20:00', durationMinutes: 90, taskTitle: 'Predicate Logic & First-Order Quantifiers', category: 'GATE', completed: true },
  { id: 'f-19', startTime: '2026-10-20T20:40:00', durationMinutes: 50, taskTitle: 'Sorting Algorithms: MergeSort & Inversions', category: 'DSA', completed: true },

  // Oct 19
  { id: 'f-20', startTime: '2026-10-19T06:20:00', durationMinutes: 90, taskTitle: 'Combinatorics: Pigeonhole Principle & Derangements', category: 'GATE', completed: true },
  { id: 'f-21', startTime: '2026-10-19T20:40:00', durationMinutes: 50, taskTitle: 'Java Memory Model & Object References', category: 'DSA', completed: true },

  // Oct 18 (Sunday)
  { id: 'f-22', startTime: '2026-10-18T08:00:00', durationMinutes: 90, taskTitle: 'Weekly GATE Mathematics Cumulative Test', category: 'Revision', completed: true },
  { id: 'f-23', startTime: '2026-10-18T16:00:00', durationMinutes: 50, taskTitle: 'Two Pointers Trapping Rain Water Walkthrough', category: 'DSA', completed: true },

  // Oct 17 (Saturday)
  { id: 'f-24', startTime: '2026-10-17T09:30:00', durationMinutes: 90, taskTitle: 'GATE Discrete Math: Generating Functions', category: 'GATE', completed: true },
  { id: 'f-25', startTime: '2026-10-17T14:30:00', durationMinutes: 50, taskTitle: 'Stack Problems & Monotonic Stack Intro', category: 'DSA', completed: true },
  { id: 'f-26', startTime: '2026-10-17T17:00:00', durationMinutes: 25, taskTitle: 'Aptitude Syllogisms & Critical Reasoning', category: 'Aptitude', completed: true },

  // Oct 16
  { id: 'f-27', startTime: '2026-10-16T06:20:00', durationMinutes: 90, taskTitle: 'Probability: Bayes Theorem & Random Variables', category: 'GATE', completed: true },
  { id: 'f-28', startTime: '2026-10-16T20:40:00', durationMinutes: 50, taskTitle: 'Java String Immutability & StringBuilder', category: 'DSA', completed: true },

  // Oct 15
  { id: 'f-29', startTime: '2026-10-15T06:20:00', durationMinutes: 90, taskTitle: 'Mean Value Theorems & Taylor Series', category: 'GATE', completed: true },
  { id: 'f-30', startTime: '2026-10-15T20:40:00', durationMinutes: 50, taskTitle: 'Binary Search on Answer Range', category: 'DSA', completed: true },

  // Oct 14
  { id: 'f-31', startTime: '2026-10-14T06:20:00', durationMinutes: 90, taskTitle: 'Group Theory & Algebraic Structures', category: 'GATE', completed: true },
  { id: 'f-32', startTime: '2026-10-14T20:40:00', durationMinutes: 50, taskTitle: 'HashMaps Internal Working in Java', category: 'DSA', completed: true },

  // Oct 13
  { id: 'f-33', startTime: '2026-10-13T06:20:00', durationMinutes: 90, taskTitle: 'Graph Coloring & Planar Graphs in GATE', category: 'GATE', completed: true },
  { id: 'f-34', startTime: '2026-10-13T20:40:00', durationMinutes: 50, taskTitle: 'Subarray Sum Equals K & Prefix HashMaps', category: 'DSA', completed: true },

  // Oct 12
  { id: 'f-35', startTime: '2026-10-12T06:20:00', durationMinutes: 50, taskTitle: 'Discrete Math Recap & Flashcards', category: 'Revision', completed: true },

  // Oct 11 (Sunday)
  { id: 'f-36', startTime: '2026-10-11T08:30:00', durationMinutes: 90, taskTitle: 'Full Sectional Mock: Engineering Mathematics', category: 'Revision', completed: true },
  { id: 'f-37', startTime: '2026-10-11T15:00:00', durationMinutes: 50, taskTitle: 'LinkedList Reversal & Cycle Detection', category: 'DSA', completed: true },

  // Oct 10 (Saturday)
  { id: 'f-38', startTime: '2026-10-10T10:00:00', durationMinutes: 90, taskTitle: 'Linear Algebra Matrix Factorization LU', category: 'GATE', completed: true },
  { id: 'f-39', startTime: '2026-10-10T14:00:00', durationMinutes: 50, taskTitle: 'Fast and Slow Pointer Technique in Java', category: 'DSA', completed: true },

  // Oct 9
  { id: 'f-40', startTime: '2026-10-09T06:20:00', durationMinutes: 90, taskTitle: 'Recurrence Relations & Master Theorem', category: 'GATE', completed: true },
  { id: 'f-41', startTime: '2026-10-09T20:40:00', durationMinutes: 50, taskTitle: 'Divide and Conquer Binary Exponentiation', category: 'DSA', completed: true },

  // Oct 8
  { id: 'f-42', startTime: '2026-10-08T06:20:00', durationMinutes: 50, taskTitle: 'Aptitude: Time, Speed and Distance', category: 'Aptitude', completed: true },
  { id: 'f-43', startTime: '2026-10-08T20:40:00', durationMinutes: 50, taskTitle: 'Kadane Algorithm & Max Subarray in Java', category: 'DSA', completed: true },

  // Oct 7
  { id: 'f-44', startTime: '2026-10-07T06:20:00', durationMinutes: 90, taskTitle: 'Asymptotic Notations Big O, Omega, Theta', category: 'GATE', completed: true },

  // Oct 5
  { id: 'f-45', startTime: '2026-10-05T06:20:00', durationMinutes: 90, taskTitle: 'GATE Discrete Math: Propositional Equivalences', category: 'GATE', completed: true },
  { id: 'f-46', startTime: '2026-10-05T20:40:00', durationMinutes: 50, taskTitle: 'Java Arrays Basics & Loop Optimization', category: 'DSA', completed: true },

  // Oct 3 (Saturday)
  { id: 'f-47', startTime: '2026-10-03T10:00:00', durationMinutes: 90, taskTitle: 'Foundation Kickoff: GATE CS Syllabus Breakdown', category: 'GATE', completed: true },
  { id: 'f-48', startTime: '2026-10-03T14:00:00', durationMinutes: 50, taskTitle: 'Java Setup, JVM Internals & Complexity Analysis', category: 'DSA', completed: true },

  // Oct 1
  { id: 'f-49', startTime: '2026-10-01T06:20:00', durationMinutes: 50, taskTitle: 'Aptitude Ratio, Proportions & Percentages', category: 'Aptitude', completed: true },

  // Sept 29
  { id: 'f-50', startTime: '2026-09-29T06:20:00', durationMinutes: 90, taskTitle: 'Engineering Math: Matrices & Determinants', category: 'GATE', completed: true }
];
