import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUnit, ILocation } from '../../models/unit.model';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent {
  searchTerm: string = '';
  
  unitsList: IUnit[] = [
    { id: 1, name: 'Unidade Centro', description: 'Matriz Principal', state: 'SP', city: 'São Paulo', neighborhood: 'Centro', street: 'Rua A', number: '100', complement: '', zipCode: '01000-000', phone: '(11) 9999-9999', active: true, locations: [{ id: 1, name: 'Recepção 1', description: 'Andar Térreo' }, { id: 2, name: 'Consultório 1', description: 'Sala 10' }] },
    { id: 2, name: 'Unidade Zona Norte', description: 'Filial Norte', state: 'SP', city: 'São Paulo', neighborhood: 'Santana', street: 'Rua B', number: '200', complement: 'Sala 2', zipCode: '02000-000', phone: '(11) 8888-8888', active: true, locations: [] },
    { id: 3, name: 'Unidade Zona Sul', description: 'Filial Sul', state: 'SP', city: 'São Paulo', neighborhood: 'Santo Amaro', street: 'Rua C', number: '300', complement: '', zipCode: '04000-000', phone: '(11) 7777-7777', active: false, locations: [{ id: 3, name: 'Laboratório', description: 'Anexo' }] },
    { id: 4, name: 'Unidade Leste', description: 'Filial Leste', state: 'SP', city: 'São Paulo', neighborhood: 'Tatuapé', street: 'Rua D', number: '400', complement: '', zipCode: '03000-000', phone: '(11) 6666-6666', active: true, locations: [] },
    { id: 5, name: 'Unidade Oeste', description: 'Filial Oeste', state: 'SP', city: 'São Paulo', neighborhood: 'Pinheiros', street: 'Rua E', number: '500', complement: '', zipCode: '05000-000', phone: '(11) 5555-5555', active: true, locations: [] },
    { id: 6, name: 'Clínica Sorriso', description: 'Odontologia', state: 'RJ', city: 'Rio de Janeiro', neighborhood: 'Botafogo', street: 'Rua F', number: '600', complement: '', zipCode: '22000-000', phone: '(21) 4444-4444', active: true, locations: [] },
    { id: 7, name: 'Clínica Vida', description: 'Geral', state: 'MG', city: 'Belo Horizonte', neighborhood: 'Savassi', street: 'Rua G', number: '700', complement: '', zipCode: '30000-000', phone: '(31) 3333-3333', active: false, locations: [] },
    { id: 8, name: 'Posto Saúde', description: 'Comunitário', state: 'PR', city: 'Curitiba', neighborhood: 'Batel', street: 'Rua H', number: '800', complement: '', zipCode: '80000-000', phone: '(41) 2222-2222', active: true, locations: [] },
    { id: 9, name: 'Unidade Paulista', description: 'Especialidades', state: 'SP', city: 'São Paulo', neighborhood: 'Bela Vista', street: 'Av Paulista', number: '900', complement: 'Andar 5', zipCode: '01310-000', phone: '(11) 1111-1111', active: true, locations: [] },
    { id: 10, name: 'Unidade ABC', description: 'Região do ABC', state: 'SP', city: 'Santo André', neighborhood: 'Centro', street: 'Rua I', number: '1000', complement: '', zipCode: '09000-000', phone: '(11) 0000-0000', active: true, locations: [] }
  ];

  filteredUnits = [...this.unitsList];

  selectedUnit: IUnit | null = null;
  newLocation: ILocation = { id: 0, name: '', description: '' };

  search() {
    if (!this.searchTerm) {
      this.filteredUnits = [...this.unitsList];
      return;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredUnits = this.unitsList.filter(u => 
      u.name.toLowerCase().includes(lowerTerm) || 
      u.city.toLowerCase().includes(lowerTerm)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredUnits = [...this.unitsList];
  }

  openNewModal() {
    this.selectedUnit = {
      id: 0,
      name: '',
      description: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      number: '',
      complement: '',
      zipCode: '',
      phone: '',
      active: true,
      locations: []
    };
  }

  openEditModal(unit: IUnit) {
    this.selectedUnit = JSON.parse(JSON.stringify(unit)); 
  }

  openDeleteModal(unit: IUnit) {
    this.selectedUnit = unit;
  }

  saveUnit() {
    if (this.selectedUnit) {
      if (this.selectedUnit.id === 0) {
        this.selectedUnit.id = Math.max(...this.unitsList.map(u => u.id)) + 1;
        this.unitsList.unshift(this.selectedUnit);
      } else {
        const index = this.unitsList.findIndex(u => u.id === this.selectedUnit!.id);
        if (index > -1) {
          this.unitsList[index] = this.selectedUnit;
        }
      }
      this.search();
    }
  }

  deleteUnit() {
    if (this.selectedUnit) {
      this.unitsList = this.unitsList.filter(u => u.id !== this.selectedUnit!.id);
      this.search();
    }
  }

  addLocation() {
    if (this.newLocation.name && this.selectedUnit) {
      this.newLocation.id = Math.floor(Math.random() * 1000) + 100;
      this.selectedUnit.locations.push({...this.newLocation});
      this.newLocation = { id: 0, name: '', description: '' };
    }
  }

  removeLocation(locId: number) {
    if (this.selectedUnit) {
      this.selectedUnit.locations = this.selectedUnit.locations.filter(l => l.id !== locId);
    }
  }
}
