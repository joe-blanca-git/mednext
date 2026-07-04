import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  searchTerm: string = '';

  usersList: IUser[] = [
    { id: 1, name: 'Ana Silva', email: 'ana.silva@mednext.com', registration: 'MAT001', active: true, onVacation: false, lastAccess: '2023-10-25T08:30:00' },
    { id: 2, name: 'Carlos Santos', email: 'carlos.santos@mednext.com', registration: 'MAT002', active: true, onVacation: true, vacationStart: '2023-10-20', vacationEnd: '2023-11-20', lastAccess: '2023-10-19T17:45:00' },
    { id: 3, name: 'Mariana Costa', email: 'mariana.costa@mednext.com', registration: 'MAT003', active: false, onVacation: false, lastAccess: '2023-09-15T09:12:00' },
    { id: 4, name: 'João Pedro', email: 'joao.pedro@mednext.com', registration: 'MAT004', active: true, onVacation: false, lastAccess: '2023-10-25T14:20:00' },
    { id: 5, name: 'Fernanda Lima', email: 'fernanda.lima@mednext.com', registration: 'MAT005', active: true, onVacation: false, lastAccess: '2023-10-24T11:05:00' },
    { id: 6, name: 'Rafael Oliveira', email: 'rafael.oliveira@mednext.com', registration: 'MAT006', active: true, onVacation: false, lastAccess: '2023-10-23T16:50:00' },
    { id: 7, name: 'Juliana Almeida', email: 'juliana.almeida@mednext.com', registration: 'MAT007', active: true, onVacation: true, vacationStart: '2023-10-01', vacationEnd: '2023-10-30', lastAccess: '2023-09-30T18:00:00' },
    { id: 8, name: 'Roberto Mendes', email: 'roberto.mendes@mednext.com', registration: 'MAT008', active: false, onVacation: false, lastAccess: '2023-05-10T10:30:00' },
    { id: 9, name: 'Camila Rocha', email: 'camila.rocha@mednext.com', registration: 'MAT009', active: true, onVacation: false, lastAccess: '2023-10-25T10:15:00' },
    { id: 10, name: 'Eduardo Martins', email: 'eduardo.martins@mednext.com', registration: 'MAT010', active: true, onVacation: false, lastAccess: '2023-10-25T07:45:00' },
  ];

  filteredUsers = [...this.usersList];

  selectedUser: IUser | null = null;
  
  // Data picker helper
  vacationData = {
    start: '',
    end: ''
  };

  search() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.usersList];
      return;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredUsers = this.usersList.filter(u => 
      u.name.toLowerCase().includes(lowerTerm) || 
      u.email.toLowerCase().includes(lowerTerm) ||
      u.registration.toLowerCase().includes(lowerTerm)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredUsers = [...this.usersList];
  }

  openNewModal() {
    this.selectedUser = {
      id: 0,
      name: '',
      email: '',
      registration: '',
      active: true,
      onVacation: false,
      lastAccess: new Date().toISOString()
    };
  }

  openEditModal(user: IUser) {
    this.selectedUser = JSON.parse(JSON.stringify(user));
  }

  openDeleteModal(user: IUser) {
    this.selectedUser = user;
  }

  openVacationModal(user: IUser) {
    this.selectedUser = user;
    this.vacationData = {
      start: user.vacationStart || '',
      end: user.vacationEnd || ''
    };
  }

  saveUser() {
    if (this.selectedUser) {
      if (this.selectedUser.id === 0) {
        this.selectedUser.id = Math.max(...this.usersList.map(u => u.id)) + 1;
        this.usersList.unshift(this.selectedUser);
      } else {
        const index = this.usersList.findIndex(u => u.id === this.selectedUser!.id);
        if (index > -1) {
          this.usersList[index] = this.selectedUser;
        }
      }
      this.search();
    }
  }

  deleteUser() {
    if (this.selectedUser) {
      this.usersList = this.usersList.filter(u => u.id !== this.selectedUser!.id);
      this.search();
    }
  }

  saveVacation() {
    if (this.selectedUser) {
      const index = this.usersList.findIndex(u => u.id === this.selectedUser!.id);
      if (index > -1) {
        this.usersList[index].onVacation = true;
        this.usersList[index].vacationStart = this.vacationData.start;
        this.usersList[index].vacationEnd = this.vacationData.end;
      }
      this.search();
    }
  }
}
