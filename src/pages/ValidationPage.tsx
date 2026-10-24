import React, { useState } from 'react';
import { ClassItem, ValidationReport } from '../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { validationApi } from '../api/validationApi';

interface ValidationPageProps {
  classes: ClassItem[];
  onNavigate: (tab: string) => void;
}

export const ValidationPage: React.FC<ValidationPageProps> = ({ classes, onNavigate }) => {
  const [report, setReport] = useState<ValidationReport | null>(null);

  const handleRunValidation = async () => {
    const res = await validationApi.validate(classes);
    setReport(res.data);
  };

  React.useEffect(() => {
    handleRunValidation();
  }, [classes]);

  const isValid = report?.isValid ?? true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-purple">ACADEMIC CONSTRAINT VERIFICATION</span>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Timetable Constraint Validation
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Formally checks hard constraints: No faculty double booking, no room double booking, no student batch overlaps, and no time slot violations.
        </p>
      </div>

      {/* Main Validation Status Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isValid
            ? `linear-gradient(135deg, var(--space-card) 0%, rgba(34, 197, 94, 0.15) 100%)`
            : `linear-gradient(135deg, var(--space-card) 0%, rgba(239, 68, 68, 0.15) 100%)`,
          borderLeft: `4px solid ${isValid ? 'var(--success)' : 'var(--danger)'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: isValid ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${isValid ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isValid ? <ShieldCheck size={32} color="var(--success)" /> : <ShieldAlert size={32} color="var(--danger)" />}
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SYSTEM AUDIT RESULT</div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: isValid ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
              {isValid ? 'VALIDATION PASSED: CONFLICT FREE' : 'VALIDATION FAILED: CONSTRAINTS VIOLATED'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {isValid
                ? 'All faculty members, classroom capacities, student groups, and time slots satisfy 100% of hard constraints.'
                : `Detected ${report?.issues.length} hard constraint violations requiring schedule adjustment.`}
            </p>
          </div>
        </div>

        <button onClick={handleRunValidation} className="btn btn-secondary">
          Re-Run Audit
        </button>
      </div>

      {/* Check List Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {[
          { title: 'Faculty Constraints', check: report?.facultyConflictsPassed ?? true, desc: 'No double-booked instructors' },
          { title: 'Room Constraints', check: report?.roomConflictsPassed ?? true, desc: 'No double-booked rooms' },
          { title: 'Student Batch Constraints', check: report?.studentGroupConflictsPassed ?? true, desc: 'No batch time overlaps' },
          { title: 'Time-Slot Constraints', check: report?.timeSlotConflictsPassed ?? true, desc: 'Valid chromatic grid' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</span>
              {item.check ? <CheckCircle2 size={18} color="var(--success)" /> : <AlertTriangle size={18} color="var(--danger)" />}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{item.desc}</div>
            <div style={{ marginTop: '0.75rem' }}>
              <span className={item.check ? 'badge badge-success' : 'badge badge-danger'}>
                {item.check ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Issues List */}
      {report && report.issues.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Detected Violations ({report.issues.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {report.issues.map((issue, idx) => (
              <div
                key={issue.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  borderLeft: '4px solid var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-danger">Conflict #{idx + 1}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {issue.class1} <span style={{ color: 'var(--danger)' }}>vs</span> {issue.class2}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    <strong>Reason:</strong> {issue.reason} ({issue.timeSlot})
                  </div>
                </div>

                <button onClick={() => onNavigate('timetable')} className="btn btn-secondary btn-sm">
                  View in Timetable <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
