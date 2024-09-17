import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Sha1Service } from '../../../services/sha1.service';
import Swal from 'sweetalert2';
import { ActivatedRoute ,Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private sha1Service: Sha1Service ,  private route: ActivatedRoute,
    private router: Router ) { }

  login() {
    //suscribe to the login method from the auth service
     // Assuming there is a function called 'encrypt' that encrypts the password
    this.auth.login({ email: this.email, password: this.password }).subscribe((data: any) => {
      
      window.localStorage.setItem('metalicas-token', data.data.token);
      window.localStorage.setItem('metalicas-user', data.data.name);
      window.localStorage.setItem('metalicas-id', data.data.id);
      window.localStorage.setItem('role', data.data.role);

      //navega al admin interno
      Swal.fire('Success', 'Has ingresado con éxito', 'success').then(() => {
        setTimeout(() => {
          this.router.navigate(['/']); // Navega a la lista de presupuestos o a otra página
        }, 500);
      });
    }, (error: any) => {
      Swal.fire('Error', 'Verifique sus datos', 'error');
    });
  }

 


}
