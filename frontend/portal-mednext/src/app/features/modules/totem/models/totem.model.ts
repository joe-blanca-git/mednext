export interface TicketType {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  prefix: string; // Ex: 'N' para Normal, 'P' para Prioritário
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface TicketSummary {
  type: TicketType | null;
  service: ServiceType | null;
  unitName: string;
  date: string;
  time: string;
}

export interface GeneratedTicket {
  number: string;
  type: string;
  service: string;
  issueTime: string;
}
