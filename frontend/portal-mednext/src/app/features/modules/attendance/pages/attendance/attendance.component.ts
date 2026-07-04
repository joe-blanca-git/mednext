import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, Category, AttendanceStatus, TimelineEvent } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {
  // Categorias Mockadas
  private catNormal: Category = { id: 1, name: 'Normal', colorClass: 'bg-primary' };
  private catPref: Category = { id: 2, name: 'Preferencial', colorClass: 'bg-warning text-dark' };
  private catUrg: Category = { id: 3, name: 'Urgência', colorClass: 'bg-danger' };
  private catExam: Category = { id: 4, name: 'Exames', colorClass: 'bg-success' };

  // Lista Principal
  tickets: Ticket[] = [];
  
  // Listas do Kanban
  waitingTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  onHoldTickets: Ticket[] = [];
  finishedTickets: Ticket[] = [];

  // Filtros
  searchName: string = '';
  searchNumber: string = '';
  selectedCategory: string = '';
  selectedUnit: string = '';

  // Indicadores
  waitingCount = 0;
  inProgressCount = 0;
  onHoldCount = 0;
  finishedCount = 0;

  // Offcanvas
  selectedTicket: Ticket | null = null;
  
  // Fake update indicator
  lastUpdated: string = 'Atualizado agora';

  ngOnInit() {
    this.generateMockTickets();
    this.applyFilters();
  }

  refreshQueue() {
    this.lastUpdated = 'Atualizando...';
    setTimeout(() => {
      this.lastUpdated = 'Atualizado agora';
      this.applyFilters();
    }, 600);
  }

  applyFilters() {
    let filtered = this.tickets.filter(t => {
      const matchName = !this.searchName || t.patientName.toLowerCase().includes(this.searchName.toLowerCase());
      const matchNum = !this.searchNumber || t.number.toLowerCase().includes(this.searchNumber.toLowerCase());
      const matchCat = !this.selectedCategory || t.category.name === this.selectedCategory;
      const matchUnit = !this.selectedUnit || t.unit === this.selectedUnit;
      return matchName && matchNum && matchCat && matchUnit;
    });

    this.waitingTickets = filtered.filter(t => t.status === 'WAITING');
    this.inProgressTickets = filtered.filter(t => t.status === 'IN_PROGRESS');
    this.onHoldTickets = filtered.filter(t => t.status === 'ON_HOLD');
    this.finishedTickets = filtered.filter(t => t.status === 'FINISHED');

    this.waitingCount = this.waitingTickets.length;
    this.inProgressCount = this.inProgressTickets.length;
    this.onHoldCount = this.onHoldTickets.length;
    this.finishedCount = this.finishedTickets.length;
  }

  clearFilters() {
    this.searchName = '';
    this.searchNumber = '';
    this.selectedCategory = '';
    this.selectedUnit = '';
    this.applyFilters();
  }

  viewTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
  }

  // --- Ações do Kanban ---

  callTicket(ticket: Ticket) {
    // Chamando a senha... vai para IN_PROGRESS e registra evento
    this.changeTicketStatus(ticket, 'IN_PROGRESS', 'Chamada', 'Paciente chamado ao painel.');
  }

  startAttendance(ticket: Ticket) {
    this.changeTicketStatus(ticket, 'IN_PROGRESS', 'Em Atendimento', 'Atendimento iniciado.');
  }

  putOnHold(ticket: Ticket) {
    this.changeTicketStatus(ticket, 'ON_HOLD', 'Em Espera', 'Colocado em espera para aguardar documentação.');
  }

  resumeAttendance(ticket: Ticket) {
    this.changeTicketStatus(ticket, 'IN_PROGRESS', 'Retomado', 'Atendimento retomado pelo operador.');
  }

  finishAttendance(ticket: Ticket) {
    this.changeTicketStatus(ticket, 'FINISHED', 'Finalizado', 'Atendimento concluído com sucesso.');
  }

  cancelTicket(ticket: Ticket) {
    this.changeTicketStatus(ticket, 'FINISHED', 'Cancelado', 'Senha cancelada por ausência.');
    // Para simplificar no mock, mandamos pra finalizado, na prática poderia ter um status CANCELLED.
  }

  private changeTicketStatus(ticket: Ticket, newStatus: AttendanceStatus, title: string, desc: string) {
    ticket.status = newStatus;
    
    // Adiciona evento na timeline
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    ticket.timeline.unshift({
      time: timeStr,
      title: title,
      description: desc,
      icon: 'bi-check-circle-fill',
      colorClass: 'text-primary'
    });

    this.applyFilters(); // Recarrega as colunas
  }

  private generateMockTickets() {
    const patients = ['João Silva', 'Maria Fernandes', 'Carlos Souza', 'Ana Paula', 'Roberta Lima', 'Felipe Santos', 'Juliana Alves', 'Marcos Castro', 'Sonia Machado', 'Lucas Pereira', 'Patrícia Gomes', 'Renata Vieira', 'Thiago Rocha', 'Bruna Mendes', 'Bruno Costa', 'Camila Nunes', 'Rodrigo Moreira', 'Amanda Teixeira', 'Diego Farias', 'Marina Dias'];
    const units = ['Centro', 'Zona Norte', 'Zona Sul', 'Leste'];
    const locations = ['Guichê 1', 'Guichê 2', 'Consultório 1', 'Recepção'];
    
    for (let i = 1; i <= 25; i++) {
      const isFinished = i % 4 === 0;
      const isInProgress = i % 7 === 0 && !isFinished;
      const isOnHold = i % 11 === 0 && !isFinished;
      
      let status: AttendanceStatus = 'WAITING';
      if (isFinished) status = 'FINISHED';
      else if (isInProgress) status = 'IN_PROGRESS';
      else if (isOnHold) status = 'ON_HOLD';

      const cat = i % 5 === 0 ? this.catUrg : (i % 3 === 0 ? this.catPref : (i % 2 === 0 ? this.catExam : this.catNormal));

      const hour = Math.floor(Math.random() * 5) + 8; // 8 to 12
      const min = Math.floor(Math.random() * 60);
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

      let ticket: Ticket = {
        id: i,
        number: `${cat.name.charAt(0).toUpperCase()}${i.toString().padStart(3, '0')}`,
        patientName: patients[i % patients.length],
        category: cat,
        unit: units[i % units.length],
        location: locations[i % locations.length],
        status: status,
        issueTime: timeStr,
        waitingTimeMinutes: Math.floor(Math.random() * 60) + 5,
        notes: i % 3 === 0 ? 'Paciente precisa de auxílio locomoção.' : '',
        timeline: [
          { time: timeStr, title: 'Senha emitida', description: 'Totem de autoatendimento.', icon: 'bi-ticket-perforated-fill', colorClass: 'text-secondary' }
        ]
      };

      if (status !== 'WAITING') {
        const cTime = `${hour}:${(min + 15).toString().padStart(2, '0')}`;
        ticket.timeline.unshift({ time: cTime, title: 'Chamada', description: 'Painel principal', icon: 'bi-megaphone-fill', colorClass: 'text-primary' });
      }

      if (status === 'FINISHED') {
        const fTime = `${hour + 1}:${min.toString().padStart(2, '0')}`;
        ticket.timeline.unshift({ time: fTime, title: 'Finalizado', description: 'Atendimento concluído', icon: 'bi-check-circle-fill', colorClass: 'text-success' });
      }

      this.tickets.push(ticket);
    }
  }
}
