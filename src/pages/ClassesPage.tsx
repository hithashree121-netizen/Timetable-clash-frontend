import React, { useState } from 'react';
import { ClassItem, DayOfWeek, TimeSlotString } from '../types';
import { Plus, Search, Filter, Trash2, Edit3, Eye, BookOpen } from 'lucide-react';
import { Modal } from '../components/Modal';
import { DAYS, TIME_SLOTS } from '../data/mockData';

interface ClassesPageProps {
  classes: ClassItem[];
  onAddClass: (newClass: Omit<ClassItem, 'id'>) => void;
  onDeleteClass: (id: string) => void;
}

export const ClassesPage: React.FC<ClassesPageProps> = ({
  classes,
  onAddClass,
  onDeleteClass
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [code, setCode] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [batch, setBatch] = useState('AI-DS 5A');
  const [roomNumber, setRoomNumber] = useState('R101');
  const [durationHours, setDurationHours] = useState(1);
  const [preferredDay, setPreferredDay] = useState<DayOfWeek>('Monday');
  const [preferredTime, setPreferredTime] = useState<TimeSlotString>('09:00 - 10:00');
  const [formError, setFormError] = useState('');

  const filtered = classes.filter(
    c =>
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !code || !facultyName) {
      setFormError('Please fill in Subject Name, Code, and Faculty Name.');
      return;
    }

    onAddClass({
      subject,
      code,
      facultyId: `fac-${Date.now()}`,
      facultyName,
      batch,
      roomId: `rm-${roomNumber.toLowerCase()}`,
      roomNumber,
      durationHours,
      preferredDay,
      preferredTime,
      color: '#6366F1'
    });

    setIsModalOpen(false);
    // Reset Form
    setSubject('');
    setCode('');
    setFacultyName('');
    setFormError('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Classes & Subject Registry
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Manage course instances, assigned faculty, student batches, and room preferences.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Add Class
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by subject, code, faculty, or batch..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Classes Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>SUBJECT CODE</th>
              <th>SUBJECT NAME</th>
              <th>FACULTY</th>
              <th>BATCH</th>
              <th>ROOM</th>
              <th>DURATION</th>
              <th>PREFERRED SLOT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No class records found matching search.
                </td>
              </tr>
            ) : (
              filtered.map(cls => (
                <tr key={cls.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    {cls.code}
                  </td>
                  <td style={{ fontWeight: 700 }}>{cls.subject}</td>
                  <td style={{ color: 'var(--text-main)' }}>{cls.facultyName}</td>
                  <td><span className="badge badge-purple">{cls.batch}</span></td>
                  <td><span className="badge badge-info">{cls.roomNumber}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{cls.durationHours} Hr(s)</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                    {cls.preferredDay || 'Monday'} {cls.preferredTime || '09:00 - 10:00'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => onDeleteClass(cls.id)} className="btn btn-danger btn-sm" title="Delete Class">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form for Add Class */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Academic Class">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && (
            <div style={{ padding: '0.625rem', borderRadius: '8px', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>
              {formError}
            </div>
          )}

          <div>
            <label className="form-label">Subject Name *</label>
            <input
              type="text"
              placeholder="e.g. Distributed Operating Systems"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Subject Code *</label>
              <input
                type="text"
                placeholder="e.g. 21CS509"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="form-label">Student Batch *</label>
              <select className="select-field" value={batch} onChange={e => setBatch(e.target.value)}>
                <option value="AI-DS 5A">AI-DS 5A</option>
                <option value="AI-DS 5B">AI-DS 5B</option>
                <option value="CSE 5A">CSE 5A</option>
                <option value="IT 5A">IT 5A</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Faculty Name *</label>
              <input
                type="text"
                placeholder="e.g. Dr. Ravi Kumar"
                value={facultyName}
                onChange={e => setFacultyName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="form-label">Room Number</label>
              <select className="select-field" value={roomNumber} onChange={e => setRoomNumber(e.target.value)}>
                <option value="R101">R101 (Classroom)</option>
                <option value="R102">R102 (Classroom)</option>
                <option value="R204">R204 (Seminar Hall)</option>
                <option value="Lab 1">Lab 1 (AI Suite)</option>
                <option value="Lab 2">Lab 2 (Systems Suite)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Preferred Day</label>
              <select className="select-field" value={preferredDay} onChange={e => setPreferredDay(e.target.value as DayOfWeek)}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Preferred Time Slot</label>
              <select className="select-field" value={preferredTime} onChange={e => setPreferredTime(e.target.value as TimeSlotString)}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Class Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
