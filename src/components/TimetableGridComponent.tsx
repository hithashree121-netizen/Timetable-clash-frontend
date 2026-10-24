import React, { useState, useMemo } from 'react';
import { ClassItem, DayOfWeek, TimeSlotString, SlotRecommendation } from '../types';
import { DAYS, TIME_SLOTS } from '../data/mockData';
import { Filter, Download, ShieldCheck, RefreshCw, Sparkles, AlertCircle, CheckCircle2, Clock, Users, Building2, Check, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import { suggestAlternativeSlots } from '../utils/graphColoringEngine';

interface TimetableGridComponentProps {
  classes: ClassItem[];
  onValidate?: () => void;
  onRegenerate?: () => void;
  onUpdateClass?: (updatedClass: ClassItem) => void;
  onNavigateToConflicts?: () => void;
}

export const TimetableGridComponent: React.FC<TimetableGridComponentProps> = ({
  classes,
  onValidate,
  onRegenerate,
  onUpdateClass,
  onNavigateToConflicts
}) => {
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedRoom, setSelectedRoom] = useState<string>('ALL');

  // Interactive Card Modal State
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [editDay, setEditDay] = useState<DayOfWeek>('Monday');
  const [editSlot, setEditSlot] = useState<TimeSlotString>('08:00 - 09:00');
  const [recs, setRecs] = useState<SlotRecommendation[]>([]);

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

  const handleOpenEditModal = (cls: ClassItem) => {
    setEditingClass(cls);
    setEditDay(cls.assignedDay || cls.preferredDay || 'Monday');
    setEditSlot(cls.assignedSlot || cls.preferredTime || '08:00 - 09:00');
    const recommendations = suggestAlternativeSlots(cls, classes);
    setRecs(recommendations);
  };

  const handleSaveClassSlot = () => {
    if (!editingClass) return;
    const updated: ClassItem = {
      ...editingClass,
      assignedDay: editDay,
      assignedSlot: editSlot
    };
    if (onUpdateClass) {
      onUpdateClass(updated);
    }
    setEditingClass(null);
  };

  // Live safety evaluation for current editDay and editSlot
  const liveSafety = useMemo(() => {
    if (!editingClass) return { isSafe: true, reason: '' };
    const otherClasses = classes.filter(c => c.id !== editingClass.id);
    const clashing = otherClasses.filter(c => {
      const d = c.assignedDay || c.preferredDay;
      const s = c.assignedSlot || c.preferredTime;
      return d === editDay && s === editSlot;
    });

    const issues: string[] = [];
    clashing.forEach(c => {
      if (c.facultyId && c.facultyId === editingClass.facultyId) issues.push(`Faculty ${c.facultyName} busy`);
      if (c.roomId && c.roomId === editingClass.roomId) issues.push(`Room ${c.roomNumber} occupied`);
      if (c.batch && c.batch === editingClass.batch) issues.push(`Batch ${c.batch} in class`);
    });

    return {
      isSafe: issues.length === 0,
      reason: issues.join(', ')
    };
  }, [classes, editingClass, editDay, editSlot]);

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
              <th style={{ width: '130px', textAlign: 'center', background: 'var(--bg-surface, rgba(13, 13, 34, 0.9))' }}>TIME SLOT</th>
              {DAYS.map(day => (
                <th key={day} style={{ textAlign: 'center', background: 'var(--bg-surface, rgba(13, 13, 34, 0.9))' }}>
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
                    background: 'var(--bg-surface, rgba(13, 13, 34, 0.9))',
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
                        borderRight: '1px solid var(--border-color)'
                      }}
                    >
                      {items.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(100, 116, 139, 0.3)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                          Free Slot
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {isConflictCell && (
                            <div
                              onClick={() => onNavigateToConflicts && onNavigateToConflicts()}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: 'var(--danger)',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                cursor: onNavigateToConflicts ? 'pointer' : 'default'
                              }}
                              title="Click to view full clash audit details"
                            >
                              <AlertCircle size={12} /> OVERLAP CLASH ({items.length})
                              {onNavigateToConflicts && <ArrowRight size={10} />}
                            </div>
                          )}

                          {items.map(cls => (
                            <div
                              key={cls.id}
                              onClick={() => handleOpenEditModal(cls)}
                              style={{
                                padding: '0.5rem 0.625rem',
                                borderRadius: '8px',
                                background: isConflictCell ? 'rgba(239, 68, 68, 0.2)' : `var(--glass-bg)`,
                                borderLeft: `4px solid ${isConflictCell ? 'var(--danger)' : cls.color || 'var(--primary)'}`,
                                borderTop: '1px solid var(--border-color)',
                                borderRight: '1px solid var(--border-color)',
                                borderBottom: '1px solid var(--border-color)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                              }}
                              title="Click to inspect or reschedule this class"
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

      {/* Class Inspector & Slot Reassigner Modal */}
      {editingClass && (
        <Modal
          isOpen={!!editingClass}
          onClose={() => setEditingClass(null)}
          title={`Class Schedule: ${editingClass.subject}`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid var(--border-color)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.8rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Course Code:</span>{' '}
                <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{editingClass.code}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Batch:</span>{' '}
                <strong style={{ color: 'var(--text-main)' }}>{editingClass.batch}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Instructor:</span>{' '}
                <strong style={{ color: 'var(--text-main)' }}>{editingClass.facultyName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Room:</span>{' '}
                <strong style={{ color: 'var(--text-main)' }}>{editingClass.roomNumber}</strong>
              </div>
            </div>

            {/* Quick Conflict-Free Recommendations */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <Sparkles size={14} color="var(--primary)" style={{ display: 'inline', marginRight: '4px' }} />
                  Suggested Collision-Free Slots:
                </label>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Click to pick</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '0.5rem' }}>
                {recs.slice(0, 4).map((r, idx) => {
                  const isSelected = editDay === r.day && editSlot === r.slot;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setEditDay(r.day); setEditSlot(r.slot); }}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(206, 188, 237, 0.2)' : 'var(--space-hover)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        {r.day}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {r.slot}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: r.isSafe ? 'var(--success)' : 'var(--warning)', fontWeight: 700 }}>
                        {r.isSafe ? '✓ Safe' : '⚠ Clash'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day and Slot Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div>
                <label className="form-label">Day *</label>
                <select
                  className="select-field"
                  value={editDay}
                  onChange={e => setEditDay(e.target.value as DayOfWeek)}
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Time Slot *</label>
                <select
                  className="select-field"
                  value={editSlot}
                  onChange={e => setEditSlot(e.target.value as TimeSlotString)}
                >
                  {TIME_SLOTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Safety Check */}
            <div
              style={{
                padding: '0.65rem 0.875rem',
                borderRadius: '8px',
                background: liveSafety.isSafe ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${liveSafety.isSafe ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: liveSafety.isSafe ? 'var(--success)' : 'var(--warning)'
              }}
            >
              {liveSafety.isSafe ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{liveSafety.isSafe ? `✓ Safe to move: 0 conflicts detected in ${editDay} ${editSlot}.` : `⚠ Potential conflict: ${liveSafety.reason}`}</span>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClassSlot}
                className="btn btn-primary"
              >
                <Check size={16} /> Save New Slot
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

