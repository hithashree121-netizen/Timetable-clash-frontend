import React from 'react';

export const ConflictChart: React.FC = () => {
  const data = [
    { label: 'Conflict-Free',       count: 18, color: '#34d399' },
    { label: 'Faculty Overlap',      count: 2,  color: '#fbbf24' },
    { label: 'Room Double Booking',  count: 3,  color: '#f87171' },
    { label: 'Batch Overlap',        count: 2,  color: '#c084fc' }
  ];

  const total = data.reduce((acc, d) => acc + d.count, 0);
  const r = 34;
  const circumference = 2 * Math.PI * r;
  let offsetAcc = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <svg width="160" height="160" viewBox="0 0 100 100">
        {/* Track ring */}
        <circle cx="50" cy="50" r={r} fill="transparent"
          stroke="rgba(139,92,246,0.1)" strokeWidth="10" />

        {/* Data segments */}
        {data.map((item, i) => {
          const arc = (item.count / total) * circumference;
          const seg = (
            <circle
              key={i}
              cx="50" cy="50" r={r}
              fill="transparent"
              stroke={item.color}
              strokeWidth="10"
              strokeDasharray={`${arc} ${circumference}`}
              strokeDashoffset={-offsetAcc}
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          );
          offsetAcc += arc;
          return seg;
        })}

        {/* Center labels */}
        <text x="50" y="46" textAnchor="middle" fill="var(--text-main)" fontSize="14" fontWeight="900">3</text>
        <text x="50" y="57" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="700" letterSpacing="0.5">
          CONFLICTS
        </text>
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', width: '100%', marginTop: '1rem' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}80`
            }} />
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{item.label}:</span>
            <strong style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginLeft: 'auto' }}>{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
