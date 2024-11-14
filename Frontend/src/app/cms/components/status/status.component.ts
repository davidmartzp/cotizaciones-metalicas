import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { BudgetsService } from '../../services/budgets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  @Input() status: string = '';
  @Input() budget: number = 0;
  @Output() statusChange = new EventEmitter<string>();
  isCarpentry : boolean = false;

  constructor(private budgetsService: BudgetsService) { }

  showSelector = false;

  // Map of statuses to colors and Spanish descriptions
  statusData: { [key: string]: { color: string, description: string } } = {
    '1': { color: 'grey', description: 'Borrador' }, 
    '2': { color: '#2196F3', description: 'Aceptada' }, 
    '3': { color: '#FF5722', description: 'Rechazada' }, 
    '4': { color: '#FFC107', description: 'En revisión' }, 
    '5': { color: '#4CAF50', description: 'Completada' }, 
    '6': { color: '#F44336', description: 'Cancelada' }, 
  };

  statuses = Object.keys(this.statusData);

  getStatusData() {
    return this.statusData[this.status] || { color: '#FFFFFF', description: 'Desconocido' };
  }

  toggleSelector(event: Event) {
    event.stopPropagation(); // Prevents the click event from propagating to the document
    this.showSelector = !this.showSelector;
  }

  selectStatus(status: string) {
    const previousStatus = this.status; // Store the previous status

    this.status = status;

    // Show a confirmation dialog when changing status
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quiere cambiar el estado de la cotización?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.statusChange.emit(this.status);
        this.showSelector = false;

        // Update the status in the database
        this.budgetsService.updateBudgetStatus( this.budget,{ status: this.status }).subscribe(
          (response: any) => {
            Swal.fire('¡Hecho!', 'El estado de la cotización ha sido actualizado', 'success');
          },
          (error: any) => {
            Swal.fire('¡Error!', 'Ha ocurrido un error al actualizar el estado de la cotización', 'error');
            this.status = previousStatus; // Restore the previous status
          }
        );
      } else {
        this.status = previousStatus; // Restore the previous status
      }
    });
  }

  closeSelector(event: Event) {
    event.stopPropagation(); // Prevents the click event from propagating to the document
    this.showSelector = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showSelector) {
      const target = event.target as HTMLElement | null;
      if (target && !target.closest('.status-container')) {
        this.showSelector = false;
      }
    }
  }
}
