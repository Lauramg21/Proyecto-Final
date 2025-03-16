import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-asignar-accion',
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar-accion.component.html',
  styleUrl: './asignar-accion.component.css',
})
export class AsignarAccionComponent implements OnInit {
  estadisticas: any[] = [];
  partidos: any[] = [];
  jugadores: any[] = [];
  acciones: any[] = [];
  equipos: any[] = [];

  selectedEstadistica: any = {
    IdPartido: null,
    IdJugador: null,
    IdAccion: null,
  };

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.loadPartidos();
    this.loadJugadores();
    this.loadAcciones();
    this.loadEquipos();
  }

  // Cargar Partidos
  loadPartidos(): void {
    this.tableService.getEntities('partidos').subscribe((response) => {
      this.partidos = response;
    });
  }

  // Cargar Equipos
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

  // Guardar Estadística
  saveEstadistica(): void {
    // Convertir valores a números para evitar problemas
    this.selectedEstadistica.IdPartido = +this.selectedEstadistica.IdPartido;
    this.selectedEstadistica.IdJugador = +this.selectedEstadistica.IdJugador;
    this.selectedEstadistica.IdAccion = +this.selectedEstadistica.IdAccion;

    this.tableService
      .addEntity('estadisticas', this.selectedEstadistica)
      .subscribe(() => {
        // Reiniciar el formulario después de guardar
        this.resetForm();
      });
  }

  // Reiniciar formulario
  resetForm(): void {
    this.selectedEstadistica = {
      IdPartido: this.selectedEstadistica.IdPartido, 
      IdJugador: null, 
      IdAccion: null, 
    };
  }

  // Obtener nombre de Partido
  getPartidoNombre(partidoId: number): string {
    const partido = this.partidos.find((p) => p.Id === partidoId);
    if (partido) {
      const equipo1 = this.equipos.find((e) => e.Id === partido.IdEquipo);
      const equipo2 = partido.Rival;

      const local = equipo1 ? equipo1.Equipo : 'Equipo Local Desconocido';
      const visitante = equipo2 ? equipo2 : 'Rival Desconocido';

      return `${local} vs ${visitante}`;
    }
    return 'Partido Desconocido';
  }
}
