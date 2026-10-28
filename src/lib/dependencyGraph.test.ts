import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_EDGES,
  evaluatePrerequisitesMet,
  computeNodeUnlocks,
  getTopologicalLearningPath,
  detectCycles,
  calculateNodeRealtimeMetrics
} from './dependencyGraph';
import { DependencyGraphNode, GATESubject, DSAProblem } from '../types';

test('curriculum dependency graph has zero circular cycles (valid DAG)', () => {
  const hasCycle = detectCycles(INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES);
  assert.equal(hasCycle, false, 'Dependency graph must be a strict DAG without cycles');
});

test('evaluatePrerequisitesMet handles empty prerequisites', () => {
  const rootNode = INITIAL_GRAPH_NODES.find(n => n.id === 'math-logic')!;
  const isMet = evaluatePrerequisitesMet(rootNode, INITIAL_GRAPH_NODES);
  assert.equal(isMet, true, 'Nodes without prerequisites are always met');
});

test('evaluatePrerequisitesMet verifies parent completion status', () => {
  const sampleNodes: DependencyGraphNode[] = [
    {
      id: 'parent-1',
      title: 'Parent Concept',
      domain: 'Math & Discrete',
      gateSubject: 'Math',
      summary: 'Parent',
      keyConcepts: [],
      linkedDSAProblems: [],
      prerequisites: [],
      status: 'mastered',
      position: { x: 0, y: 0 }
    },
    {
      id: 'parent-2',
      title: 'Parent Concept 2',
      domain: 'Math & Discrete',
      gateSubject: 'Math',
      summary: 'Parent 2',
      keyConcepts: [],
      linkedDSAProblems: [],
      prerequisites: [],
      status: 'in_progress',
      position: { x: 0, y: 0 }
    },
    {
      id: 'child',
      title: 'Child Concept',
      domain: 'DSA & Java',
      gateSubject: 'Algorithms',
      summary: 'Child',
      keyConcepts: [],
      linkedDSAProblems: [],
      prerequisites: ['parent-1', 'parent-2'],
      status: 'locked',
      position: { x: 100, y: 100 }
    }
  ];

  const child = sampleNodes.find(n => n.id === 'child')!;
  assert.equal(evaluatePrerequisitesMet(child, sampleNodes), false);

  // If both parents are mastered
  sampleNodes[1].status = 'mastered';
  assert.equal(evaluatePrerequisitesMet(child, sampleNodes), true);
});

test('computeNodeUnlocks lists target dependent nodes', () => {
  const unlocks = computeNodeUnlocks('math-logic', INITIAL_GRAPH_EDGES);
  assert.ok(unlocks.includes('sys-digital'), 'Logic must unlock Digital Logic');
  assert.ok(unlocks.includes('theory-toc'), 'Logic must unlock Theory of Computation');
});

test('getTopologicalLearningPath generates valid prerequisite order', () => {
  const path = getTopologicalLearningPath(INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES);
  assert.equal(path.length, INITIAL_GRAPH_NODES.length);

  // Discrete logic must appear before digital logic
  const logicIndex = path.findIndex(n => n.id === 'math-logic');
  const digitalIndex = path.findIndex(n => n.id === 'sys-digital');
  assert.ok(logicIndex < digitalIndex, 'Propositional logic must precede Digital Logic');

  // Linear data structures must precede trees
  const linearIndex = path.findIndex(n => n.id === 'dsa-linear');
  const treeIndex = path.findIndex(n => n.id === 'dsa-trees');
  assert.ok(linearIndex < treeIndex, 'Linear data structures must precede Trees');
});

