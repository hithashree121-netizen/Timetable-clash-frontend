import React, { useState } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Search, Info, ShieldAlert } from 'lucide-react';
import { getColorForSlot } from '../utils/graphColoringEngine';

interface InteractiveGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode?: (node: GraphNode | null) => void;
  selectedNodeId?: string | null;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeNode = nodes.find(n => n.id === selectedNodeId) || selectedNode;

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));
  const handleReset = () => {
    setZoom(1);
    setSelectedNode(null);
    if (onSelectNode) onSelectNode(null);
  };

  const filteredNodes = nodes.filter(
    n => n.label.toLowerCase().includes(searchTerm.toLowerCase()) || n.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: activeNode ? '1fr 320px' : '1fr', gap: '1.25rem', height: '600px' }}>
      {/* Graph Visualizer Canvas Card */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: '#070a13'
        }}
      >
        {/* Controls Overlay Bar */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none'
          }}
        >
          {/* Search Node */}
          <div style={{ pointerEvents: 'auto', position: 'relative', width: '220px' }}>
            <Search size={14} color="var(--text-subtle)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search graph node..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2rem', fontSize: '0.75rem', height: '32px', background: 'rgba(17, 24, 39, 0.9)' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: '6px', background: 'rgba(17, 24, 39, 0.9)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button onClick={handleZoomIn} className="btn btn-secondary btn-sm" title="Zoom In"><ZoomIn size={14} /></button>
            <button onClick={handleZoomOut} className="btn btn-secondary btn-sm" title="Zoom Out"><ZoomOut size={14} /></button>
            <button onClick={handleReset} className="btn btn-secondary btn-sm" title="Reset View"><RotateCcw size={14} /></button>
          </div>
        </div>

        {/* SVG Graph Canvas */}
        <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden', cursor: 'grab' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 700 500"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
          >
            <defs>
              <radialGradient id="gridGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Background Grid Lines */}
            <rect width="100%" height="100%" fill="url(#gridGlow)" />
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37, 48, 74, 0.2)" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges (Conflict Relationships) */}
            {edges.map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted = activeNode && (activeNode.id === sourceNode.id || activeNode.id === targetNode.id);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x || 100}
                    y1={sourceNode.y || 100}
                    x2={targetNode.x || 200}
                    y2={targetNode.y || 200}
                    stroke={isHighlighted ? '#EF4444' : 'rgba(148, 163, 184, 0.25)'}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={isHighlighted ? 'none' : '4 4'}
                  />
                </g>
              );
            })}

            {/* Nodes (Class / Subject Vertices) */}
            {filteredNodes.map((node, i) => {
              const isSelected = activeNode?.id === node.id;
              const nodeColor = getColorForSlot(node.colorIndex >= 0 ? node.colorIndex : i);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 150}, ${node.y || 150})`}
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer Glow Ring */}
                  {isSelected && (
                    <circle r="36" fill="none" stroke={nodeColor} strokeWidth="2" strokeDasharray="6 3" className="pulse-glow" />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="28"
                    fill="#111827"
                    stroke={isSelected ? '#ffffff' : nodeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    filter="drop-shadow(0 4px 12px rgba(0,0,0,0.6))"
                  />

                  {/* Degree Badge */}
                  <circle cx="20" cy="-20" r="10" fill="#EF4444" />
                  <text x="20" y="-16" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">
                    {node.degree}
                  </text>

                  {/* Subject Code Text */}
                  <text x="0" y="4" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="800" fontFamily="var(--font-mono)">
                    {node.code.replace('21', '')}
                  </text>

                  {/* Label Text below node */}
                  <text x="0" y="42" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="700">
                    {node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            background: 'rgba(17, 24, 39, 0.85)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            gap: '12px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
            Node = Class
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '2px', background: 'var(--danger)' }} />
            Edge = Conflict
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#22C55E' }} />
            Color = Slot
          </span>
        </div>
      </div>

      {/* Right Side Inspector Panel */}
      {activeNode && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <span className="badge badge-purple">NODE INSPECTOR</span>
            <button onClick={() => setSelectedNode(null)} className="btn btn-secondary btn-sm">Close</button>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {activeNode.label}
          </h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '1.25rem' }}>
            {activeNode.code}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border-color', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Faculty:</span>
              <strong style={{ color: 'var(--text-main)' }}>{activeNode.faculty}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border-color', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Student Batch:</span>
              <strong style={{ color: 'var(--text-main)' }}>{activeNode.batch}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border-color', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Room:</span>
              <strong style={{ color: 'var(--text-main)' }}>{activeNode.room}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border-color', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vertex Degree:</span>
              <span className="badge badge-danger">{activeNode.degree} Conflicts</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border-color', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Slot:</span>
              <strong style={{ color: 'var(--success)' }}>
                {activeNode.timeSlotAssigned || 'Color Slot #' + (activeNode.colorIndex + 1)}
              </strong>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
              Graph Coloring Status:
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
              ✓ Color Chromatic Number Assigned
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
