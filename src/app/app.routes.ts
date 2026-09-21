import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
      {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transactions.component')
        .then(m => m.TransactionsComponent)
  },
  {
    path: 'budgets',
    loadComponent: () =>
      import('./features/budgets/budgets.component')
        .then(m => m.BudgetsComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports.component')
        .then(m => m.ReportsComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component')
        .then(m => m.ProfileComponent)
  },
]},
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];