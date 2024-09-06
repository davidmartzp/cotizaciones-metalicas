import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  metalicasUser = window.localStorage.getItem('metalicas-user');

  constructor(private auth: AuthService) { }

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
