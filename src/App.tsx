/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
  FocusSession
} from './types';
import { StorageService } from './lib/storage';
import { playNotificationChime, createInAppNotification } from './lib/notifications';
import {
  calculateHabitStreak,
  calculateOverallGateProgress,
  calculateDSAStats,
  calculateNextSpacedRevisionDate
} from './lib/calculations';
import {
  getLiveDateString,
  getLiveDayOfWeekType,
  getLiveMinutesOfDay,
  calculateLiveStreak
} from './lib/dateTime';
import { AuthService, UserProfile, SUPER_ADMIN_CREDENTIALS } from './lib/auth';
import { registerServiceWorker } from './lib/pwa';

// Layout & Navigation
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { TimetableManager } from './components/timetable/TimetableManager';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { DSAView } from './components/dsa/DSAView';
import { GATETable } from './components/gate/GATETable';
import { PlacementView } from './components/placement/PlacementView';
import { MockTestsView } from './components/tests/MockTestsView';
import { HabitsView } from './components/habits/HabitsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { FlashcardsView } from './components/flashcards/FlashcardsView';
import { InterviewPrepView } from './components/placement/InterviewPrepView';
import { DependencyGraphView } from './components/graph/DependencyGraphView';

// Auth & Cloud & PWA Modals
import { AuthModal } from './components/auth/AuthModal';
import { PendingApprovalScreen } from './components/auth/PendingApprovalScreen';
import { AdminManagementModal } from './components/admin/AdminManagementModal';
import { ProfileSetupModal } from './components/profile/ProfileSetupModal';
import { GoogleCloudDbModal } from './components/cloud/GoogleCloudDbModal';
import { PwaInstallModal } from './components/pwa/PwaInstallModal';

