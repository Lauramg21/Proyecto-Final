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
  errorMessage: string = ''; // Variable para mostrar mensajes de error
  successMessage: string = ''; // Variable para mostrar mensaje de éxito

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit() {
    // Limpiar los mensajes anteriores
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, ingrese todos los campos.';
      return;
    }

    console.log(`Intentando iniciar sesión con: ${this.email}`);

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('rol', response.rol);
          this.successMessage = 'Login exitoso, redirigiendo...';
          console.log('Login exitoso');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500); // Redirige después de 1.5 segundos para mostrar el mensaje de éxito
        } else {
          this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
          console.error('Error en la autenticación: Respuesta inválida');
        }
      },
      (error) => {
        this.errorMessage =
          'Contraseña o correo incorrecto';
        console.error('Error de autenticación:', error);
      }
    );
  }
}
