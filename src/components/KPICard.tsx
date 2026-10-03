import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: {
    text: string;
    type: 'positive' | 'negative' | 'neutral';
  };
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'var(--primary)',
  trend
}) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem', letterSpacing: '-0.03em' }}>
            {value}
          </div>
        </div>

        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `rgba(${hexToRgb(color)}, 0.12)`,
            border: `1px solid rgba(${hexToRgb(color)}, 0.25)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={22} color={color} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            {subtitle}
          </span>
        )}

        {trend && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              background: trend.type === 'positive' ? 'var(--success-bg)' : trend.type === 'negative' ? 'var(--danger-bg)' : 'rgba(37, 48, 74, 0.4)',
              color: trend.type === 'positive' ? 'var(--success)' : trend.type === 'negative' ? 'var(--danger)' : 'var(--text-muted)'
            }}
          >
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
};

function hexToRgb(hex: string): string {
  if (hex.startsWith('#')) {
    const c = hex.substring(1);
    if (c.length === 6) {
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
  }
  return '99, 102, 241';
}
