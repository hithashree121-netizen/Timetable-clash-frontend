import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, User, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { ClassItem, FacultyItem, RoomItem } from '../types';
import { INITIAL_CLASSES, INITIAL_FACULTY, INITIAL_ROOMS } from '../data/mockData';

interface SearchResult {
  id: string;
  type: 'class' | 'faculty' | 'room';
  title: string;
  subtitle: string;
  meta: string;
  targetTab: string;
}

interface HeaderSearchProps {
  onNavigate?: (tab: string) => void;
  classes?: ClassItem[];
  faculty?: FacultyItem[];
  rooms?: RoomItem[];
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  onNavigate,
  classes = INITIAL_CLASSES,
  faculty = INITIAL_FACULTY,
  rooms = INITIAL_ROOMS
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter items whenever query changes
  useEffect(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setResults([]);
      return;
    }

    const matched: SearchResult[] = [];

    // 1. Search Classes
    const matchedClasses = (classes.length ? classes : INITIAL_CLASSES).filter(c =>
      c.subject.toLowerCase().includes(clean) ||
      c.code.toLowerCase().includes(clean) ||
      c.facultyName.toLowerCase().includes(clean) ||
      c.batch.toLowerCase().includes(clean) ||
      c.roomNumber.toLowerCase().includes(clean)
    );

    matchedClasses.slice(0, 5).forEach(c => {
      matched.push({
        id: c.id,
        type: 'class',
        title: `${c.subject} (${c.code})`,
        subtitle: `${c.facultyName} • Batch ${c.batch}`,
        meta: `Room ${c.roomNumber} • ${c.preferredDay || 'Assigned'}`,
        targetTab: 'classes'
      });
    });

    // 2. Search Faculty
    const matchedFaculty = (faculty.length ? faculty : INITIAL_FACULTY).filter(f =>
      f.name.toLowerCase().includes(clean) ||
      f.department.toLowerCase().includes(clean)
    );

    matchedFaculty.slice(0, 4).forEach(f => {
      matched.push({
        id: f.id,
        type: 'faculty',
        title: f.name,
        subtitle: f.department,
        meta: `${f.assignedClassesCount} classes assigned • ${f.status}`,
        targetTab: 'faculty'
      });
    });

    // 3. Search Rooms
    const matchedRooms = (rooms.length ? rooms : INITIAL_ROOMS).filter(r =>
      r.roomNumber.toLowerCase().includes(clean) ||
      r.building.toLowerCase().includes(clean) ||
      r.type.toLowerCase().includes(clean)
    );

    matchedRooms.slice(0, 4).forEach(r => {
      matched.push({
        id: r.id,
        type: 'room',
        title: `${r.roomNumber} (${r.type})`,
        subtitle: r.building,
        meta: `Capacity: ${r.capacity} seats • ${r.status}`,
        targetTab: 'rooms'
      });
    });

    setResults(matched);
  }, [query, classes, faculty, rooms]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    if (onNavigate) {
      onNavigate(item.targetTab);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const hasQuery = query.trim().length > 0;
  const isNotFound = hasQuery && results.length === 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        flex: 1,
        maxWidth: '460px',
        margin: '0 0.5rem'
      }}
    >
      {/* Search Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--glass-bg)',
          border: isOpen
            ? '1px solid var(--space-border-bright)'
            : '1px solid var(--space-border)',
          borderRadius: '12px',
          padding: '0.45rem 0.85rem',
          boxShadow: isOpen
            ? '0 0 16px var(--blue-glow, rgba(0, 240, 255, 0.25))'
            : 'none',
          transition: 'all 0.25s ease'
        }}
      >
        <Search
          size={16}
          style={{
            color: isOpen ? 'var(--blue, #00f0ff)' : 'var(--text-muted)',
            flexShrink: 0,
            transition: 'color 0.2s ease'
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search classes, course codes, faculty, rooms..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '0.825rem',
            fontFamily: 'inherit',
            width: '100%'
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            aria-label="Clear search"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Overlay */}
      {isOpen && hasQuery && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'var(--space-card-2, #0d0d24)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--space-border-bright, rgba(0, 240, 255, 0.35))',
            borderRadius: '14px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), 0 0 24px rgba(124, 92, 252, 0.2)',
            zIndex: 100,
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '0.5rem'
          }}
        >
          {/* Matches Found */}
          {!isNotFound && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0.6rem 0.35rem',
                  borderBottom: '1px solid var(--space-border)',
                  marginBottom: '0.35rem'
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Matching Results ({results.length})
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                  Press Esc to close
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {results.map((item) => {
                  const isClass = item.type === 'class';
                  const isFaculty = item.type === 'faculty';

                  const badgeBg = isClass
                    ? 'rgba(124, 92, 252, 0.2)'
                    : isFaculty
                    ? 'rgba(0, 240, 255, 0.16)'
                    : 'rgba(236, 72, 153, 0.18)';

                  const badgeColor = isClass
                    ? 'var(--violet-light, #9d7ffc)'
                    : isFaculty
                    ? 'var(--blue, #00f0ff)'
                    : 'var(--pink, #ec4899)';

                  const IconComponent = isClass ? BookOpen : isFaculty ? User : MapPin;

                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--space-hover, rgba(255,255,255,0.06))';
                        e.currentTarget.style.borderColor = 'var(--space-border)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: badgeBg,
                            color: badgeColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <IconComponent size={14} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.825rem',
                              fontWeight: 600,
                              color: 'var(--text-main)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.subtitle} • {item.meta}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            background: badgeBg,
                            color: badgeColor,
                            textTransform: 'uppercase'
                          }}
                        >
                          {item.type}
                        </span>
                        <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NOT FOUND State */}
          {isNotFound && (
            <div
              style={{
                padding: '1.25rem 1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--danger, #f43f5e)'
                }}
              >
                <AlertCircle size={22} />
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Not Found
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.4 }}>
                No matching classes, faculty, or rooms found for <strong style={{ color: 'var(--pink, #ec4899)' }}>"{query}"</strong>.
              </div>

              <div
                style={{
                  marginTop: '0.35rem',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(124, 92, 252, 0.08)',
                  borderRadius: '8px',
                  border: '1px solid var(--space-border)',
                  fontSize: '0.7rem',
                  color: 'var(--text-subtle)',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>
                  💡 Try searching for:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {['Operating Systems', 'P3CS2', 'CSL-001', 'Ms. Nidhi', 'DBMS'].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => setQuery(hint)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--space-border)',
                        color: 'var(--blue, #00f0ff)',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
