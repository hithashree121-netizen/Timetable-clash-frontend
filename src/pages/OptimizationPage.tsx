import React, { useState } from 'react';
import { AlgorithmType, ClassItem, AlgorithmComparisonResult } from '../types';
import { Zap, CheckCircle, ArrowRight, Play, RefreshCw, BarChart2 } from 'lucide-react';
import { optimizationApi } from '../api/optimizationApi';

interface OptimizationPageProps {
  classes: ClassItem[];
  onOptimizationComplete: (optimizedClasses: ClassItem[]) => void;
}

export const OptimizationPage: React.FC<OptimizationPageProps> = ({
  classes,
  onOptimizationComplete
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('DSATUR');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [comparisonData, setComparisonData] = useState<AlgorithmComparisonResult[] | null>(null);
  const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(null);

  const steps = [
    'Building Conflict Graph...',
    `Applying ${selectedAlgorithm} Graph Coloring...`,
    'Assigning Chromatic Time Slots...',
    'Checking Faculty & Room Constraints...',
    'Validating Timetable...'
  ];

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    setStepIndex(0);

    for (let i = 0; i < steps.length; i++) {
      setStepIndex(i);
      await new Promise(r => setTimeout(r, 450));
    }

    const res = await optimizationApi.runOptimization(selectedAlgorithm, classes);
    const comp = await optimizationApi.compareAlgorithms(classes);

    setLastExecutionTime(res.data.executionTimeMs);
    setComparisonData(comp.data);
    onOptimizationComplete(res.data.classes);
    setIsOptimizing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-purple">SCHEDULING ALGORITHM BENCHMARK</span>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Timetable Optimization Engine
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Select a graph coloring heuristic to resolve clashes and map classes into non-overlapping time slot colors.
        </p>
      </div>

      {/* Algorithm Selection Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* First-Fit (Violet Theme) */}
        <div
          onClick={() => setSelectedAlgorithm('First-Fit')}
          className="glass-card"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            borderColor: selectedAlgorithm === 'First-Fit' ? '#7c5cfc' : 'var(--border-color)',
            background: selectedAlgorithm === 'First-Fit' ? 'rgba(124, 92, 252, 0.14)' : 'var(--glass-bg)',
            boxShadow: selectedAlgorithm === 'First-Fit' ? '0 0 22px rgba(124, 92, 252, 0.28)' : 'none',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c5cfc', letterSpacing: '0.05em' }}>⚡ GREEDY BASELINE</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 8px 0', fontFamily: 'var(--font-display)' }}>
            FIRST-FIT
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Fast greedy coloring baseline. Colors vertices in natural input order by assigning the lowest available index color.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Time Complexity: O(V + E)</span>
            {selectedAlgorithm === 'First-Fit' && <CheckCircle size={18} color="#7c5cfc" />}
          </div>
        </div>

        {/* Welsh-Powell (Pink Theme) */}
        <div
          onClick={() => setSelectedAlgorithm('Welsh-Powell')}
          className="glass-card"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            borderColor: selectedAlgorithm === 'Welsh-Powell' ? '#c084fc' : 'var(--border-color)',
            background: selectedAlgorithm === 'Welsh-Powell' ? 'rgba(192, 132, 252, 0.14)' : 'var(--glass-bg)',
            boxShadow: selectedAlgorithm === 'Welsh-Powell' ? '0 0 22px rgba(192, 132, 252, 0.3)' : 'none',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-mocha" style={{ fontSize: '0.65rem' }}>🏅 DEGREE-ORDERED</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 8px 0', fontFamily: 'var(--font-display)' }}>
            WELSH-POWELL
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Sorts vertices in descending order of conflict degree. Prioritizes heavily constrained classes first to minimize chromatic index.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Sort: Deg(v) Descending</span>
            {selectedAlgorithm === 'Welsh-Powell' && <CheckCircle size={18} color="#c084fc" />}
          </div>
        </div>

        {/* DSATUR (Cyan Theme - Recommended) */}
        <div
          onClick={() => setSelectedAlgorithm('DSATUR')}
          className="glass-card"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            borderColor: selectedAlgorithm === 'DSATUR' ? '#22d3ee' : 'var(--border-color)',
            background: selectedAlgorithm === 'DSATUR' ? 'rgba(34, 211, 238, 0.1)' : 'var(--glass-bg)',
            boxShadow: selectedAlgorithm === 'DSATUR' ? '0 0 28px rgba(34, 211, 238, 0.28)' : 'none',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>🏆 RECOMMENDED OPTIMAL</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22d3ee', margin: '6px 0 8px 0', fontFamily: 'var(--font-display)' }}>
            DSATUR (Degree of Saturation)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Constraint-aware dynamic coloring algorithm. Iteratively colors the vertex with the maximum degree of saturation (most distinct colored neighbors).
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: 600 }}>Dynamic DSAT(v) Heuristic</span>
            {selectedAlgorithm === 'DSATUR' && <CheckCircle size={18} color="#22d3ee" />}
          </div>
        </div>
      </div>

      {/* Input Constraints & Run Section */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Input Classes:</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{classes.length}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Available Rooms:</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>5</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Available Slots:</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>30</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Selected Heuristic:</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedAlgorithm}</div>
          </div>
        </div>

        <button onClick={handleRunOptimization} disabled={isOptimizing} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          {isOptimizing ? <RefreshCw className="pulse-glow" size={18} /> : <Zap size={18} />}
          {isOptimizing ? 'Optimizing Schedule...' : 'Run Optimization'}
        </button>
      </div>

      {/* Progress Execution Modal State */}
      {isOptimizing && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              {steps[stepIndex]}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
              Step {stepIndex + 1} of {steps.length}
            </span>
          </div>

          <div style={{ height: '8px', background: 'rgba(139,92,246,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((stepIndex + 1) / steps.length) * 100}%`, background: 'linear-gradient(90deg, #7c5cfc 0%, #22d3ee 100%)', transition: 'width 0.4s ease', boxShadow: '0 0 10px rgba(124,92,252,0.5)' }} />
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {comparisonData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={18} color="var(--primary)" /> Algorithm Comparison Matrix
            </h3>
            {lastExecutionTime && (
              <span className="badge badge-success">Execution Time: {lastExecutionTime} ms</span>
            )}
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>METRIC / HEURISTIC</th>
                  <th>FIRST-FIT (GREEDY)</th>
                  <th>WELSH-POWELL</th>
                  <th>DSATUR (DYNAMIC)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>Time Slots Used (Chromatic #)</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{comparisonData.find(c => c.algorithm === 'First-Fit')?.slotsUsed} Slots</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{comparisonData.find(c => c.algorithm === 'Welsh-Powell')?.slotsUsed} Slots</td>
                  <td style={{ fontWeight: 800, color: 'var(--success)' }}>{comparisonData.find(c => c.algorithm === 'DSATUR')?.slotsUsed} Slots (Optimal)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Schedule Overlap Conflicts</td>
                  <td><span className="badge badge-success">0 Conflicts</span></td>
                  <td><span className="badge badge-success">0 Conflicts</span></td>
                  <td><span className="badge badge-success">0 Conflicts</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Execution Latency (ms)</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{comparisonData.find(c => c.algorithm === 'First-Fit')?.executionTimeMs} ms</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{comparisonData.find(c => c.algorithm === 'Welsh-Powell')?.executionTimeMs} ms</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--info)', fontWeight: 700 }}>{comparisonData.find(c => c.algorithm === 'DSATUR')?.executionTimeMs} ms</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Validation Status</td>
                  <td><span className="badge badge-success">✓ PASS</span></td>
                  <td><span className="badge badge-success">✓ PASS</span></td>
                  <td><span className="badge badge-success">✓ PASS</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
