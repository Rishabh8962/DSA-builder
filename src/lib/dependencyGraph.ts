import {
  DependencyGraphNode,
  GraphEdge,
  GraphNodeDomain,
  GraphNodeStatus,
  DynamicNodeStatus,
  NodeRealtimeMetrics,
  GATESubject,
  DSAProblem
} from '../types';

export const INITIAL_GRAPH_NODES: DependencyGraphNode[] = [
  // 1. Math & Discrete Foundations (Layer 1)
  {
    id: 'math-logic',
    title: 'Propositional & First Order Logic',
    domain: 'Math & Discrete',
    gateSubject: 'Discrete Mathematics',
    weightageMarks: 4,
    summary: 'Truth tables, predicates, quantifiers, logical equivalences, and formal proofs.',
    keyConcepts: ['Propositional Logic', 'Quantifiers (∀, ∃)', 'Inference Rules', 'Conjunctive Normal Form'],
    linkedDSAProblems: ['Valid Parentheses', 'Boolean Evaluation'],
    prerequisites: [],
    status: 'mastered',
    position: { x: 50, y: 50 }
  },
  {
    id: 'math-sets',
    title: 'Sets, Relations & Functions',
    domain: 'Math & Discrete',
    gateSubject: 'Discrete Mathematics',
    weightageMarks: 4,
    summary: 'Equivalence relations, partial orders, lattices, and function cardinality (injective, surjective).',
    keyConcepts: ['Partial Order Relations', 'Hasse Diagrams', 'Lattices', 'Bijection & Equivalence Classes'],
    linkedDSAProblems: ['Contains Duplicate', 'Valid Anagram'],
    prerequisites: [],
    status: 'in_progress',
    position: { x: 50, y: 190 }
  },
  {
    id: 'math-la',
    title: 'Linear Algebra (Matrices & Eigenvalues)',
    domain: 'Math & Discrete',
    gateSubject: 'Engineering Mathematics',
    weightageMarks: 5,
    summary: 'System of linear equations, matrix rank, determinants, and Cayley-Hamilton theorem.',
    keyConcepts: ['Matrix Rank & Nullity', 'Eigenvalues & Eigenvectors', 'Cayley-Hamilton Theorem', 'Gaussian Elimination'],
    linkedDSAProblems: ['Rotate Image / Matrix Operations'],
    prerequisites: [],
    status: 'in_progress',
    position: { x: 50, y: 330 }
  },
  {
    id: 'prog-basics',
    title: 'Programming Fundamentals & Asymptotic Complexity',
    domain: 'DSA & Java',
    gateSubject: 'Programming & Data Structures',
    dsaTopic: 'Complexity & Basics',
    weightageMarks: 5,
    summary: 'C/Java syntax, memory pointers/references, recursion mechanics, Big-O, Big-Omega, Big-Theta notation.',
    keyConcepts: ['Time & Space Complexity', 'Recurrence Relations', 'Master Theorem', 'Call Stack & Recursion'],
    linkedDSAProblems: ['Two Sum', 'Climbing Stairs'],
    prerequisites: [],
    status: 'in_progress',
    position: { x: 50, y: 470 }
  },

  // 2. Intermediate Foundations (Layer 2)
  {
    id: 'sys-digital',
    title: 'Digital Logic & Boolean Algebra',
    domain: 'Systems & OS',
    gateSubject: 'Digital Logic',
    weightageMarks: 6,
    summary: 'Combinational & sequential circuits, K-Maps, multiplexers, and flip-flops.',
    keyConcepts: ['Karnaugh Maps', 'Adders & Decoders', 'JK / D / T Flip-Flops', 'Finite State Machines'],
    linkedDSAProblems: ['Bit Manipulation & Single Number'],
    prerequisites: ['math-logic'],
    status: 'unlocked',
    position: { x: 340, y: 50 }
  },
  {
    id: 'dbms-relational',
    title: 'Relational Model, Algebra & SQL',
    domain: 'Database & Architecture',
    gateSubject: 'Databases (DBMS)',
    weightageMarks: 5,
    summary: 'Mathematical relational algebra operators, tuple relational calculus, and SQL queries/joins.',
    keyConcepts: ['Select, Project, Join, Division', 'Tuple Relational Calculus', 'Subqueries & Group By', 'Integrity Constraints'],
    linkedDSAProblems: ['SQL LeetCode queries'],
    prerequisites: ['math-sets'],
    status: 'unlocked',
    position: { x: 340, y: 190 }
  },
  {
    id: 'dsa-linear',
    title: 'Linear Data Structures (Arrays, Strings, Two Pointers)',
    domain: 'DSA & Java',
    gateSubject: 'Programming & Data Structures',
    dsaTopic: 'Arrays & Two Pointers',
    weightageMarks: 6,
    summary: 'Sequential memory layout, dynamic resizing, two-pointer convergence, and sliding window.',
    keyConcepts: ['Two Pointers', 'Sliding Window', 'In-place Array Mutations', 'Prefix Sums'],
    linkedDSAProblems: ['Best Time to Buy and Sell Stock', '3Sum', 'Container With Most Water', 'Longest Substring'],
    prerequisites: ['prog-basics'],
    status: 'unlocked',
    position: { x: 340, y: 390 }
  },
  {
    id: 'dsa-bs',
    title: 'Binary Search & Monotonic Invariants',
    domain: 'DSA & Java',
    gateSubject: 'Algorithms',
    dsaTopic: 'Binary Search',
    weightageMarks: 4,
    summary: 'Logarithmic search space reduction, lower/upper bounds, and searching across answer spaces.',
    keyConcepts: ['Rotated Array Search', 'Search Space Invariants', 'Bisect Algorithm'],
    linkedDSAProblems: ['Binary Search', 'Search in Rotated Sorted Array'],
    prerequisites: ['prog-basics'],
    status: 'unlocked',
    position: { x: 340, y: 530 }
  },

  // 3. Structural & Core Systems (Layer 3)
  {
    id: 'sys-coa',
    title: 'Computer Organization & Architecture (Pipelining & Cache)',
    domain: 'Database & Architecture',
    gateSubject: 'Computer Organization & Architecture',
    weightageMarks: 8,
    summary: 'Instruction execution cycle, ALU data-path, pipelining hazards, cache mapping techniques.',
    keyConcepts: ['Direct/Set-Associative Cache', 'Pipelining Speedup & Branch Hazards', 'Addressing Modes', 'Memory Interleaving'],
    linkedDSAProblems: [],
    prerequisites: ['sys-digital'],
    status: 'locked',
    position: { x: 640, y: 50 }
  },
  {
    id: 'dbms-normal',
    title: 'DBMS Normalization & Functional Dependencies',
    domain: 'Database & Architecture',
    gateSubject: 'Databases (DBMS)',
    weightageMarks: 5,
    summary: 'Closure of FDs, canonical cover, lossless join decomposition, 1NF, 2NF, 3NF, and BCNF.',
    keyConcepts: ['BCNF vs 3NF', 'Lossless Decomposition', 'Dependency Preservation', 'Minimal Cover Algorithm'],
    linkedDSAProblems: [],
    prerequisites: ['dbms-relational'],
    status: 'locked',
    position: { x: 640, y: 190 }
  },
  {
    id: 'dsa-lists-stacks',
    title: 'Linked Lists, Stacks & Queues',
    domain: 'DSA & Java',
    gateSubject: 'Programming & Data Structures',
    dsaTopic: 'Linked Lists & Stacks',
    weightageMarks: 6,
    summary: 'Node pointer manipulation, fast-slow pointers, monotonic stacks, and expression evaluation.',
    keyConcepts: ['Reverse Linked List', 'Cycle Detection (Floyd)', 'Monotonic Stack (Next Greater Element)', 'Queue using Stacks'],
    linkedDSAProblems: ['Reverse Linked List', 'Merge Two Sorted Lists', 'Linked List Cycle', 'Valid Parentheses'],
    prerequisites: ['dsa-linear'],
    status: 'unlocked',
    position: { x: 640, y: 350 }
  },
  {
    id: 'math-graphs',
    title: 'Discrete Math Graph Theory',
    domain: 'Math & Discrete',
    gateSubject: 'Discrete Mathematics',
    weightageMarks: 5,
    summary: 'Vertex degrees, Handshaking lemma, Eulerian/Hamiltonian graphs, planar graphs (Euler formula), chromatic number.',
    keyConcepts: ['Handshaking Lemma', 'Euler Tours', 'Planar Graphs (V - E + F = 2)', 'Graph Coloring'],
    linkedDSAProblems: [],
    prerequisites: ['math-sets'],
    status: 'unlocked',
    position: { x: 640, y: 490 }
  },

  // 4. Advanced Operating Systems & Trees (Layer 4)
  {
    id: 'sys-os-concurrency',
    title: 'OS Processes, Threads & Synchronization',
    domain: 'Systems & OS',
    gateSubject: 'Operating Systems',
    weightageMarks: 7,
    summary: 'Process state transitions, CPU scheduling algorithms, critical section, Semaphores, Peterson algorithm, Deadlocks.',
    keyConcepts: ['Banker’s Algorithm', 'Counting & Binary Semaphores', 'Context Switch Overhead', 'Preemptive CPU Scheduling'],
    linkedDSAProblems: ['Java Producer-Consumer Concurrent Queue'],
    prerequisites: ['prog-basics', 'sys-coa'],
    status: 'locked',
    position: { x: 940, y: 50 }
  },
  {
    id: 'sys-os-vm',
    title: 'OS Virtual Memory & Multi-Level Paging',
    domain: 'Systems & OS',
    gateSubject: 'Operating Systems',
    weightageMarks: 6,
    summary: 'Address translation, page tables, TLB hit ratios, page replacement algorithms (FIFO, LRU, Optimal), thrashing.',
    keyConcepts: ['Effective Memory Access Time', 'Multi-level Page Tables', 'Inverted Page Table', 'Belady’s Anomaly'],
    linkedDSAProblems: ['LRU Cache Implementation'],
    prerequisites: ['sys-coa'],
    status: 'locked',
    position: { x: 940, y: 190 }
  },
  {
    id: 'dsa-trees',
    title: 'Trees, Binary Search Trees & Heaps',
    domain: 'DSA & Java',
    gateSubject: 'Programming & Data Structures',
    dsaTopic: 'Trees & BST',
    weightageMarks: 7,
    summary: 'Recursive traversals (Inorder/Preorder/Postorder/Level order), BST invariants, LCA, Heapify, and Priority Queues.',
    keyConcepts: ['BST Invariants', 'Lowest Common Ancestor (LCA)', 'Level Order BFS', 'Binary Heap Array Mapping'],
    linkedDSAProblems: ['Invert Binary Tree', 'Maximum Depth of Binary Tree', 'Lowest Common Ancestor of a BST'],
    prerequisites: ['dsa-lists-stacks', 'math-graphs'],
    status: 'unlocked',
    position: { x: 940, y: 350 }
  },
  {
    id: 'dbms-indexing',
    title: 'DBMS Indexing (B & B+ Trees) & Transactions',
    domain: 'Database & Architecture',
    gateSubject: 'Databases (DBMS)',
    weightageMarks: 6,
    summary: 'B and B+ tree node splitting/search, ACID properties, Conflict Serializability, and 2-Phase Locking (2PL).',
    keyConcepts: ['B+ Tree Node Fanout Calculation', 'Conflict Serializability (Precedence Graph)', 'Strict 2PL', 'Write-Ahead Logging'],
    linkedDSAProblems: [],
    prerequisites: ['dbms-normal', 'dsa-trees'],
    status: 'locked',
    position: { x: 940, y: 490 }
  },

  // 5. Theory of Computation, Networks & Advanced Algorithms (Layer 5)
  {
    id: 'net-routing',
    title: 'Computer Networks (Subnetting, TCP/UDP & Routing)',
    domain: 'Systems & OS',
    gateSubject: 'Computer Networks',
    weightageMarks: 8,
    summary: 'IPv4/IPv6 CIDR subnet calculations, TCP 3-way handshake, sliding window flow control, Distance Vector and Link State routing.',
    keyConcepts: ['CIDR Subnet Masks', 'TCP Congestion Control (Slow Start/AIMD)', 'Distance Vector Routing', 'CRC Error Detection'],
    linkedDSAProblems: [],
    prerequisites: ['sys-os-concurrency'],
    status: 'locked',
    position: { x: 1240, y: 50 }
  },
  {
    id: 'theory-toc',
    title: 'Theory of Computation (Automata & Formal Languages)',
    domain: 'Theory & Compilers',
    gateSubject: 'Theory of Computation',
    weightageMarks: 8,
    summary: 'DFA, NFA, minimization, Regular expressions, Pumping Lemma for regular languages, CFG, Pushdown automata, Turing machines.',
    keyConcepts: ['DFA State Minimization', 'Pumping Lemma Contradiction', 'Chomsky Hierarchy', 'Halting Problem Undecidability'],
    linkedDSAProblems: [],
    prerequisites: ['math-logic', 'math-sets'],
    status: 'locked',
    position: { x: 1240, y: 190 }
  },
  {
    id: 'theory-compilers',
    title: 'Compiler Design (Parsing & Syntax-Directed Translation)',
    domain: 'Theory & Compilers',
    gateSubject: 'Compiler Design',
    weightageMarks: 5,
    summary: 'Lexical tokens, LL(1) parsing tables, LR(0)/SLR(1)/LALR(1) parsing, syntax-directed definitions (S-attributed & L-attributed).',
    keyConcepts: ['FIRST and FOLLOW Sets', 'LL(1) Conflict Resolution', 'LR Parsing Automaton', 'Intermediate Code (3-Address Code)'],
    linkedDSAProblems: ['Expression Parsing with Stacks'],
    prerequisites: ['theory-toc', 'dsa-lists-stacks'],
    status: 'locked',
    position: { x: 1240, y: 330 }
  },
  {
    id: 'dsa-graphs',
    title: 'Graph Algorithms (BFS/DFS, Topological Sort, Shortest Paths)',
    domain: 'DSA & Java',
    gateSubject: 'Algorithms',
    dsaTopic: 'Graphs',
    weightageMarks: 8,
    summary: 'Graph representations, cycle detection, Kahn algorithm for topological sort, Dijkstra shortest paths, Prim/Kruskal MST.',
    keyConcepts: ['BFS vs DFS', 'Connected Components', 'Topological Sort (DAG)', 'Dijkstra with PriorityQueue'],
    linkedDSAProblems: ['Number of Islands', 'Course Schedule (Topological Sort)'],
    prerequisites: ['dsa-trees', 'math-graphs'],
    status: 'unlocked',
    position: { x: 1240, y: 470 }
  },
  {
    id: 'dsa-dp',
    title: 'Dynamic Programming & Greedy Paradigms',
    domain: 'DSA & Java',
    gateSubject: 'Algorithms',
    dsaTopic: 'Dynamic Programming',
    weightageMarks: 8,
    summary: 'Optimal substructure, overlapping subproblems, memoization vs tabulation, 0/1 Knapsack, LCS, Matrix Chain Multiplication.',
    keyConcepts: ['1D & 2D Memoization', 'State Transition Relations', 'Longest Common Subsequence', 'Matrix Chain Multiplication Parenthesization'],
    linkedDSAProblems: ['Climbing Stairs', 'Coin Change', 'Longest Common Subsequence'],
    prerequisites: ['prog-basics', 'dsa-trees'],
    status: 'unlocked',
    position: { x: 1240, y: 610 }
  }
];

