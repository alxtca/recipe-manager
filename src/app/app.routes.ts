import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'recipe/:id',
    loadComponent: () =>
      import('./features/recipe-detail/recipe-detail.component').then((m) => m.RecipeDetailComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'dashboard/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/recipe-form/recipe-form.component').then((m) => m.RecipeFormComponent),
  },
  {
    path: 'dashboard/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/recipe-form/recipe-form.component').then((m) => m.RecipeFormComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
