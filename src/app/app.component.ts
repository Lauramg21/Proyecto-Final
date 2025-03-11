import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { Navbar2Component } from './components/layout/navbar2/navbar2.component';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { NavbarDashboardComponent } from './components/layout/navbar-dashboard/navbar-dashboard.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule, NavbarComponent, FooterComponent, Navbar2Component, DashboardComponent, NavbarDashboardComponent], // Agrega los componentes aquí
})
export class AppComponent implements OnInit {
  isHomePage: boolean = false;
  isLoginPage: boolean = false;
  isDashboardPage: boolean = false;
  constructor(private router: Router) {}

  ngOnInit() {
    // Detectar cambios en la ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        this.isHomePage = this.router.url === '/';
        this.isLoginPage = currentUrl.startsWith('/login'); 
        this.isDashboardPage = currentUrl.startsWith('/dashboard');
      });
  }
}