export const INITIAL_GRAPH_EDGES: GraphEdge[] = [
  // Discrete Math to Systems / Databases
  { id: 'e1', source: 'math-logic', target: 'sys-digital', label: 'Boolean Gates' },
  { id: 'e2', source: 'math-logic', target: 'theory-toc', label: 'Formal Proofs' },
  { id: 'e3', source: 'math-sets', target: 'dbms-relational', label: 'Relational Calculus' },
  { id: 'e4', source: 'math-sets', target: 'math-graphs', label: 'Relations to Adjacency' },
  { id: 'e5', source: 'math-sets', target: 'theory-toc', label: 'Alphabet & Languages' },

  // Programming to Data Structures & Algorithms
  { id: 'e6', source: 'prog-basics', target: 'dsa-linear', label: 'Contiguous Memory' },
  { id: 'e7', source: 'prog-basics', target: 'dsa-bs', label: 'Asymptotics O(log n)' },
  { id: 'e8', source: 'dsa-linear', target: 'dsa-lists-stacks', label: 'Pointer Traversal' },
  { id: 'e9', source: 'dsa-lists-stacks', target: 'dsa-trees', label: 'Recursive Nodes' },
  { id: 'e10', source: 'math-graphs', target: 'dsa-trees', label: 'Tree as Acyclic Graph' },
  { id: 'e11', source: 'dsa-trees', target: 'dsa-graphs', label: 'Tree to General Graph' },
  { id: 'e12', source: 'dsa-trees', target: 'dsa-dp', label: 'Subproblem Trees' },
  { id: 'e13', source: 'math-graphs', target: 'dsa-graphs', label: 'Adjacency & Weights' },

  // Systems & Architecture
  { id: 'e14', source: 'sys-digital', target: 'sys-coa', label: 'ALU & Flip-flops' },
  { id: 'e15', source: 'sys-coa', target: 'sys-os-concurrency', label: 'Interrupts & Context' },
  { id: 'e16', source: 'sys-coa', target: 'sys-os-vm', label: 'Cache to Virtual Paging' },
  { id: 'e17', source: 'sys-os-concurrency', target: 'net-routing', label: 'Sockets & Buffers' },

  // Databases & Storage
  { id: 'e18', source: 'dbms-relational', target: 'dbms-normal', label: 'FD Decompositions' },
  { id: 'e19', source: 'dbms-normal', target: 'dbms-indexing', label: 'Table to Disk Index' },
  { id: 'e20', source: 'dsa-trees', target: 'dbms-indexing', label: 'B+ Tree Balanced Index' },

  // Theory to Compilers
  { id: 'e21', source: 'theory-toc', target: 'theory-compilers', label: 'Lexing & Parsing' },
  { id: 'e22', source: 'dsa-lists-stacks', target: 'theory-compilers', label: 'Shift-Reduce Stack' }
];

