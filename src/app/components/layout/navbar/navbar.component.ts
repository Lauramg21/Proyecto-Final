import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false; // Nueva propiedad para el estado del scroll

  constructor() {}

  ngOnInit(): void {
    // Inicializa el estado del navbar en función del scroll
    this.checkScroll();
  }

  // Detecta el desplazamiento y actualiza el estado
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkScroll();
  }

  checkScroll() {
    if (window.scrollY > 0) {
      this.isScrolled = true; // Activa el fondo blanco si se ha desplazado
    } else {
      this.isScrolled = false; // Mantiene el fondo transparente en la parte superior
    }
  }

  desplegarMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
