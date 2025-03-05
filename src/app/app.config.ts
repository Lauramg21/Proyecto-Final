import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig = [
  provideRouter(appRoutes), // Proveedor de rutas
  // Puedes incluir otros proveedores como servicios globales aquí
];
