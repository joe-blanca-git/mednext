import { Injectable, Injector } from '@angular/core';
import {  MenuResponse } from '../../features/shared/components/menu-side/menu-side.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService {

  constructor(
    private router: Router,
    injector: Injector,
    private http: HttpClient
  ) { 
    super(injector);
  }

  async getMenu(): Promise<MenuResponse[]> {
    try {
      const url = `${this.urlApiService}useraccessmap/session`;
      const response = await firstValueFrom(this.http.get<MenuResponse[]>(url, this.GetAuthHeaderJson()));

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

}
