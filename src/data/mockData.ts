import { ClassItem, FacultyItem, RoomItem, ConflictItem, DayOfWeek, TimeSlotString } from '../types';

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TIME_SLOTS: TimeSlotString[] = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:30 - 11:30',
  '11:30 - 12:30',
  '02:00 - 03:00',
  '03:00 - 04:00'
];

export const INITIAL_CLASSES: ClassItem[] = [
  // Batch III Semester CSE-A
  {
    id: 'cls-101',
    code: 'P3CS2',
    subject: 'Operating Systems (OS)',
    facultyId: 'fac-101',
    facultyName: 'Ms. Nidhi L G',
    batch: 'III CSE-A',
    roomId: 'rm-csl001',
    roomNumber: 'CSL-001',
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '08:00 - 09:00',
    color: '#CEBCED'
  },
  {
    id: 'cls-102',
    code: 'P3CSI1',
    subject: 'Computer Organization & Architecture (COA)',
    facultyId: 'fac-102',
    facultyName: 'Dr. Y S Nijagunarya',
    batch: 'III CSE-A',
    roomId: 'rm-csl001',
    roomNumber: 'CSL-001',
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '08:00 - 09:00',
    color: '#6F4E37'
  },
  {
    id: 'cls-103',
    code: 'P3CS1',
    subject: 'Object Oriented Programming with Java',
    facultyId: 'fac-103',
    facultyName: 'Ms. Shwetha A N',
    batch: 'III CSE-A',
    roomId: 'rm-csl001',
    roomNumber: 'CSL-001',
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '02:00 - 03:00',
    color: '#E5E4E2'
  },
  {
    id: 'cls-104',
    code: 'P3MAT1',
    subject: 'Statistics and Probability',
    facultyId: 'fac-104',
    facultyName: 'Dr. P Usha',
    batch: 'III CSE-A',
    roomId: 'rm-csl001',
    roomNumber: 'CSL-001',
    durationHours: 1,
    preferredDay: 'Tuesday',
    preferredTime: '10:30 - 11:30',
    color: '#BFA5DC'
  },
  {
    id: 'cls-105',
    code: 'P3CS3',
    subject: 'Data Structures and Applications (DS)',
    facultyId: 'fac-105',
    facultyName: 'Dr. Sheela S',
    batch: 'III CSE-A',
    roomId: 'rm-csl001',
    roomNumber: 'CSL-001',
    durationHours: 1,
    preferredDay: 'Tuesday',
    preferredTime: '11:30 - 12:30',
    color: '#8E6548'
  },

  // Batch V Semester AI & DS
  {
    id: 'cls-201',
    code: 'S5CCSI01',
    subject: 'Database Management System (DBMS)',
    facultyId: 'fac-201',
    facultyName: 'Dr. Bharathi P T',
    batch: 'V AI&DS',
    roomId: 'rm-csl102',
    roomNumber: 'CSL-102',
    durationHours: 1,
    preferredDay: 'Tuesday',
    preferredTime: '09:00 - 10:00',
    color: '#D8C8F2'
  },
  {
    id: 'cls-202',
    code: 'S5CCSI02',
    subject: 'Machine Learning Techniques (MLT)',
    facultyId: 'fac-202',
    facultyName: 'Dr. R M Savithramma',
    batch: 'V AI&DS',
    roomId: 'rm-csl102',
    roomNumber: 'CSL-102',
    durationHours: 1,
    preferredDay: 'Tuesday',
    preferredTime: '10:30 - 11:30',
    color: '#6F4E37'
  },

  // Batch VII Semester CSE & AI/DS
  {
    id: 'cls-301',
    code: 'S7CCSPE03',
    subject: 'Agentic AI Architecture',
    facultyId: 'fac-301',
    facultyName: 'Dr. Mahesh Pandit / Mrs. Shilpa S P',
    batch: 'VII CSE-A',
    roomId: 'rm-ai301',
    roomNumber: 'AI-301',
    durationHours: 1,
    preferredDay: 'Wednesday',
    preferredTime: '09:00 - 10:00',
    color: '#A37554'
  },
  {
    id: 'cls-302',
    code: 'S7CSPE02',
    subject: 'Generative AI and Prompt Engineering',
    facultyId: 'fac-302',
    facultyName: 'Dr. Praveen Kumar',
    batch: 'VII CSE-A',
    roomId: 'rm-ai301',
    roomNumber: 'AI-301',
    durationHours: 1,
    preferredDay: 'Wednesday',
    preferredTime: '09:00 - 10:00',
    color: '#CEBCED'
  },
  {
    id: 'cls-303',
    code: 'S7CCSI03',
    subject: 'Natural Language Processing (NLP)',
    facultyId: 'fac-303',
    facultyName: 'Dr. Srinivas K',
    batch: 'VII CSE-A',
    roomId: 'rm-acc2',
    roomNumber: 'ACC2 Lab',
    durationHours: 1,
    preferredDay: 'Monday',
    preferredTime: '03:00 - 04:00',
    color: '#E5E4E2'
  },
  {
    id: 'cls-304',
    code: 'S7CS01',
    subject: 'Real Time Big Data Analytics (RTBDA)',
    facultyId: 'fac-304',
    facultyName: 'Dr. N R Sunitha',
    batch: 'VII CSE-A',
    roomId: 'rm-kalpana',
    roomNumber: 'Kalpana Chawla Lab',
    durationHours: 1,
    preferredDay: 'Wednesday',
    preferredTime: '10:30 - 11:30',
    color: '#BFA5DC'
  }
];

