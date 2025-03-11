import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/layout/home/home.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { LoginComponent } from './components/layout/login/login.component';
import { Navbar2Component } from './components/layout/navbar2/navbar2.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { NavbarDashboardComponent } from './components/layout/navbar-dashboard/navbar-dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    Navbar2Component,
    DashboardComponent,
    NavbarDashboardComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
