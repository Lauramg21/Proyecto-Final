import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'; // Importar DatePipe
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [DatePipe],
})
export class PartidosComponent implements OnInit {
  rol: string | null = '';
  partidos: any[] = []; // Lista completa de partidos
  filteredPartidos: any[] = []; // Lista filtrada de partidos
  equipos: any[] = []; // Lista de equipos
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTerm: string = '';
  selectedEquipo: string = '';
  isEditModalOpen: boolean = false;
  isAddMode: boolean = false;
  selectedPartido: any = {
    IdEquipo: null,
    Local: true,
    Rival: '',
    Fecha: '',
    Estado: true,
  };

  constructor(
    private tableService: TableService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.rol = localStorage.getItem('rol');
     console.log(this.rol);
     if (!this.rol) {
       console.error('No hay rol definido, redirigiendo a login.');
       this.router.navigate(['/login']);
     }
    this.loadPartidos(); // Cargar partidos
    this.loadEquipos(); // Cargar equipos
  }

  // Cargar partidos desde el servicio
  loadPartidos(): void {
    this.tableService.getEntities('partidos').subscribe((response) => {
      this.partidos = response;
      this.filteredPartidos = this.partidos.map((partido) => {
        // Formatear la fecha en formato dd/mm/yy
        partido.Fecha = this.datePipe.transform(partido.Fecha, 'dd/MM/yyyy');
        return partido;
      });
      this.totalPages = Math.ceil(this.filteredPartidos.length / this.pageSize);
    });
  }

  // Cargar equipos desde el servicio
  loadEquipos(): void {
    this.tableService.getEntities('equipos').subscribe((response) => {
      this.equipos = response;
    });
  }

  // Filtrar partidos por nombre de equipo y estado
  filterPartidos(): void {
    this.filteredPartidos = this.partidos.filter((partido) => {
      const matchesSearch = partido.Rival?.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      );
      const matchesEquipo =
        !this.selectedEquipo || partido.IdEquipo == this.selectedEquipo;

      return matchesSearch && matchesEquipo;
    });

    this.currentPage = 1; // Reiniciar paginación
    this.totalPages = Math.ceil(this.filteredPartidos.length / this.pageSize);
  }

  // Obtener partidos paginados
  get paginatedPartidos() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredPartidos.slice(startIndex, endIndex);
  }

  // Cambiar de página en la paginación
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Método para abrir el modal de edición o añadir
  openModal(partido: any = null): void {
    this.isAddMode = !partido;
    this.selectedPartido = partido
      ? { ...partido }
      : { IdEquipo: null, Local: true, Rival: '', Fecha: '', Estado: 1 };
    this.isEditModalOpen = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.isEditModalOpen = false;
  }

  // Guardar el partido (crear o editar)
  savePartido(): void {
    // Convertir Local a booleano antes de guardarlo
    this.selectedPartido.Local = +this.selectedPartido.Local;

    this.selectedPartido.IdEquipo = +this.selectedPartido.IdEquipo; // Convertir a número
    console.log(this.selectedPartido);

    if (this.isAddMode) {
      this.tableService
        .addEntity('partidos', this.selectedPartido)
        .subscribe(() => {
          this.loadPartidos();
          this.closeModal();
        });
    } else {
      this.tableService
        .updateEntity('partidos', this.selectedPartido.Id, this.selectedPartido)
        .subscribe(() => {
          this.loadPartidos();
          this.closeModal();
        });
    }
  }

  // Eliminar un partido
  deletePartido(partido: any): void {
    this.tableService.deleteEntity('partidos', partido.Id).subscribe(() => {
      this.loadPartidos();
    });
  }

  // Obtener el nombre del equipo a partir del ID
  getEquipoNombre(IdEquipo: number): string {
    const equipo = this.equipos.find((e) => e.Id === IdEquipo);
    return equipo ? equipo.Equipo : 'Desconocido';
  }
}
