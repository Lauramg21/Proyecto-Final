import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router'; // Importamos Router para manejar la ruta actual
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar-dashboard',
  imports: [CommonModule],
  templateUrl: './navbar-dashboard.component.html',
  styleUrl: './navbar-dashboard.component.css',
})
export class NavbarDashboardComponent implements OnInit {
  rol: string = ''; // Variable para almacenar el rol del usuario

  ngOnInit() {
    this.rol = localStorage.getItem('rol') || 'Desconocido';

    if(this.rol === '0'){
      this.rol='Admin';
    }else if(this.rol === '1'){
      this.rol='Usuario';
    }else{
      this.rol='Usuario Lectura'
    }
  }

  isMenuOpen = false;

  constructor(private router: Router) {}

  desplegarMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
