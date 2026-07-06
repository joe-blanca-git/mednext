import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userName: string = 'João';

  // Modal properties
  showPanelModal = false;
  selectedUnit = '';
  selectedLocation = '';

  showTotemModal = false;
  totemUnit = '';
  totemLocation = '';

  indicators = [
    { title: 'Senhas Geradas Hoje', value: 128, description: '+12% em relação a ontem', icon: 'bi-ticket-perforated', colorClass: 'text-primary', bgClass: 'bg-primary-subtle' },
    { title: 'Senhas Atendidas', value: 97, description: 'Ótimo desempenho', icon: 'bi-check-circle', colorClass: 'text-success', bgClass: 'bg-success-subtle' },
    { title: 'Em Atendimento', value: 12, description: 'No momento', icon: 'bi-person-video2', colorClass: 'text-warning', bgClass: 'bg-warning-subtle' },
    { title: 'Aguardando', value: 19, description: 'Tempo médio de espera 12m', icon: 'bi-hourglass-split', colorClass: 'text-danger', bgClass: 'bg-danger-subtle' }
  ];

  unitSummary = [
    { name: 'Centro', generated: 45, attended: 39, waiting: 6, avgTime: '08:12' },
    { name: 'Zona Norte', generated: 31, attended: 26, waiting: 5, avgTime: '09:01' },
    { name: 'Zona Sul', generated: 28, attended: 20, waiting: 8, avgTime: '11:30' },
    { name: 'Leste', generated: 24, attended: 12, waiting: 0, avgTime: '07:45' }
  ];

  quickAccess = [
    { name: 'Unidades', description: 'Gerenciar unidades e setores', icon: 'bi-building', route: '/registers/units' },
    { name: 'Usuários', description: 'Controle de acessos e perfis', icon: 'bi-people', route: '/registers/users' },
    { name: 'Atendimento', description: 'Iniciar ou gerenciar filas', icon: 'bi-headset', route: '/attendance' },
    { name: 'Painel', description: 'Visualizar painel de chamadas', icon: 'bi-display', action: 'panelModal' },
    { name: 'Histórico', description: 'Relatório de chamadas', icon: 'bi-clock-history', route: '/history' },
    { name: 'Iniciar Totem', description: 'Autoatendimento', icon: 'bi-tablet', action: 'totemModal' }
  ];

  constructor(private router: Router, private location: Location) {}

  handleQuickAccess(quick: any) {
    if (quick.route) {
      this.router.navigate([quick.route]);
    } else if (quick.action === 'panelModal') {
      this.showPanelModal = true;
    } else if (quick.action === 'totemModal') {
      this.showTotemModal = true;
    }
  }

  closePanelModal() {
    this.showPanelModal = false;
    this.selectedUnit = '';
    this.selectedLocation = '';
  }

  openPanel() {
    this.showPanelModal = false;
    const urlTree = this.router.createUrlTree(['/panel'], {
      queryParams: {
        unit: this.selectedUnit,
        location: this.selectedLocation
      }
    });
    
    // Ensure the baseHref (/portal-next/) is appended correctly
    const finalUrl = this.location.prepareExternalUrl(this.router.serializeUrl(urlTree));
    
    // Open in a completely new window (not just a new tab) by specifying window features
    window.open(finalUrl, '_blank', 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
  }

  closeTotemModal() {
    this.showTotemModal = false;
    this.totemUnit = '';
    this.totemLocation = '';
  }

  openTotem() {
    this.showTotemModal = false;
    const urlTree = this.router.createUrlTree(['/totem'], {
      queryParams: {
        unit: this.totemUnit,
        location: this.totemLocation
      }
    });
    const finalUrl = this.location.prepareExternalUrl(this.router.serializeUrl(urlTree));
    window.open(finalUrl, '_blank', 'width=1024,height=768,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
  }
}
