import { ClassItem, FacultyItem, RoomItem, ConflictItem, DayOfWeek, TimeSlotString } from '../types';

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TIME_SLOTS: TimeSlotString[] = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 01:00',
  '02:00 - 03:00',
  '03:00 - 04:00'
];

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'cls-1',
    code: '21AIDC501',
    subject: 'Artificial Intelligence & Neural Networks',
    facultyId: 'fac-1',
    facultyName: 'Dr. Vikramaditya',
    batch: 'AI-DS 5A',
    roomId: 'rm-101',
    roomNumber: 'R101',
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '09:00 - 10:00',
    color: '#6366F1'
  },
  {
    id: 'cls-2',
    code: '21CS502',
    subject: 'Database Management Systems (DBMS)',
    facultyId: 'fac-2',
    facultyName: 'Dr. Ravi Kumar',
    batch: 'AI-DS 5A',
    roomId: 'rm-102',
    roomNumber: 'R102',
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '09:00 - 10:00', // Intentional conflict with cls-1 (Same batch 5A & same time)
    color: '#3B82F6'
  },
  {
    id: 'cls-3',
    code: '21CS503',
    subject: 'Design & Analysis of Algorithms',
    facultyId: 'fac-3',
    facultyName: 'Prof. Ananya Sharma',
    batch: 'AI-DS 5A',
    roomId: 'rm-101',
    roomNumber: 'R101',
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '10:00 - 11:00',
    color: '#8B5CF6'
  },
  {
    id: 'cls-4',
    code: '21CS504',
    subject: 'Operating Systems (OS)',
    facultyId: 'fac-4',
    facultyName: 'Prof. Rajesh Gupta',
    batch: 'AI-DS 5B',
    roomId: 'rm-101',
    roomNumber: 'R101', // Intentional room conflict with cls-3 (R101 at same time)
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '10:00 - 11:00',
    color: '#EC4899'
  },
  {
    id: 'cls-5',
    code: '21CS505',
    subject: 'Computer Networks',
    facultyId: 'fac-5',
    facultyName: 'Dr. Meera Reddy',
    batch: 'AI-DS 5B',
    roomId: 'rm-102',
    roomNumber: 'R102',
    durationHours: 1,
    preferredDay: 'Tuesday',
    preferredTime: '09:00 - 10:00',
    color: '#10B981'
  },
  {
    id: 'cls-6',
    code: '21AIDC506',
    subject: 'Machine Learning Foundations',
    facultyId: 'fac-1',
    facultyName: 'Dr. Vikramaditya',
    batch: 'AI-DS 5B',
    roomId: 'rm-102',
    roomNumber: 'R102', // Intentional faculty conflict with Dr. Vikramaditya if scheduled together
    durationHours: 1,
    preferredDay: 'Tuesday',
    preferredTime: '09:00 - 10:00',
    color: '#F59E0B'
  },
  {
    id: 'cls-7',
    code: '21AIDC507',
    subject: 'AI & Data Science Lab',
    facultyId: 'fac-6',
    facultyName: 'Prof. Senthil V.',
    batch: 'AI-DS 5A',
    roomId: 'rm-lab1',
    roomNumber: 'Lab 1',
    durationHours: 2,
    preferredDay: 'Wednesday',
    preferredTime: '02:00 - 03:00',
    color: '#06B6D4'
  },
  {
    id: 'cls-8',
    code: '21CS508',
    subject: 'DBMS & SQL Laboratory',
    facultyId: 'fac-2',
    facultyName: 'Dr. Ravi Kumar',
    batch: 'AI-DS 5B',
    roomId: 'rm-lab2',
    roomNumber: 'Lab 2',
    durationHours: 2,
    preferredDay: 'Thursday',
    preferredTime: '11:00 - 12:00',
    color: '#84CC16'
  }
];

export const INITIAL_FACULTY: FacultyItem[] = [
  {
    id: 'fac-1',
    name: 'Dr. Vikramaditya',
    department: 'AI & Data Science',
    assignedClassesCount: 2,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-2',
    name: 'Dr. Ravi Kumar',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 2,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-3',
    name: 'Prof. Ananya Sharma',
    department: 'AI & Data Science',
    assignedClassesCount: 1,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-4',
    name: 'Prof. Rajesh Gupta',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 1,
    availability: 'Part-Time',
    status: 'Available'
  },
  {
    id: 'fac-5',
    name: 'Dr. Meera Reddy',
    department: 'Information Technology',
    assignedClassesCount: 1,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-6',
    name: 'Prof. Senthil V.',
    department: 'AI & Data Science',
    assignedClassesCount: 1,
    availability: 'Full-Time',
    status: 'Available'
  }
];

export const INITIAL_ROOMS: RoomItem[] = [
  {
    id: 'rm-101',
    roomNumber: 'R101',
    building: 'Aryabhata Academic Block',
    capacity: 70,
    type: 'Classroom',
    status: 'Available'
  },
  {
    id: 'rm-102',
    roomNumber: 'R102',
    building: 'Aryabhata Academic Block',
    capacity: 70,
    type: 'Classroom',
    status: 'Available'
  },
  {
    id: 'rm-204',
    roomNumber: 'R204',
    building: 'Ramanujan Tech Complex',
    capacity: 150,
    type: 'Seminar Hall',
    status: 'Available'
  },
  {
    id: 'rm-lab1',
    roomNumber: 'Lab 1',
    building: 'AI Excellence Lab Suite',
    capacity: 45,
    type: 'Lab',
    status: 'Available'
  },
  {
    id: 'rm-lab2',
    roomNumber: 'Lab 2',
    building: 'Computing Systems Wing',
    capacity: 45,
    type: 'Lab',
    status: 'Available'
  }
];

export const INITIAL_CONFLICTS: ConflictItem[] = [
  {
    id: 'cnf-101',
    type: 'Student Group Conflict',
    subject1: 'Artificial Intelligence (21AIDC501)',
    subject2: 'Database Management Systems (21CS502)',
    relatedResource: 'Batch AI-DS 5A',
    timeSlot: 'Monday 09:00 - 10:00',
    severity: 'Critical',
    status: 'Unresolved'
  },
  {
    id: 'cnf-102',
    type: 'Room Conflict',
    subject1: 'Design & Analysis of Algorithms (21CS503)',
    subject2: 'Operating Systems (21CS504)',
    relatedResource: 'Room R101',
    timeSlot: 'Monday 10:00 - 11:00',
    severity: 'Critical',
    status: 'Unresolved'
  },
  {
    id: 'cnf-103',
    type: 'Faculty Conflict',
    subject1: 'Computer Networks (21CS505)',
    subject2: 'Machine Learning Foundations (21AIDC506)',
    relatedResource: 'Dr. Vikramaditya',
    timeSlot: 'Tuesday 09:00 - 10:00',
    severity: 'Warning',
    status: 'Unresolved'
  }
];