test('calculateNodeRealtimeMetrics marks node with unmet prerequisites as prerequisite_gap', () => {
  // sys-coa requires sys-digital. In INITIAL_GRAPH_NODES, sys-digital is unlocked (not mastered).
  const coaNode = INITIAL_GRAPH_NODES.find(n => n.id === 'sys-coa')!;
  const metrics = calculateNodeRealtimeMetrics(coaNode, INITIAL_GRAPH_NODES, [], []);
  
  assert.equal(metrics.hasPrerequisiteGap, true, 'COA should have prerequisite gap because sys-digital is not mastered');
  assert.equal(metrics.dynamicStatus, 'prerequisite_gap', 'Status should be prerequisite_gap');
  assert.ok(metrics.missingPrerequisites.some(p => p.id === 'sys-digital'));
  assert.ok(metrics.difficultyScore >= 60, 'Blocked nodes incur prerequisite difficulty penalty');
});

test('calculateNodeRealtimeMetrics sets dynamicStatus to ready when prerequisites are satisfied', () => {
  // Let's create a scenario where sys-digital is mastered
  const mockNodes: DependencyGraphNode[] = INITIAL_GRAPH_NODES.map(n => 
    n.id === 'sys-digital' ? { ...n, status: 'mastered' } : n
  );
  const coaNode = mockNodes.find(n => n.id === 'sys-coa')!;
  const metrics = calculateNodeRealtimeMetrics(coaNode, mockNodes, [], []);
  
  assert.equal(metrics.hasPrerequisiteGap, false, 'COA prerequisites should now be satisfied');
  assert.equal(metrics.dynamicStatus, 'ready', 'COA should now be ready to learn');
});

test('calculateNodeRealtimeMetrics dynamically reduces difficulty score when DSA problems are solved', () => {
  const linearNode = INITIAL_GRAPH_NODES.find(n => n.id === 'dsa-linear')!;
  
  // Unattempted state
  const unsolvedDSA: DSAProblem[] = [
    { id: '1', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', platform: 'LeetCode', status: 'Not Started', attempts: 0, timeSpentMinutes: 0, hintsUsed: false, revisionStage: 0 },
    { id: '2', title: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', platform: 'LeetCode', status: 'Not Started', attempts: 0, timeSpentMinutes: 0, hintsUsed: false, revisionStage: 0 }
  ];
  const initialMetrics = calculateNodeRealtimeMetrics(linearNode, INITIAL_GRAPH_NODES, [], unsolvedDSA);

  // Solved state
  const solvedDSA: DSAProblem[] = [
    { id: '1', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', platform: 'LeetCode', status: 'Solved', attempts: 1, timeSpentMinutes: 20, hintsUsed: false, revisionStage: 2 },
    { id: '2', title: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', platform: 'LeetCode', status: 'Solved', attempts: 2, timeSpentMinutes: 40, hintsUsed: false, revisionStage: 1 }
  ];
  const solvedMetrics = calculateNodeRealtimeMetrics(linearNode, INITIAL_GRAPH_NODES, [], solvedDSA);

  assert.ok(
    solvedMetrics.difficultyScore < initialMetrics.difficultyScore,
    `Solved difficulty (${solvedMetrics.difficultyScore}) should be lower than initial difficulty (${initialMetrics.difficultyScore})`
  );
  assert.equal(solvedMetrics.dsaSolvedProblems, 2);
  assert.equal(solvedMetrics.dsaSolvedRate, 100);
});

test('calculateNodeRealtimeMetrics reflects GATE syllabus percent and weak topics', () => {
  const dbmsNode = INITIAL_GRAPH_NODES.find(n => n.id === 'dbms-relational')!;
  const gateSubjects: GATESubject[] = [
    {
      id: 'subj-dbms',
      name: 'Databases (DBMS)',
      shortCode: 'DBMS',
      weightageEstimated: 7,
      status: 'learning',
      syllabusPercent: 60,
      lecturesDone: true,
      notesReady: true,
      pyqsAttempted: 20,
      pyqAccuracy: 40, // low accuracy
      weakTopics: ['Relational Calculus'],
      topics: []
    }
  ];

  const metrics = calculateNodeRealtimeMetrics(dbmsNode, INITIAL_GRAPH_NODES, gateSubjects, []);
  assert.equal(metrics.gateSyllabusPercent, 60);
  assert.equal(metrics.hasGateWeakness, true);
  assert.ok(metrics.gateWeakTopics.includes('Relational Calculus'));
});

