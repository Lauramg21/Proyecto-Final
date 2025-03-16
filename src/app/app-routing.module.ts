import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/layout/home/home.component';
import { LoginComponent } from './components/layout/login/login.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { UsuariosComponent } from './components/layout/usuarios/usuarios.component';
import { SeccionesComponent } from './components/layout/secciones/secciones.component';
import { EquiposComponent } from './components/layout/equipos/equipos.component';
import { JugadoresComponent } from './components/layout/jugadores/jugadores.component';
import { PartidosComponent } from './components/layout/partidos/partidos.component';
import { AccionesComponent } from './components/layout/acciones/acciones.component';
import { EstadisticasComponent } from './components/layout/estadisticas/estadisticas.component';
import { AsignarAccionComponent } from './components/layout/asignar-accion/asignar-accion.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'users', component:UsuariosComponent},
  { path: 'secciones', component:SeccionesComponent},
  { path: 'equipos', component:EquiposComponent},
  { path: 'jugadores', component:JugadoresComponent},
  { path: 'partidos', component:PartidosComponent},
  { path: 'acciones', component:AccionesComponent},
  { path: 'estadisticas', component:EstadisticasComponent},
  { path: 'asignar', component:AsignarAccionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
