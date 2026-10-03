import React from 'react';

export const AlgorithmChart: React.FC = () => {
  const algorithms = [
    { name: 'First-Fit', slots: 6, timeMs: 0.8, color: '#6366F1' },
    { name: 'Welsh-Powell', slots: 5, timeMs: 1.2, color: '#8B5CF6' },
    { name: 'DSATUR', slots: 4, timeMs: 1.9, color: '#3B82F6' }
  ];

  const maxSlots = 8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
      {algorithms.map((algo, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: algo.color }} />
              {algo.name}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {algo.slots} Slots ({algo.timeMs}ms)
            </span>
          </div>
          <div
            style={{
              height: '10px',
              width: '100%',
              backgroundColor: 'rgba(37, 48, 74, 0.4)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(algo.slots / maxSlots) * 100}%`,
                background: `linear-gradient(90deg, ${algo.color} 0%, var(--secondary) 100%)`,
                borderRadius: '999px',
                transition: 'width 0.8s ease'
              }}
            />
          </div>
        </div>
      ))}

      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontStyle: 'italic', marginTop: '0.25rem' }}>
        * Lower slots indicates tighter color packing and higher schedule efficiency.
      </div>
    </div>
  );
};
