import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  RotateCw,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Flashcard } from '../../types';
import { playNotificationChime } from '../../lib/notifications';

interface FlashcardsViewProps {
  onOpenFocusModal: () => void;
}

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subject: 'Engineering Mathematics',
    topic: 'Linear Algebra',
    front: 'Eigenvalues & Trace / Determinant Relationship',
    back: '1. Sum of Eigenvalues = Trace of Matrix (sum of main diagonal elements)\n2. Product of Eigenvalues = Determinant of Matrix (|A|)\n3. Eigenvalues of A^k are λ^k\n4. If A is singular, at least one eigenvalue is 0.',
    mastered: false
  },
  {
    id: 'fc-2',
    subject: 'Algorithms',
    topic: 'Asymptotic Analysis',
    front: 'Master Theorem for T(n) = aT(n/b) + Θ(n^k log^p n)',
    back: 'Compare a with b^k:\n• Case 1: if a > b^k → T(n) = Θ(n^(log_b a))\n• Case 2: if a = b^k:\n   - if p > -1 → Θ(n^k log^(p+1) n)\n   - if p = -1 → Θ(n^k log log n)\n• Case 3: if a < b^k and regularity holds → Θ(n^k log^p n)',
    mastered: false
  },
  {
    id: 'fc-3',
    subject: 'Operating Systems',
    topic: 'Memory Management',
    front: 'Effective Memory Access Time (EMAT) with TLB',
    back: 'EMAT = h * (t_tlb + m) + (1 - h) * (t_tlb + (k + 1)*m)\nWhere:\n• h = TLB hit ratio\n• t_tlb = TLB lookup time\n• m = Main memory access time\n• k = Number of page table levels (k-level paging)',
    mastered: false
  },
  {
    id: 'fc-4',
    subject: 'Databases (DBMS)',
    topic: 'Normalization',
    front: 'Boyce-Codd Normal Form (BCNF) Condition',
    back: 'A relation R is in BCNF if for every non-trivial Functional Dependency X → Y:\n• X must be a SUPERKEY of R.\nNote: BCNF is strictly stronger than 3NF. BCNF always guarantees lossless join decomposition, but dependency preservation is NOT always guaranteed.',
    mastered: false
  },
  {
    id: 'fc-5',
    subject: 'Computer Networks',
    topic: 'Transport Layer',
    front: 'Sliding Window Protocol Channel Utilization / Efficiency',
    back: 'Efficiency (η) = (W * T_t) / (T_t + 2 * T_p) = W / (1 + 2a)\nWhere:\n• a = T_p / T_t (Propagation delay / Transmission delay)\n• W = Sender window size\n• For Stop-and-Wait: W = 1 → η = 1 / (1 + 2a)\n• For 100% efficiency: W ≥ 1 + 2a',
    mastered: false
  },
  {
    id: 'fc-6',
    subject: 'Java & Placement',
    topic: 'Collections Framework',
    front: 'HashMap Internal Working in Java (JDK 8+)',
    back: '• Default initial capacity = 16, default load factor = 0.75.\n• Uses Array of Nodes (buckets) based on hash(key) & (n-1).\n• Handles collisions via linked list.\n• Treeification: If bucket list length ≥ 8 and total capacity ≥ 64, linked list transforms into Red-Black Tree (O(log n) worst case lookup).',
    mastered: false
  },
  {
    id: 'fc-7',
    subject: 'Discrete Mathematics',
    topic: 'Graph Theory',
    front: 'Euler Graph vs Hamiltonian Graph Existence Conditions',
    back: '• Euler Graph: Connected graph with ALL vertices having EVEN degree.\n• Euler Path: Connected graph with exactly 0 or 2 vertices of ODD degree.\n• Dirac\'s Theorem (Hamiltonian): If connected graph has n ≥ 3 vertices and every vertex has deg(v) ≥ n/2, then G has a Hamiltonian cycle.',
    mastered: false
  },
  {
    id: 'fc-8',
    subject: 'Computer Organization',
    topic: 'Pipelining',
    front: 'Pipelining Speedup and Efficiency',
    back: 'Speedup S = (n * t_non_pipe) / ((k + n - 1) * t_pipe + stall_cycles * t_pipe)\n• For ideal pipeline with large n: S_ideal = k (number of stages)\n• Pipeline cycle time = max(stage delays) + latch delay\n• Throughput = n / total time ≈ 1 / cycle_time',
    mastered: false
  }
];

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onOpenFocusModal }) => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const stored = localStorage.getItem('preppilot_flashcards');
      return stored ? JSON.parse(stored) : DEFAULT_FLASHCARDS;
    } catch {
      return DEFAULT_FLASHCARDS;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New card form
  const [newSubject, setNewSubject] = useState('Operating Systems');
  const [newTopic, setNewTopic] = useState('');
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const saveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    localStorage.setItem('preppilot_flashcards', JSON.stringify(newCards));
  };

  const filteredCards = cards.filter(c => {
    const matchesSubject = selectedSubject === 'All' || c.subject === selectedSubject;
    const matchesSearch = c.front.toLowerCase().includes(searchQuery.toLowerCase()) || c.back.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === 'all' ? true : filterMode === 'mastered' ? c.mastered : !c.mastered;
    return matchesSubject && matchesSearch && matchesMode;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % (filteredCards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + (filteredCards.length || 1)) % (filteredCards.length || 1));
  };

  const handleToggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cards.map(c => {
      if (c.id === id) {
        return { ...c, mastered: !c.mastered };
      }
      return c;
    });
    saveCards(updated);
    playNotificationChime('success');
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront || !newBack) return;

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      subject: newSubject,
      topic: newTopic || 'Core Concept',
      front: newFront,
      back: newBack,
      mastered: false
    };

    saveCards([newCard, ...cards]);
    setIsAddOpen(false);
    setNewFront('');
    setNewBack('');
    setNewTopic('');
    playNotificationChime('success');
  };

  const subjects = ['All', ...new Set(cards.map(c => c.subject))];
  const masteredCount = cards.filter(c => c.mastered).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              <span>College Break Formula & Flashcard Deck</span>
            </h1>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
              Active Recall
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formulas, theorems, and core Java concepts formatted for 5–10 minute college break drills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Metrics & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0c1224] p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-0.5 text-xs">
            <button
              onClick={() => { setFilterMode('all'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg ${filterMode === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400'}`}
            >
              All ({cards.length})
            </button>
            <button
              onClick={() => { setFilterMode('unmastered'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg ${filterMode === 'unmastered' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400'}`}
            >
              Need Practice ({cards.length - masteredCount})
            </button>
            <button
              onClick={() => { setFilterMode('mastered'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg ${filterMode === 'mastered' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400'}`}
            >
              Mastered ({masteredCount})
            </button>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Card {filteredCards.length > 0 ? currentIndex + 1 : 0} of {filteredCards.length}
        </span>
      </div>

      {/* 3D Flip Card Container */}
      {filteredCards.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-12 text-center text-slate-400">
          <Layers className="h-8 w-8 mx-auto mb-2 text-slate-600" />
          <p className="text-sm font-semibold">No flashcards found for this filter</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div
            onClick={() => {
              setIsFlipped(!isFlipped);
              playNotificationChime('beep');
            }}
            className="w-full max-w-2xl min-h-[300px] cursor-pointer rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0c142e] via-[#0f1738] to-[#121133] p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between hover:border-indigo-500/50 transition-all select-none"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300">
                  {currentCard.subject}
                </span>
                <span className="text-xs text-slate-400 font-mono">• {currentCard.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => handleToggleMastered(currentCard.id, e)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                    currentCard.mastered
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{currentCard.mastered ? 'Mastered' : 'Mark Mastered'}</span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                    Question / Formula Prompt
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                    {currentCard.front}
                  </h2>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                    Formula Breakdown / Key Concept
                  </span>
                  <p className="text-sm sm:text-base text-slate-200 font-mono whitespace-pre-line leading-relaxed bg-[#080d1a]/80 p-4 rounded-2xl border border-slate-800/80">
                    {currentCard.back}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-indigo-500/20">
              <span className="flex items-center gap-1">
                <RotateCw className="h-3.5 w-3.5 text-indigo-400" />
                <span>Tap card anywhere to {isFlipped ? 'show question' : 'reveal formula & answer'}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {isFlipped ? 'Answer View' : 'Prompt View'}
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="rounded-xl border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/30"
            >
              Flip Card
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
            >
              <span>Next Card</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateCard}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Add Formula Flashcard</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Engineering Mathematics">Engg Mathematics</option>
                  <option value="Discrete Mathematics">Discrete Maths</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Databases (DBMS)">Databases (DBMS)</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Computer Organization">COA</option>
                  <option value="Java & Placement">Java & Placement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Name</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="e.g. Paging / Normalization"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prompt / Formula Name (Front)</label>
              <input
                type="text"
                required
                value={newFront}
                onChange={e => setNewFront(e.target.value)}
                placeholder="e.g. Master Theorem Case 2"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Explanation / Formula (Back)</label>
              <textarea
                required
                rows={4}
                value={newBack}
                onChange={e => setNewBack(e.target.value)}
                placeholder="Enter formula, key condition, or edge case breakdown..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Save Flashcard
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
