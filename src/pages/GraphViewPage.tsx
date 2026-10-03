import React, { useState } from 'react';
import { ClassItem, GraphNode } from '../types';
import { InteractiveGraph } from '../components/InteractiveGraph';
import { buildConflictGraph } from '../utils/graphColoringEngine';

interface GraphViewPageProps {
  classes: ClassItem[];
}

export const GraphViewPage: React.FC<GraphViewPageProps> = ({ classes }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { nodes, edges } = buildConflictGraph(classes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-purple">GRAPH COLORING MATHEMATICAL MODEL</span>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Conflict Graph Topology Visualizer
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Interactive graph representation where vertices (nodes) denote academic classes and undirected edges connect mutually conflicting schedule instances. Node color denotes the chromatic time slot assignment.
        </p>
      </div>

      <InteractiveGraph
        nodes={nodes}
        edges={edges}
        onSelectNode={setSelectedNode}
        selectedNodeId={selectedNode?.id}
      />
    </div>
  );
};
