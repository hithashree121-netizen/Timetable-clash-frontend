import React from 'react';
import { LayoutDashboard, CalendarDays, GitGraph, AlertTriangle, Zap } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Schedule', icon: CalendarDays },
    { id: 'graph', label: 'Graph', icon: GitGraph },
    { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle },
    { id: 'optimization', label: 'Optimize', icon: Zap }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div
              style={{
                width: '32px',
                height: '24px',
                borderRadius: '12px',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: isActive ? 700 : 500, letterSpacing: '-0.01em' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
