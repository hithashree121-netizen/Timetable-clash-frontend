import React, { useState, useMemo } from 'react';
import { ConflictItem, ClassItem, DayOfWeek, TimeSlotString, SlotRecommendation } from '../types';
import {
  AlertTriangle,
  Play,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Search,
  Filter,
  Download,
  Zap,
  ArrowRight,
  Clock,
  Building2,
  Users,
  Check,
  X,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { conflictApi } from '../api/conflictApi';
import { Modal } from '../components/Modal';
import { DAYS, TIME_SLOTS } from '../data/mockData';

interface ConflictsPageProps {
  conflicts: ConflictItem[];
  classes: ClassItem[];
  onUpdateConflicts: (newConflicts: ConflictItem[]) => void;
  onUpdateClasses?: (newClasses: ClassItem[]) => void;
}

export const ConflictsPage: React.FC<ConflictsPageProps> = ({
  conflicts,
  classes,
  onUpdateConflicts,
  onUpdateClasses
}) => {
  // Detection Progress State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAutoResolving, setIsAutoResolving] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'Critical' | 'Warning'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Unresolved' | 'Resolved'>('ALL');

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Resolution Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);
  const [classToMoveId, setClassToMoveId] = useState<string>('');
  const [targetDay, setTargetDay] = useState<DayOfWeek>('Monday');
  const [targetSlot, setTargetSlot] = useState<TimeSlotString>('09:00 - 10:00');
  const [recommendations, setRecommendations] = useState<SlotRecommendation[]>([]);

  const steps = [
    'Building conflict constraint graph...',
    'Analyzing faculty & room occupancy...',
    'Detecting student group overlaps...',
    'Validation audit complete.'
  ];

  // Run Conflict Detection
  const handleRunDetection = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 450));
    }

    const res = await conflictApi.detectConflicts(classes);
    onUpdateConflicts(res.data);
    setIsAnalyzing(false);

    const activeCount = res.data.filter(c => c.status === 'Unresolved').length;
    showToast(
      activeCount === 0
        ? 'Constraint audit finished: 0 conflicts detected!'
        : `Detection complete: Found ${activeCount} active timetable clashes.`,
      activeCount === 0 ? 'success' : 'warning'
    );
  };

  // One-Click Auto-Resolve All Clashes via DSATUR Graph Coloring
  const handleAutoResolveAll = async () => {
    setIsAutoResolving(true);
    await new Promise(r => setTimeout(r, 600));

    const res = await conflictApi.autoResolveAll(classes, conflicts);
    if (res.success && res.data) {
      if (onUpdateClasses) {
        onUpdateClasses(res.data.classes);
      }
      onUpdateConflicts(res.data.conflicts);
      showToast(
        `Successfully auto-resolved ${res.data.resolvedCount} timetable clashes via DSATUR graph coloring!`,
        'success'
      );
    }
    setIsAutoResolving(false);
  };

  // Open Resolution Modal
  const handleOpenResolveModal = (conflict: ConflictItem) => {
    setSelectedConflict(conflict);

    // Identify class 1 and class 2
    const c1 = classes.find(c => c.id === conflict.class1Id || c.subject.includes(conflict.subject1));
    const c2 = classes.find(c => c.id === conflict.class2Id || c.subject.includes(conflict.subject2));

    const chosenToMove = c2 || c1;
    const chosenId = chosenToMove ? chosenToMove.id : '';
    setClassToMoveId(chosenId);

    if (chosenToMove) {
      const recs = conflictApi.getSlotRecommendations(chosenToMove, classes);
      setRecommendations(recs);

      // Pre-select the best recommended slot
      const topSafe = recs.find(r => r.isSafe);
      if (topSafe) {
        setTargetDay(topSafe.day);
        setTargetSlot(topSafe.slot);
      } else {
        setTargetDay(chosenToMove.assignedDay || chosenToMove.preferredDay || 'Monday');
        setTargetSlot(chosenToMove.assignedSlot || chosenToMove.preferredTime || '09:00 - 10:00');
      }
    }

    setIsModalOpen(true);
  };

  // When user changes which class to move inside the modal
  const handleClassSelectionChange = (id: string) => {
    setClassToMoveId(id);
    const chosen = classes.find(c => c.id === id);
    if (chosen) {
      const recs = conflictApi.getSlotRecommendations(chosen, classes);
      setRecommendations(recs);
      const topSafe = recs.find(r => r.isSafe);
      if (topSafe) {
        setTargetDay(topSafe.day);
        setTargetSlot(topSafe.slot);
      }
    }
  };

  // Apply Resolution from Modal
  const handleApplyResolution = async () => {
    if (!selectedConflict || !classToMoveId) return;

    const res = await conflictApi.resolveConflict(
      selectedConflict.id,
      classToMoveId,
      targetDay,
      targetSlot,
      classes,
      conflicts
    );

    if (res.success && res.data) {
      if (onUpdateClasses) {
        onUpdateClasses(res.data.classes);
      }
      onUpdateConflicts(res.data.conflicts);

      const movedClass = classes.find(c => c.id === classToMoveId);
      showToast(
        `Resolved! Rescheduled ${movedClass?.subject || 'class'} to ${targetDay} ${targetSlot}.`,
        'success'
      );
    }

    setIsModalOpen(false);
    setSelectedConflict(null);
  };

  // Quick Fix Action (One-click resolve on table row)
  const handleQuickFix = async (conflict: ConflictItem) => {
    const c2 = classes.find(c => c.id === conflict.class2Id || c.subject.includes(conflict.subject2));
    const c1 = classes.find(c => c.id === conflict.class1Id || c.subject.includes(conflict.subject1));
    const targetClass = c2 || c1;

    if (!targetClass) {
      showToast('Could not find class details to auto-reschedule.', 'warning');
      return;
    }

    const recs = conflictApi.getSlotRecommendations(targetClass, classes);
    const topSafe = recs.find(r => r.isSafe);

    if (!topSafe) {
      // Open modal for manual adjustment if no completely safe slot is found
      handleOpenResolveModal(conflict);
      return;
    }

    const res = await conflictApi.resolveConflict(
      conflict.id,
      targetClass.id,
      topSafe.day,
      topSafe.slot,
      classes,
      conflicts
    );

    if (res.success && res.data) {
      if (onUpdateClasses) {
        onUpdateClasses(res.data.classes);
      }
      onUpdateConflicts(res.data.conflicts);
      showToast(
        `Quick-fixed! Rescheduled "${targetClass.subject}" to ${topSafe.day} ${topSafe.slot}.`,
        'success'
      );
    }
  };

  // Export Conflicts Audit CSV
  const handleExportCSV = () => {
    const headers = ['Conflict ID', 'Type', 'Subject 1', 'Subject 2', 'Related Resource', 'Time Slot', 'Severity', 'Status', 'Resolution Note'];
    const rows = conflicts.map(c => [
      c.id,
      `"${c.type}"`,
      `"${c.subject1}"`,
      `"${c.subject2}"`,
      `"${c.relatedResource}"`,
      `"${c.timeSlot}"`,
      c.severity,
      c.status,
      `"${c.resolutionNote || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `timetable_conflict_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported conflict audit CSV report.', 'info');
  };

  // Filtered conflicts
  const filteredConflicts = useMemo(() => {
    return conflicts.filter(c => {
      // Search
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.id.toLowerCase().includes(query) ||
        c.subject1.toLowerCase().includes(query) ||
        c.subject2.toLowerCase().includes(query) ||
        c.relatedResource.toLowerCase().includes(query) ||
        c.timeSlot.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Severity
      if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;

      // Type
      if (typeFilter !== 'ALL' && c.type !== typeFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

      return true;
    });
  }, [conflicts, searchQuery, severityFilter, typeFilter, statusFilter]);

  // KPI Calculations
  const totalConflicts = conflicts.length;
  const criticalCount = conflicts.filter(c => c.severity === 'Critical' && c.status === 'Unresolved').length;
  const warningCount = conflicts.filter(c => c.severity === 'Warning' && c.status === 'Unresolved').length;
  const unresolvedCount = conflicts.filter(c => c.status === 'Unresolved').length;
  const resolvedCount = conflicts.filter(c => c.status === 'Resolved').length;

  // Selected Class in modal details
  const modalClass1 = selectedConflict
    ? classes.find(c => c.id === selectedConflict.class1Id || c.subject.includes(selectedConflict.subject1))
    : null;
  const modalClass2 = selectedConflict
    ? classes.find(c => c.id === selectedConflict.class2Id || c.subject.includes(selectedConflict.subject2))
    : null;
  const currentMovingClass = classes.find(c => c.id === classToMoveId);

  // Live safety check in modal for currently chosen (targetDay, targetSlot)
  const liveSlotEvaluation = useMemo(() => {
    if (!currentMovingClass) return { isSafe: true, reason: 'Valid' };
    const otherClasses = classes.filter(c => c.id !== currentMovingClass.id);
    const clashing = otherClasses.filter(c => {
      const cDay = c.assignedDay || c.preferredDay;
      const cSlot = c.assignedSlot || c.preferredTime;
      return cDay === targetDay && cSlot === targetSlot;
    });

    const reasons: string[] = [];
    clashing.forEach(c => {
      if (c.facultyId && c.facultyId === currentMovingClass.facultyId) {
        reasons.push(`Faculty ${c.facultyName} busy`);
      }
      if (c.roomId && c.roomId === currentMovingClass.roomId) {
        reasons.push(`Room ${c.roomNumber} occupied`);
      }
      if (c.batch && c.batch === currentMovingClass.batch) {
        reasons.push(`Batch ${c.batch} already has class`);
      }
    });

    return {
      isSafe: reasons.length === 0,
      reason: reasons.length > 0 ? reasons.join('; ') : 'Safe: 0 Collisions Detected'
    };
  }, [classes, currentMovingClass, targetDay, targetSlot]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: '76px',
            right: '24px',
            zIndex: 150,
            padding: '0.875rem 1.25rem',
            borderRadius: '10px',
            background: toast.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : toast.type === 'warning' ? 'rgba(245, 158, 11, 0.95)' : 'rgba(99, 102, 241, 0.95)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            backdropFilter: 'blur(8px)'
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Banner with Quick Auto-Resolve & Run Buttons */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, var(--space-card) 0%, rgba(124, 92, 252, 0.4) 55%, rgba(34, 211, 238, 0.5) 100%)',
          border: '1px solid rgba(124, 92, 252, 0.18)',
          borderLeft: '4px solid #7c5cfc',
          boxShadow: '0 12px 36px rgba(124, 92, 252, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-purple">REAL-TIME CONSTRAINT AUDIT</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>• Conflict Graph Engine</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
            Timetable Clash Detection & Auto-Resolution
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', maxWidth: '680px' }}>
            Identify overlapping time slots between subjects, double-booked faculty instructors, room capacity constraints, and student group schedule clashes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleAutoResolveAll}
            disabled={isAutoResolving || unresolvedCount === 0}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #7c5cfc 0%, #c084fc 55%, #22d3ee 100%)',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 0 20px rgba(124, 92, 252, 0.4)',
              border: '1px solid rgba(124, 92, 252, 0.3)'
            }}
            title="Automatically reschedule all clashes using DSATUR chromatic colors"
          >
            {isAutoResolving ? <RefreshCw className="pulse-glow" size={16} /> : <Sparkles size={16} />}
            {isAutoResolving ? 'Resolving Clashes...' : 'Auto-Resolve All (DSATUR)'}
          </button>

          <button
            onClick={handleRunDetection}
            disabled={isAnalyzing}
            className="btn btn-secondary"
          >
            {isAnalyzing ? <RefreshCw className="pulse-glow" size={16} /> : <Play size={16} />}
            {isAnalyzing ? 'Auditing Graph...' : 'Re-Run Audit'}
          </button>
        </div>
      </div>

      {/* Step Progress Bar during Analysis */}
      {isAnalyzing && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.5rem' }}>
            {steps[analysisStep]}
          </div>
          <div style={{ height: '6px', background: 'rgba(229, 228, 226, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((analysisStep + 1) / steps.length) * 100}%`, background: 'var(--warning)', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* KPI Cards Summary with Click-to-Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div
          onClick={() => { setStatusFilter('ALL'); setSeverityFilter('ALL'); }}
          className="glass-card"
          style={{
            padding: '1.25rem',
            cursor: 'pointer',
            borderColor: statusFilter === 'ALL' && severityFilter === 'ALL' ? 'var(--primary)' : 'var(--border-color)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL CONFLICTS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {totalConflicts}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
            {unresolvedCount} active • {resolvedCount} resolved
          </div>
        </div>

        <div
          onClick={() => { setSeverityFilter('Critical'); setStatusFilter('Unresolved'); }}
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderLeft: '3px solid var(--danger)',
            cursor: 'pointer',
            borderColor: severityFilter === 'Critical' ? 'var(--danger)' : undefined
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>CRITICAL CLASHES</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Hard constraint violations</div>
        </div>

        <div
          onClick={() => { setSeverityFilter('Warning'); setStatusFilter('Unresolved'); }}
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderLeft: '3px solid var(--warning)',
            cursor: 'pointer',
            borderColor: severityFilter === 'Warning' ? 'var(--warning)' : undefined
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>WARNINGS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
            {warningCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Soft preferences / capacity</div>
        </div>

        <div
          onClick={() => { setStatusFilter('Resolved'); setSeverityFilter('ALL'); }}
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderLeft: '3px solid var(--success)',
            cursor: 'pointer',
            borderColor: statusFilter === 'Resolved' ? 'var(--success)' : undefined
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>RESOLVED</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Rescheduled conflict-free</div>
        </div>
      </div>

      {/* Search, Filter Toolbar & Export Bar */}
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
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search conflicts by course, faculty, room, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.8rem' }}
            />
          </div>

          {/* Type Filter */}
          <select
            className="select-field"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{ width: '180px', height: '36px', fontSize: '0.8rem', padding: '0 0.75rem' }}
          >
            <option value="ALL">All Conflict Types</option>
            <option value="Faculty Conflict">Faculty Overlap</option>
            <option value="Room Conflict">Room Conflict</option>
            <option value="Student Group Conflict">Student Batch Clash</option>
          </select>

          {/* Status Filter */}
          <select
            className="select-field"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            style={{ width: '140px', height: '36px', fontSize: '0.8rem', padding: '0 0.75rem' }}
          >
            <option value="ALL">All Status</option>
            <option value="Unresolved">Unresolved</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Export Button */}
        <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
          <Download size={14} /> Export Audit CSV
        </button>
      </div>

      {/* Conflicts Data Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>CONFLICT ID</th>
              <th>TYPE</th>
              <th>SUBJECT 1</th>
              <th>SUBJECT 2</th>
              <th>RELATED RESOURCE</th>
              <th>TIME SLOT</th>
              <th>SEVERITY</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredConflicts.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--success)' }}>
                  <CheckCircle2 size={36} style={{ margin: '0 auto 0.75rem auto', color: 'var(--success)' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    No Conflicts Found
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {searchQuery || severityFilter !== 'ALL' || statusFilter !== 'ALL'
                      ? 'No conflicts matched your current filter criteria.'
                      : 'All classes adhere 100% to faculty, room, and student group constraints.'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredConflicts.map(c => {
                const isResolved = c.status === 'Resolved';

                return (
                  <tr key={c.id} style={{ opacity: isResolved ? 0.75 : 1 }}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isResolved ? 'var(--text-muted)' : 'var(--danger)', fontSize: '0.8rem' }}>
                      {c.id}
                    </td>

                    <td>
                      <span className={`badge ${c.type === 'Faculty Conflict' ? 'badge-purple' : c.type === 'Room Conflict' ? 'badge-info' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                        {c.type === 'Faculty Conflict' && <Users size={11} style={{ marginRight: '4px' }} />}
                        {c.type === 'Room Conflict' && <Building2 size={11} style={{ marginRight: '4px' }} />}
                        {c.type === 'Student Group Conflict' && <Users size={11} style={{ marginRight: '4px' }} />}
                        {c.type}
                      </span>
                    </td>

                    <td style={{ color: 'var(--text-main)', fontSize: '0.82rem', fontWeight: 600 }}>
                      {c.subject1}
                    </td>

                    <td style={{ color: 'var(--text-main)', fontSize: '0.82rem', fontWeight: 600 }}>
                      {c.subject2}
                    </td>

                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {c.relatedResource}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {c.timeSlot}
                    </td>

                    <td>
                      <span className={c.severity === 'Critical' ? 'badge badge-danger' : 'badge badge-warning'}>
                        {c.severity}
                      </span>
                    </td>

                    <td>
                      <span className={isResolved ? 'badge badge-success' : 'badge badge-danger'}>
                        {isResolved ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Check size={11} /> Resolved
                          </span>
                        ) : (
                          'Unresolved'
                        )}
                      </span>
                      {c.resolutionNote && (
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                          {c.resolutionNote}
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {!isResolved ? (
                          <>
                            <button
                              onClick={() => handleQuickFix(c)}
                              className="btn btn-secondary btn-sm"
                              title="Instantly reschedule to top safe slot"
                              style={{ color: 'var(--warning)', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                            >
                              <Zap size={13} /> Quick Fix
                            </button>

                            <button
                              onClick={() => handleOpenResolveModal(c)}
                              className="btn btn-primary btn-sm"
                              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
                            >
                              Resolve <ArrowRight size={13} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenResolveModal(c)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem' }}
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Conflict Resolution & Slot-Swap Modal */}
      {selectedConflict && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Resolve Clash: ${selectedConflict.type}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Conflict Summary Box */}
            <div
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                  {selectedConflict.relatedResource}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Clash occurring at <strong>{selectedConflict.timeSlot}</strong>
                </div>
              </div>
            </div>

            {/* Choose Which Class to Reschedule */}
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                Select Which Class to Reschedule:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {/* Option 1: Subject 1 */}
                <div
                  onClick={() => modalClass1 && handleClassSelectionChange(modalClass1.id)}
                  className="glass-card"
                  style={{
                    padding: '0.875rem',
                    cursor: 'pointer',
                    borderColor: classToMoveId === modalClass1?.id ? 'var(--primary)' : 'var(--border-color)',
                    background: classToMoveId === modalClass1?.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(17, 24, 39, 0.6)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Subject 1</span>
                    {classToMoveId === modalClass1?.id && <CheckCircle2 size={14} color="var(--primary)" />}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                    {selectedConflict.subject1}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {modalClass1?.facultyName || 'Faculty Assigned'} • {modalClass1?.roomNumber || 'Room'}
                  </div>
                </div>

                {/* Option 2: Subject 2 */}
                <div
                  onClick={() => modalClass2 && handleClassSelectionChange(modalClass2.id)}
                  className="glass-card"
                  style={{
                    padding: '0.875rem',
                    cursor: 'pointer',
                    borderColor: classToMoveId === modalClass2?.id ? 'var(--primary)' : 'var(--border-color)',
                    background: classToMoveId === modalClass2?.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(17, 24, 39, 0.6)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Subject 2</span>
                    {classToMoveId === modalClass2?.id && <CheckCircle2 size={14} color="var(--primary)" />}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                    {selectedConflict.subject2}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {modalClass2?.facultyName || 'Faculty Assigned'} • {modalClass2?.roomNumber || 'Room'}
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Recommended Slots List */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <Sparkles size={14} color="var(--primary)" style={{ display: 'inline', marginRight: '4px' }} />
                  Recommended Conflict-Free Slots:
                </label>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Click to auto-fill</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {recommendations.slice(0, 4).map((rec, i) => {
                  const isSelected = targetDay === rec.day && targetSlot === rec.slot;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setTargetDay(rec.day); setTargetSlot(rec.slot); }}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        {rec.day}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {rec.slot}
                      </div>
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: rec.isSafe ? 'var(--success)' : 'var(--warning)', marginTop: '2px' }}>
                        {rec.isSafe ? '✓ 0 Conflicts' : `⚠ ${rec.conflictsCount} Clash`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Day & Time Slot Adjustment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div>
                <label className="form-label">Target Day *</label>
                <select
                  className="select-field"
                  value={targetDay}
                  onChange={e => setTargetDay(e.target.value as DayOfWeek)}
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Target Time Slot *</label>
                <select
                  className="select-field"
                  value={targetSlot}
                  onChange={e => setTargetSlot(e.target.value as TimeSlotString)}
                >
                  {TIME_SLOTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Real-time Safety Preview Indicator */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: liveSlotEvaluation.isSafe ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${liveSlotEvaluation.isSafe ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {liveSlotEvaluation.isSafe ? (
                <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0 }} />
              ) : (
                <AlertTriangle size={16} color="var(--warning)" style={{ flexShrink: 0 }} />
              )}
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: liveSlotEvaluation.isSafe ? 'var(--success)' : 'var(--warning)' }}>
                {liveSlotEvaluation.isSafe
                  ? `✓ Valid Slot: No constraints violated for ${targetDay} ${targetSlot}.`
                  : `⚠ Caution: ${liveSlotEvaluation.reason}.`}
              </span>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyResolution}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
              >
                <Check size={16} /> Confirm & Reschedule
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

