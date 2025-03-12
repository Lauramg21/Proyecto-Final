import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TableService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener la lista de elementos de cualquier entidad
  getEntities(entity: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${entity}`);
  }

  // Obtener un único elemento por ID
  getEntityById(entity: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${entity}/${id}`);
  }

  // Agregar un nuevo elemento
  addEntity(entity: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${entity}`, data);
  }

  // Eliminar un elemento
  deleteEntity(entity: string, id: string): Observable<void> {
    console.log('Intentando eliminar usuario:', entity + id); // Depuración

    return this.http.delete<void>(`${this.apiUrl}/${entity}/${id}`);
  }

  // Editar un elemento
  updateEntity(entity: string, id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${entity}/${id}`, data);
  }
}
