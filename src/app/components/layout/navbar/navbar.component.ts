import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router'; // Importamos Router para manejar la ruta actual
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  isHome = false; // Variable para saber si estamos en la página de inicio

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkRoute(); // Verificar la ruta al iniciar
    this.checkScroll(); // Verificar el scroll si estamos en la página de inicio
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkScroll();
  }

  // Cambia el fondo del navbar si estamos en el Home y si se ha hecho scroll
  checkScroll() {
    if (this.isHome) {
      this.isScrolled = window.scrollY > 0; // Si se hace scroll, cambia el fondo
    } else {
      this.isScrolled = true; // En otras páginas, el fondo siempre es blanco
    }
  }

  // Verifica si estamos en la página de inicio
  checkRoute() {
    this.isHome = this.router.url === '/'; // Si estamos en la página de inicio
  }

  desplegarMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
