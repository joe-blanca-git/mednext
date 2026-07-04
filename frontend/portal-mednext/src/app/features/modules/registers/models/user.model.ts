export interface IUser {
  id: number;
  name: string;
  email: string;
  registration: string;
  active: boolean;
  onVacation: boolean;
  vacationStart?: string;
  vacationEnd?: string;
  lastAccess: string;
}
