import React, { useState } from 'react';
import { X, Calculator, RotateCcw, Copy, Check, History } from 'lucide-react';
import { playNotificationChime } from '../../lib/notifications';

interface GateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GateCalculatorModal: React.FC<GateCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    setDisplay(prev => (prev === '0' || prev === 'Error' ? d : prev + d));
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
  };

  const handleBackspace = () => {
    setDisplay(prev => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(-val));
    }
  };

  const handleOperator = (op: string) => {
    setFormula(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleFunction = (fn: string) => {
    const x = parseFloat(display);
    if (isNaN(x)) return;

    let res = 0;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    switch (fn) {
      case 'sin':
        res = Math.sin(angleMode === 'deg' ? toRad(x) : x);
        break;
      case 'cos':
        res = Math.cos(angleMode === 'deg' ? toRad(x) : x);
        break;
      case 'tan':
        res = Math.tan(angleMode === 'deg' ? toRad(x) : x);
        break;
      case 'asin':
        res = angleMode === 'deg' ? toDeg(Math.asin(x)) : Math.asin(x);
        break;
      case 'acos':
        res = angleMode === 'deg' ? toDeg(Math.acos(x)) : Math.acos(x);
        break;
      case 'atan':
        res = angleMode === 'deg' ? toDeg(Math.atan(x)) : Math.atan(x);
        break;
      case 'log':
        res = Math.log10(x);
        break;
      case 'ln':
        res = Math.log(x);
        break;
      case 'sqrt':
        res = Math.sqrt(x);
        break;
      case 'cbrt':
        res = Math.cbrt(x);
        break;
      case 'sqr':
        res = x * x;
        break;
      case 'cube':
        res = x * x * x;
        break;
      case 'recip':
        res = 1 / x;
        break;
      case 'fact': {
        if (x < 0 || !Number.isInteger(x) || x > 170) {
          setDisplay('Error');
          return;
        }
        let f = 1;
        for (let i = 2; i <= x; i++) f *= i;
        res = f;
        break;
      }
      case 'exp':
        res = Math.exp(x);
        break;
      case 'pow10':
        res = Math.pow(10, x);
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      default:
        return;
    }

    const rounded = Math.round(res * 1e8) / 1e8;
    setDisplay(String(rounded));
    setHistory(prev => [`${fn}(${x}) = ${rounded}`, ...prev.slice(0, 9)]);
  };

  const handleEquals = () => {
    if (!formula) return;
    try {
      const parts = formula.trim().split(' ');
      const left = parseFloat(parts[0]);
      const op = parts[1];
      const right = parseFloat(display);

      let res = 0;
      if (op === '+') res = left + right;
      else if (op === '-') res = left - right;
      else if (op === '*') res = left * right;
      else if (op === '/') res = right !== 0 ? left / right : NaN;
      else if (op === '%') res = left % right;
      else if (op === '^') res = Math.pow(left, right);

      if (isNaN(res) || !isFinite(res)) {
        setDisplay('Error');
      } else {
        const rounded = Math.round(res * 1e8) / 1e8;
        setDisplay(String(rounded));
        setHistory(prev => [`${left} ${op} ${right} = ${rounded}`, ...prev.slice(0, 9)]);
      }
      setFormula('');
    } catch {
      setDisplay('Error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    playNotificationChime('beep');
    setTimeout(() => setCopied(false), 2000);
  };

  // Memory keys
  const handleMemory = (op: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => {
    const val = parseFloat(display) || 0;
    if (op === 'MC') setMemory(0);
    else if (op === 'MR') setDisplay(String(memory));
    else if (op === 'MS') setMemory(val);
    else if (op === 'M+') setMemory(prev => prev + val);
    else if (op === 'M-') setMemory(prev => prev - val);
    playNotificationChime('beep');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#0a0f1d] p-5 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close GATE Calculator"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">GATE Virtual Scientific Calculator</h2>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                Official TCS-iON Layout Simulator
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Practice calculating logarithms, powers, and roots using exam-mode controls
            </p>
          </div>
        </div>

        {/* Display Box */}
        <div className="rounded-xl border border-slate-700 bg-[#050811] p-3 mb-4 shadow-inner">
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono h-4">
            <span>{formula}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-indigo-400 font-bold uppercase">{angleMode}</span>
              {memory !== 0 && <span className="text-[10px] text-amber-400 font-bold">M</span>}
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider overflow-x-auto">
              {display}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 text-slate-500 hover:text-indigo-400"
              title="Copy to clipboard"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Calculator Keypad Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 text-xs font-mono">
          {/* Row 1: Angle & Memory */}
          <button
            onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
            className="rounded-lg bg-indigo-950/60 border border-indigo-500/30 p-2 text-indigo-300 font-bold hover:bg-indigo-900/60"
          >
            {angleMode.toUpperCase()}
          </button>
          <button onClick={() => handleMemory('MC')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:bg-slate-800">MC</button>
          <button onClick={() => handleMemory('MR')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:bg-slate-800">MR</button>
          <button onClick={() => handleMemory('MS')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:bg-slate-800">MS</button>
          <button onClick={() => handleMemory('M+')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:bg-slate-800">M+</button>
          <button onClick={handleBackspace} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-amber-400 font-bold hover:bg-slate-800">←</button>
          <button onClick={handleClear} className="rounded-lg bg-rose-950/40 border border-rose-500/30 p-2 text-rose-300 font-bold hover:bg-rose-900/50">C</button>

          {/* Row 2: Trig & Powers */}
          <button onClick={() => handleFunction('sin')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-indigo-300 hover:bg-slate-800">sin</button>
          <button onClick={() => handleFunction('cos')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-indigo-300 hover:bg-slate-800">cos</button>
          <button onClick={() => handleFunction('tan')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-indigo-300 hover:bg-slate-800">tan</button>
          <button onClick={() => handleFunction('ln')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">ln</button>
          <button onClick={() => handleFunction('log')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">log₁₀</button>
          <button onClick={() => handleOperator('/')} className="rounded-lg bg-indigo-900/40 border border-indigo-500/30 p-2 text-indigo-300 font-bold hover:bg-indigo-900/60">÷</button>
          <button onClick={() => handleOperator('%')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:bg-slate-800">mod</button>

          {/* Row 3: Inverse Trig & 7, 8, 9, * */}
          <button onClick={() => handleFunction('asin')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-indigo-300 hover:bg-slate-800">sin⁻¹</button>
          <button onClick={() => handleFunction('acos')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-indigo-300 hover:bg-slate-800">cos⁻¹</button>
          <button onClick={() => handleFunction('atan')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-indigo-300 hover:bg-slate-800">tan⁻¹</button>
          <button onClick={() => handleDigit('7')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">7</button>
          <button onClick={() => handleDigit('8')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">8</button>
          <button onClick={() => handleDigit('9')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">9</button>
          <button onClick={() => handleOperator('*')} className="rounded-lg bg-indigo-900/40 border border-indigo-500/30 p-2 text-indigo-300 font-bold hover:bg-indigo-900/60">×</button>

          {/* Row 4: Sqrt, Powers & 4, 5, 6, - */}
          <button onClick={() => handleFunction('sqrt')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">√x</button>
          <button onClick={() => handleFunction('sqr')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">x²</button>
          <button onClick={() => handleOperator('^')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">xʸ</button>
          <button onClick={() => handleDigit('4')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">4</button>
          <button onClick={() => handleDigit('5')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">5</button>
          <button onClick={() => handleDigit('6')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">6</button>
          <button onClick={() => handleOperator('-')} className="rounded-lg bg-indigo-900/40 border border-indigo-500/30 p-2 text-indigo-300 font-bold hover:bg-indigo-900/60">−</button>

          {/* Row 5: Cube, Factorial & 1, 2, 3, + */}
          <button onClick={() => handleFunction('cbrt')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">³√x</button>
          <button onClick={() => handleFunction('fact')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">n!</button>
          <button onClick={() => handleFunction('recip')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-violet-300 hover:bg-slate-800">1/x</button>
          <button onClick={() => handleDigit('1')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">1</button>
          <button onClick={() => handleDigit('2')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">2</button>
          <button onClick={() => handleDigit('3')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">3</button>
          <button onClick={() => handleOperator('+')} className="rounded-lg bg-indigo-900/40 border border-indigo-500/30 p-2 text-indigo-300 font-bold hover:bg-indigo-900/60">+</button>

          {/* Row 6: Constants & 0, ., = */}
          <button onClick={() => handleFunction('pi')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-amber-300 hover:bg-slate-800">π</button>
          <button onClick={() => handleFunction('e')} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-amber-300 hover:bg-slate-800">e</button>
          <button onClick={handleToggleSign} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-300 hover:bg-slate-800">±</button>
          <button onClick={() => handleDigit('0')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">0</button>
          <button onClick={() => handleDigit('.')} className="rounded-lg bg-[#141b2e] border border-slate-700 p-2 text-white font-bold hover:bg-[#1a233b]">.</button>
          <button
            onClick={handleEquals}
            className="col-span-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 p-2 text-white font-extrabold hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/30"
          >
            =
          </button>
        </div>

        {/* Calculation History Tape */}
        {history.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 font-semibold">
                <History className="h-3.5 w-3.5" /> Recent Calculations
              </span>
              <button
                onClick={() => setHistory([])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] font-mono text-slate-300">
              {history.map((h, i) => (
                <span key={i} className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 whitespace-nowrap">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
