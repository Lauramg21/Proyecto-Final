import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/layout/home/home.component';
import { LoginComponent } from './components/layout/login/login.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { UsuariosComponent } from './components/layout/usuarios/usuarios.component';
import { SeccionesComponent } from './components/layout/secciones/secciones.component';
import { EquiposComponent } from './components/layout/equipos/equipos.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'users', component:UsuariosComponent},
  { path: 'secciones', component:SeccionesComponent},
  { path: 'equipos', component:EquiposComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
