import React from 'react';
import { KPICard } from '../components/KPICard';
import { ConflictChart } from '../components/ConflictChart';
import { AlgorithmChart } from '../components/AlgorithmChart';
import { ChromeGlassSphere } from '../components/ChromeGlassSphere';
import {
  BookOpen, Users, Building2, Clock,
  AlertTriangle, Zap, Activity, ArrowRight,
  Sparkles, GitGraph, Star, TrendingUp
} from 'lucide-react';
import { ClassItem, ConflictItem } from '../types';

interface DashboardPageProps {
  classes: ClassItem[];
  conflicts: ConflictItem[];
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ classes, conflicts, onNavigate }) => {
  const unresolvedConflicts = conflicts.filter(c => c.status === 'Unresolved').length;
  const totalConflicts = conflicts.length || 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── HERO BANNER ── */}
      <div className="dashboard-hero-wrapper">
        {/* Background cosmic radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 65% 85% at 75% 50%, rgba(0, 240, 255, 0.12) 0%, rgba(124, 92, 252, 0.15) 35%, rgba(236, 72, 153, 0.08) 60%, transparent 80%)',
          pointerEvents: 'none'
        }} />

        {/* Left Content */}
        <div className="hero-content-left">
          <div style={{
            fontSize: '0.72rem', fontWeight: 800,
            color: '#00f0ff', letterSpacing: '0.15em',
            marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem'
          }}>
            <div style={{ width: '28px', height: '2px', background: 'linear-gradient(90deg, #ec4899, #00f0ff)' }} />
            SMARTER SCHEDULING • GRAPH AI
          </div>

          <h2 style={{
            fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-main)', letterSpacing: '-0.03em',
            marginBottom: '0.25rem',
            textShadow: '0 2px 20px rgba(0, 240, 255, 0.2)'
          }}>
            Timetable Conflicts,
          </h2>
          <h2 style={{
            fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1,
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(90deg, #ec4899 0%, #9d7ffc 40%, #00f0ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            marginBottom: '1.1rem'
          }}>
            Smarter Solutions.
          </h2>

          <p style={{
            fontSize: '0.875rem', color: '#94a3b8',
            maxWidth: '500px', lineHeight: 1.65, marginBottom: '1.75rem'
          }}>
            Detect conflicts, optimize time-slot allocation, and generate constraint-free academic
            schedules using advanced graph coloring heuristics and chromatic polynomial analysis.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('optimization')}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                background: 'linear-gradient(135deg, rgba(236,72,153,0.35) 0%, rgba(124,92,252,0.4) 50%, rgba(0,240,255,0.25) 100%)',
                border: '1px solid rgba(0, 240, 255, 0.6)',
                color: '#ffffff',
                boxShadow: '0 0 24px rgba(124,92,252,0.45), 0 0 15px rgba(0,240,255,0.3)',
                letterSpacing: '0.02em'
              }}
            >
              <Sparkles size={16} />
              Run Optimization →
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className="btn btn-secondary"
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                background: 'rgba(0, 240, 255, 0.06)'
              }}
            >
              <GitGraph size={16} color="#00f0ff" />
              View Graph View
            </button>
          </div>
        </div>

        {/* Right: Cosmic orbital decoration with Chrome Glassy rotating ball */}
        <div className="hero-sphere-right">
          <ChromeGlassSphere size={270} />

          {/* ANALYZE / OPTIMIZE / SCHEDULE vertical text */}
          <div style={{
            position: 'absolute', right: '1.5rem',
            top: '50%', transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end',
            pointerEvents: 'none'
          }}>
            {['ANALYZE', 'OPTIMIZE', 'SCHEDULE'].map(word => (
              <span key={word} style={{
                fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.18em',
                color: 'rgba(148, 163, 184, 0.6)'
              }}>
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="dashboard-kpi-grid">
        <KPICard
          title="TOTAL CLASSES"
          value={classes.length || 11}
          subtitle="Registered Subjects"
          icon={BookOpen}
          color="#7c5cfc"
          trend={{ text: '8 Batches', type: 'neutral' }}
        />
        <KPICard
          title="TOTAL FACULTY"
          value="18"
          subtitle="Assigned Instructors"
          icon={Users}
          color="#00f0ff"
          trend={{ text: 'Full Time', type: 'positive' }}
        />
        <KPICard
          title="TOTAL ROOMS"
          value="12"
          subtitle="Lecture Halls & Labs"
          icon={Building2}
          color="#ec4899"
          trend={{ text: '3 Labs', type: 'neutral' }}
        />
        <KPICard
          title="AVAILABLE SLOTS"
          value="30"
          subtitle="6 Slots × 5 Days"
          icon={Clock}
          color="#38bdf8"
          trend={{ text: 'Standard Grid', type: 'positive' }}
        />
      </div>

      {/* ── SECOND ROW: Conflicts Overview + Optimization Performance + Conflict Breakdown ── */}
      <div className="dashboard-analytics-grid">

        {/* Conflicts Overview */}
        <div
          className="glass-card"
          style={{
            padding: '1.35rem 1.5rem',
            background: 'linear-gradient(135deg, var(--space-card) 0%, var(--space-card-2) 100%)',
            position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(244, 63, 94, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={17} color="#f43f5e" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                Conflicts Overview
              </span>
            </div>
            <ArrowRight size={14} color="#64748b" />
          </div>

          <div style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
            {totalConflicts}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1.25rem', fontWeight: 600 }}>
            Active Detected Clashes
          </div>

          {/* Futuristic Wave Gradient */}
          <svg width="100%" height="52" viewBox="0 0 200 52" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.55 }}>
            <path d="M0 32 Q25 14 50 28 Q75 44 100 24 Q125 10 150 26 Q175 42 200 18 L200 52 L0 52Z"
              fill="rgba(124,92,252,0.3)" />
            <path d="M0 38 Q30 20 60 34 Q90 48 120 28 Q150 12 180 26 L200 20 L200 52 L0 52Z"
              fill="rgba(236,72,153,0.25)" />
            <path d="M0 44 Q35 30 70 40 Q105 52 140 34 Q175 22 200 30 L200 52 L0 52Z"
              fill="rgba(0,240,255,0.2)" />
          </svg>

          <button
            onClick={() => onNavigate('conflicts')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.8rem', fontWeight: 700, color: '#00f0ff',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              position: 'relative', zIndex: 1
            }}
          >
            View Conflict Matrix <ArrowRight size={13} />
          </button>
        </div>

        {/* Optimization Performance */}
        <div className="glass-card" style={{ padding: '1.35rem 1.5rem', border: '1px solid rgba(124,92,252,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={17} color="#00f0ff" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                Optimization Performance
              </span>
            </div>
            <span style={{
              fontSize: '0.68rem', fontWeight: 800, color: '#10b981',
              background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.35)',
              padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.05em'
            }}>
              DSATUR 96%
            </span>
          </div>

          {[
            { name: 'First-Fit',    pct: 68, color: '#7c5cfc', icon: '⚡' },
            { name: 'Welsh-Powell', pct: 82, color: '#ec4899', icon: '🏅' },
            { name: 'DSATUR',       pct: 96, color: '#00f0ff', icon: '🏆' }
          ].map(algo => (
            <div key={algo.name} style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{algo.icon}</span> {algo.name}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{algo.pct}%</span>
              </div>
              <div style={{
                height: '7px', borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.06)', overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%', width: `${algo.pct}%`,
                  background: `linear-gradient(90deg, ${algo.color} 0%, rgba(${
                    algo.color === '#00f0ff' ? '0,240,255' : algo.color === '#ec4899' ? '236,72,153' : '124,92,252'
                  },0.6) 100%)`,
                  borderRadius: '999px',
                  boxShadow: `0 0 10px ${algo.color}`,
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Conflict Breakdown donut */}
        <div className="glass-card" style={{ padding: '1.35rem 1.5rem', border: '1px solid rgba(236,72,153,0.22)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={17} color="#ec4899" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                Conflict Breakdown
              </span>
            </div>
            <ArrowRight size={14} color="#64748b" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Mini donut */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <ConflictChart />
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
              {[
                { label: 'Faculty Clash', color: '#ec4899', pct: '33%' },
                { label: 'Room Clash',    color: '#00f0ff', pct: '33%' },
                { label: 'Group Clash',   color: '#10b981', pct: '33%' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>1</span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{item.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── THIRD ROW: Recent Activity + Graph Benchmark + Quote ── */}
      <div className="dashboard-bottom-grid">

        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: '1.35rem 1.5rem', border: '1px solid rgba(0,240,255,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={17} color="#00f0ff" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>Recent Activity</span>
            </div>
            <ArrowRight size={14} color="#64748b" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { time: '14:32', text: 'DSATUR completed successfully',   color: '#10b981' },
              { time: '14:28', text: 'Graph built with 32 nodes, 56 edges', color: '#7c5cfc' },
              { time: '14:21', text: 'Conflict detection finished (3 found)', color: '#f43f5e' },
              { time: '14:15', text: 'Optimization started (DSATUR)',    color: '#00f0ff' }
            ].map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  marginTop: '5px', background: act.color,
                  boxShadow: `0 0 8px ${act.color}`
                }} />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, fontWeight: 500 }}>{act.text}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph Coloring Benchmark */}
        <div className="glass-card" style={{ padding: '1.35rem 1.5rem', border: '1px solid rgba(124,92,252,0.22)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitGraph size={17} color="#00f0ff" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                Graph Coloring Benchmark
              </span>
            </div>
            <button
              onClick={() => onNavigate('optimization')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '0.72rem', fontWeight: 700, color: '#00f0ff',
                background: 'rgba(0,240,255,0.1)',
                border: '1px solid rgba(0,240,255,0.3)',
                padding: '4px 10px', borderRadius: '6px', cursor: 'pointer'
              }}
            >
              Algorithm Metrics →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', alignItems: 'center' }}>
            {/* Mini graph visual */}
            <svg viewBox="0 0 130 100" width="100%" height="100" style={{ maxWidth: '130px' }}>
              {/* Edges */}
              <line x1="30" y1="50" x2="65" y2="25" stroke="rgba(0,240,255,0.4)" strokeWidth="1.5" />
              <line x1="65" y1="25" x2="100" y2="45" stroke="rgba(236,72,153,0.4)" strokeWidth="1.5" />
              <line x1="100" y1="45" x2="80" y2="78" stroke="rgba(124,92,252,0.4)" strokeWidth="1.5" />
              <line x1="30" y1="50" x2="80" y2="78" stroke="rgba(236,72,153,0.35)" strokeWidth="1.5" />
              <line x1="65" y1="25" x2="80" y2="78" stroke="rgba(0,240,255,0.3)" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="30" y1="50" x2="100" y2="45" stroke="rgba(124,92,252,0.3)" strokeWidth="1" strokeDasharray="3 2" />
              {/* Nodes */}
              {[
                { cx: 30,  cy: 50, color: '#7c5cfc' },
                { cx: 65,  cy: 25, color: '#ec4899' },
                { cx: 100, cy: 45, color: '#00f0ff' },
                { cx: 80,  cy: 78, color: '#10b981' },
                { cx: 50,  cy: 80, color: '#e2e8f0' }
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.cx} cy={n.cy} r="11" fill={n.color} opacity="0.25" />
                  <circle cx={n.cx} cy={n.cy} r="7"  fill={n.color} />
                  <circle cx={n.cx - 2} cy={n.cy - 2} r="2.5" fill="rgba(255,255,255,0.7)" />
                </g>
              ))}
            </svg>

            {/* Bar chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'First-Fit',    pct: 68, color: '#7c5cfc' },
                { name: 'Welsh-Powell', pct: 82, color: '#ec4899' },
                { name: 'DSATUR',       pct: 96, color: '#00f0ff', star: true }
              ].map(algo => (
                <div key={algo.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {algo.star && <Star size={10} fill="#00f0ff" color="#00f0ff" />}
                      {algo.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{algo.pct}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${algo.pct}%`,
                      background: algo.color, borderRadius: '999px',
                      boxShadow: `0 0 8px ${algo.color}`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote card */}
        <div
          className="glass-card"
          style={{
            padding: '1.35rem 1.5rem',
            background: 'linear-gradient(135deg, var(--space-card) 0%, var(--space-card-2) 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(236,72,153,0.25)'
          }}
        >
          <div style={{
            position: 'absolute', bottom: '-20px', right: '-20px',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)'
          }} />

          <div style={{
            fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.4,
            fontFamily: 'var(--font-display)', color: 'var(--text-main)',
            position: 'relative', zIndex: 1
          }}>
            "Intelligent graph coloring for zero-conflict academic schedules."
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f0ff, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0,240,255,0.5)'
            }}>
              <Star size={15} color="#fff" fill="#fff" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
