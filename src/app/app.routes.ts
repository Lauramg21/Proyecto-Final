import { Routes } from '@angular/router';
import { HomeComponent } from './components/layout/home/home.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent }, // Ruta para el Home
  // Puedes agregar otras rutas aquí
  { path: '**', redirectTo: '' }, // Ruta de fallback
];