// Modals
import { FocusTimerModal } from './components/focus/FocusTimerModal';
import { QuickRecoveryModal } from './components/timetable/QuickRecoveryModal';
import { GateCalculatorModal } from './components/calculator/GateCalculatorModal';
import { TimetableCardModal } from './components/timetable/TimetableCardModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Multi-user authentication & profile state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => AuthService.init());
  const [allUsersVersion, setAllUsersVersion] = useState(0);

  // Core application state (scoped per user)
  const [weekdayBlocks, setWeekdayBlocks] = useState<TimetableBlock[]>([]);
  const [saturdayBlocks, setSaturdayBlocks] = useState<TimetableBlock[]>([]);
  const [sundayBlocks, setSundayBlocks] = useState<TimetableBlock[]>([]);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>([]);
  const [gateSubjects, setGateSubjects] = useState<GATESubject[]>([]);
  const [dsaProblems, setDsaProblems] = useState<DSAProblem[]>([]);
  const [companies, setCompanies] = useState<CompanyApplication[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [habits, setHabits] = useState<DailyHabits[]>([]);
  const [reminders, setReminders] = useState<ReminderSetting[]>([]);
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  // Modals state
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGoogleCloudModalOpen, setIsGoogleCloudModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // Register PWA service worker on initial mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Reload user-scoped data whenever active user changes
  useEffect(() => {
    if (!currentUser) return;

    StorageService.setActiveUserId(currentUser.id);

    setWeekdayBlocks(StorageService.getWeekdayTimetable(currentUser.id));
    setSaturdayBlocks(StorageService.getSaturdayTimetable(currentUser.id));
    setSundayBlocks(StorageService.getSundayTimetable(currentUser.id));
    setRoadmapPhases(StorageService.getRoadmap(currentUser.id));
    setGateSubjects(StorageService.getGateSubjects(currentUser.id));
    setDsaProblems(StorageService.getDSAProblems(currentUser.id));
    setCompanies(StorageService.getCompanies(currentUser.id));
    setMockTests(StorageService.getMockTests(currentUser.id));
    setHabits(StorageService.getHabits(currentUser.id));
    setReminders(StorageService.getReminders(currentUser.id));
    setSettings(StorageService.getSettings(currentUser.id));
    setFocusSessions(StorageService.getFocusSessions(currentUser.id));
  }, [currentUser, allUsersVersion]);

  // Real-time ticking clock (updates state every second)
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayDateStr = getLiveDateString(now);
  const dayOfWeekType = getLiveDayOfWeekType(now);
  const currentMinutesOfDay = getLiveMinutesOfDay(now);

  // Dynamic habit log for today
  const todayHabits: DailyHabits = habits.find(h => h.date === todayDateStr) || {
    date: todayDateStr,
    wakeUpOnTime: false,
    morningGateSession: false,
    attendCollege: false,
    dsaPractice: false,
    aptitudeRevision: false,
    exerciseGym: false,
    sleepBy1030: false,
    socialMediaMinutes: 0
  };

  const liveStreakData = calculateLiveStreak(habits, todayDateStr);
  const gateProgress = calculateOverallGateProgress(gateSubjects);
  const dsaStats = calculateDSAStats(dsaProblems);

  // Calculate pending users waiting for Super Admin approval
  const allUsers = AuthService.getAllUsers();
  const pendingApprovalsCount = allUsers.filter(u => u.status === 'pending').length;

  // Persistence helpers (scoped to current user)
  const handleUpdateWeekday = (blocks: TimetableBlock[]) => {
    setWeekdayBlocks(blocks);
    StorageService.saveWeekdayTimetable(blocks, currentUser?.id);
  };

  const handleUpdateSaturday = (blocks: TimetableBlock[]) => {
    setSaturdayBlocks(blocks);
    StorageService.saveSaturdayTimetable(blocks, currentUser?.id);
  };

  const handleUpdateSunday = (blocks: TimetableBlock[]) => {
    setSundayBlocks(blocks);
    StorageService.saveSundayTimetable(blocks, currentUser?.id);
  };

  const handleToggleBlockComplete = (blockId: string) => {
    const updated = weekdayBlocks.map(b => {
      if (b.id === blockId) {
        const isDone = b.completedDate === todayDateStr;
        if (!isDone) {
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.8 }
            });
          } catch {}
        }
        return {
          ...b,
          completedDate: isDone ? undefined : todayDateStr
        };
      }
      return b;
    });
    handleUpdateWeekday(updated);
  };

  const handleUpdatePhases = (phases: RoadmapPhase[]) => {
    setRoadmapPhases(phases);
    StorageService.saveRoadmap(phases, currentUser?.id);
  };

  const handleUpdateGateSubjects = (subjects: GATESubject[]) => {
    setGateSubjects(subjects);
    StorageService.saveGateSubjects(subjects, currentUser?.id);
  };

  const handleUpdateDSAProblems = (probs: DSAProblem[]) => {
    setDsaProblems(probs);
    StorageService.saveDSAProblems(probs, currentUser?.id);
  };

  const handleUpdateCompanies = (comps: CompanyApplication[]) => {
    setCompanies(comps);
    StorageService.saveCompanies(comps, currentUser?.id);
  };

  const handleUpdateMockTests = (tests: MockTest[]) => {
    setMockTests(tests);
    StorageService.saveMockTests(tests, currentUser?.id);
  };

  const handleUpdateTodayHabits = (updatedToday: DailyHabits) => {
    const existingIndex = habits.findIndex(h => h.date === todayDateStr);
    let newHabits: DailyHabits[];
    if (existingIndex >= 0) {
      newHabits = habits.map(h => (h.date === todayDateStr ? updatedToday : h));
    } else {
      newHabits = [updatedToday, ...habits];
    }
    setHabits(newHabits);
    StorageService.saveHabits(newHabits, currentUser?.id);
  };

  const handleUpdateSocialMedia = (minutes: number) => {
    handleUpdateTodayHabits({
      ...todayHabits,
      socialMediaMinutes: minutes
    });
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings, currentUser?.id);
  };

  const handleUpdateReminders = (newReminders: ReminderSetting[]) => {
    setReminders(newReminders);
    StorageService.saveReminders(newReminders, currentUser?.id);
  };

  const handleResetAll = () => {
    StorageService.resetAllData(currentUser?.id);
    window.location.reload();
  };

  // Quick recovery rescheduling
  const handleRescheduleTask = (sourceBlockId: string, targetBlockId: string) => {
    const sourceBlock = weekdayBlocks.find(b => b.id === sourceBlockId);
    const targetBlock = weekdayBlocks.find(b => b.id === targetBlockId);
    if (!sourceBlock || !targetBlock) return;

    const updated = weekdayBlocks.map(b => {
      if (b.id === targetBlockId) {
        return {
          ...b,
          activity: `Recovered: ${sourceBlock.activity}`,
          description: `Rescheduled from ${sourceBlock.timeRange} without violating college/gym/sleep locks.`
        };
      }
      return b;
    });

    handleUpdateWeekday(updated);

    const notif = createInAppNotification(
      'Session Rescheduled',
      `Moved "${sourceBlock.activity}" to ${targetBlock.timeRange} slot.`,
      'recovery'
    );
    const existing = StorageService.getNotifications(currentUser?.id);
    StorageService.saveNotifications([notif, ...existing], currentUser?.id);
  };

  const handleAddFocusSession = (session: FocusSession) => {
    const updated = StorageService.addFocusSession(session, currentUser?.id);
    setFocusSessions(updated);
  };

  const handleCompleteFocusSession = (durationMins: number, taskName: string, category: string) => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    const newSession: FocusSession = {
      id: `f-${Date.now()}`,
      startTime: `${todayDateStr}T${new Date().toTimeString().slice(0, 8)}`,
      durationMinutes: durationMins,
      taskTitle: taskName,
      category: category as any,
      completed: true
    };
    handleAddFocusSession(newSession);

    const notif = createInAppNotification(
      'Focus Session Completed!',
      `Logged ${durationMins} minutes on ${taskName} (${category}). Great momentum!`,
      'milestone'
    );
    const existing = StorageService.getNotifications(currentUser?.id);
    StorageService.saveNotifications([notif, ...existing], currentUser?.id);
  };

  const handleMarkProblemRevised = (problemId: string) => {
    const updated = dsaProblems.map(p => {
      if (p.id === problemId) {
        const nextStage = Math.min(4, p.revisionStage + 1);
        const nextDate = calculateNextSpacedRevisionDate(nextStage);
        return {
          ...p,
          status: 'Solved' as const,
          revisionStage: nextStage,
          spacedRevisionDue: nextDate
        };
      }
      return p;
    });
    handleUpdateDSAProblems(updated);
    playNotificationChime('success');
  };

  // Auth Handlers
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setAllUsersVersion(v => v + 1);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  // IF USER IS NOT LOGGED IN AT ALL: MANDATORY LOGIN GATE
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#080d1a] text-slate-100 flex items-center justify-center p-4 font-sans">
        <AuthModal
          isOpen={true}
          isMandatoryGate={true}
          onClose={() => {}}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // MANDATORY SECURITY GATE: HIDE ALL FEATURES AND TIMETABLES FROM PENDING/REJECTED USERS
  if (currentUser.status === 'pending' || currentUser.status === 'rejected') {
    return (
      <PendingApprovalScreen
        user={currentUser}
        onRefreshUser={() => {
          const allUsers = AuthService.getAllUsers();
          const refreshed = allUsers.find(
            u => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()
          );
          if (refreshed) {
            AuthService.setCurrentUser(refreshed);
            setCurrentUser({ ...refreshed });
            setAllUsersVersion(v => v + 1);
          }
        }}
        onLogout={handleLogout}
        onOpenAdminLogin={() => {
          AuthService.logout();
          setCurrentUser(null);
          setIsAuthModalOpen(true);
        }}
      />
    );
  }

  // APPROVED USER (SUPER ADMIN OR APPROVED STUDENT)
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans">
      {/* Sticky Header with Live Clock & Date */}
      <Header
        onOpenFocusModal={() => setIsFocusModalOpen(true)}
        onOpenRecoveryModal={() => setIsRecoveryModalOpen(true)}
        streak={liveStreakData.currentStreak}
        streakStatusMessage={liveStreakData.statusMessage}
        todayHabits={todayHabits}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenGoogleCloudModal={() => setIsGoogleCloudModalOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onLogout={handleLogout}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          gateProgress={gateProgress}
          dsaSolved={dsaStats.solved}
          currentUser={currentUser}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
          onOpenGoogleCloudModal={() => setIsGoogleCloudModalOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              weekdayBlocks={weekdayBlocks}
              saturdayBlocks={saturdayBlocks}
              sundayBlocks={sundayBlocks}
              gateSubjects={gateSubjects}
              dsaProblems={dsaProblems}
              todayHabits={todayHabits}
              userSettings={settings}
              streak={liveStreakData.currentStreak}
              weeklyConsistency={liveStreakData.weeklyConsistencyPercent}
              todayDateStr={todayDateStr}
              dayOfWeekType={dayOfWeekType}
              currentMinutesOfDay={currentMinutesOfDay}
              currentUserName={currentUser.name}
              streakStatusMessage={liveStreakData.statusMessage}
              isTodayStreakCompleted={liveStreakData.isTodayCompleted}
              onToggleBlockComplete={handleToggleBlockComplete}
              onOpenFocusModal={() => setIsFocusModalOpen(true)}
              onOpenRecoveryModal={() => setIsRecoveryModalOpen(true)}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onOpenWallpaperCard={() => setIsWallpaperModalOpen(true)}
              onUpdateSocialMedia={handleUpdateSocialMedia}
              onNavigateTab={setCurrentTab}
              onMarkProblemRevised={handleMarkProblemRevised}
            />
          )}

          {currentTab === 'timetable' && (
            <TimetableManager
              weekdayBlocks={weekdayBlocks}
              saturdayBlocks={saturdayBlocks}
              sundayBlocks={sundayBlocks}
              todayDateStr={todayDateStr}
              liveDayType={dayOfWeekType}
              onUpdateWeekday={handleUpdateWeekday}
              onUpdateSaturday={handleUpdateSaturday}
              onUpdateSunday={handleUpdateSunday}
              onResetTimetables={() => {
                StorageService.saveWeekdayTimetable(StorageService.getWeekdayTimetable(currentUser.id), currentUser.id);
                setWeekdayBlocks(StorageService.getWeekdayTimetable(currentUser.id));
                setSaturdayBlocks(StorageService.getSaturdayTimetable(currentUser.id));
                setSundayBlocks(StorageService.getSundayTimetable(currentUser.id));
              }}
              onOpenRecoveryModal={() => setIsRecoveryModalOpen(true)}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapView
              phases={roadmapPhases}
              onUpdatePhases={handleUpdatePhases}
            />
          )}

          {currentTab === 'graph' && (
            <DependencyGraphView
              gateSubjects={gateSubjects}
              dsaProblems={dsaProblems}
              onNavigateTab={setCurrentTab}
              onUpdateGateSubjects={handleUpdateGateSubjects}
              onUpdateDSAProblems={handleUpdateDSAProblems}
            />
          )}

          {currentTab === 'dsa' && (
            <DSAView
              problems={dsaProblems}
              onUpdateProblems={handleUpdateDSAProblems}
              dailyTarget={settings.dsaDailyTarget}
            />
          )}

          {currentTab === 'gate' && (
            <GATETable
              subjects={gateSubjects}
              onUpdateSubjects={handleUpdateGateSubjects}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsView
              onOpenFocusModal={() => setIsFocusModalOpen(true)}
            />
          )}

          {currentTab === 'placement' && (
            <PlacementView
              companies={companies}
              onUpdateCompanies={handleUpdateCompanies}
              userSettings={settings}
            />
          )}

          {currentTab === 'interview' && (
            <InterviewPrepView />
          )}

          {currentTab === 'tests' && (
            <MockTestsView
              mockTests={mockTests}
              onUpdateMockTests={handleUpdateMockTests}
              onOpenFocusModal={() => setIsFocusModalOpen(true)}
            />
          )}

          {currentTab === 'habits' && (
            <HabitsView
              habits={habits}
              todayHabits={todayHabits}
              onUpdateTodayHabits={handleUpdateTodayHabits}
              streak={liveStreakData.currentStreak}
              weeklyConsistency={liveStreakData.weeklyConsistencyPercent}
              userSettings={settings}
              onOpenFocusModal={() => setIsFocusModalOpen(true)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              gateSubjects={gateSubjects}
              dsaProblems={dsaProblems}
              habits={habits}
              mockTests={mockTests}
              weekdayBlocks={weekdayBlocks}
              focusSessions={focusSessions}
              todayDateStr={todayDateStr}
              onAddFocusSession={handleAddFocusSession}
              onOpenFocusModal={() => setIsFocusModalOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              reminders={reminders}
              onUpdateSettings={handleUpdateSettings}
              onUpdateReminders={handleUpdateReminders}
              onResetAllData={handleResetAll}
              currentUser={currentUser}
              onOpenGoogleCloudModal={() => setIsGoogleCloudModalOpen(true)}
              onOpenPwaModal={() => setIsPwaModalOpen(true)}
              onOpenAdminModal={() => setIsAdminModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Android Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onOpenGoogleCloudModal={() => setIsGoogleCloudModalOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Core Modals */}
      <FocusTimerModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        onCompleteSession={handleCompleteFocusSession}
      />

      <QuickRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        weekdayBlocks={weekdayBlocks}
        onRescheduleTask={handleRescheduleTask}
      />

      <GateCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <TimetableCardModal
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        weekdayBlocks={weekdayBlocks}
        saturdayBlocks={saturdayBlocks}
        sundayBlocks={sundayBlocks}
      />

      {/* User Auth & Management Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {currentUser && (
        <>
          <ProfileSetupModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            currentUser={currentUser}
            onProfileUpdated={(updated) => setCurrentUser(updated)}
          />

          <AdminManagementModal
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            currentUser={currentUser}
            onUserStatusChange={() => setAllUsersVersion(v => v + 1)}
            onSwitchUserSession={(targetUser) => {
              setCurrentUser(targetUser);
              setIsAdminModalOpen(false);
            }}
          />

          <GoogleCloudDbModal
            isOpen={isGoogleCloudModalOpen}
            onClose={() => setIsGoogleCloudModalOpen(false)}
            currentUser={currentUser}
          />

          <PwaInstallModal
            isOpen={isPwaModalOpen}
            onClose={() => setIsPwaModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
