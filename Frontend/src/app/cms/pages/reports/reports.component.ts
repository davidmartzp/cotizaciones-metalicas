import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  isProduction: boolean = environment.production;
  selectedStatus: number = 0;
  selectedUser: number = 0;  // Nuevo campo para el usuario
  startDate: string | null = null;  // Fecha de inicio
  endDate: string | null = null;    // Fecha de fin
  reportUrl: string | null = null;

  // Lista de estados posibles
  statuses = [
    { id: 1, color: 'grey', description: 'Borrador' },
    { id: 2, color: '#2196F3', description: 'Aceptada' },
    { id: 3, color: '#FF5722', description: 'Rechazada' },
    { id: 4, color: '#FFC107', description: 'En revisión' },
    { id: 5, color: '#4CAF50', description: 'Completada' },
    { id: 6, color: '#F44336', description: 'Cancelada' }
  ];

  // Lista de usuarios para seleccionar
  users : any[] = [];

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    // Aquí puedes cargar los usuarios reales desde un servicio si es necesario
    this.usersService.getUsers().subscribe(users => this.users = users);
  }

  // Método para generar la URL del reporte
  generateReportUrl() {
    //las fechas son obligatorias
    if (!this.startDate || !this.endDate) {
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar una fecha de inicio y una fecha de fin',
        icon: 'error'
      });
      return;
    }

    // Generar la URL con los parámetros de estado, usuario, fechas
    if (this.isProduction) {
      window.open(`https://metalicasmundialltda.com/cotizaciones/admin/report/${this.startDate}/${this.endDate}/${this.selectedUser}/${this.selectedStatus}`, '_blank');
    } else {
      window.open(`http://metalicas.test/report/${this.startDate}/${this.endDate}/${this.selectedUser}/${this.selectedStatus}`, '_blank');
    }
  }
}
