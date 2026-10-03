import React, { useState } from 'react';
import { RoomItem, RoomType } from '../types';
import { Plus, Building2, Search, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';

interface RoomsPageProps {
  roomsList: RoomItem[];
  onAddRoom: (item: Omit<RoomItem, 'id'>) => void;
  onDeleteRoom: (id: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({
  roomsList,
  onAddRoom,
  onDeleteRoom
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [roomNumber, setRoomNumber] = useState('');
  const [building, setBuilding] = useState('Aryabhata Academic Block');
  const [capacity, setCapacity] = useState(70);
  const [type, setType] = useState<RoomType>('Classroom');

  const filtered = roomsList.filter(
    r => r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || r.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return;
    onAddRoom({
      roomNumber,
      building,
      capacity,
      type,
      status: 'Available'
    });
    setIsModalOpen(false);
    setRoomNumber('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Infrastructure & Room Registry
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Classrooms, computer laboratories, and seminar halls.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Add New Room
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0.875rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search room number or building..."
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
              <th>ROOM NUMBER</th>
              <th>BUILDING BLOCK</th>
              <th>CAPACITY</th>
              <th>ROOM TYPE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>{r.roomNumber}</td>
                <td style={{ fontWeight: 600 }}>{r.building}</td>
                <td style={{ color: 'var(--text-main)' }}>{r.capacity} Seats</td>
                <td>
                  <span className={`badge ${r.type === 'Lab' ? 'badge-purple' : r.type === 'Seminar Hall' ? 'badge-warning' : 'badge-info'}`}>
                    {r.type}
                  </span>
                </td>
                <td><span className="badge badge-success">{r.status}</span></td>
                <td>
                  <button onClick={() => onDeleteRoom(r.id)} className="btn btn-danger btn-sm">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Infrastructure Room">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Room Number / ID *</label>
            <input type="text" placeholder="e.g. R305" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="form-label">Building / Block</label>
            <input type="text" placeholder="e.g. Ramanujan Tech Block" value={building} onChange={e => setBuilding(e.target.value)} className="input-field" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Seating Capacity</label>
              <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="form-label">Room Type</label>
              <select className="select-field" value={type} onChange={e => setType(e.target.value as RoomType)}>
                <option value="Classroom">Classroom</option>
                <option value="Lab">Lab</option>
                <option value="Seminar Hall">Seminar Hall</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Room</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
