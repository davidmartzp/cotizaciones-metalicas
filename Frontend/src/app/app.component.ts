import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './cms/components/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './cms/pages/auth/login/login.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'metalicas';
  showFill = false
  isLoggedIn: boolean = false;

  constructor(private router: Router) {

    this.router.events.subscribe((event: any) => {

      if (typeof window !== 'undefined') {
        if (localStorage.getItem('metalicas-token')) {
          this.isLoggedIn = true;
          this.showFill = true;
        }else{
          this.isLoggedIn = false;
          this.showFill = true;
        }
      }
     
      //si la ruta incluye login y esta logeado
      if (this.router.url.includes('login') && this.isLoggedIn) {
        window.location.href = '/admin/budgets';
      }

    });

  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('metalicas-token')) {
        this.isLoggedIn = true;
        this.showFill = true;
      }
    }
  }



}
