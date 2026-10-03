import React, { useState } from 'react';
import { ClassItem, DayOfWeek, TimeSlotString } from '../types';
import { DAYS, TIME_SLOTS } from '../data/mockData';
import { Filter, Download, ShieldCheck, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface TimetableGridComponentProps {
  classes: ClassItem[];
  onValidate?: () => void;
  onRegenerate?: () => void;
}

export const TimetableGridComponent: React.FC<TimetableGridComponentProps> = ({
  classes,
  onValidate,
  onRegenerate
}) => {
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedRoom, setSelectedRoom] = useState<string>('ALL');

  // Extract unique filter options
  const batches = Array.from(new Set(classes.map(c => c.batch))).filter(Boolean);
  const faculties = Array.from(new Set(classes.map(c => c.facultyName))).filter(Boolean);
  const rooms = Array.from(new Set(classes.map(c => c.roomNumber))).filter(Boolean);

  // Filter classes based on selections
  const filteredClasses = classes.filter(c => {
    if (selectedBatch !== 'ALL' && c.batch !== selectedBatch) return false;
    if (selectedFaculty !== 'ALL' && c.facultyName !== selectedFaculty) return false;
    if (selectedRoom !== 'ALL' && c.roomNumber !== selectedRoom) return false;
    return true;
  });

  // Map classes to (Day, TimeSlot) cells
  const getCellClasses = (day: DayOfWeek, slot: TimeSlotString): ClassItem[] => {
    return filteredClasses.filter(c => {
      const classDay = c.assignedDay || c.preferredDay;
      const classSlot = c.assignedSlot || c.preferredTime;
      return classDay === day && classSlot === slot;
    });
  };

  const handleExportCSV = () => {
    const headers = ['Day', 'Time Slot', 'Subject Code', 'Subject Name', 'Faculty', 'Batch', 'Room'];
    const rows: string[][] = [];

    DAYS.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        const items = getCellClasses(day, slot);
        items.forEach(c => {
          rows.push([day, slot, c.code, `"${c.subject}"`, `"${c.facultyName}"`, c.batch, c.roomNumber]);
        });
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'academic_timetable.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Filter & Toolbar Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
            <Filter size={16} /> Filters:
          </div>

          <select
            className="select-field"
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            style={{ width: '150px', height: '36px', padding: '0 0.75rem', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Batches</option>
            {batches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            className="select-field"
            value={selectedFaculty}
            onChange={e => setSelectedFaculty(e.target.value)}
            style={{ width: '160px', height: '36px', padding: '0 0.75rem', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Faculty</option>
            {faculties.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            className="select-field"
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
            style={{ width: '140px', height: '36px', padding: '0 0.75rem', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Rooms</option>
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onRegenerate && (
            <button onClick={onRegenerate} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Regenerate
            </button>
          )}

          {onValidate && (
            <button onClick={onValidate} className="btn btn-secondary btn-sm">
              <ShieldCheck size={14} color="var(--success)" /> Validate
            </button>
          )}

          <button onClick={handleExportCSV} className="btn btn-primary btn-sm">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Timetable Grid Table */}
      <div className="table-responsive">
        <table className="custom-table" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '130px', textAlign: 'center', background: '#070a13' }}>TIME SLOT</th>
              {DAYS.map(day => (
                <th key={day} style={{ textAlign: 'center', background: '#0b1020' }}>
                  {day.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(slot => (
              <tr key={slot}>
                {/* Slot Label Column */}
                <td
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    background: '#080b14',
                    borderRight: '1px solid var(--border-color)'
                  }}
                >
                  {slot}
                </td>

                {/* Days Columns */}
                {DAYS.map(day => {
                  const items = getCellClasses(day, slot);
                  const isConflictCell = items.length > 1;

                  return (
                    <td
                      key={day}
                      style={{
                        padding: '0.5rem',
                        height: '110px',
                        verticalAlign: 'top',
                        background: isConflictCell ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                        borderRight: '1px solid rgba(37, 48, 74, 0.4)'
                      }}
                    >
                      {items.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(100, 116, 139, 0.3)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                          Free Slot
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {isConflictCell && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger)', fontSize: '0.68rem', fontWeight: 800 }}>
                              <AlertCircle size={12} /> OVERLAP CLASH ({items.length})
                            </div>
                          )}

                          {items.map(cls => (
                            <div
                              key={cls.id}
                              style={{
                                padding: '0.5rem 0.625rem',
                                borderRadius: '8px',
                                background: isConflictCell ? 'rgba(239, 68, 68, 0.2)' : `rgba(30, 41, 59, 0.9)`,
                                borderLeft: `4px solid ${isConflictCell ? 'var(--danger)' : cls.color || 'var(--primary)'}`,
                                borderTop: '1px solid var(--border-color)',
                                borderRight: '1px solid var(--border-color)',
                                borderBottom: '1px solid var(--border-color)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                fontSize: '0.75rem'
                              }}
                            >
                              <div style={{ fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {cls.subject}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '2px' }}>
                                <span>{cls.facultyName}</span>
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{cls.roomNumber}</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px' }}>
                                <span className="badge badge-purple" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                                  {cls.batch}
                                </span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-subtle)' }}>
                                  {cls.code}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
