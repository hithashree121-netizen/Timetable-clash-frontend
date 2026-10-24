import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { getDemoMode, setDemoMode } from '../api/config';
import { HeaderSearch } from './HeaderSearch';
import { ClassItem, FacultyItem, RoomItem } from '../types';

interface HeaderProps {
  activeTab: string;
  theme?: 'dark' | 'light';
  onSetTheme?: (theme: 'dark' | 'light') => void;
  onRefresh?: () => void;
  onToggleMobileMenu?: () => void;
  onNavigate?: (tab: string) => void;
  classes?: ClassItem[];
  faculty?: FacultyItem[];
  rooms?: RoomItem[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  theme = 'dark',
  onSetTheme,
  onRefresh,
  onToggleMobileMenu,
  onNavigate,
  classes,
  faculty,
  rooms
}) => {
  const isDemo = getDemoMode();

  const handleToggleDemo = () => {
    setDemoMode(!isDemo);
    if (onRefresh) onRefresh();
  };

  return (
    <header
      className="app-header"
      style={{
        height: '58px',
        borderBottom: '1px solid var(--space-border)',
        background: 'var(--header-bg, rgba(8, 8, 28, 0.92))',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        gap: '1rem',
        transition: 'background 0.3s ease, border-color 0.3s ease'
      }}
    >
      {/* Left: Mobile menu toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            style={{
              background: 'rgba(124,92,252,0.12)',
              border: '1px solid var(--space-border)',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* Center: Search */}
      <HeaderSearch
        onNavigate={onNavigate}
        classes={classes}
        faculty={faculty}
        rooms={rooms}
      />
      {/* Right: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
        {/* Sun/Moon Theme Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: theme === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(124, 92, 252, 0.1)',
          padding: '3px', borderRadius: '10px',
          border: '1px solid var(--space-border)'
        }}>
          <button
            title="Switch to Light Mode"
            onClick={() => onSetTheme?.('light')}
            style={{
              background: theme === 'light' ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : 'transparent',
              border: theme === 'light' ? '1px solid rgba(251, 191, 36, 0.6)' : 'none',
              color: theme === 'light' ? '#ffffff' : 'var(--text-muted)',
              borderRadius: '7px',
              padding: '5px 7px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              boxShadow: theme === 'light' ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Sun size={15} />
          </button>

          <button
            title="Switch to Dark Mode"
            onClick={() => onSetTheme?.('dark')}
            style={{
              background: theme === 'dark' ? 'linear-gradient(135deg, #7c5cfc, #00f0ff)' : 'transparent',
              border: theme === 'dark' ? '1px solid rgba(0, 240, 255, 0.6)' : 'none',
              color: theme === 'dark' ? '#ffffff' : 'var(--text-muted)',
              borderRadius: '7px',
              padding: '5px 7px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              boxShadow: theme === 'dark' ? '0 0 12px rgba(0, 240, 255, 0.45)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Moon size={15} />
          </button>
        </div>

        {/* Demo / Live pill */}
        <button
          onClick={handleToggleDemo}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 10px',
            borderRadius: '999px',
            border: `1px solid ${isDemo ? 'rgba(251,191,36,0.4)' : 'rgba(52,211,153,0.4)'}`,
            background: isDemo ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)',
            color: isDemo ? '#fbbf24' : '#34d399',
            fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer'
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: isDemo ? '#fbbf24' : '#34d399',
            boxShadow: isDemo ? '0 0 6px #fbbf24' : '0 0 6px #34d399'
          }} />
          {isDemo ? 'DEMO' : 'LIVE'}
        </button>


      </div>
    </header>
  );
};
