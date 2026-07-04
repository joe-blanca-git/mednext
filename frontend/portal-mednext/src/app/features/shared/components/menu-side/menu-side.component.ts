import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MenuService } from '../../../../core/services/menu.service';
import { RouterModule, Router } from '@angular/router';

export interface MenuResponse {
  appSystemId: number;
  appSystemName: string;
  menus: IMenuItem[];
}

export interface IMenuItem {
  menuId: number;
  menuName: string;
  icon: string;
  route?: string;
  submenus?: SubMenu[];
  expanded?: boolean;
}

export interface SubMenu {
  submenuId: number;
  submenuName: string;
  route: string;
}

@Component({
  selector: 'app-menu-side',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-side.component.html',
  styleUrl: './menu-side.component.scss'
})
export class MenuSideComponent {
  @Input() sidebarCollapsed = false;
  @Input() activeTab = 'dashboard';
  @Output() tabChange = new EventEmitter<string>();

  menu: IMenuItem[] = [];

  constructor(
    private menuService: MenuService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchMenu();
    }
  }

  setActiveTab(tab: string) {
    this.router.navigate([tab]);
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }

  toggleMenu(item: IMenuItem) {
    if (!this.sidebarCollapsed) {
      item.expanded = !item.expanded;
    }
  }

  navigateToMenu(item: IMenuItem) {
    this.setActiveTab(this.getRoute(item));
  }

  getRoute(item: IMenuItem): string {
    return item.route || '';
  }

  async fetchMenu() {
    try {
      const menuData = await this.menuService.getMenu();

      this.menu = menuData[0].menus;
    
      
    } catch (error) {
      console.error('Error fetching menu:', error);
      this.menu = []; // fallback or keep previous state
    }
  }
}
