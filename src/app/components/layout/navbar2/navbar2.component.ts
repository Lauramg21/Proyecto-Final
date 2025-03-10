import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router'; // Importamos Router para manejar la ruta actual
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar2',
  imports: [CommonModule],
  templateUrl: './navbar2.component.html',
  styleUrl: './navbar2.component.css',
})
export class Navbar2Component implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  isHome = false; // Variable para saber si estamos en la página de inicio

  constructor(private router: Router) {}

  ngOnInit(): void {

  }



  desplegarMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
