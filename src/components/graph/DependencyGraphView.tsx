import React, { useState, useMemo, useRef } from 'react';
import {
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Info,
  ListOrdered,
  Network,
  AlertTriangle,
  Clock,
  Gauge,
  Flame,
  Check,
  ShieldAlert,
  ChevronRight,
  Code2,
  ArrowUpRight
} from 'lucide-react';
import {
  DependencyGraphNode,
  GraphEdge,
  GraphNodeDomain,
  GraphNodeStatus,
  DynamicNodeStatus,
  NodeRealtimeMetrics,
  GATESubject,
  DSAProblem
} from '../../types';
import {
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_EDGES,
  evaluatePrerequisitesMet,
  computeNodeUnlocks,
  getTopologicalLearningPath,
  calculateNodeRealtimeMetrics
} from '../../lib/dependencyGraph';
import { playNotificationChime } from '../../lib/notifications';

interface DependencyGraphViewProps {
  gateSubjects?: GATESubject[];
  dsaProblems?: DSAProblem[];
  onNavigateTab: (tab: any) => void;
  onUpdateGateSubjects?: (subjects: GATESubject[]) => void;
  onUpdateDSAProblems?: (problems: DSAProblem[]) => void;
}

export const DependencyGraphView: React.FC<DependencyGraphViewProps> = ({
  gateSubjects = [],
  dsaProblems = [],
  onNavigateTab,
  onUpdateGateSubjects,
  onUpdateDSAProblems
}) => {
  const [nodes, setNodes] = useState<DependencyGraphNode[]>(() => {
    try {
      const stored = localStorage.getItem('preppilot_knowledge_graph_nodes');
      return stored ? JSON.parse(stored) : INITIAL_GRAPH_NODES;
    } catch {
      return INITIAL_GRAPH_NODES;
    }
  });

  const edges = INITIAL_GRAPH_EDGES;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('math-logic');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'graph' | 'path'>('graph');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const saveNodes = (newNodes: DependencyGraphNode[]) => {
    setNodes(newNodes);
    localStorage.setItem('preppilot_knowledge_graph_nodes', JSON.stringify(newNodes));
  };

  // Real-time metrics computed for all nodes
  const nodeMetricsMap = useMemo(() => {
    const map = new Map<string, NodeRealtimeMetrics>();
    for (const node of nodes) {
      map.set(node.id, calculateNodeRealtimeMetrics(node, nodes, gateSubjects, dsaProblems));
    }
    return map;
  }, [nodes, gateSubjects, dsaProblems]);

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const selectedNodeMetrics = useMemo(() => {
    return selectedNode ? nodeMetricsMap.get(selectedNode.id) || null : null;
  }, [selectedNode, nodeMetricsMap]);

  // Downstream unlocked node IDs
  const downstreamUnlockedIds = useMemo(() => {
    if (!selectedNodeId) return [];
    return computeNodeUnlocks(selectedNodeId, edges);
  }, [selectedNodeId, edges]);

  // Pre-calculated topological learning sequence
  const topologicalOrder = useMemo(() => {
    return getTopologicalLearningPath(nodes, edges);
  }, [nodes, edges]);

  // Node position map for drawing edges
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  // Aggregate stats across the graph
  const stats = useMemo(() => {
    let mastered = 0;
    let inProgress = 0;
    let gaps = 0;
    let ready = 0;
    let totalDifficulty = 0;

    for (const node of nodes) {
      const m = nodeMetricsMap.get(node.id);
      if (!m) continue;
      totalDifficulty += m.difficultyScore;
      if (m.dynamicStatus === 'mastered') mastered++;
      else if (m.dynamicStatus === 'prerequisite_gap') gaps++;
      else if (m.dynamicStatus === 'in_progress') inProgress++;
      else ready++;
    }

    const avgDifficulty = Math.round(totalDifficulty / Math.max(1, nodes.length));
    const masteryPercentage = Math.round((mastered / Math.max(1, nodes.length)) * 100);

    return { mastered, inProgress, gaps, ready, avgDifficulty, masteryPercentage };
  }, [nodes, nodeMetricsMap]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const m = nodeMetricsMap.get(n.id);
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.gateSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.dsaTopic && n.dsaTopic.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDomain = selectedDomain === 'All' || n.domain === selectedDomain;

      let matchesStatus = true;
      if (selectedStatusFilter === 'mastered') matchesStatus = m?.dynamicStatus === 'mastered';
      else if (selectedStatusFilter === 'in_progress') matchesStatus = m?.dynamicStatus === 'in_progress';
      else if (selectedStatusFilter === 'prerequisite_gap') matchesStatus = m?.dynamicStatus === 'prerequisite_gap';
      else if (selectedStatusFilter === 'ready') matchesStatus = m?.dynamicStatus === 'ready';

      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [nodes, searchQuery, selectedDomain, selectedStatusFilter, nodeMetricsMap]);

  const handleUpdateStatus = (nodeId: string, status: GraphNodeStatus) => {
    const updated = nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, status };
      }
      return n;
    });

    saveNodes(updated);
    playNotificationChime(status === 'mastered' ? 'success' : 'beep');
  };

  const handleRemediatePrerequisite = (preId: string) => {
    handleUpdateStatus(preId, 'mastered');
  };

  const handleFocusNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const targetNode = nodeMap.get(nodeId);
    if (targetNode) {
      // Pan to center the selected node in viewport
      setPanOffset({
        x: Math.max(10, 260 - targetNode.position.x),
        y: Math.max(10, 220 - targetNode.position.y)
      });
    }
    playNotificationChime('beep');
  };

  const handleResetGraph = () => {
    if (window.confirm('Reset knowledge graph statuses back to default?')) {
      saveNodes(INITIAL_GRAPH_NODES);
      setSelectedNodeId('math-logic');
      setPanOffset({ x: 20, y: 20 });
      setZoomLevel(1);
    }
  };

  // Drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getDifficultyBadge = (score: number) => {
    if (score >= 80) {
      return { label: 'Advanced', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }
    if (score >= 62) {
      return { label: 'Challenging', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    if (score >= 40) {
      return { label: 'Moderate', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
    }
    return { label: 'Foundational', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-indigo-400" />
              <span>GATE & DSA Prerequisite Dependency Graph</span>
            </h1>
            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-indigo-300">
              Live Real-Time DAG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic node colors and difficulty scores synchronized in real-time with your GATE syllabus progress and DSA practice problems.
          </p>
        </div>

        {/* View Toggle & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-0.5 text-xs">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Interactive Graph</span>
            </button>
            <button
              onClick={() => setViewMode('path')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'path' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Learning Sequence ({topologicalOrder.length})</span>
            </button>
          </div>

          <button
            onClick={handleResetGraph}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-white transition-all"
            title="Reset Graph Progress"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Color Scheme Legend Bar */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-3 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Dynamic Status Legend:</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-medium">
          {/* Green: Mastered */}
          <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-emerald-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-bold">Green: Mastered</span>
            <span className="text-[10px] text-emerald-400/80 font-mono font-normal">({stats.mastered})</span>
          </div>

          {/* Amber: In Progress */}
          <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/40 px-2.5 py-1 rounded-xl text-amber-300">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold">Amber: In Progress</span>
            <span className="text-[10px] text-amber-400/80 font-mono font-normal">({stats.inProgress})</span>
          </div>

          {/* Red: Prerequisite Gaps */}
          <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-500/40 px-2.5 py-1 rounded-xl text-rose-300">
            <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
            <span className="font-bold">Red: Prereq Gap</span>
            <span className="text-[10px] text-rose-400/80 font-mono font-normal">({stats.gaps} blocked)</span>
          </div>

          {/* Cyan: Ready */}
          <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/40 px-2.5 py-1 rounded-xl text-cyan-300">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-bold">Cyan: Ready</span>
            <span className="text-[10px] text-cyan-400/80 font-mono font-normal">({stats.ready})</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-emerald-500/30 bg-[#0c1824] p-3 text-center">
          <span className="text-[11px] text-emerald-400 block font-medium">Mastered Topics</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{stats.mastered}</span>
          <span className="text-[10px] text-slate-400 block">{stats.masteryPercentage}% curriculum verified</span>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-[#161420] p-3 text-center">
          <span className="text-[11px] text-amber-300 block font-medium">In Progress</span>
          <span className="text-2xl font-bold font-mono text-amber-400">{stats.inProgress}</span>
          <span className="text-[10px] text-slate-400 block">Active syllabus & DSA</span>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-[#190d18] p-3 text-center">
          <span className="text-[11px] text-rose-300 block font-medium">Prerequisite Gaps</span>
          <span className="text-2xl font-bold font-mono text-rose-400">{stats.gaps}</span>
          <span className="text-[10px] text-slate-400 block">Bottlenecks needing attention</span>
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-[#0c1224] p-3 text-center">
          <span className="text-[11px] text-indigo-300 block font-medium">Avg Challenge Index</span>
          <span className="text-2xl font-bold font-mono text-indigo-300">{stats.avgDifficulty}/100</span>
          <span className="text-[10px] text-slate-400 block">Weighted real-time score</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0c1224] p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Quick status filter pills */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-900/90 p-1 text-xs gap-1">
            <button
              onClick={() => setSelectedStatusFilter('All')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedStatusFilter === 'All' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({nodes.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('prerequisite_gap')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                selectedStatusFilter === 'prerequisite_gap' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>Gaps ({stats.gaps})</span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('in_progress')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedStatusFilter === 'in_progress' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('mastered')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedStatusFilter === 'mastered' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Mastered ({stats.mastered})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('ready')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedStatusFilter === 'ready' ? 'bg-cyan-600 text-white font-bold' : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              Ready ({stats.ready})
            </button>
          </div>

          {/* Domain Dropdown */}
          <select
            value={selectedDomain}
            onChange={e => setSelectedDomain(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Subject Domains</option>
            <option value="Math & Discrete">Math & Discrete</option>
            <option value="DSA & Java">DSA & Java</option>
            <option value="Systems & OS">Systems & OS</option>
            <option value="Database & Architecture">Database & Architecture</option>
            <option value="Theory & Compilers">Theory & Compilers</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search topic or problem..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* View Mode 1: Interactive Node Canvas */}
      {viewMode === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2 Cols: Canvas View */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#070b16] shadow-2xl relative overflow-hidden flex flex-col h-[650px]">
            {/* Canvas Zoom Controls Bar */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0d1429]/90 backdrop-blur-md p-1 shadow-lg">
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setZoomLevel(1); setPanOffset({ x: 20, y: 20 }); }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Reset View"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Instruction tooltip */}
            <div className="absolute bottom-3 left-3 z-20 rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-1 text-[11px] text-slate-400 backdrop-blur-sm pointer-events-none flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-indigo-400" />
              <span>Red arrows & nodes indicate prerequisite gaps. Click any node to inspect real-time difficulty scores.</span>
            </div>

            {/* Interactive Graph Surface */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            >
              <div
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transformOrigin: '0 0',
                  width: '1650px',
                  height: '840px',
                  position: 'absolute'
                }}
              >
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <marker
                      id="arrow-default"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                    <marker
                      id="arrow-active"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                    </marker>
                    <marker
                      id="arrow-gap"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                    </marker>
                    <marker
                      id="arrow-mastered"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                    <marker
                      id="arrow-in-progress"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                    </marker>
                  </defs>

                  {edges.map(edge => {
                    const src = nodeMap.get(edge.source);
                    const tgt = nodeMap.get(edge.target);
                    if (!src || !tgt) return null;

                    const srcMetrics = nodeMetricsMap.get(edge.source);
                    const tgtMetrics = nodeMetricsMap.get(edge.target);

                    const x1 = src.position.x + 224; // right edge of source card
                    const y1 = src.position.y + 48;  // vertical center
                    const x2 = tgt.position.x;       // left edge of target card
                    const y2 = tgt.position.y + 48;

                    const isHighlight =
                      selectedNodeId === edge.source ||
                      selectedNodeId === edge.target;

                    // Prerequisite gap link: source is NOT mastered, blocking target!
                    const isPrereqGapEdge = srcMetrics?.dynamicStatus !== 'mastered';
                    const isBothMastered = srcMetrics?.dynamicStatus === 'mastered' && tgtMetrics?.dynamicStatus === 'mastered';
                    const isInProgressEdge = srcMetrics?.dynamicStatus === 'mastered' && tgtMetrics?.dynamicStatus === 'in_progress';

                    // Smooth bezier curve
                    const dx = Math.max(50, Math.abs(x2 - x1) * 0.5);
                    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                    let strokeColor = '#475569';
                    let markerEnd = 'url(#arrow-default)';

                    if (isHighlight) {
                      strokeColor = '#818cf8';
                      markerEnd = 'url(#arrow-active)';
                    } else if (isPrereqGapEdge) {
                      strokeColor = '#f43f5e';
                      markerEnd = 'url(#arrow-gap)';
                    } else if (isBothMastered) {
                      strokeColor = '#10b981';
                      markerEnd = 'url(#arrow-mastered)';
                    } else if (isInProgressEdge) {
                      strokeColor = '#f59e0b';
                      markerEnd = 'url(#arrow-in-progress)';
                    }

                    return (
                      <g key={edge.id}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isHighlight ? 2.5 : isPrereqGapEdge ? 2 : 1.5}
                          strokeDasharray={isPrereqGapEdge ? '5 3' : isHighlight ? 'none' : '4 4'}
                          markerEnd={markerEnd}
                          className="transition-all duration-300"
                        />
                        {edge.label && isHighlight && (
                          <text
                            x={(x1 + x2) / 2}
                            y={(y1 + y2) / 2 - 6}
                            fill="#a5b4fc"
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                            className="select-none bg-[#0a0f1d]"
                          >
                            {edge.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes Layer */}
                {nodes.map(node => {
                  const metrics = nodeMetricsMap.get(node.id) || calculateNodeRealtimeMetrics(node, nodes, gateSubjects, dsaProblems);
                  const isSelected = selectedNodeId === node.id;
                  const isPrerequisiteOfSelected = selectedNode?.prerequisites.includes(node.id);
                  const isUnlockedBySelected = downstreamUnlockedIds.includes(node.id);

                  const isFiltered = filteredNodes.some(fn => fn.id === node.id);
                  const diffBadge = getDifficultyBadge(metrics.difficultyScore);

                  // DYNAMIC COLOR CODING:
                  // Mastered = Green, In Progress = Amber, Prerequisite Gap = Red, Ready = Cyan
                  let cardBorderBg = '';
                  let statusBadge = null;

                  if (metrics.dynamicStatus === 'mastered') {
                    cardBorderBg = 'border-emerald-500/80 bg-gradient-to-br from-[#06241a] via-[#091820] to-[#0a1220] ring-1 ring-emerald-500/40 shadow-emerald-950/40';
                    statusBadge = (
                      <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>Mastered</span>
                      </span>
                    );
                  } else if (metrics.dynamicStatus === 'prerequisite_gap') {
                    cardBorderBg = 'border-rose-500/80 bg-gradient-to-br from-[#290a16] via-[#1a0c1a] to-[#0e0c1a] ring-1 ring-rose-500/40 shadow-rose-950/50';
                    statusBadge = (
                      <span className="flex items-center gap-1 rounded-md bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-rose-300 animate-pulse">
                        <AlertTriangle className="h-3 w-3 text-rose-400" />
                        <span>Prereq Gap</span>
                      </span>
                    );
                  } else if (metrics.dynamicStatus === 'in_progress') {
                    cardBorderBg = 'border-amber-500/80 bg-gradient-to-br from-[#261806] via-[#18131d] to-[#0c1224] ring-1 ring-amber-500/30 shadow-amber-950/40';
                    statusBadge = (
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-300">
                        <Clock className="h-3 w-3 text-amber-400" />
                        <span>In Progress</span>
                      </span>
                    );
                  } else {
                    // Ready
                    cardBorderBg = 'border-cyan-500/60 bg-gradient-to-br from-[#081d2c] via-[#0b1626] to-[#0a1020] ring-1 ring-cyan-500/30';
                    statusBadge = (
                      <span className="flex items-center gap-1 rounded-md bg-cyan-500/20 border border-cyan-500/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                        <Unlock className="h-3 w-3 text-cyan-400" />
                        <span>Ready</span>
                      </span>
                    );
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleFocusNode(node.id)}
                      className={`interactive-node absolute w-56 rounded-2xl border p-3 cursor-pointer shadow-lg transition-all duration-200 z-10 ${
                        !isFiltered ? 'opacity-25' : 'opacity-100'
                      } ${cardBorderBg} ${
                        isSelected
                          ? 'ring-2 ring-indigo-400 scale-105 z-30 shadow-2xl shadow-indigo-500/30'
                          : isPrerequisiteOfSelected
                          ? 'ring-2 ring-amber-400/70 z-20'
                          : isUnlockedBySelected
                          ? 'ring-2 ring-cyan-400/70 z-20'
                          : 'hover:scale-[1.02]'
                      }`}
                      style={{
                        left: `${node.position.x}px`,
                        top: `${node.position.y}px`
                      }}
                    >
                      {/* Top Header: Dynamic Status & Difficulty Score */}
                      <div className="flex items-center justify-between mb-1.5 gap-1">
                        {statusBadge}
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold border ${diffBadge.color}`}>
                          Diff: {metrics.difficultyScore}/100
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {node.title}
                      </h3>

                      {/* Progress Bar & Tracker Metrics */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                          <span>Progress</span>
                          <span className="font-bold text-white">{metrics.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              metrics.dynamicStatus === 'mastered'
                                ? 'bg-emerald-400'
                                : metrics.dynamicStatus === 'prerequisite_gap'
                                ? 'bg-rose-500'
                                : metrics.dynamicStatus === 'in_progress'
                                ? 'bg-amber-400'
                                : 'bg-cyan-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, metrics.progressPercent))}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer: Subject & Solved Summary */}
                      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 font-mono">
                        <span className="truncate max-w-[110px]">{node.gateSubject}</span>
                        {metrics.dsaTotalProblems > 0 ? (
                          <span className="text-emerald-300 font-semibold">
                            {metrics.dsaSolvedProblems}/{metrics.dsaTotalProblems} DSA
                          </span>
                        ) : (
                          <span className="text-indigo-300 font-semibold">~{metrics.gateWeightage}m</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 1 Col: Node Detail Inspector Panel */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 shadow-xl flex flex-col justify-between space-y-4">
            {selectedNode && selectedNodeMetrics ? (
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Header */}
                <div className="pb-3 border-b border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">
                      {selectedNode.domain}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border ${
                        selectedNodeMetrics.dynamicStatus === 'mastered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : selectedNodeMetrics.dynamicStatus === 'prerequisite_gap'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : selectedNodeMetrics.dynamicStatus === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}
                    >
                      {selectedNodeMetrics.dynamicStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white leading-tight">
                    {selectedNode.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Subject: {selectedNode.gateSubject} • GATE Weightage: ~{selectedNodeMetrics.gateWeightage} marks
                  </p>
                </div>

                {/* Real-Time Difficulty & Challenge Meter */}
                <div className="rounded-xl border border-slate-800 bg-[#070b16] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Gauge className="h-4 w-4 text-indigo-400" />
                      <span>Live Real-Time Difficulty Score</span>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${getDifficultyBadge(selectedNodeMetrics.difficultyScore).color}`}>
                      {selectedNodeMetrics.difficultyScore}/100 • {selectedNodeMetrics.difficultyLevel}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        selectedNodeMetrics.difficultyScore >= 80
                          ? 'bg-rose-500'
                          : selectedNodeMetrics.difficultyScore >= 62
                          ? 'bg-amber-500'
                          : selectedNodeMetrics.difficultyScore >= 40
                          ? 'bg-indigo-500'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${selectedNodeMetrics.difficultyScore}%` }}
                    />
                  </div>

                  {/* Factor Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <div>
                      <span>GATE Syllabus: </span>
                      <span className="text-white font-semibold">{selectedNodeMetrics.gateSyllabusPercent}% Done</span>
                    </div>
                    <div>
                      <span>DSA Problems: </span>
                      <span className="text-white font-semibold">
                        {selectedNodeMetrics.dsaSolvedProblems}/{selectedNodeMetrics.dsaTotalProblems} Solved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prerequisite Gap Alert (Red Banner) */}
                {selectedNodeMetrics.hasPrerequisiteGap && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                      <span>Prerequisite Gap Detected!</span>
                    </div>
                    <p className="text-[11px] text-rose-200/90 leading-relaxed">
                      This topic cannot be mastered effectively until its prerequisite foundations are completed. Missing parent concepts:
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {selectedNodeMetrics.missingPrerequisites.map(pre => (
                        <div
                          key={pre.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-rose-900/40 border border-rose-500/30 text-xs"
                        >
                          <span className="font-semibold text-rose-200 truncate max-w-[160px]">{pre.title}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleFocusNode(pre.id)}
                              className="px-2 py-0.5 text-[10px] font-semibold bg-rose-600/40 hover:bg-rose-600/70 text-rose-100 rounded-md transition-all"
                            >
                              Jump to Node
                            </button>
                            <button
                              onClick={() => handleRemediatePrerequisite(pre.id)}
                              className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-600/40 hover:bg-emerald-600/70 text-emerald-200 rounded-md transition-all"
                              title="Mark prerequisite mastered to unblock"
                            >
                              Mark Done ✓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1">Concept Summary</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    {selectedNode.summary}
                  </p>
                </div>

                {/* Core Topics Tested */}
                {selectedNode.keyConcepts.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                      Core Topics Tested in GATE / Placement Interviews
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.keyConcepts.map(c => (
                        <span key={c} className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites Required */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-400" />
                    <span>Prerequisites Required First</span>
                  </span>
                  {selectedNode.prerequisites.length === 0 ? (
                    <span className="text-xs text-emerald-400 font-mono">
                      ✓ Foundation topic — No prior prerequisites required!
                    </span>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedNode.prerequisites.map(preId => {
                        const preNode = nodeMap.get(preId);
                        if (!preNode) return null;
                        const isDone = preNode.status === 'mastered';
                        return (
                          <div
                            key={preId}
                            onClick={() => handleFocusNode(preId)}
                            className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                              isDone
                                ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                                : 'border-rose-500/40 bg-rose-950/20 text-rose-300 hover:border-rose-400'
                            }`}
                          >
                            <span className="truncate max-w-[170px] font-medium">{preNode.title}</span>
                            <span className="text-[10px] font-mono">
                              {isDone ? '✓ Mastered' : 'Missing Gap'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* What This Node Unlocks */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Unlock className="h-3 w-3 text-cyan-400" />
                    <span>Directly Unlocks (Downstream Topics)</span>
                  </span>
                  {downstreamUnlockedIds.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Apex topic in curriculum sequence</span>
                  ) : (
                    <div className="space-y-1.5">
                      {downstreamUnlockedIds.map(downId => {
                        const downNode = nodeMap.get(downId);
                        if (!downNode) return null;
                        return (
                          <div
                            key={downId}
                            onClick={() => handleFocusNode(downId)}
                            className="flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-300 hover:border-indigo-500/40 cursor-pointer transition-all"
                          >
                            <span className="truncate max-w-[170px] font-medium">{downNode.title}</span>
                            <ArrowRight className="h-3 w-3 text-indigo-400" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Linked DSA Problems Tracker Integration */}
                {selectedNode.linkedDSAProblems.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <Code2 className="h-3 w-3 text-emerald-400" />
                        <span>Linked DSA Practice Problems ({selectedNodeMetrics.dsaSolvedProblems}/{selectedNodeMetrics.dsaTotalProblems})</span>
                      </span>
                      <button
                        onClick={() => onNavigateTab('dsa')}
                        className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>DSA Hub</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {selectedNode.linkedDSAProblems.map(prob => (
                        <div
                          key={prob}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300"
                        >
                          <span className="truncate max-w-[180px]">{prob}</span>
                          <button
                            onClick={() => onNavigateTab('dsa')}
                            className="text-[10px] text-indigo-300 font-medium hover:text-white"
                          >
                            Practice
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">
                Select any node on the graph to inspect real-time difficulty scores & prerequisites.
              </div>
            )}

            {/* Quick Status Action Controls */}
            {selectedNode && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">
                  Override Mastery Status:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(selectedNode.id, 'unlocked')}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedNode.status === 'unlocked'
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Ready
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedNode.id, 'in_progress')}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedNode.status === 'in_progress'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedNode.id, 'mastered')}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedNode.status === 'mastered'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Mastered ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode 2: Linear Recommended Learning Sequence (Topological Sort) */}
      {viewMode === 'path' && (
        <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-indigo-400" />
                <span>Recommended Topological Study Sequence</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated dynamically from prerequisite dependency arrows. Follow this linear order to never hit an unexplained concept.
              </p>
            </div>
            <span className="rounded bg-indigo-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-indigo-300 self-start sm:self-auto">
              22 Sequenced Milestones
            </span>
          </div>

          <div className="space-y-2.5">
            {topologicalOrder.map((node, index) => {
              const metrics = nodeMetricsMap.get(node.id) || calculateNodeRealtimeMetrics(node, nodes, gateSubjects, dsaProblems);
              const diffBadge = getDifficultyBadge(metrics.difficultyScore);

              return (
                <div
                  key={node.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                    metrics.dynamicStatus === 'mastered'
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : metrics.dynamicStatus === 'prerequisite_gap'
                      ? 'border-rose-500/40 bg-rose-950/20'
                      : metrics.dynamicStatus === 'in_progress'
                      ? 'border-amber-500/40 bg-amber-950/20'
                      : 'border-cyan-500/30 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold bg-slate-800 text-slate-300">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold ${metrics.dynamicStatus === 'mastered' ? 'line-through text-slate-400' : 'text-white'}`}>
                          {node.title}
                        </h3>
                        <span className="rounded px-1.5 py-0.2 text-[9px] font-mono uppercase bg-slate-800 text-slate-400">
                          {node.domain}
                        </span>
                        <span className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-semibold border ${diffBadge.color}`}>
                          Diff: {metrics.difficultyScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {node.gateSubject} {metrics.gateWeightage && `• ~${metrics.gateWeightage} Marks`} • {node.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {metrics.dynamicStatus === 'prerequisite_gap' && (
                      <span className="text-[10px] font-mono text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Prereq Gap</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(node.id, metrics.dynamicStatus === 'mastered' ? 'unlocked' : 'mastered')}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        metrics.dynamicStatus === 'mastered'
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{metrics.dynamicStatus === 'mastered' ? 'Completed' : 'Mark Mastered'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
