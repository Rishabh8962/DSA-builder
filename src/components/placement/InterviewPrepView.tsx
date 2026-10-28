import React, { useState } from 'react';
import {
  Briefcase,
  Code2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  BookOpen,
  Award,
  Layers,
  FileText,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { InterviewQuestion, STARProject } from '../../types';
import { playNotificationChime } from '../../lib/notifications';

const DEFAULT_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q-1',
    category: 'Java & OOP',
    question: 'How does HashMap handle collisions internally in Java 8 and beyond?',
    answer: 'HashMap uses an array of Node<K,V> buckets. When two keys hash to the same bucket index via (n - 1) & hash:\n1. It initially chains them using a Singly Linked List.\n2. Treeification Threshold: When the chain length in a single bucket reaches 8 and the table capacity is at least 64, Java converts that bucket into a Red-Black Tree.\n3. This changes worst-case lookup from O(n) to O(log n).\n4. Untreeify Threshold: If elements in that bucket drop down to 6 due to removals, it reverts back to a linked list.',
    codeSnippet: 'static final int TREEIFY_THRESHOLD = 8;\nstatic final int UNTREEIFY_THRESHOLD = 6;\nstatic final int MIN_TREEIFY_CAPACITY = 64;',
    importance: 'Must Know',
    mastered: false
  },
  {
    id: 'q-2',
    category: 'Java & OOP',
    question: 'Explain the difference between final, finally, and finalize in Java.',
    answer: '• final: Keyword used as an access modifier. Applied to variable (makes it a constant), method (prevents overriding), or class (prevents inheritance).\n• finally: Block used with try-catch. Guarantees execution whether an exception is handled or not (used for closing sockets, DB connections).\n• finalize(): Method in java.lang.Object called by Garbage Collector before an object is reclaimed (deprecated in modern Java).',
    importance: 'High',
    mastered: false
  },
  {
    id: 'q-3',
    category: 'Operating Systems',
    question: 'What is the exact difference between a Process and a Thread?',
    answer: '• Process: An executing instance of a program with its own independent address space (code, data, heap, stack, file descriptors). Process switching requires OS kernel intervention and flushing/updating MMU page tables (heavyweight context switch).\n• Thread: A light-weight execution unit within a process. Multiple threads share the same process code, data, and heap, but each has its own private Stack, Program Counter (PC), and registers. Thread switching does not require invalidating page tables.',
    importance: 'Must Know',
    mastered: false
  },
  {
    id: 'q-4',
    category: 'Operating Systems',
    question: 'What are the 4 Coffman conditions for Deadlock, and how to prevent it?',
    answer: 'All four must hold simultaneously for deadlock to occur:\n1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (process holding resources can request new ones)\n3. No Preemption (resources cannot be forcibly confiscated)\n4. Circular Wait (a closed chain of processes each waiting for resource held by next)\nPrevention strategy: Break at least one condition (e.g. impose total ordering on all resources to eliminate Circular Wait).',
    importance: 'High',
    mastered: false
  },
  {
    id: 'q-5',
    category: 'DBMS & SQL',
    question: 'Why are B+ Trees preferred over B-Trees for database indexing?',
    answer: '1. In B+ Trees, data pointers and actual records are stored ONLY in the leaf nodes, while internal nodes store only search keys. This allows internal nodes to have a much higher branching factor (fan-out), keeping the tree shallow (fewer disk I/O operations).\n2. All leaf nodes in a B+ Tree are linked together sequentially in a doubly linked list, making Range Queries (e.g. WHERE salary BETWEEN 50000 AND 80000) extremely fast with simple pointer traversal without visiting parent nodes.\n3. Predictable search time because all leaf nodes are at the exact same depth.',
    importance: 'Must Know',
    mastered: false
  },
  {
    id: 'q-6',
    category: 'Computer Networks',
    question: 'Walk through the TCP 3-Way Handshake step by step.',
    answer: '1. SYN: Client sends SYN packet to Server with an Initial Sequence Number (ISN = x). Client enters SYN_SENT state.\n2. SYN-ACK: Server receives SYN, allocates buffers, and sends back SYN (with its own ISN = y) + ACK (x + 1). Server enters SYN_RCVD state.\n3. ACK: Client sends ACK (y + 1). Connection is established (ESTABLISHED state) and data transfer begins.',
    codeSnippet: 'Client  --- [SYN, Seq=x]       ---> Server (SYN_SENT)\nClient  <-- [SYN+ACK, Seq=y, Ack=x+1] - Server (SYN_RCVD)\nClient  --- [ACK, Ack=y+1]     ---> Server (ESTABLISHED)',
    importance: 'Must Know',
    mastered: false
  },
  {
    id: 'q-7',
    category: 'System Design Basics',
    question: 'Horizontal Scaling vs Vertical Scaling and when to choose which?',
    answer: '• Vertical Scaling (Scale Up): Adding more CPU, RAM, or SSD to an existing single machine. Simple, no distributed complexity, but has hard hardware limits and single point of failure (SPOF).\n• Horizontal Scaling (Scale Out): Adding more servers/nodes behind a Load Balancer (e.g., NGINX). High availability, fault tolerant, virtually unlimited scale, but requires stateless application architecture and distributed caching (Redis).',
    importance: 'High',
    mastered: false
  }
];

