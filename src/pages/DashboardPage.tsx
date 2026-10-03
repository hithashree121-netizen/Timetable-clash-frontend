import React from 'react';
import { KPICard } from '../components/KPICard';
import { ConflictChart } from '../components/ConflictChart';
import { AlgorithmChart } from '../components/AlgorithmChart';
import {
  BookOpen,
  Users,
  Building2,
  Clock,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  Sparkles,
  GitGraph
} from 'lucide-react';
import { ClassItem, ConflictItem } from '../types';

interface DashboardPageProps {
  classes: ClassItem[];
  conflicts: ConflictItem[];
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  classes,
  conflicts,
  onNavigate
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(99, 102, 241, 0.15) 100%)',
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-purple">AI & DS V-SEMESTER MINI-PROJECT</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>• Academic Engine v1.0</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Timetable Intelligence Dashboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', maxWidth: '720px' }}>
            Detect conflicts, optimize time-slot allocation, and generate graph-colored constraint-free academic schedules using First-Fit, Welsh-Powell, and DSATUR graph coloring algorithms.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onNavigate('optimization')} className="btn btn-primary">
            <Zap size={16} /> Run Optimization
          </button>
          <button onClick={() => onNavigate('graph')} className="btn btn-secondary">
            <GitGraph size={16} /> View Graph
          </button>
        </div>
      </div>

      {/* KPI Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KPICard title="Total Classes" value={classes.length || 42} subtitle="Registered Subjects" icon={BookOpen} color="#6366F1" trend={{ text: '8 Batches', type: 'neutral' }} />
        <KPICard title="Total Faculty" value="18" subtitle="Assigned Instructors" icon={Users} color="#8B5CF6" trend={{ text: 'Full Time', type: 'positive' }} />
        <KPICard title="Total Rooms" value="12" subtitle="Lecture Halls & Labs" icon={Building2} color="#3B82F6" trend={{ text: '3 Labs', type: 'neutral' }} />
        <KPICard title="Available Slots" value="30" subtitle="6 Slots × 5 Days" icon={Clock} color="#10B981" trend={{ text: 'Standard Grid', type: 'positive' }} />
        <KPICard title="Detected Conflicts" value={conflicts.length || 7} subtitle="Faculty/Room/Group" icon={AlertTriangle} color="#EF4444" trend={{ text: 'Action Needed', type: 'negative' }} />
        <KPICard title="Optimized Slots" value="24" subtitle="Chromatic Assignments" icon={Zap} color="#F59E0B" trend={{ text: 'DSATUR Ready', type: 'positive' }} />
      </div>

      {/* Grid Row 2: Charts & Visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Conflict Overview Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Conflict Breakdown
            </h3>
            <button onClick={() => onNavigate('conflicts')} className="btn btn-secondary btn-sm">
              Details <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ flex: 1, minHeight: '260px' }}>
            <ConflictChart />
          </div>
        </div>

        {/* Algorithm Performance Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Graph Coloring Benchmark
            </h3>
            <span className="badge badge-info">Algorithm Metrics</span>
          </div>
          <AlgorithmChart />
        </div>

        {/* Activity Log */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={18} color="var(--primary)" /> Recent Engine Activity
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
            {[
              { text: 'Timetable optimized using DSATUR algorithm', time: '2 mins ago', type: 'success' },
              { text: '3 room conflicts detected in R101', time: '15 mins ago', type: 'danger' },
              { text: 'Faculty Dr. Vikramaditya assigned 2 classes', time: '1 hour ago', type: 'info' },
              { text: 'Timetable constraint validation completed', time: '3 hours ago', type: 'success' }
            ].map((act, i) => (
              <div
                key={i}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderLeft: `3px solid ${act.type === 'success' ? 'var(--success)' : act.type === 'danger' ? 'var(--danger)' : 'var(--info)'}`,
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{act.text}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '2px' }}>{act.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
