import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Observation } from '../../../../interfaces/observation';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-observations',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './observations.component.html',
  styleUrl: './observations.component.css'
})
export class ObservationsComponent {
  @Input() observation: Observation = {
    observation: '',
    observation_1: 'no', 
    observation_2: 'no',
    observation_3: 'no', 
    observation_4: 'no' 
  };

  @Output() observationData = new EventEmitter<Observation>();

  ngOnInit() {
    this.changeObservationData();
  }


  changeObservationData() {
    this.observationData.emit(this.observation);
  }
}
