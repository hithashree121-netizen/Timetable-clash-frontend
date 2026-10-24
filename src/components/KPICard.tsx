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
  color = '#7c5cfc',
  trend
}) => {
  const rgb = hexToRgb(color);

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.35rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--space-card) 0%, var(--space-card-2) 100%)'
      }}
    >
      {/* Background glow orb */}
      <div style={{
        position: 'absolute', bottom: '-24px', right: '-24px',
        width: '90px', height: '90px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${rgb}, 0.14) 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700,
          color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          {title}
        </span>

        {/* Icon box */}
        <div
          style={{
            width: '40px', height: '40px', borderRadius: '11px',
            background: `rgba(${rgb}, 0.14)`,
            border: `1px solid rgba(${rgb}, 0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 14px rgba(${rgb}, 0.2)`, flexShrink: 0
          }}
        >
          <Icon size={20} color={color} />
        </div>
      </div>

      {/* Value */}
      <div style={{
        fontSize: '2.1rem', fontWeight: 900,
        color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1,
        marginBottom: '0.4rem',
        fontFamily: 'var(--font-display)'
      }}>
        {value}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        {subtitle && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
            {subtitle}
          </span>
        )}

        {trend && (
          <span
            style={{
              fontSize: '0.68rem', fontWeight: 700,
              padding: '2px 9px', borderRadius: '999px',
              background: trend.type === 'positive'
                ? 'rgba(52,211,153,0.12)'
                : trend.type === 'negative'
                ? 'rgba(248,113,113,0.12)'
                : `rgba(${rgb}, 0.12)`,
              color: trend.type === 'positive'
                ? '#34d399'
                : trend.type === 'negative'
                ? '#f87171'
                : color,
              border: `1px solid ${
                trend.type === 'positive'
                  ? 'rgba(52,211,153,0.25)'
                  : trend.type === 'negative'
                  ? 'rgba(248,113,113,0.25)'
                  : `rgba(${rgb}, 0.25)`
              }`
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
  if (hex.startsWith('#') && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '124, 92, 252';
}
