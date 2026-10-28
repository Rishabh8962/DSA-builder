import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { MockTest, MistakeType } from '../../types';
import { calculateMockTestAnalytics } from '../../lib/calculations';
import { playNotificationChime } from '../../lib/notifications';

interface MockTestsViewProps {
  mockTests: MockTest[];
  onUpdateMockTests: (tests: MockTest[]) => void;
  onOpenFocusModal: () => void;
}

export const MockTestsView: React.FC<MockTestsViewProps> = ({
  mockTests,
  onUpdateMockTests,
  onOpenFocusModal
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [testName, setTestName] = useState('GATE Diagnostic Test 1');
  const [testType, setTestType] = useState<'Diagnostic' | 'Subject Sectional' | 'Multi-Subject' | 'Full Length Mock'>('Diagnostic');
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [marksScored, setMarksScored] = useState<number>(45);
  const [positiveMarks, setPositiveMarks] = useState<number>(52);
  const [negativeMarks, setNegativeMarks] = useState<number>(7);
  const [timeTaken, setTimeTaken] = useState<number>(180);
  const [weakTopicsStr, setWeakTopicsStr] = useState('Discrete Math Logic, Linear Algebra Matrices');
  const [notes, setNotes] = useState('');

  // Mistake counts
  const [conceptMistakes, setConceptMistakes] = useState<number>(3);
  const [formulaMistakes, setFormulaMistakes] = useState<number>(2);
  const [calcMistakes, setCalcMistakes] = useState<number>(1);
  const [misreadMistakes, setMisreadMistakes] = useState<number>(1);
  const [timeMistakes, setTimeMistakes] = useState<number>(1);
  const [guessingMistakes, setGuessingMistakes] = useState<number>(2);

  const analytics = calculateMockTestAnalytics(mockTests);

  const handleCreateMockTest = (e: React.FormEvent) => {
    e.preventDefault();

    const accuracy = positiveMarks + negativeMarks > 0 
      ? Math.round((positiveMarks / (positiveMarks + negativeMarks)) * 100)
      : 0;

    const newTest: MockTest = {
      id: `mock-${Date.now()}`,
      testName,
      date: new Date().toISOString().split('T')[0],
      type: testType,
      totalMarks,
      marksScored,
      positiveMarks,
      negativeMarks,
      timeTakenMinutes: timeTaken,
      accuracyPercent: accuracy,
      weakTopics: weakTopicsStr.split(',').map(s => s.trim()).filter(Boolean),
      mistakeBreakdown: {
        concept_not_understood: conceptMistakes,
        formula_forgotten: formulaMistakes,
        calculation_mistake: calcMistakes,
        question_misread: misreadMistakes,
        time_management: timeMistakes,
        guessing_careless: guessingMistakes
      },
      notes
    };

    onUpdateMockTests([newTest, ...mockTests]);
    setIsAddModalOpen(false);
    playNotificationChime('success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            <span>Mock Tests & Mistake Analysis Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            GATE CS diagnostic tests, sectional tests, and detailed classification of every lost mark.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Log Mock Test</span>
        </button>
      </div>

      {/* Zero Tests Warning / Diagnostic Reminder Banner */}
      {mockTests.length === 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#131b2e] to-[#0d1429] p-5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-300">
                Action Required: Attempt Diagnostic Test
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                You have not attempted a GATE mock test yet. As part of <strong>Phase 1: Foundation (Oct 27 – Nov 8)</strong>, take an initial 65-question diagnostic test to establish an authentic baseline without false assumptions.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                >
                  Log Diagnostic Result
                </button>
                <button
                  onClick={onOpenFocusModal}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  Timed 3-hour Test Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards (if tests exist) */}
      {mockTests.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
            <span className="text-[11px] text-slate-400 block">Tests Attempted</span>
            <span className="text-2xl font-bold font-mono text-white">{analytics.totalTests}</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
            <span className="text-[11px] text-slate-400 block">Average Score</span>
            <span className="text-2xl font-bold font-mono text-indigo-400">{analytics.averageScore}</span>
            <span className="text-[10px] text-slate-500 block">out of 100</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
            <span className="text-[11px] text-slate-400 block">Peak Score</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{analytics.highestScore}</span>
            <span className="text-[10px] text-slate-500 block">Target: 70+</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-3 text-center">
            <span className="text-[11px] text-slate-400 block">Total Lost to Negatives</span>
            <span className="text-2xl font-bold font-mono text-rose-400">-{analytics.totalNegativeMarks}</span>
            <span className="text-[10px] text-slate-500 block">1/3rd penalty</span>
          </div>
        </div>
      )}

      {/* Mistake Categories Breakdown */}
      {mockTests.length > 0 && analytics.commonMistakes.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0b1020] p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Root Cause Error Analysis (Where marks are lost)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {analytics.commonMistakes.map(item => (
              <div key={item.category} className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block leading-tight">{item.category}</span>
                <span className="text-lg font-bold font-mono text-amber-300 mt-1 block">{item.count}</span>
                <span className="text-[9px] text-slate-500">errors</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tests Log History */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Recorded Mock Tests</h2>

        {mockTests.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-8 text-center text-slate-400">
            <Info className="h-6 w-6 mx-auto mb-2 text-slate-500" />
            <p className="text-xs font-medium">No tests logged yet. Initial diagnostic test should be taken first.</p>
          </div>
        ) : (
          mockTests.map(test => (
            <div
              key={test.id}
              className="rounded-2xl border border-slate-800 bg-[#0c1224] p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{test.testName}</h3>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300">
                      {test.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    <span>{test.date}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{test.timeTakenMinutes} mins</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-white">
                      {test.marksScored} <span className="text-xs text-slate-400 font-normal">/ {test.totalMarks}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-mono">{test.accuracyPercent}% Accuracy</span>
                  </div>
                </div>
              </div>

              {/* Weak Topics */}
              {test.weakTopics && test.weakTopics.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 text-[11px]">Weak concepts flagged:</span>
                  {test.weakTopics.map(w => (
                    <span key={w} className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
                      {w}
                    </span>
                  ))}
                </div>
              )}

              {test.notes && (
                <p className="text-xs text-slate-300 italic bg-slate-900/40 p-2 rounded-lg">
                  “{test.notes}”
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Log Mock Test Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateMockTest}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-4 my-8"
          >
            <h3 className="text-base font-bold text-white">Log Mock Test & Mistakes</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Test Name</label>
              <input
                type="text"
                required
                value={testName}
                onChange={e => setTestName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Test Type</label>
                <select
                  value={testType}
                  onChange={e => setTestType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Diagnostic">Diagnostic Baseline</option>
                  <option value="Subject Sectional">Subject Sectional</option>
                  <option value="Multi-Subject">Multi-Subject</option>
                  <option value="Full Length Mock">Full Length Mock (65 Qs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Marks Scored (out of 100)</label>
                <input
                  type="number"
                  required
                  step="0.33"
                  value={marksScored}
                  onChange={e => setMarksScored(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Positive Marks</label>
                <input
                  type="number"
                  step="0.5"
                  value={positiveMarks}
                  onChange={e => setPositiveMarks(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-emerald-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Negative Marks</label>
                <input
                  type="number"
                  step="0.33"
                  value={negativeMarks}
                  onChange={e => setNegativeMarks(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-rose-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Time Taken (mins)</label>
                <input
                  type="number"
                  value={timeTaken}
                  onChange={e => setTimeTaken(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Error Classification */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
              <span className="block text-xs font-bold text-amber-300">
                Categorize Questions Lost / Mistakes:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400">Concept not understood</label>
                  <input
                    type="number"
                    min="0"
                    value={conceptMistakes}
                    onChange={e => setConceptMistakes(Number(e.target.value))}
                    className="w-full rounded bg-slate-800 p-1 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Formula or fact forgotten</label>
                  <input
                    type="number"
                    min="0"
                    value={formulaMistakes}
                    onChange={e => setFormulaMistakes(Number(e.target.value))}
                    className="w-full rounded bg-slate-800 p-1 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Calculation mistake</label>
                  <input
                    type="number"
                    min="0"
                    value={calcMistakes}
                    onChange={e => setCalcMistakes(Number(e.target.value))}
                    className="w-full rounded bg-slate-800 p-1 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Question misread</label>
                  <input
                    type="number"
                    min="0"
                    value={misreadMistakes}
                    onChange={e => setMisreadMistakes(Number(e.target.value))}
                    className="w-full rounded bg-slate-800 p-1 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Time management panic</label>
                  <input
                    type="number"
                    min="0"
                    value={timeMistakes}
                    onChange={e => setTimeMistakes(Number(e.target.value))}
                    className="w-full rounded bg-slate-800 p-1 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Careless guessing</label>
                  <input
                    type="number"
                    min="0"
                    value={guessingMistakes}
                    onChange={e => setGuessingMistakes(Number(e.target.value))}
                    className="w-full rounded bg-slate-800 p-1 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weak Topics (comma separated)</label>
              <input
                type="text"
                value={weakTopicsStr}
                onChange={e => setWeakTopicsStr(e.target.value)}
                placeholder="e.g. Eigenvalues, Paging, BCNF"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Key Takeaway Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What to revise before next mock test..."
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Save Test Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