const DEFAULT_STAR_PROJECTS: STARProject[] = [
  {
    id: 'proj-1',
    title: 'High-Throughput File Processing Engine',
    techStack: 'Java 17, Spring Boot, PostgreSQL, Docker, Redis',
    situation: 'University lab required bulk processing of 50,000+ student assessment submissions within a 20-minute deadline without crashing the database.',
    task: 'Designed and implemented an asynchronous processing pipeline capable of handling concurrent file uploads, parsing results, and updating SQL records.',
    action: 'Implemented Java ExecutorService with bounded ThreadPoolExecutor to prevent memory exhaustion. Used Redis as a distributed queue to buffer ingestion, and batched JDBC inserts (batches of 500 records) to minimize database network round trips.',
    result: 'Reduced overall processing turnaround time by 68% (from 42 minutes to 13.5 minutes) and eliminated out-of-memory errors during peak submission spikes.',
    keyInterviewTakeaway: 'Demonstrates deep understanding of Java concurrency, thread pools, and batch SQL optimization.'
  }
];

export const InterviewPrepView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'star'>('questions');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedQId, setExpandedQId] = useState<string | null>('q-1');

  // Stored state
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() => {
    try {
      const stored = localStorage.getItem('preppilot_interview_questions');
      return stored ? JSON.parse(stored) : DEFAULT_QUESTIONS;
    } catch {
      return DEFAULT_QUESTIONS;
    }
  });

  const [projects, setProjects] = useState<STARProject[]>(() => {
    try {
      const stored = localStorage.getItem('preppilot_star_projects');
      return stored ? JSON.parse(stored) : DEFAULT_STAR_PROJECTS;
    } catch {
      return DEFAULT_STAR_PROJECTS;
    }
  });

  // New Project Form Modal
  const [isAddProjOpen, setIsAddProjOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projSituation, setProjSituation] = useState('');
  const [projTask, setProjTask] = useState('');
  const [projAction, setProjAction] = useState('');
  const [projResult, setProjResult] = useState('');
  const [projTakeaway, setProjTakeaway] = useState('');

  const saveQuestions = (newQ: InterviewQuestion[]) => {
    setQuestions(newQ);
    localStorage.setItem('preppilot_interview_questions', JSON.stringify(newQ));
  };

  const saveProjects = (newP: STARProject[]) => {
    setProjects(newP);
    localStorage.setItem('preppilot_star_projects', JSON.stringify(newP));
  };

  const handleToggleMastered = (id: string) => {
    const updated = questions.map(q => (q.id === id ? { ...q, mastered: !q.mastered } : q));
    saveQuestions(updated);
    playNotificationChime('success');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;

    const newProj: STARProject = {
      id: `proj-${Date.now()}`,
      title: projTitle,
      techStack: projTech || 'Java, Spring Boot, MySQL',
      situation: projSituation,
      task: projTask,
      action: projAction,
      result: projResult,
      keyInterviewTakeaway: projTakeaway
    };

    saveProjects([newProj, ...projects]);
    setIsAddProjOpen(false);
    setProjTitle('');
    setProjTech('');
    setProjSituation('');
    setProjTask('');
    setProjAction('');
    setProjResult('');
    setProjTakeaway('');
    playNotificationChime('success');
  };

  const filteredQuestions = questions.filter(q => 
    selectedCategory === 'All' || q.category === selectedCategory
  );

  const categories = ['All', 'Java & OOP', 'DBMS & SQL', 'Operating Systems', 'Computer Networks', 'System Design Basics'];
  const masteredQCount = questions.filter(q => q.mastered).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-violet-400" />
              <span>Campus Placement Interview Preparation</span>
            </h1>
            <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-violet-300">
              Technical & HR Rounds
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master core CS conceptual interview questions and frame your college projects using the proven STAR technique.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'star' && (
            <button
              onClick={() => setIsAddProjOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add STAR Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('questions')}
          className={`border-b-2 py-2.5 px-4 text-xs font-bold transition-all ${
            activeTab === 'questions'
              ? 'border-violet-500 text-violet-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Core CS Quick-Fire Sheet ({masteredQCount}/{questions.length} Mastered)
        </button>
        <button
          onClick={() => setActiveTab('star')}
          className={`border-b-2 py-2.5 px-4 text-xs font-bold transition-all ${
            activeTab === 'star'
              ? 'border-violet-500 text-violet-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          STAR Framework Project Explainer ({projects.length})
        </button>
      </div>

      {/* View 1: Core CS Quick-Fire Sheet */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                  selectedCategory === cat
                    ? 'border-violet-500 bg-violet-500/20 text-violet-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredQuestions.map(q => {
              const isExpanded = expandedQId === q.id;
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded ? 'border-violet-500/40 bg-[#0c1224]' : 'border-slate-800 bg-[#0a0f1d]'
                  }`}
                >
                  <div
                    onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                    className="flex items-center justify-between p-4 cursor-pointer select-none gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleMastered(q.id);
                        }}
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-all ${
                          q.mastered
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-700 bg-slate-800 hover:border-violet-400'
                        }`}
                        title="Mark mastered"
                      >
                        {q.mastered && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-mono text-violet-300">
                            {q.category}
                          </span>
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300 font-mono">
                            {q.importance}
                          </span>
                        </div>
                        <h3 className={`text-sm font-bold mt-1 ${q.mastered ? 'text-slate-400' : 'text-white'}`}>
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-800/80 p-4 space-y-3 bg-[#080d1a]/50">
                      <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-4 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                        {q.answer}
                      </div>

                      {q.codeSnippet && (
                        <pre className="rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs font-mono text-indigo-300 overflow-x-auto">
                          {q.codeSnippet}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: STAR Framework Project Builder */}
      {activeTab === 'star' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 text-xs text-indigo-200 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">The STAR Technique for Technical Interviews:</span>
              <p className="leading-relaxed">
                When recruiters ask <em>"Tell me about a challenging project you built,"</em> deliver your story in 4 structured parts:
                <strong> Situation</strong> (the problem/context), <strong>Task</strong> (what you were tasked to solve), 
                <strong> Action</strong> (your specific technical choices and algorithms), and <strong>Result</strong> (metrics, latency reduction, reliability).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map(proj => (
              <div
                key={proj.id}
                className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-white">{proj.title}</h2>
                    <span className="text-xs text-indigo-400 font-mono mt-0.5 block">
                      Tech Stack: {proj.techStack}
                    </span>
                  </div>
                  <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-violet-300 self-start sm:self-auto">
                    Interview Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block mb-1">
                      S — Situation (Context & Problem)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{proj.situation}</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] block mb-1">
                      T — Task (Your Responsibility)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{proj.task}</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-bold text-teal-400 uppercase tracking-wider text-[10px] block mb-1">
                      A — Action (Technical Implementation)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{proj.action}</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
                      R — Result (Quantitative Impact)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{proj.result}</p>
                  </div>
                </div>

                {proj.keyInterviewTakeaway && (
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-2.5 text-xs text-indigo-300 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    <span><strong>Key Speaking Takeaway:</strong> {proj.keyInterviewTakeaway}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddProjOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateProject}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0c1224] p-6 shadow-2xl text-slate-100 space-y-3.5 my-8"
          >
            <h3 className="text-base font-bold text-white">Structure College Project (STAR Framework)</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={projTitle}
                onChange={e => setProjTitle(e.target.value)}
                placeholder="e.g. Distributed Task Scheduler / E-Commerce Backend"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack</label>
              <input
                type="text"
                value={projTech}
                onChange={e => setProjTech(e.target.value)}
                placeholder="e.g. Java, Spring Boot, MySQL, Redis, Docker"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">S — Situation (What was the challenge or background?)</label>
              <textarea
                required
                rows={2}
                value={projSituation}
                onChange={e => setProjSituation(e.target.value)}
                placeholder="Describe the problem, users, or bottleneck..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-indigo-300 mb-1">T — Task (What were you assigned to build?)</label>
              <textarea
                required
                rows={2}
                value={projTask}
                onChange={e => setProjTask(e.target.value)}
                placeholder="Define your goal and scope..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1">A — Action (What exact Java / CS solutions did you build?)</label>
              <textarea
                required
                rows={2}
                value={projAction}
                onChange={e => setProjAction(e.target.value)}
                placeholder="Data structures used, concurrency, caching, database indexing..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1">R — Result (Metrics & outcome)</label>
              <textarea
                required
                rows={2}
                value={projResult}
                onChange={e => setProjResult(e.target.value)}
                placeholder="e.g. 50% faster response time, handled 1000 req/sec, zero data loss..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Key Interview Takeaway</label>
              <input
                type="text"
                value={projTakeaway}
                onChange={e => setProjTakeaway(e.target.value)}
                placeholder="e.g. Proves practical multithreading and database indexing knowledge"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddProjOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500"
              >
                Save STAR Story
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
