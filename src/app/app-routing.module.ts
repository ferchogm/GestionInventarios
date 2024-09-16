import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard'; // Importar el guard para los roles

const routes: Routes = [
  // Ruta por defecto que redirige a la página de inicio de sesión
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta para la página de inicio de sesión
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },

  // Ruta para la página de creación de cuenta
  {
    path: 'create-account',
    loadChildren: () => import('./create-account/create-account.module').then(m => m.CreateAccountPageModule)
  },

  // Ruta para el menú principal accesible solo por roles admin y logística
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logística'] }
  },

  // Ruta para la sección de inventario
  {
    path: 'inventory',
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logística'] }
  },

  // Ruta para la sección de reportes
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logística', 'consulta'] }
  },

  // Ruta para la sección de categorías
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logística'] }
  },

  // Ruta para la sección de gestión de usuarios (solo accesible por admin)
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },

  // Ruta para la sección de gestión de stock
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then(m => m.StockPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logística'] }
  },

  // Ruta para la sección de consulta de productos
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'logística', 'consulta'] }
  },

  // Ruta comodín para manejar rutas no encontradas
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
