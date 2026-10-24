import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  Building2,
  AlertTriangle,
  GitGraph,
  Zap,
  ShieldCheck,
  FileBarChart,
  Settings,
  X,
  Plus,
  Server
} from 'lucide-react';
import { getDemoMode } from '../api/config';
import { ChromeGlassSphere } from './ChromeGlassSphere';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  conflictsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
  conflictsCount
}) => {
  const isDemo = getDemoMode();

  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
    { id: 'timetable',   label: 'Timetable',    icon: CalendarDays },
    { id: 'classes',     label: 'Classes',      icon: BookOpen },
    { id: 'faculty',     label: 'Faculty',      icon: Users },
    { id: 'rooms',       label: 'Rooms',        icon: Building2 },
    {
      id: 'conflicts', label: 'Conflicts', icon: AlertTriangle,
      badge: conflictsCount !== undefined ? (conflictsCount > 0 ? String(conflictsCount) : undefined) : '3'
    },
    { id: 'graph',       label: 'Graph View',   icon: GitGraph },
    { id: 'optimization',label: 'Optimization', icon: Zap },
    { id: 'validation',  label: 'Validation',   icon: ShieldCheck },
    { id: 'reports',     label: 'Reports',      icon: FileBarChart },
    { id: 'settings',    label: 'Settings',     icon: Settings }
  ];

  const handleTabSelect = (id: string) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: collapsed ? '80px' : '220px',
        background: 'var(--space-surface)',
        borderRight: '1px solid rgba(139, 92, 246, 0.18)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowX: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {/* Chrome Glassy Orb Logo */}
          <div style={{ flexShrink: 0 }}>
            <ChromeGlassSphere size={38} showRings={false} showSparkles={false} interactive={false} />
          </div>

          {(!collapsed || mobileOpen) && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontWeight: 800, fontSize: '0.95rem',
                letterSpacing: '0.04em', color: 'var(--text-main)',
                fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap'
              }}>
                CHRONO<span style={{
                  background: 'linear-gradient(90deg, #ec4899, #00f0ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>CLASH</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Timetable Clash Detection
              </div>
            </div>
          )}
        </div>

        {/* Plus button / close */}
        {mobileOpen ? (
          <button
            onClick={() => setMobileOpen && setMobileOpen(false)}
            style={{
              background: 'rgba(124, 92, 252, 0.15)',
              border: '1px solid rgba(124, 92, 252, 0.3)',
              color: 'var(--primary)', borderRadius: '8px',
              padding: '5px', cursor: 'pointer', display: 'flex'
            }}
          >
            <X size={16} />
          </button>
        ) : (!collapsed || mobileOpen) ? (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'rgba(124, 92, 252, 0.15)',
              border: '1px solid rgba(124, 92, 252, 0.3)',
              color: 'var(--primary)', borderRadius: '8px',
              padding: '5px', cursor: 'pointer', display: 'flex'
            }}
          >
            <Plus size={14} />
          </button>
        ) : null}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.875rem 0.625rem', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                title={collapsed && !mobileOpen ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: collapsed && !mobileOpen ? '0.75rem 0' : '0.65rem 0.875rem',
                  justifyContent: collapsed && !mobileOpen ? 'center' : 'flex-start',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(124,92,252,0.22) 0%, rgba(0,240,255,0.12) 100%)'
                    : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.855rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  width: '100%',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(124,92,252,0.35)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? '#7c5cfc' : 'var(--text-subtle)'}
                  style={{ flexShrink: 0 }}
                />

                {(!collapsed || mobileOpen) && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}

                {/* Active bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '3px', borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #7c5cfc, #c084fc)'
                  }} />
                )}

                {/* Badge */}
                {(!collapsed || mobileOpen) && item.badge && (
                  <span style={{
                    marginLeft: 'auto', flexShrink: 0,
                    background: 'rgba(248,113,113,0.2)',
                    color: '#f87171',
                    fontSize: '0.68rem', fontWeight: 800,
                    padding: '2px 7px', borderRadius: '999px',
                    border: '1px solid rgba(248,113,113,0.35)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Decorative chrome glassy orb at bottom */}
      {(!collapsed || mobileOpen) && (
        <div style={{ padding: '0.75rem 0.5rem', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <ChromeGlassSphere size={94} showRings={true} showSparkles={false} interactive={true} />
        </div>
      )}

      {/* Footer Status */}
      <div style={{
        padding: '0.875rem 1rem',
        borderTop: '1px solid rgba(139,92,246,0.15)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          justifyContent: collapsed && !mobileOpen ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
            backgroundColor: isDemo ? '#fbbf24' : '#34d399',
            boxShadow: isDemo ? '0 0 8px #fbbf24' : '0 0 8px #34d399'
          }} />
          {(!collapsed || mobileOpen) && (
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Server size={10} />
                {isDemo ? 'DEMO MODE' : 'API Connected'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#4a5568' }}>
                {isDemo ? 'Graph Engine Local' : 'REST v1.0'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
