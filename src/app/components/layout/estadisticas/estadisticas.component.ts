import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class EstadisticasComponent implements OnInit {
  rol: string | null = '';

  estadisticas: any[] = [];
  filteredEstadisticas: any[] = [];
  partidos: any[] = [];
  jugadores: any[] = [];
  acciones: any[] = [];
  equipos: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTerm: string = '';
  isEditModalOpen: boolean = false;
  isAddMode: boolean = false;
  selectedEstadistica: any = {
    IdPartido: null,
    IdJugador: null,
    IdAccion: null,
  };
  selectedPartido: number | '' = '';
  selectedJugador: number | '' = '';
  selectedAccion: number | '' = '';

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
     this.rol = localStorage.getItem('rol');
     console.log(this.rol);
     if (!this.rol) {
       console.error('No hay rol definido, redirigiendo a login.');
       this.router.navigate(['/login']);
     }
    this.loadEstadisticas();
    this.loadPartidos();
    this.loadJugadores();
    this.loadAcciones();
    this.loadEquipos();
  }

  // Cargar Estadísticas
  loadEstadisticas(): void {
    this.tableService.getEntities('estadisticas').subscribe((response) => {
      this.estadisticas = response;
      this.filteredEstadisticas = this.estadisticas;
      console.log(response);
      this.totalPages = Math.ceil(
        this.filteredEstadisticas.length / this.pageSize
      );
    });
  }

  // Cargar Partidos
  loadPartidos(): void {
    this.tableService.getEntities('partidos').subscribe((response) => {
      this.partidos = response;
      console.log(response);
    });
  }

  loadEquipos(): void {
    this.tableService.getEntities('equipos').subscribe((response) => {
      this.equipos = response;
    });
  }

  // Cargar Jugadores
  loadJugadores(): void {
    this.tableService.getEntities('jugadores').subscribe((response) => {
      this.jugadores = response;
    });
  }

  // Cargar Acciones
  loadAcciones(): void {
    this.tableService.getEntities('acciones').subscribe((response) => {
      this.acciones = response;
    });
  }

  // Filtrar Estadísticas
  filterEstadisticas(): void {
    // Filtrar estadísticas según los filtros seleccionados
    this.filteredEstadisticas = this.estadisticas.filter((estadistica) => {
      const matchesSearch = estadistica.toString().includes(this.searchTerm); // Filtrar por búsqueda

      const matchesPartido =
        !this.selectedPartido || estadistica.IdPartido == this.selectedPartido; // Filtrar por Partido
      console.log('Estadistica Id Partifo' + estadistica.IdPartido);
      console.log('Partido seleccionado' + this.selectedPartido);

      const matchesJugador =
        !this.selectedJugador || estadistica.IdJugador == this.selectedJugador; // Filtrar por Jugador
      const matchesAccion =
        !this.selectedAccion || estadistica.IdAccion == this.selectedAccion; // Filtrar por Acción

      // Retorna true si la estadística pasa todos los filtros, de lo contrario, false
      return matchesSearch && matchesPartido && matchesJugador && matchesAccion;
    });

    // Resetear a la primera página al filtrar
    this.currentPage = 1;

    // Calcular el total de páginas después del filtrado
    this.totalPages = Math.ceil(
      this.filteredEstadisticas.length / this.pageSize
    );
  }

  // Obtener Estadísticas paginadas
  get paginatedEstadisticas() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredEstadisticas.slice(startIndex, endIndex); // Filtrado + Paginación
  }

  // Cambiar de página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Abrir modal (Añadir/Editar)
  openModal(estadistica: any = null): void {
    this.isAddMode = !estadistica;
    this.selectedEstadistica = estadistica
      ? { ...estadistica }
      : { IdPartido: null, IdJugador: null, IdAccion: null, Valor: 0 };
    this.isEditModalOpen = true;
  }

  // Cerrar modal
  closeModal(): void {
    this.isEditModalOpen = false;
  }

  // Guardar Estadística
  saveEstadistica(): void {
    this.selectedEstadistica.IdPartido = +this.selectedEstadistica.IdPartido;
    this.selectedEstadistica.IdJugador = +this.selectedEstadistica.IdJugador;
    this.selectedEstadistica.IdAccion = +this.selectedEstadistica.IdAccion;

    if (this.isAddMode) {
      this.tableService
        .addEntity('estadisticas', this.selectedEstadistica)
        .subscribe(() => {
          this.loadEstadisticas();
          this.closeModal();
        });
    } else {
      this.tableService
        .updateEntity(
          'estadisticas',
          this.selectedEstadistica.Id,
          this.selectedEstadistica
        )
        .subscribe(() => {
          this.loadEstadisticas();
          this.closeModal();
        });
    }
  }

  // Eliminar Estadística
  deleteEstadistica(estadistica: any): void {
    this.tableService
      .deleteEntity('estadisticas', estadistica.Id)
      .subscribe(() => {
        this.loadEstadisticas();
      });
  }

  // Obtener nombre de Partido
  getPartidoNombre(partidoId: number): string {
    const partido = this.partidos.find((p) => p.Id === partidoId);
    if (partido) {
      // Buscar el equipo local
      const equipo1 = this.equipos.find((e) => e.Id === partido.IdEquipo);

      // Equipo rival
      const equipo2 = partido.Rival;

      // Asegurarse de que los equipos existen
      const local = equipo1 ? equipo1.Equipo : 'Equipo Local Desconocido';
      const visitante = equipo2 ? equipo2 : 'Rival Desconocido';

      return `${local} vs ${visitante}`;
    }
    return 'Partido Desconocido';
  }

  // Obtener nombre de Jugador
  getJugadorNombre(jugadorId: number): string {
    const jugador = this.jugadores.find((j) => j.Id === jugadorId);
    return jugador ? jugador.Jugador : 'Desconocido';
  }

  // Obtener descripción de Acción
  getAccionDescripcion(accionId: number): string {
    const accion = this.acciones.find((a) => a.Id === accionId);
    return accion ? accion.Accion : 'Desconocida';
  }
}
