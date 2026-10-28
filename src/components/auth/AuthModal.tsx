import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  X,
  AlertCircle,
  Building,
  Target
} from 'lucide-react';
import { AuthService, SUPER_ADMIN_CREDENTIALS, UserProfile } from '../../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [targetScore, setTargetScore] = useState(70);

  if (!isOpen) return null;

  const handleQuickSuperAdminFill = () => {
    setEmail(SUPER_ADMIN_CREDENTIALS.email);
    setPassword(SUPER_ADMIN_CREDENTIALS.password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = AuthService.login(email, password);
      if (!res.success || !res.user) {
        setError(res.error || 'Login failed');
        return;
      }
      onAuthSuccess(res.user);
      onClose();
    } else {
      const res = AuthService.register({
        name,
        email,
        password,
        college,
        branch,
        targetGateScore: targetScore
      });

      if (!res.success || !res.user) {
        setError(res.error || 'Registration failed');
        return;
      }

      onAuthSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30 mb-3">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sign In to PrepPilot OS' : 'Create New Student Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your GATE & Placement roadmap and schedules'
              : 'Register your separate profile. Super Admin approval required.'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register New User</span>
          </button>
        </div>

        {/* Quick Fill Super Admin for Ease of Use */}
        {mode === 'login' && (
          <div className="mb-4 p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Super Admin Profile
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Rishabh Gautam ({SUPER_ADMIN_CREDENTIALS.email})
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickSuperAdminFill}
              className="text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg transition-all shadow"
            >
              Autofill
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aman Sharma"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College / Institute
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. IIT/NIT/State Univ"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Score
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      min={40}
                      max={100}
                      value={targetScore}
                      onChange={e => setTargetScore(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Policy Note on Super Admin Approval */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] text-amber-300/90 leading-relaxed">
                <span className="font-bold flex items-center gap-1 text-amber-200 mb-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Security & Privacy Gate
                </span>
                For data isolation and access control, newly registered student profiles have all
                timetables and prep features hidden until approved by Super Admin{' '}
                <strong className="text-amber-200">
                  {SUPER_ADMIN_CREDENTIALS.name} ({SUPER_ADMIN_CREDENTIALS.email})
                </strong>.
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-[0.99]"
          >
            {mode === 'login' ? 'Log In to PrepPilot' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
