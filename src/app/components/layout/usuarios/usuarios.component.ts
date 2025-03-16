import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  imports: [CommonModule, FormsModule],
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  userRole: string = 'admin';
  currentPage: number = 1;
  pageSize: number = 5; 
  totalPages: number = 1;
  searchTerm: string = '';

  isEditModalOpen: boolean = false;
  isAddMode: boolean = false; // Controlar si estamos añadiendo o editando
  selectedUser: any = { Id: null, User: '', Password: '', rol: '', Estado: 1 };

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  getRol(rol: number): string {
    switch (rol) {
      case 0:
        return 'Admin';
      case 1:
        return 'Usuario';
      case 2:
        return 'Lectura';
      default:
        return 'Desconocido';
    }
  }

  // Obtener los usuarios para la página actual
  get paginatedUsuarios() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.usuarios.slice(startIndex, endIndex);
  }

  get filteredUsuarios() {
    return this.usuarios
      .filter((usuario) =>
        Object.values(usuario).some((value) =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      )
      .slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
  }

  // Cambiar la página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  loadUsuarios(): void {
    this.tableService.getEntities('usuarios').subscribe((response) => {
      this.usuarios = response;
      this.usuariosFiltrados = response;
      this.totalPages = Math.ceil(this.usuarios.length / this.pageSize);
      this.currentPage = 1; // Resetear a la primera página
    });
  }

  // Abre el modal para editar o añadir un usuario
  openModal(user?: any): void {
    if (user) {
      this.selectedUser = { ...user };
      this.isAddMode = false; // Modo de edición
    } else {
      this.selectedUser = {
        Id: null,
        User: '',
        Password: '',
        rol: '',
        Estado: 1,
      }; // Usuario vacío
      this.isAddMode = true; // Modo de añadir
    }
    this.isEditModalOpen = true;
  }

  // Guardar el usuario (editar o añadir)
  saveUser(): void {
    if (this.isAddMode) {
      this.addUser(); // Llamar a la función para agregar usuario
    } else {
      this.editUser(); // Llamar a la función para editar usuario
    }
    this.closeModal();
  }

  // Llamada al servicio para añadir un usuario
  addUser(): void {
    console.log('Añadiendo usuario:', this.selectedUser);
    this.tableService.addEntity('usuarios', this.selectedUser).subscribe(() => {
      this.loadUsuarios();
    });
  }

  // Llamada al servicio para editar un usuario
  editUser(): void {
    console.log('Editando usuario:', this.selectedUser);
    this.tableService
      .updateEntity('usuarios', this.selectedUser.Id, this.selectedUser)
      .subscribe(() => {
        this.loadUsuarios();
      });
  }

  // Cerrar el modal
  closeModal(): void {
    this.isEditModalOpen = false;
  }

  // Eliminar usuario
  deleteUser(user: any): void {
    console.log('Intentando eliminar usuario:', user.Id);
    this.tableService.deleteEntity('usuarios', user.Id).subscribe(() => {
      this.loadUsuarios();
    });
  }
}
