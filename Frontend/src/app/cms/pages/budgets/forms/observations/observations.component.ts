import { Component, Input, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { Observation } from '../../../../interfaces/observation';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ObservationsService } from '../../../../services/observations.service';
import { Console } from 'console';

@Component({
  selector: 'app-observations',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.css']
})
export class ObservationsComponent {
  
  @Input() observation : string = '';
  @Input() observations : Observation[] = [];
  ObservationsList: Observation[] = [];
  @Output() observationData = new EventEmitter<Observation[]>();
  @Output() observationChange = new EventEmitter<string>();

  constructor(private observationsService: ObservationsService) {}

  ngOnInit() {
    // Suscribirse al servicio para obtener la lista de observaciones
    this.observationsService.getObservations().subscribe((data) => {
      // Usa setTimeout para que la actualización ocurra en el siguiente ciclo
      setTimeout(() => {
        this.ObservationsList = data;
  
        //por defecto los valores de las observaciones son null
        this.ObservationsList.forEach((observation) => {
          observation.value = null;
        });

        //si se proporcionan observaciones, establecer los valores correspondientes
        if (this.observations.length > 0) {
          this.observations.forEach((observation) => {
            const index = this.ObservationsList.findIndex((item) => item.id === observation.id);
            if (index !== -1) {
              this.ObservationsList[index].value = observation.value;
            }
          });
        }
        this.changeObservationData(); // Mueve esta llamada aquí
      });
    });
  }


  // Método que maneja el cambio en los checkboxes
  onCheckboxChange(index: number, value: string) {
    // Si selecciona el checkbox actual, deselecciona ambos
    if (this.ObservationsList[index].value === value) {
      this.ObservationsList[index].value = null;
    } else {
      // Si selecciona un valor, desmarca el otro
      this.ObservationsList[index].value = value;
    }
    console.log(this.ObservationsList);

    this.changeObservationData();
  }

  // Emitir los datos de observación actualizados
  changeObservationData() {
    this.observationData.emit(this.ObservationsList);
    this.observationChange.emit(this.observation);
    console.log(this.observation);

  }
}
