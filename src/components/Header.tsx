import React from 'react';
import { Search, Bell, Cpu, User, Sparkles } from 'lucide-react';
import { getDemoMode, setDemoMode } from '../api/config';

interface HeaderProps {
  activeTab: string;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onRefresh }) => {
  const isDemo = getDemoMode();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Timetable Intelligence Dashboard';
      case 'timetable': return 'Master Timetable Schedule';
      case 'classes': return 'Class & Subject Registry';
      case 'faculty': return 'Faculty Allocation Directory';
      case 'rooms': return 'Infrastructure & Room Registry';
      case 'conflicts': return 'Clash Detection Matrix';
      case 'graph': return 'Conflict Graph Visualizer';
      case 'optimization': return 'Graph Coloring Optimization';
      case 'validation': return 'Timetable Constraint Validation';
      case 'reports': return 'Academic Report Generator';
      case 'settings': return 'System Settings & API Config';
      default: return 'Timetable Intelligence Platform';
    }
  };

  const handleToggleDemo = () => {
    setDemoMode(!isDemo);
    if (onRefresh) onRefresh();
  };

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--card-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Title & Breadcrumb */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          <span>AI & DS Dept</span>
          <span>/</span>
          <span>V-Semester Project</span>
          <span>/</span>
          <span style={{ color: 'var(--primary)' }}>{activeTab.toUpperCase()}</span>
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '2px' }}>
          {getTitle()}
        </h1>
      </div>

      {/* Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search classes, faculty, rooms..."
            className="input-field"
            style={{ paddingLeft: '2.25rem', fontSize: '0.8rem', height: '38px' }}
          />
        </div>

        {/* Demo Mode Switcher */}
        <button
          onClick={handleToggleDemo}
          title="Toggle Backend / Demo Mode"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            border: `1px solid ${isDemo ? 'rgba(245, 158, 11, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
            background: isDemo ? 'var(--warning-bg)' : 'var(--success-bg)',
            color: isDemo ? 'var(--warning)' : 'var(--success)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Cpu size={14} />
          <span>{isDemo ? 'DEMO MODE' : 'LIVE API'}</span>
        </button>

        {/* Notifications */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(37, 48, 74, 0.3)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} color="var(--text-muted)" />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger)'
            }}
          />
        </div>

        {/* Profile Avatar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            paddingLeft: '0.75rem',
            borderLeft: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#ffffff',
              border: '2px solid var(--border-color)'
            }}
          >
            AD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              Project Evaluator
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
              AI & DS Dept
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
