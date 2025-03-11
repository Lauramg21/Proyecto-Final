import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent {
  rol: string | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol'); 
    console.log(this.rol);
    if (!this.rol) {
      console.error('No hay rol definido, redirigiendo a login.');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}
