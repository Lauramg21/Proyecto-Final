import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class SeccionesComponent implements OnInit {
  rol: string | null = '';
  secciones: any[] = []; // Lista de secciones
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTerm: string = ''; // Campo de búsqueda
  isEditModalOpen: boolean = false;
  isAddMode: boolean = false; // Determina si estamos en modo de añadir
  selectedSeccion: any = { Seccion: '', Estado: 1 }; // Sección seleccionada

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
     this.rol = localStorage.getItem('rol');
     console.log(this.rol);
     if (!this.rol) {
       console.error('No hay rol definido, redirigiendo a login.');
       this.router.navigate(['/login']);
     }
    this.loadSecciones(); // Cargar secciones al iniciar
  }

  // Cargar secciones desde el servicio
  loadSecciones(): void {
    this.tableService.getEntities('secciones').subscribe((response) => {
      this.secciones = response;
      this.totalPages = Math.ceil(
        this.filteredSecciones.length / this.pageSize
      );
    });
  }

  // Filtrar las secciones según el término de búsqueda
  get filteredSecciones() {
    return this.secciones.filter((seccion) =>
      seccion.Seccion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Obtener las secciones paginadas (aplica filtro y paginación)
  get paginatedSecciones() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredSecciones.slice(startIndex, endIndex);
  }

  // Cambiar de página en la paginación
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Método para abrir el modal de edición o añadir
  openModal(seccion: any = null): void {
    this.isAddMode = !seccion;
    this.selectedSeccion = seccion
      ? { ...seccion }
      : { Seccion: '', Estado: 1 };
    this.isEditModalOpen = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.isEditModalOpen = false;
  }

  // Guardar la sección (crear o editar)
  saveSeccion(): void {
    if (this.isAddMode) {
      this.tableService
        .addEntity('secciones', this.selectedSeccion)
        .subscribe(() => {
          this.loadSecciones(); // Recargar la lista después de añadir
          this.closeModal();
        });
    } else {
      this.tableService
        .updateEntity(
          'secciones',
          this.selectedSeccion.Id,
          this.selectedSeccion
        )
        .subscribe(() => {
          this.loadSecciones(); // Recargar la lista después de editar
          this.closeModal();
        });
    }
  }

  // Eliminar una sección
  deleteSeccion(seccion: any): void {
    this.tableService.deleteEntity('secciones', seccion.Id).subscribe(() => {
      this.loadSecciones(); // Recargar la lista después de eliminar
    });
  }
}
