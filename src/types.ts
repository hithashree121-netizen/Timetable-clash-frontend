export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type TimeSlotString = '09:00 - 10:00' | '10:00 - 11:00' | '11:00 - 12:00' | '12:00 - 01:00' | '02:00 - 03:00' | '03:00 - 04:00';

export interface ClassItem {
  id: string;
  code: string;
  subject: string;
  facultyId: string;
  facultyName: string;
  batch: string; // e.g., '5A', '5B', 'AI-DS 5'
  roomId: string;
  roomNumber: string;
  durationHours: number;
  preferredDay?: DayOfWeek;
  preferredTime?: TimeSlotString;
  color?: string;
  assignedDay?: DayOfWeek;
  assignedSlot?: TimeSlotString;
  assignedSlotIndex?: number;
}

export interface FacultyItem {
  id: string;
  name: string;
  department: string;
  assignedClassesCount: number;
  availability: 'Full-Time' | 'Part-Time' | 'On-Leave';
  status: 'Available' | 'Busy';
}

export type RoomType = 'Classroom' | 'Lab' | 'Seminar Hall';

export interface RoomItem {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
  type: RoomType;
  status: 'Available' | 'Maintenance' | 'Occupied';
}

export type ConflictType = 'Faculty Conflict' | 'Room Conflict' | 'Student Group Conflict' | 'Time Slot Conflict';

export interface ConflictItem {
  id: string;
  type: ConflictType;
  subject1: string;
  subject2: string;
  relatedResource: string;
  timeSlot: string;
  severity: 'Critical' | 'Warning';
  status: 'Unresolved' | 'Resolved';
}

export interface GraphNode {
  id: string;
  label: string;
  code: string;
  faculty: string;
  batch: string;
  room: string;
  degree: number;
  colorIndex: number;
  timeSlotAssigned?: string;
  x?: number;
  y?: number;
  saturation?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  reason: string;
}

export type AlgorithmType = 'First-Fit' | 'Welsh-Powell' | 'DSATUR';

export interface AlgorithmComparisonResult {
  algorithm: AlgorithmType;
  slotsUsed: number;
  conflictsCount: number;
  executionTimeMs: number;
  validationStatus: 'Success' | 'Failed';
  colorPaletteCount: number;
}

export interface TimetableCell {
  day: DayOfWeek;
  timeSlot: TimeSlotString;
  classes: ClassItem[];
  hasClash: boolean;
}

export interface ValidationReport {
  isValid: boolean;
  facultyConflictsPassed: boolean;
  roomConflictsPassed: boolean;
  studentGroupConflictsPassed: boolean;
  timeSlotConflictsPassed: boolean;
  issues: {
    id: string;
    class1: string;
    class2: string;
    type: ConflictType;
    reason: string;
    timeSlot: string;
  }[];
}
