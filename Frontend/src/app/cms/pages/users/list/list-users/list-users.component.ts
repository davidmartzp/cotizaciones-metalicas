import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: any[] = [];
  page: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 1;
  filterText: string = ''; // Propiedad para el filtro de texto

  constructor(private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.loadAllUsers();
   }

  editUser(id: number): void {
    this.router.navigate([`/usuarios-actualizar/${id}`]);
  }

  addUser(): void {
    this.router.navigate([`/usuarios-crear`]);
  }

  /*deleteUsers(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      this.userService.deleteUsers(id).subscribe(
        () => this.loadUsers(),
        (error: any) => console.error('Error deleting user', error)
      );
    }
  }*/

  loadAllUsers(): void {
    // se suscribe al servicio getUsers y se reasigna el valor de users , tambien la paginacion
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data;
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    });
  }


  // Propiedad calculada para obtener usuarios filtrados
  get filteredUsers(): any[] {
    if (!this.filterText.trim()) {
      return this.users;
    }
    const filter = this.filterText.toLowerCase();
    return this.users.filter(user =>
      user.name.toLowerCase().includes(filter)
    );
  }

  // Actualizar estado de un usuario
  updateUserStatus(user: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres actualizar el estado de este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('user', user);
        this.userService.updateUserStatus(user).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario actualizado con éxito',
              showConfirmButton: false,
              timer: 1500
            });
            this.loadAllUsers();
          },
          (error: any) => console.error('Error updating user', error)
        );
      }
    });
  }
}
