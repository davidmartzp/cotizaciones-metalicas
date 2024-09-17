import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, } from '@angular/router';
import { AuthService } from '../../services/auth.service';


import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  //obtiene el rol del usuario de localstorage
  role : string | null = '';
  metalicasUser : any = '';


  constructor(private auth: AuthService) { 
    this.role =  window.localStorage.getItem('role');
    this.metalicasUser = window.localStorage.getItem('metalicas-user');
  }


  logout() {
    // Assuming there is a function called 'logout' that logs out the user
    Swal.fire({
      title: 'Confirme el cierre de sesión',
      text: '¿Está seguro de que desea cerrar la sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
      }
    });
  }
}
