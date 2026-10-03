import React, { useState } from 'react';
import { FacultyItem } from '../types';
import { Plus, Users, Search, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';

interface FacultyPageProps {
  facultyList: FacultyItem[];
  onAddFaculty: (item: Omit<FacultyItem, 'id'>) => void;
  onDeleteFaculty: (id: string) => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({
  facultyList,
  onAddFaculty,
  onDeleteFaculty
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('AI & Data Science');
  const [availability, setAvailability] = useState<'Full-Time' | 'Part-Time' | 'On-Leave'>('Full-Time');

  const filtered = facultyList.filter(
    f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAddFaculty({
      name,
      department,
      assignedClassesCount: 0,
      availability,
      status: 'Available'
    });
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Faculty Allocation Directory
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Instructors, professors, and teaching availability constraints.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Add Faculty Member
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0.875rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by faculty name or department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>FACULTY ID</th>
              <th>NAME</th>
              <th>DEPARTMENT</th>
              <th>ASSIGNED CLASSES</th>
              <th>AVAILABILITY</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{f.id}</td>
                <td style={{ fontWeight: 700 }}>{f.name}</td>
                <td>{f.department}</td>
                <td><span className="badge badge-purple">{f.assignedClassesCount} Classes</span></td>
                <td><span className="badge badge-info">{f.availability}</span></td>
                <td><span className="badge badge-success">{f.status}</span></td>
                <td>
                  <button onClick={() => onDeleteFaculty(f.id)} className="btn btn-danger btn-sm">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Faculty Member">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Full Name *</label>
            <input type="text" placeholder="e.g. Dr. Priya Sundaram" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="form-label">Department</label>
            <select className="select-field" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
          <div>
            <label className="form-label">Availability Constraint</label>
            <select className="select-field" value={availability} onChange={e => setAvailability(e.target.value as any)}>
              <option value="Full-Time">Full-Time (Mon-Fri)</option>
              <option value="Part-Time">Part-Time (Selected Slots)</option>
              <option value="On-Leave">On-Leave</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Faculty</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