export const INITIAL_FACULTY: FacultyItem[] = [
  {
    id: 'fac-101',
    name: 'Ms. Nidhi L G',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 3,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-102',
    name: 'Dr. Y S Nijagunarya',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 4,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-103',
    name: 'Ms. Shwetha A N',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 4,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-104',
    name: 'Dr. P Usha',
    department: 'Mathematics',
    assignedClassesCount: 5,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-105',
    name: 'Dr. Sheela S',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 4,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-201',
    name: 'Dr. Bharathi P T',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 4,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-202',
    name: 'Dr. R M Savithramma',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 5,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-301',
    name: 'Dr. Mahesh Pandit / Mrs. Shilpa S P',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 3,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-302',
    name: 'Dr. Praveen Kumar',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 3,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-303',
    name: 'Dr. Srinivas K',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 4,
    availability: 'Full-Time',
    status: 'Available'
  },
  {
    id: 'fac-304',
    name: 'Dr. N R Sunitha',
    department: 'Computer Science & Engineering',
    assignedClassesCount: 4,
    availability: 'Full-Time',
    status: 'Available'
  }
];

export const INITIAL_ROOMS: RoomItem[] = [
  {
    id: 'rm-csl001',
    roomNumber: 'CSL-001',
    building: 'Central Academic Complex',
    capacity: 70,
    type: 'Classroom',
    status: 'Available'
  },
  {
    id: 'rm-csl102',
    roomNumber: 'CSL-102',
    building: 'Central Academic Complex',
    capacity: 70,
    type: 'Classroom',
    status: 'Available'
  },
  {
    id: 'rm-csl104',
    roomNumber: 'CSL-104',
    building: 'Central Academic Complex',
    capacity: 70,
    type: 'Classroom',
    status: 'Available'
  },
  {
    id: 'rm-ai301',
    roomNumber: 'AI-301',
    building: 'Advanced Tech Wing',
    capacity: 75,
    type: 'Classroom',
    status: 'Available'
  },
  {
    id: 'rm-acc2',
    roomNumber: 'ACC2 Lab',
    building: 'Computing Center',
    capacity: 45,
    type: 'Lab',
    status: 'Available'
  },
  {
    id: 'rm-kalpana',
    roomNumber: 'Kalpana Chawla Lab',
    building: 'Research Suite',
    capacity: 45,
    type: 'Lab',
    status: 'Available'
  },
  {
    id: 'rm-shakuntala',
    roomNumber: 'Shakunthala Devi Lab',
    building: 'Hardware Systems Wing',
    capacity: 50,
    type: 'Lab',
    status: 'Available'
  },
  {
    id: 'rm-rcc',
    roomNumber: 'RCC Laboratory',
    building: 'Central High-Compute Lab',
    capacity: 50,
    type: 'Lab',
    status: 'Available'
  }
];

export const INITIAL_CONFLICTS: ConflictItem[] = [
  {
    id: 'cnf-sit-01',
    type: 'Student Group Conflict',
    subject1: 'Operating Systems (OS)',
    subject2: 'Computer Organization & Arch (COA)',
    class1Id: 'cls-101',
    class2Id: 'cls-102',
    relatedResource: 'Batch III CSE-A',
    timeSlot: 'Monday 08:00 - 09:00',
    severity: 'Critical',
    status: 'Unresolved'
  },
  {
    id: 'cnf-sit-02',
    type: 'Room Conflict',
    subject1: 'Agentic AI Architecture (S7CCSPE03)',
    subject2: 'Generative AI & Prompt Engg (S7CSPE02)',
    class1Id: 'cls-301',
    class2Id: 'cls-302',
    relatedResource: 'Room AI-301',
    timeSlot: 'Wednesday 09:00 - 10:00',
    severity: 'Critical',
    status: 'Unresolved'
  },
  {
    id: 'cnf-sit-03',
    type: 'Faculty Conflict',
    subject1: 'Machine Learning Techniques (S5CCSI02)',
    subject2: 'Database Management System (DBMS)',
    class1Id: 'cls-202',
    class2Id: 'cls-201',
    relatedResource: 'Dr. R M Savithramma',
    timeSlot: 'Tuesday 10:30 - 11:30',
    severity: 'Warning',
    status: 'Unresolved'
  }
];

export const searchClasses = (query: string, classesList: ClassItem[] = INITIAL_CLASSES): ClassItem[] => {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];
  return classesList.filter(c =>
    c.subject.toLowerCase().includes(clean) ||
    c.code.toLowerCase().includes(clean) ||
    c.facultyName.toLowerCase().includes(clean) ||
    c.batch.toLowerCase().includes(clean) ||
    c.roomNumber.toLowerCase().includes(clean)
  );
};
