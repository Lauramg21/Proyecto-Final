import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<{ token: string; rol: string }> {
    return this.http.post<{ token: string; rol: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }
}