export function evaluatePrerequisitesMet(
  node: DependencyGraphNode,
  allNodes: DependencyGraphNode[]
): boolean {
  if (!node.prerequisites || node.prerequisites.length === 0) return true;
  const nodesMap = new Map(allNodes.map(n => [n.id, n]));
  return node.prerequisites.every(preId => {
    const preNode = nodesMap.get(preId);
    return preNode ? preNode.status === 'mastered' : false;
  });
}

export function computeNodeUnlocks(
  nodeId: string,
  edges: GraphEdge[]
): string[] {
  return edges.filter(e => e.source === nodeId).map(e => e.target);
}

export function getTopologicalLearningPath(
  nodes: DependencyGraphNode[],
  edges: GraphEdge[]
): DependencyGraphNode[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }

  for (const e of edges) {
    if (adj.has(e.source) && inDegree.has(e.target)) {
      adj.get(e.source)!.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    }
  }

  // Queue of all nodes with 0 in-degree
  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const resultIds: string[] = [];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    resultIds.push(curr);
    for (const neighbor of adj.get(curr) || []) {
      const nextDeg = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, nextDeg);
      if (nextDeg === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If graph contains any isolated or remaining nodes, append them
  const remainingIds = nodes.map(n => n.id).filter(id => !resultIds.includes(id));
  const fullOrderIds = [...resultIds, ...remainingIds];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  return fullOrderIds.map(id => nodeMap.get(id)!).filter(Boolean);
}

