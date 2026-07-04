export interface Category {
  id: number;
  name: string;
  color?: string; // Optional color for category highlight
}

export interface PanelTicket {
  id: string;
  number: string;      // e.g., 'A023'
  patientName?: string; // e.g., 'João Silva'
  destination: string; // e.g., 'Consultório 04'
  category: Category;
  timeCalled?: Date;   // Set when promoted to "calling"
  status: 'waiting' | 'calling' | 'finished';
}
