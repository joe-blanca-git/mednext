import { Routes } from '@angular/router';
import { HomeAppComponent } from './features/modules/home/index/home.app.component';
import { AuthGuardService } from './core/guards/auth.guard';
import { HomeComponent } from './features/modules/home/pages/home/home.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
    },
    {
        path: '',
        component: HomeAppComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: HomeComponent,
                title: 'Página Inicial'
            },
            {
                path: 'registers/units',
                loadComponent: () => import('./features/modules/registers/pages/units/units.component').then(c => c.UnitsComponent),
                title: 'Cadastro de Unidades'
            },
            {
                path: 'registers/users',
                loadComponent: () => import('./features/modules/registers/pages/users/users.component').then(c => c.UsersComponent),
                title: 'Cadastro de Usuários'
            },
            {
                path: 'attendance',
                loadComponent: () => import('./features/modules/attendance/pages/attendance/attendance.component').then(c => c.AttendanceComponent)
            },
        ]
    },
    {
        path: 'panel',
        //canActivate: [AuthGuardService],
        loadComponent: () => import('./features/modules/panel/pages/panel/panel.component').then(c => c.PanelComponent)
    }
];
