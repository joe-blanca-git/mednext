export type AttendanceStatus = 'WAITING' | 'IN_PROGRESS' | 'ON_HOLD' | 'FINISHED';

export interface Category {
  id: number;
  name: string;
  colorClass: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  description?: string;
  icon?: string;
  colorClass?: string;
}

export interface Ticket {
  id: number;
  number: string; // Ex: A023
  patientName: string;
  category: Category;
  unit: string;
  location: string;
  status: AttendanceStatus;
  issueTime: string; // ISO String
  callTime?: string;
  startTime?: string;
  finishTime?: string;
  waitingTimeMinutes: number;
  attendanceTimeMinutes?: number;
  notes?: string;
  timeline: TimelineEvent[];
}