export function detectCycles(
  nodes: DependencyGraphNode[],
  edges: GraphEdge[]
): boolean {
  const visited = new Set<string>();
  const recStack = new Set<string>();
  const adj = new Map<string, string[]>();

  for (const n of nodes) {
    adj.set(n.id, []);
  }
  for (const e of edges) {
    if (adj.has(e.source)) {
      adj.get(e.source)!.push(e.target);
    }
  }

  function isCyclicUtil(v: string): boolean {
    if (recStack.has(v)) return true;
    if (visited.has(v)) return false;

    visited.add(v);
    recStack.add(v);

    for (const neighbor of adj.get(v) || []) {
      if (isCyclicUtil(neighbor)) return true;
    }

    recStack.delete(v);
    return false;
  }

  for (const n of nodes) {
    if (!visited.has(n.id)) {
      if (isCyclicUtil(n.id)) return true;
    }
  }
  return false;
}

export function calculateNodeRealtimeMetrics(
  node: DependencyGraphNode,
  allNodes: DependencyGraphNode[],
  gateSubjects: GATESubject[] = [],
  dsaProblems: DSAProblem[] = []
): NodeRealtimeMetrics {
  const nodeMap = new Map(allNodes.map(n => [n.id, n]));

  // 1. Missing Prerequisites & Gap Detection
  const missingPrerequisites: { id: string; title: string; status: GraphNodeStatus }[] = [];
  if (node.prerequisites && node.prerequisites.length > 0) {
    for (const preId of node.prerequisites) {
      const parent = nodeMap.get(preId);
      if (!parent || parent.status !== 'mastered') {
        missingPrerequisites.push({
          id: preId,
          title: parent ? parent.title : preId,
          status: parent ? parent.status : 'locked'
        });
      }
    }
  }

  const hasPrerequisiteGap = missingPrerequisites.length > 0;

  // 2. GATE Tracker Integration
  const matchingGateSubj = gateSubjects.find(s =>
    s.name.toLowerCase() === node.gateSubject.toLowerCase() ||
    s.shortCode.toLowerCase() === node.gateSubject.toLowerCase() ||
    node.gateSubject.toLowerCase().includes(s.shortCode.toLowerCase())
  );

  const gateWeightage = node.weightageMarks || (matchingGateSubj ? matchingGateSubj.weightageEstimated : 5);
  const gateSyllabusPercent = matchingGateSubj ? matchingGateSubj.syllabusPercent : 0;
  const gatePyqsAttempted = matchingGateSubj ? matchingGateSubj.pyqsAttempted : 0;
  const gatePyqAccuracy = matchingGateSubj ? matchingGateSubj.pyqAccuracy : 0;
  const gateWeakTopics = matchingGateSubj ? matchingGateSubj.weakTopics : [];
  const hasGateWeakness = gateWeakTopics.length > 0 || (gatePyqsAttempted > 0 && gatePyqAccuracy < 55);

  // 3. DSA Tracker Integration
  const matchingProblems = dsaProblems.filter(p => {
    const inLinked = node.linkedDSAProblems.some(lp =>
      p.title.toLowerCase().includes(lp.toLowerCase()) ||
      lp.toLowerCase().includes(p.title.toLowerCase())
    );
    const topicMatches = node.dsaTopic && p.topic.toLowerCase().includes(node.dsaTopic.toLowerCase());
    return inLinked || topicMatches;
  });

  const dsaTotalProblems = matchingProblems.length;
  const dsaSolvedProblems = matchingProblems.filter(p => p.status === 'Solved').length;
  const dsaAttemptedProblems = matchingProblems.filter(p => p.status === 'Attempted' || p.status === 'Needs Revision').length;
  const dsaEasyCount = matchingProblems.filter(p => p.difficulty === 'Easy').length;
  const dsaMediumCount = matchingProblems.filter(p => p.difficulty === 'Medium').length;
  const dsaHardCount = matchingProblems.filter(p => p.difficulty === 'Hard').length;
  const dsaSolvedRate = dsaTotalProblems > 0 ? Math.round((dsaSolvedProblems / dsaTotalProblems) * 100) : 0;

  // 4. Progress Percentage
  let progressPercent = 0;
  if (dsaTotalProblems > 0 && matchingGateSubj) {
    progressPercent = Math.round((gateSyllabusPercent * 0.5) + (dsaSolvedRate * 0.5));
  } else if (matchingGateSubj) {
    progressPercent = gateSyllabusPercent;
  } else if (dsaTotalProblems > 0) {
    progressPercent = dsaSolvedRate;
  } else {
    progressPercent = node.status === 'mastered' ? 100 : node.status === 'in_progress' ? 45 : 0;
  }

  // 5. Dynamic Node Status (Mastered = Green, In Progress = Amber, Prerequisite Gap = Red, Ready = Cyan)
  let dynamicStatus: DynamicNodeStatus = 'ready';
  if (node.status === 'mastered' || (progressPercent >= 80 && !hasPrerequisiteGap)) {
    dynamicStatus = 'mastered';
  } else if (hasPrerequisiteGap) {
    dynamicStatus = 'prerequisite_gap';
  } else if (
    node.status === 'in_progress' ||
    progressPercent > 0 ||
    dsaAttemptedProblems > 0 ||
    dsaSolvedProblems > 0
  ) {
    dynamicStatus = 'in_progress';
  } else {
    dynamicStatus = 'ready';
  }

  // 6. Real-time Difficulty Score (10 to 99)
  const baseDomainDifficulty: Record<GraphNodeDomain, number> = {
    'Math & Discrete': 38,
    'DSA & Java': 50,
    'Systems & OS': 65,
    'Database & Architecture': 60,
    'Theory & Compilers': 78,
    'General Aptitude': 35
  };

  let rawScore = baseDomainDifficulty[node.domain] || 50;
  rawScore += Math.round((gateWeightage - 4) * 2);

  const weightedDSALoad = (dsaEasyCount * 1) + (dsaMediumCount * 2.5) + (dsaHardCount * 4.5);
  if (weightedDSALoad > 0) {
    rawScore += Math.min(15, Math.round(weightedDSALoad * 1.5));
  }

  if (dsaTotalProblems > 0) {
    const solvedRatio = dsaSolvedProblems / dsaTotalProblems;
    rawScore -= Math.round(solvedRatio * 20);
  }

  if (gateSyllabusPercent > 0) {
    rawScore -= Math.round((gateSyllabusPercent / 100) * 15);
  }

  if (hasGateWeakness) {
    rawScore += 12;
  }

  // Prerequisite gap penalty: attempting a node with missing foundations is significantly more difficult
  if (hasPrerequisiteGap) {
    rawScore += 16;
  }

  const difficultyScore = Math.max(10, Math.min(99, Math.round(rawScore)));

  let difficultyLevel: 'Foundational' | 'Moderate' | 'Challenging' | 'Advanced Hard';
  if (difficultyScore <= 38) {
    difficultyLevel = 'Foundational';
  } else if (difficultyScore <= 62) {
    difficultyLevel = 'Moderate';
  } else if (difficultyScore <= 80) {
    difficultyLevel = 'Challenging';
  } else {
    difficultyLevel = 'Advanced Hard';
  }

  return {
    missingPrerequisites,
    hasPrerequisiteGap,
    dynamicStatus,
    difficultyScore,
    difficultyLevel,
    gateWeightage,
    gateSyllabusPercent,
    gatePyqsAttempted,
    gatePyqAccuracy,
    gateWeakTopics,
    hasGateWeakness,
    dsaTotalProblems,
    dsaSolvedProblems,
    dsaAttemptedProblems,
    dsaEasyCount,
    dsaMediumCount,
    dsaHardCount,
    dsaSolvedRate,
    progressPercent
  };
}
