import React, { useState } from 'react';
import { X, RotateCcw, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { TimetableBlock } from '../../types';
import { playNotificationChime } from '../../lib/notifications';

interface QuickRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekdayBlocks: TimetableBlock[];
  onRescheduleTask: (sourceBlockId: string, targetBlockId: string) => void;
}

export const QuickRecoveryModal: React.FC<QuickRecoveryModalProps> = ({
  isOpen,
  onClose,
  weekdayBlocks,
  onRescheduleTask
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [targetSlot, setTargetSlot] = useState<string>('');

  if (!isOpen) return null;

  // Study tasks that can be rescheduled
  const studyTasks = weekdayBlocks.filter(b => b.category === 'study' || b.category === 'revision');

  // Candidate slots that are legitimate study or revision windows (protects college, gym, meals, sleep)
  const candidateTargetSlots = weekdayBlocks.filter(b => 
    (b.category === 'study' || b.category === 'revision') && b.id !== selectedTask
  );

  const handleExecuteRecovery = () => {
    if (!selectedTask || !targetSlot) return;
    playNotificationChime('success');
    onRescheduleTask(selectedTask, targetSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close Quick Recovery"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Quick Recovery Planner</h2>
            <p className="text-xs text-slate-400">
              Reschedule a missed study session without overcrowding your day or violating sleep/gym/college blocks
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 mb-4 text-xs text-amber-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">
            PrepPilot protects your 9 AM–5 PM college, 6–8 PM gym, meals, and 10:30 PM sleep schedule. Missed tasks can be merged or assigned to designated evening or weekend revision slots.
          </p>
        </div>

        <div className="space-y-4">
          {/* Step 1: Select missed task */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. Which task was missed or needs recovery?
            </label>
            <div className="space-y-1.5">
              {studyTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedTask === task.id
                      ? 'border-violet-500 bg-violet-600/20 text-violet-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{task.activity}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{task.timeRange}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium capitalize">
                    {task.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select next target slot */}
          {selectedTask && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2. Select target recovery slot:
              </label>
              <div className="space-y-1.5">
                {candidateTargetSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setTargetSlot(slot.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                      targetSlot === slot.id
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-semibold block">{slot.activity}</span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3 text-indigo-400" />
                        {slot.timeRange}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                      Available Slot
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            disabled={!selectedTask || !targetSlot}
            onClick={handleExecuteRecovery}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedTask && targetSlot
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:opacity-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Reschedule Task</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
