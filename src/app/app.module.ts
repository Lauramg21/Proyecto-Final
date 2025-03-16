import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { AppComponent } from './app.component';
import { HomeComponent } from './components/layout/home/home.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { LoginComponent } from './components/layout/login/login.component';
import { Navbar2Component } from './components/layout/navbar2/navbar2.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { NavbarDashboardComponent } from './components/layout/navbar-dashboard/navbar-dashboard.component';
import { UsuariosComponent } from './components/layout/usuarios/usuarios.component';
import { SeccionesComponent } from './components/layout/secciones/secciones.component';
import { EquiposComponent } from './components/layout/equipos/equipos.component';
import { JugadoresComponent } from './components/layout/jugadores/jugadores.component';
import { PartidosComponent } from './components/layout/partidos/partidos.component';
import { AccionesComponent } from './components/layout/acciones/acciones.component';
import { EstadisticasComponent } from './components/layout/estadisticas/estadisticas.component';
import { AsignarAccionComponent } from './components/layout/asignar-accion/asignar-accion.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    Navbar2Component,
    DashboardComponent,
    NavbarDashboardComponent,
    RouterModule,
    UsuariosComponent,
    SeccionesComponent,
    EquiposComponent,
    JugadoresComponent,
    PartidosComponent,
    AccionesComponent,
    EstadisticasComponent,
    AsignarAccionComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
