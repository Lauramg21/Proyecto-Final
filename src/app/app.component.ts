import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { Navbar2Component } from './components/layout/navbar2/navbar2.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule, NavbarComponent, FooterComponent, Navbar2Component], // Agrega los componentes aquí
})
export class AppComponent implements OnInit {
  isHomePage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Detectar cambios en la ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {

        this.isHomePage = this.router.url === '/';
      });
  }
}