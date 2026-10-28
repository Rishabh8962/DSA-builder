import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Flame, Volume2, VolumeX, CloudRain } from 'lucide-react';
import { playNotificationChime, startAmbientSound, stopAmbientSound } from '../../lib/notifications';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSession: (durationMins: number, taskName: string, category: string) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onCompleteSession
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // 25, 50, 90 mins
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [category, setCategory] = useState<'GATE' | 'DSA' | 'Aptitude' | 'Revision'>('GATE');
  const [taskName, setTaskName] = useState<string>('GATE Core Study');
  const [ambientSound, setAmbientSound] = useState<'off' | 'brown' | 'rain' | 'white'>('off');

  useEffect(() => {
    setSecondsLeft(selectedDuration * 60);
    setIsActive(false);
    stopAmbientSound();
    setAmbientSound('off');
  }, [selectedDuration]);

  // Handle ambient sound toggle when timer starts/stops
  useEffect(() => {
    if (isActive && ambientSound !== 'off') {
      startAmbientSound(ambientSound as any, 0.15);
    } else if (!isActive) {
      stopAmbientSound();
    }
  }, [isActive, ambientSound]);

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      playNotificationChime('focus_done');
      onCompleteSession(selectedDuration, taskName, category);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, selectedDuration, taskName, category, onCompleteSession]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((selectedDuration * 60 - secondsLeft) / (selectedDuration * 60)) * 100;

  const handleSelectPreset = (mins: number) => {
    setSelectedDuration(mins);
    if (mins === 25) setTaskName('Quick Pomodoro Sprint');
    else if (mins === 50) setTaskName('Deep Problem Solving');
    else setTaskName('Deep Flow State Session');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close Focus Timer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Focus Session</h2>
            <p className="text-xs text-slate-400">Distraction-free timer for GATE & DSA blocks</p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[25, 50, 90].map(mins => (
            <button
              key={mins}
              onClick={() => handleSelectPreset(mins)}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedDuration === mins
                  ? 'border-indigo-500 bg-indigo-600/20 text-indigo-200 shadow-md'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {mins} mins
              <span className="block text-[10px] font-normal opacity-75">
                {mins === 25 ? 'Pomodoro' : mins === 50 ? 'Deep Work' : 'Flow State'}
              </span>
            </button>
          ))}
        </div>

        {/* Category & Task Inputs */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            {(['GATE', 'DSA', 'Aptitude', 'Revision'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                  category === cat
                    ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            placeholder="Focusing on..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />

          {/* Offline Ambient Sound Controls */}
          <div>
            <span className="block text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
              <Volume2 className="h-3 w-3 text-indigo-400" />
              <span>Ambient Sound for Concentration:</span>
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'off', label: 'Off', icon: VolumeX },
                { id: 'rain', label: 'Rain', icon: CloudRain },
                { id: 'brown', label: 'Brown Noise', icon: Volume2 },
                { id: 'white', label: 'White Noise', icon: Volume2 }
              ].map(s => {
                const Icon = s.icon;
                const isSelected = ambientSound === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setAmbientSound(s.id as any);
                      if (s.id !== 'off' && isActive) {
                        startAmbientSound(s.id as any, 0.15);
                      } else if (s.id === 'off') {
                        stopAmbientSound();
                      }
                    }}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-slate-800 bg-[#080d1a]">
            {/* Circular Progress Overlay */}
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="6"
                className="text-indigo-500"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="z-10 text-center font-mono">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="block text-[11px] font-sans text-slate-400 mt-1">
                {isActive ? 'In Progress' : secondsLeft === 0 ? 'Completed!' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setSecondsLeft(selectedDuration * 60);
              setIsActive(false);
            }}
            className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-400 hover:text-white"
            title="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              playNotificationChime('beep');
              setIsActive(!isActive);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all text-sm"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              playNotificationChime('success');
              onCompleteSession(selectedDuration, taskName, category);
              onClose();
            }}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-400 hover:bg-emerald-500/20"
            title="Mark finished early"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
