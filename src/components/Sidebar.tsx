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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Server
} from 'lucide-react';
import { getDemoMode } from '../api/config';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const isDemo = getDemoMode();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: Building2 },
    { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle, badge: '3' },
    { id: 'graph', label: 'Graph View', icon: GitGraph },
    { id: 'optimization', label: 'Optimization', icon: Zap },
    { id: 'validation', label: 'Validation', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      style={{
        width: collapsed ? '80px' : '260px',
        backgroundColor: 'var(--card-bg)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px var(--primary-glow)'
            }}
          >
            <GitGraph size={22} color="#ffffff" />
          </div>

          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                TIMETABLE <span style={{ color: 'var(--primary)' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                GRAPH COLORING ENGINE
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(37, 48, 74, 0.4)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            borderRadius: '6px',
            padding: '4px',
            cursor: 'pointer',
            display: collapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: collapsed ? '0.75rem 0' : '0.75rem 1rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <Icon size={20} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />

                {!collapsed && <span>{item.label}</span>}

                {!collapsed && item.badge && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      background: 'var(--danger-bg)',
                      color: 'var(--danger)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer System Status */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(11, 16, 32, 0.6)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isDemo ? 'var(--warning)' : 'var(--success)',
              boxShadow: isDemo ? '0 0 8px var(--warning)' : '0 0 8px var(--success)'
            }}
          />
          {!collapsed && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Server size={12} />
                {isDemo ? 'DEMO MODE' : 'Backend Connected'}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                {isDemo ? 'Graph Engine Local' : 'REST API v1.0'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
