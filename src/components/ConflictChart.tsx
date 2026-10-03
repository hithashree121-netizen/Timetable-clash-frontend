import React from 'react';

export const ConflictChart: React.FC = () => {
  // Mock conflict breakdown data
  const data = [
    { label: 'Conflict-Free', count: 18, color: '#22C55E' },
    { label: 'Faculty Overlap', count: 2, color: '#F59E0B' },
    { label: 'Room Double Booking', count: 3, color: '#EF4444' },
    { label: 'Batch Overlap', count: 2, color: '#8B5CF6' }
  ];

  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <svg width="220" height="220" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1f293d" strokeWidth="12" />
        {/* Render simple concentric ring representation */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#22C55E"
          strokeWidth="12"
          strokeDasharray={`${(18 / total) * 251.2} 251.2`}
          strokeDashoffset="0"
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#EF4444"
          strokeWidth="12"
          strokeDasharray={`${(3 / total) * 251.2} 251.2`}
          strokeDashoffset={`-${(18 / total) * 251.2}`}
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#F59E0B"
          strokeWidth="12"
          strokeDasharray={`${(2 / total) * 251.2} 251.2`}
          strokeDashoffset={`-${((18 + 3) / total) * 251.2}`}
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#8B5CF6"
          strokeWidth="12"
          strokeDasharray={`${(2 / total) * 251.2} 251.2`}
          strokeDashoffset={`-${((18 + 3 + 2) / total) * 251.2}`}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="47" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="800">
          7
        </text>
        <text x="50" y="58" textAnchor="middle" fill="#94A3B8" fontSize="5" fontWeight="600">
          CLASHES
        </text>
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: item.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
            <strong style={{ color: 'var(--text-main)', marginLeft: 'auto' }}>{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
