import React from 'react';
import { TimetableGridComponent } from '../components/TimetableGridComponent';
import { ClassItem } from '../types';

interface TimetablePageProps {
  classes: ClassItem[];
  onValidate: () => void;
  onRegenerate: () => void;
  onUpdateClass?: (updatedClass: ClassItem) => void;
  onNavigateToConflicts?: () => void;
}

export const TimetablePage: React.FC<TimetablePageProps> = ({
  classes,
  onValidate,
  onRegenerate,
  onUpdateClass,
  onNavigateToConflicts
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Generated Academic Timetable
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Weekly schedule grid mapped to time slots via graph coloring chromatic assignments.
        </p>
      </div>

      <TimetableGridComponent
        classes={classes}
        onValidate={onValidate}
        onRegenerate={onRegenerate}
        onUpdateClass={onUpdateClass}
        onNavigateToConflicts={onNavigateToConflicts}
      />
    </div>
  );
};
