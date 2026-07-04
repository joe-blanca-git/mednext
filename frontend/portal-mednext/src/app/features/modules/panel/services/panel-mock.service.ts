import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Category, PanelTicket } from '../models/panel.models';

@Injectable({
  providedIn: 'root'
})
export class PanelMockService {
  private categories: Category[] = [
    { id: 1, name: 'Normal', color: 'primary' },
    { id: 2, name: 'Preferencial', color: 'warning' },
    { id: 3, name: 'Retorno', color: 'info' },
    { id: 4, name: 'Exame', color: 'success' }
  ];

  private destinations = ['Consultório 01', 'Consultório 02', 'Consultório 03', 'Consultório 04', 'Guichê 01', 'Guichê 02', 'Sala 05'];

  private waitingTickets: PanelTicket[] = [];
  private lastCalledTickets: PanelTicket[] = [];
  private currentCall: PanelTicket | null = null;

  // Subjects to emit state changes
  private waitingSubject = new BehaviorSubject<PanelTicket[]>([]);
  private lastCalledSubject = new BehaviorSubject<PanelTicket[]>([]);
  private currentCallSubject = new BehaviorSubject<PanelTicket | null>(null);

  waiting$ = this.waitingSubject.asObservable();
  lastCalled$ = this.lastCalledSubject.asObservable();
  currentCall$ = this.currentCallSubject.asObservable();

  constructor() {
    this.generateInitialData();
  }

  private generateInitialData() {
    // Generate some waiting tickets (approx 30)
    for (let i = 1; i <= 30; i++) {
      this.waitingTickets.push(this.createRandomTicket(i));
    }
    this.waitingSubject.next([...this.waitingTickets]);
  }

  private createRandomTicket(index: number): PanelTicket {
    const category = this.categories[Math.floor(Math.random() * this.categories.length)];
    const destination = this.destinations[Math.floor(Math.random() * this.destinations.length)];
    const prefix = category.name.charAt(0).toUpperCase();
    
    return {
      id: `TKT-${index}-${Date.now()}`,
      number: `${prefix}${index.toString().padStart(3, '0')}`,
      destination: destination,
      category: category,
      status: 'waiting'
    };
  }

  // Simulates the backend pushing a new call
  public announceNextTicket() {
    if (this.waitingTickets.length === 0) {
      // For demo purposes, replenish the queue if it's empty
      this.generateInitialData();
    }

    // Move current call to last called if exists
    if (this.currentCall) {
      this.currentCall.status = 'finished';
      this.lastCalledTickets.unshift(this.currentCall); // Add to top of list
      
      // Keep only last 10
      if (this.lastCalledTickets.length > 10) {
        this.lastCalledTickets.pop();
      }
      this.lastCalledSubject.next([...this.lastCalledTickets]);
    }

    // Get next ticket from waiting queue
    const nextTicket = this.waitingTickets.shift();
    if (nextTicket) {
      nextTicket.status = 'calling';
      nextTicket.timeCalled = new Date();
      this.currentCall = nextTicket;
      
      this.waitingSubject.next([...this.waitingTickets]);
      this.currentCallSubject.next({ ...this.currentCall });
    }
  }

  public getClinicName(): string {
    return 'Clínica MedNext';
  }
}
