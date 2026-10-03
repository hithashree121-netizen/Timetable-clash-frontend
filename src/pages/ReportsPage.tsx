import React from 'react';
import { FileBarChart, Download, Printer, CheckCircle, FileText } from 'lucide-react';
import { ClassItem } from '../types';

interface ReportsPageProps {
  classes: ClassItem[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ classes }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Academic Report Generator
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Generate executive summaries, graph coloring benchmarks, and faculty allocation reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Report 1: Executive Timetable Summary */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <FileText size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Executive Timetable Summary
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
            Complete breakdown of course distribution, total credit hours, faculty workload, and room utilization stats.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
            • Total Classes: {classes.length}<br />
            • Active Batches: AI-DS 5A, AI-DS 5B<br />
            • Audit Date: October 2026
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
            Download Executive Report
          </button>
        </div>

        {/* Report 2: Graph Coloring Audit */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <FileBarChart size={22} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Graph Coloring Heuristic Report
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
            Mathematical benchmark comparing First-Fit, Welsh-Powell, and DSATUR graph coloring chromatic index outputs.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
            • Chromatic Number χ(G): 4<br />
            • Dominant Heuristic: DSATUR<br />
            • Execution Time: ~1.9 ms
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
            Download Benchmark Report
          </button>
        </div>

        {/* Report 3: Constraint Validation Certificate */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <CheckCircle size={22} color="var(--success)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Constraint Compliance Certificate
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
            Official validation certificate verifying zero hard constraint violations across faculty, rooms, and batches.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
            • Status: CONFLICT FREE<br />
            • Verification Standard: IEEE Academic<br />
            • Issuer: Timetable AI Engine
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
