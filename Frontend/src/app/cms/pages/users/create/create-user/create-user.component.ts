import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../services/users.service';
import Swal from 'sweetalert2';
import { Send } from 'express';
import { MailService } from '../../../../services/mail.service';



@Component({
  selector: 'app-create-User',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  loading = false;
  userId: string | null = null;
  user = {
    name: '',
    email: '',
    phone: '',
    initials: '',
    role: '',
    status: '',
  };



  constructor(private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private mail: MailService,
  ) { }

  ngOnInit(): void {
    //Obtener el usuario por parametro de la url 
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.loadUserData(this.userId);
      }
    });


  }

  loadUserData(id: string) {
    let userId = parseInt(id);
    this.userService.getUser(userId).subscribe((response) => {
      console.log('Usero obtenido', response);
      this.user = response;

      console.log('Usuario obtenido', this.user);
    }, (error) => {
      console.error('Error al obtener el usero', error
      );
    }
    );
  }

  onSubmit(form: any) {
    // Validamos cada campo del formulario con sweetalert2

    if (this.user.name == '') {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'El campo nombre no puede estar vacío',
      });
      return;
    }

    //iniciales 
    if (this.user.initials == '') {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'El campo iniciales no puede estar vacío',
      });
      return;
    }

    if (this.user.email == '') {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'El campo correo electrónico no puede estar vacío',
      });
      return;
    }

    //formato email 
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.user.email)) {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'El correo electrónico no tiene un formato válido',
      });
      return;
    }

    //telefono
    if (this.user.phone == '') {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'El campo teléfono no puede estar vacío',
      });
      return;
    }

    this.userService.storeUser(this.user).subscribe((response) => {
      console.log('Respuesta del servidor', response);
      Swal.fire({
        icon: 'success',
        title: 'Usuario agregado',
        text: 'El usuario ha sido agregado con éxito',
      });

      let user = {
        id: response.id,
        name: this.user.name,
        email: this.user.email,
      };
      

      this.mail.sendSetUserPassword(user).subscribe()

      setTimeout (() => {
       // this.router.navigate([`/usuarios-listar`]);
      }, 2000);
    }, (error) => {
      console.error('Error al agregar el usuario', error);
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'Ha ocurrido un error al agregar el usuario',
      });
    });
  }

  returnToList() {
    this.router.navigate([`/usuarios-listar`]);
  }

}
