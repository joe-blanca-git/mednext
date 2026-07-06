import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketType, ServiceType, TicketSummary, GeneratedTicket } from '../../models/totem.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-totem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './totem.component.html',
  styleUrl: './totem.component.scss'
})
export class TotemComponent implements OnInit {
  
  currentStep: number = 1;
  isProcessing: boolean = false;
  
  // Mock Data
  unitName: string = 'Recepção Central';
  
  ticketTypes: TicketType[] = [
    {
      id: 'convencional',
      name: 'Atendimento Convencional',
      description: 'Atendimento para pacientes em geral.',
      icon: 'bi-person-fill',
      colorClass: 'text-primary',
      prefix: 'C'
    },
    {
      id: 'prioritario',
      name: 'Atendimento Prioritário',
      description: 'Idosos, gestantes, pessoas com deficiência e demais prioridades legais.',
      icon: 'bi-person-hearts',
      colorClass: 'text-danger',
      prefix: 'P'
    }
  ];

  services: ServiceType[] = [
    { id: 's1', name: 'Consulta Médica', description: 'Atendimento com clínico ou especialista', icon: 'bi-clipboard2-pulse' },
    { id: 's2', name: 'Retorno Médico', description: 'Retorno de consulta anterior', icon: 'bi-arrow-counterclockwise' },
    { id: 's3', name: 'Resultados de Exames', description: 'Retirada ou avaliação de resultados', icon: 'bi-file-earmark-medical' },
    { id: 's4', name: 'Autorização de Exames', description: 'Aprovação junto a convênios', icon: 'bi-shield-check' },
    { id: 's5', name: 'Coleta Laboratorial', description: 'Exames de sangue e coleta geral', icon: 'bi-droplet' },
    { id: 's6', name: 'Vacinação', description: 'Aplicação de vacinas', icon: 'bi-bandaid' },
    { id: 's7', name: 'Atendimento Administrativo', description: 'Dúvidas, pagamentos e informações', icon: 'bi-headset' }
  ];

  // State
  selectedType: TicketType | null = null;
  selectedService: ServiceType | null = null;
  generatedTicket: GeneratedTicket | null = null;
  
  currentDate: string = '';
  currentTime: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateDateTime();
  }

  private updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('pt-BR');
    this.currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  selectType(type: TicketType) {
    this.selectedType = type;
    this.nextStep();
  }

  selectService(service: ServiceType) {
    this.selectedService = service;
    this.nextStep();
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
      this.updateDateTime();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  printTicket() {
    this.isProcessing = true;
    
    // Simulate API call and printing delay
    setTimeout(() => {
      this.isProcessing = false;
      this.generateFinalTicket();
      this.currentStep = 4;
      
      // Auto return to start after 10 seconds
      setTimeout(() => {
        if (this.currentStep === 4) {
          this.resetTotem();
        }
      }, 10000);
      
    }, 2000);
  }

  private generateFinalTicket() {
    const prefix = this.selectedType?.prefix || 'N';
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const formattedNum = randomNum.toString().padStart(3, '0');
    
    this.updateDateTime();
    
    this.generatedTicket = {
      number: `${prefix}${formattedNum}`,
      type: this.selectedType?.name || 'Convencional',
      service: this.selectedService?.name || 'Geral',
      issueTime: this.currentTime
    };
  }

  resetTotem() {
    this.currentStep = 1;
    this.selectedType = null;
    this.selectedService = null;
    this.generatedTicket = null;
    this.isProcessing = false;
  }
}
