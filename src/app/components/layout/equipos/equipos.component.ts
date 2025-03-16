import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class EquiposComponent implements OnInit {
  rol: string | null = '';
  equipos: any[] = []; // Lista de equipos
  filteredEquipos: any[] = []; // Equipos filtrados
  secciones: any[] = []; // Lista de secciones
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTerm: string = ''; // Campo de búsqueda
  isEditModalOpen: boolean = false;
  isAddMode: boolean = false; // Determina si estamos en modo de añadir
  selectedEquipo: any = { Equipo: '', Estado: 1, IdSeccion: null }; // Equipo seleccionado, con SeccionId
  selectedSeccion: number | null = null; // Sección seleccionada para filtrar

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    console.log(this.rol);
    if (!this.rol) {
      console.error('No hay rol definido, redirigiendo a login.');
      this.router.navigate(['/login']);
    }
    this.loadEquipos(); // Cargar equipos al iniciar
    this.loadSecciones(); // Cargar secciones al iniciar
  }

  // Cargar equipos desde el servicio
  loadEquipos(): void {
    this.tableService.getEntities('equipos').subscribe((response) => {
      this.equipos = response;
      this.filteredEquipos = this.equipos;
      this.totalPages = Math.ceil(this.filteredEquipos.length / this.pageSize);
    });
  }

  // Cargar secciones desde el servicio
  loadSecciones(): void {
    this.tableService.getEntities('secciones').subscribe((response) => {
      this.secciones = response;
    });
  }

  // Sección seleccionada para filtrar
  filterEquipos(): void {
    this.filteredEquipos = this.equipos.filter((equipo) => {
      const matchesSearch = equipo.Equipo?.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      );

      const matchesSeccion =
        !this.selectedSeccion || equipo.IdSeccion == this.selectedSeccion;

      return matchesSearch && matchesSeccion;
    });

    this.currentPage = 1; // Reiniciar a la primera página después del filtro
    this.totalPages = Math.ceil(this.filteredEquipos.length / this.pageSize);
  }

  // Obtener las secciones paginadas (aplica filtro y paginación)
  get paginatedEquipos() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredEquipos.slice(startIndex, endIndex);
  }

  // Cambiar de página en la paginación
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Método para abrir el modal de edición o añadir
  openModal(equipo: any = null): void {
    this.isAddMode = !equipo;
    this.selectedEquipo = equipo
      ? { ...equipo }
      : { Equipo: '', Estado: 1, SeccionId: null };
    this.isEditModalOpen = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.isEditModalOpen = false;
  }

  // Guardar el equipo (crear o editar)
  saveEquipo(): void {
    // Asegurarse de que SeccionId es un número
    this.selectedEquipo.SeccionId = +this.selectedEquipo.SeccionId; // Convierte a número

    if (this.isAddMode) {
      this.tableService
        .addEntity('equipos', this.selectedEquipo)
        .subscribe(() => {
          this.loadEquipos(); // Recargar la lista después de añadir
          this.closeModal();
        });
    } else {
      this.tableService
        .updateEntity('equipos', this.selectedEquipo.Id, this.selectedEquipo)
        .subscribe(() => {
          this.loadEquipos(); // Recargar la lista después de editar
          this.closeModal();
        });
    }
  }

  // Eliminar un equipo
  deleteEquipo(equipo: any): void {
    this.tableService.deleteEntity('equipos', equipo.Id).subscribe(() => {
      this.loadEquipos(); // Recargar la lista después de eliminar
    });
  }

  // Método para obtener el nombre de la sección a partir del ID
  getSeccionNombre(seccionId: number): string {
    const seccion = this.secciones.find((s) => s.Id === seccionId);
    return seccion ? seccion.Seccion : 'Desconocida'; // Si no encuentra, devuelve 'Desconocida'
  }
}
