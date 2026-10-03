import React, { useState } from 'react';
import { ConflictItem, ClassItem } from '../types';
import { AlertTriangle, Play, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { conflictApi } from '../api/conflictApi';

interface ConflictsPageProps {
  conflicts: ConflictItem[];
  classes: ClassItem[];
  onUpdateConflicts: (newConflicts: ConflictItem[]) => void;
}

export const ConflictsPage: React.FC<ConflictsPageProps> = ({
  conflicts,
  classes,
  onUpdateConflicts
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const steps = [
    'Building conflict graph...',
    'Analyzing faculty & room constraints...',
    'Detecting student group overlaps...',
    'Validation complete.'
  ];

  const handleRunDetection = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 600));
    }

    const res = await conflictApi.detectConflicts(classes);
    onUpdateConflicts(res.data);
    setIsAnalyzing(false);
  };

  const totalConflicts = conflicts.length;
  const criticalCount = conflicts.filter(c => c.severity === 'Critical').length;
  const warningCount = conflicts.filter(c => c.severity === 'Warning').length;
  const resolvedCount = conflicts.filter(c => c.status === 'Resolved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(239, 68, 68, 0.12) 100%)',
          borderLeft: '4px solid var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-danger">REAL-TIME CONSTRAINT AUDIT</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>• Conflict Graph Engine</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Timetable Clash Detection
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', maxWidth: '680px' }}>
            Identify overlapping time slots between subjects, double-booked faculty instructors, room capacity constraints, and student group schedule clashes.
          </p>
        </div>

        <button onClick={handleRunDetection} disabled={isAnalyzing} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
          {isAnalyzing ? <RefreshCw className="pulse-glow" size={16} /> : <Play size={16} />}
          {isAnalyzing ? 'Analyzing Graph...' : 'Run Conflict Detection'}
        </button>
      </div>

      {/* Step Progress Bar during Analysis */}
      {isAnalyzing && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.5rem' }}>
            {steps[analysisStep]}
          </div>
          <div style={{ height: '6px', background: 'rgba(37, 48, 74, 0.5)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((analysisStep + 1) / steps.length) * 100}%`, background: 'var(--warning)', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* KPI Cards Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL CONFLICTS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>{totalConflicts}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--danger)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>CRITICAL CLASHES</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>{criticalCount}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--warning)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>WARNINGS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>{warningCount}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--success)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>RESOLVED</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>{resolvedCount}</div>
        </div>
      </div>

      {/* Conflicts Data Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>CONFLICT ID</th>
              <th>TYPE</th>
              <th>SUBJECT 1</th>
              <th>SUBJECT 2</th>
              <th>RELATED RESOURCE</th>
              <th>TIME SLOT</th>
              <th>SEVERITY</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--success)', fontWeight: 700 }}>
                  <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem auto' }} />
                  Zero Conflicts Detected! Your Timetable is 100% Conflict-Free.
                </td>
              </tr>
            ) : (
              conflicts.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--danger)' }}>{c.id}</td>
                  <td style={{ fontWeight: 700 }}>{c.type}</td>
                  <td style={{ color: 'var(--text-main)', fontSize: '0.8rem' }}>{c.subject1}</td>
                  <td style={{ color: 'var(--text-main)', fontSize: '0.8rem' }}>{c.subject2}</td>
                  <td><span className="badge badge-purple">{c.relatedResource}</span></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.timeSlot}</td>
                  <td>
                    <span className={c.severity === 'Critical' ? 'badge badge-danger' : 'badge badge-warning'}>
                      {c.severity}
                    </span>
                  </td>
                  <td>
                    <span className={c.status === 'Resolved' ? 'badge badge-success' : 'badge badge-danger'}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
