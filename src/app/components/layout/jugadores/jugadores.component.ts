import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class JugadoresComponent implements OnInit {
  rol: string | null = '';
  jugadores: any[] = []; // Lista completa de jugadores
  filteredJugadores: any[] = []; // Lista filtrada de jugadores
  equipos: any[] = []; // Lista de equipos
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTerm: string = ''; // Campo de búsqueda
  selectedEquipo: string = ''; // Filtro por equipo
  isEditModalOpen: boolean = false;
  isAddMode: boolean = false; // Modo añadir/editar
  selectedJugador: any = { Jugador: '', Numero: null, IdEquipo: null }; // Usa IdEquipo

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
     this.rol = localStorage.getItem('rol');
     console.log(this.rol);
     if (!this.rol) {
       console.error('No hay rol definido, redirigiendo a login.');
       this.router.navigate(['/login']);
     }
    this.loadJugadores(); // Cargar jugadores
    this.loadEquipos(); // Cargar equipos
  }

  // Cargar jugadores desde el servicio
  loadJugadores(): void {
    this.tableService.getEntities('jugadores').subscribe((response) => {
      this.jugadores = response;
      this.filteredJugadores = this.jugadores; // Inicializar con todos
      this.totalPages = Math.ceil(
        this.filteredJugadores.length / this.pageSize
      );
    });
  }

  // Cargar equipos desde el servicio
  loadEquipos(): void {
    this.tableService.getEntities('equipos').subscribe((response) => {
      this.equipos = response;
    });
  }

  // Filtrar jugadores por nombre y equipo
  filterJugadores(): void {
    this.filteredJugadores = this.jugadores.filter((jugador) => {
      const matchesSearch = jugador.Jugador?.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      );

      const matchesEquipo =
        !this.selectedEquipo || jugador.IdEquipo == this.selectedEquipo;

      return matchesSearch && matchesEquipo;
    });

    this.currentPage = 1; // Reiniciar paginación
    this.totalPages = Math.ceil(this.filteredJugadores.length / this.pageSize);
  }

  // Obtener jugadores paginados
  get paginatedJugadores() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredJugadores.slice(startIndex, endIndex);
  }

  // Cambiar de página en la paginación
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Método para abrir el modal de edición o añadir
  openModal(jugador: any = null): void {
    this.isAddMode = !jugador;
    this.selectedJugador = jugador
      ? { ...jugador }
      : { Jugador: '', Numero: null, IdEquipo: null };
    this.isEditModalOpen = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.isEditModalOpen = false;
  }

  // Guardar el jugador (crear o editar)
  saveJugador(): void {
    if (isNaN(this.selectedJugador.Numero)) {
      alert('Por favor ingrese un número válido en el campo de número');
      return;
    }

    this.selectedJugador.IdEquipo = +this.selectedJugador.IdEquipo; // Convertir a número
    this.selectedJugador.Numero = +this.selectedJugador.Numero; // Asegúrate de que sea un número
    console.log(this.selectedJugador);
    if (this.isAddMode) {
      this.tableService
        .addEntity('jugadores', this.selectedJugador)
        .subscribe(() => {
          this.loadJugadores();
          this.closeModal();
        });
    } else {
      this.tableService
        .updateEntity(
          'jugadores',
          this.selectedJugador.Id,
          this.selectedJugador
        )
        .subscribe(() => {
          this.loadJugadores();
          this.closeModal();
        });
    }
  }

  // Eliminar un jugador
  deleteJugador(jugador: any): void {
    this.tableService.deleteEntity('jugadores', jugador.Id).subscribe(() => {
      this.loadJugadores();
    });
  }

  // Obtener el nombre del equipo a partir del ID
  getEquipoNombre(IdEquipo: number): string {
    const equipo = this.equipos.find((e) => e.Id === IdEquipo);
    return equipo ? equipo.Equipo : 'Desconocido';
  }
}
