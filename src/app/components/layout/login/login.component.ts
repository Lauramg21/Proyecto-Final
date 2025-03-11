import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      console.error('Email y contraseña son obligatorios');
      return;
    }

    console.log(`Intentando iniciar sesión con: ${this.email}`);

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('rol', response.rol);
          console.log('Login exitoso');
          this.router.navigate(['/dashboard']); 
        } else {
          console.error('Error en la autenticación: Respuesta inválida');
        }
      },
      (error) => {
        console.error('Error de autenticación:', error);
      }
    );
  }
}
