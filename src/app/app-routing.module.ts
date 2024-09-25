import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logistica'] }
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory/inventory.page').then(m => m.InventoryPage),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logistica'] }
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.page').then(m => m.ReportsPage),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logistica', 'consulta'] }
  },
  {
    path: 'categories',
    loadComponent: () => import('./categories/categories.page').then(m => m.CategoriesPage),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logistica'] }
  },
  {
    path: 'stock',
    loadComponent: () => import('./stock/stock.page').then(m => m.StockPage),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logistica'] }
  },
  {
    path: 'product',
    loadComponent: () => import('./product/product.page').then(m => m.ProductPage),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logistica', 'consulta'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}