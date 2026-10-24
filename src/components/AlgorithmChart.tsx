import React from 'react';

export const AlgorithmChart: React.FC = () => {
  const algorithms = [
    { name: 'First-Fit',     slots: 6, timeMs: 0.8, color: '#7c5cfc', pct: 68 },
    { name: 'Welsh-Powell',  slots: 5, timeMs: 1.2, color: '#c084fc', pct: 82 },
    { name: 'DSATUR',        slots: 4, timeMs: 1.9, color: '#22d3ee', pct: 96, best: true }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', padding: '0.5rem 0' }}>
      {algorithms.map((algo, i) => (
        <div key={i}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.45rem',
            alignItems: 'center'
          }}>
            <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '9px', height: '9px', borderRadius: '50%',
                backgroundColor: algo.color,
                boxShadow: `0 0 7px ${algo.color}80`, flexShrink: 0
              }} />
              {algo.name}
              {algo.best && (
                <span style={{
                  fontSize: '0.64rem', fontWeight: 800, color: '#34d399',
                  background: 'rgba(52,211,153,0.12)',
                  border: '1px solid rgba(52,211,153,0.28)',
                  padding: '1px 7px', borderRadius: '999px'
                }}>
                  BEST
                </span>
              )}
            </span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>
              {algo.slots} Slots · {algo.pct}%
            </span>
          </div>

          <div style={{
            height: '9px', width: '100%',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '999px', overflow: 'hidden',
            border: '1px solid rgba(139,92,246,0.12)'
          }}>
            <div style={{
              height: '100%',
              width: `${algo.pct}%`,
              background: `linear-gradient(90deg, ${algo.color} 0%, ${algo.color}80 100%)`,
              borderRadius: '999px',
              transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: `0 0 8px ${algo.color}60`
            }} />
          </div>
        </div>
      ))}

      <div style={{
        fontSize: '0.7rem', color: 'var(--text-subtle)',
        fontStyle: 'italic', marginTop: '0.15rem',
        borderTop: '1px solid rgba(139,92,246,0.1)', paddingTop: '0.75rem'
      }}>
        * Lower chromatic number indicates more efficient schedule packing.
      </div>
    </div>
  );
};
