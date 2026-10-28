import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Monitor,
  CheckCircle2,
  Sparkles,
  X,
  Share,
  PlusSquare,
  ArrowRight,
  WifiOff,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { promptPWAInstall, isStandaloneApp, canPromptInstall } from '../../lib/pwa';
import { playNotificationChime } from '../../lib/notifications';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [installResult, setInstallResult] = useState<string | null>(null);

  useEffect(() => {
    setIsStandalone(isStandaloneApp());
    setCanPrompt(canPromptInstall());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const outcome = await promptPWAInstall();
    if (outcome === 'accepted') {
      playNotificationChime('success');
      setInstallResult('App successfully installed! You can now launch it from your desktop or home screen.');
      setIsStandalone(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } else if (outcome === 'dismissed') {
      setInstallResult('Installation dismissed. You can install anytime from the header button.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-xl shadow-indigo-600/30 p-2 mb-3">
            <img src="/icons/icon.svg" alt="PrepPilot App Icon" className="h-full w-full object-contain" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Install PrepPilot as a Desktop &amp; Mobile App
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Experience lightning fast offline startup, standalone desktop window, and distraction-free GATE prep.
          </p>
        </div>

        {/* Install Result Banner */}
        {installResult && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{installResult}</span>
          </div>
        )}

        {/* Already Installed Banner */}
        {isStandalone ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2 mb-5">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>PrepPilot is Installed &amp; Running in App Mode!</span>
            </div>
            <p className="text-xs text-slate-300">
              You are currently using the standalone Progressive Web App. You have complete offline access, quick desktop shortcuts, and real-time IST clock synchronization.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {/* Primary One-Click Install Button if supported */}
            {canPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/40 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-[0.99]"
              >
                <Download className="h-4 w-4" />
                <span>1-Click Install App Now</span>
              </button>
            )}

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <Zap className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
                <span className="text-[11px] font-bold text-white block">Instant Launch</span>
                <span className="text-[10px] text-slate-400">Zero loading delay</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <WifiOff className="h-5 w-5 text-sky-400 mx-auto mb-1.5" />
                <span className="text-[11px] font-bold text-white block">Offline First</span>
                <span className="text-[10px] text-slate-400">Works without internet</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <Monitor className="h-5 w-5 text-indigo-400 mx-auto mb-1.5" />
                <span className="text-[11px] font-bold text-white block">Standalone</span>
                <span className="text-[10px] text-slate-400">No browser clutter</span>
              </div>
            </div>

            {/* Platform Instructions */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 text-xs">
              <span className="font-bold text-slate-200 block border-b border-slate-800 pb-2">
                Manual Installation Guide (Desktop &amp; Mobile)
              </span>

              {/* Desktop (Chrome / Edge / Brave) */}
              <div className="flex items-start gap-2.5">
                <Monitor className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Desktop (Chrome / Edge / Brave)</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click the <strong>Install</strong> icon in the address bar (top right), or click <strong>⋮ Menu &rarr; "Save and share" &rarr; "Install PrepPilot"</strong>.
                  </p>
                </div>
              </div>

              {/* Android (Chrome) */}
              <div className="flex items-start gap-2.5">
                <Smartphone className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Android (Chrome)</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tap the <strong>⋮ Menu</strong> in top-right and choose <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </p>
                </div>
              </div>

              {/* iPhone / iPad (Safari) */}
              <div className="flex items-start gap-2.5">
                <Share className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">iPhone &amp; iPad (Safari)</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tap the <strong>Share</strong> button at the bottom of Safari, scroll down, and tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
