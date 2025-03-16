import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.component.html',
  styleUrls: ['./acciones.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AccionesComponent implements OnInit {
  rol: string | null = '';
  acciones: any[] = []; 
  filteredAcciones: any[] = []; 
  secciones: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTerm: string = ''; 
  isEditModalOpen: boolean = false;
  isAddMode: boolean = false;
  selectedAccion: any = { Accion: '', Seccion: null };
  selectedSeccion: number | null = null; 

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
     this.rol = localStorage.getItem('rol');
     console.log(this.rol);
     if (!this.rol) {
       console.error('No hay rol definido, redirigiendo a login.');
       this.router.navigate(['/login']);
     }
    this.loadAcciones();
    this.loadSecciones();
  }

  // Cargar Acciones desde el servicio
  loadAcciones(): void {
    this.tableService.getEntities('acciones').subscribe((response) => {
      this.acciones = response;
      this.filteredAcciones = this.acciones;
      this.totalPages = Math.ceil(this.filteredAcciones.length / this.pageSize);
    });
  }

  // Cargar Secciones desde el servicio
  loadSecciones(): void {
    this.tableService.getEntities('secciones').subscribe((response) => {
      this.secciones = response;
    });
  }

  // Filtrar Acciones
  filterAcciones(): void {
    this.filteredAcciones = this.acciones.filter((accion) => {
      const matchesSearch = accion.Accion?.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      );

      const matchesSeccion =
        !this.selectedSeccion || accion.Seccion == this.selectedSeccion;

      return matchesSearch && matchesSeccion;
    });

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredAcciones.length / this.pageSize);
  }

  // Obtener Acciones paginadas
  get paginatedAcciones() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredAcciones.slice(startIndex, endIndex);
  }

  // Cambiar de página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Abrir modal (Añadir/Editar)
  openModal(accion: any = null): void {
    this.isAddMode = !accion;
    this.selectedAccion = accion
      ? { ...accion }
      : { Accion: '', Estado: 1, Seccion: null };
    this.isEditModalOpen = true;
  }

  // Cerrar modal
  closeModal(): void {
    this.isEditModalOpen = false;
  }

  // Guardar Acción
  saveAccion(): void {
    this.selectedAccion.Seccion = +this.selectedAccion.Seccion;
    console.log('Accion' + this.selectedAccion.Seccion);
    if (this.isAddMode) {
      this.tableService
        .addEntity('acciones', this.selectedAccion)
        .subscribe(() => {
          this.loadAcciones();
          this.closeModal();
        });
    } else {
      this.tableService
        .updateEntity('acciones', this.selectedAccion.Id, this.selectedAccion)
        .subscribe(() => {
          this.loadAcciones();
          this.closeModal();
        });
    }
  }

  // Eliminar Acción
  deleteAccion(accion: any): void {
    this.tableService.deleteEntity('acciones', accion.Id).subscribe(() => {
      this.loadAcciones();
    });
  }

  // Obtener el nombre de la sección
  getSeccionNombre(seccionId: number): string {
    const seccion = this.secciones.find((s) => s.Id === seccionId);
    return seccion ? seccion.Seccion : 'Desconocida';
  }
}
