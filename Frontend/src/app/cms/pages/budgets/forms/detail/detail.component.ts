import { Component, Output, EventEmitter, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../../interfaces/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
  @Input() project: Project = {
    name: '',
    date: '',
    manufacture_delivery_time: '',
    installation_delivery_time: '',
    warranty: '',
    payment_methods_notes: '',
    delivery_address: '',
    offer_valid: ''
  };

  @Output() projectData = new EventEmitter<Project>();


  ngOnInit() {
    this.changeProjectData();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['project']){
      this.project = changes['project'].currentValue;
    }
  }

  ngAfterViewInit(changes: SimpleChanges) {
  
  }

  changeProjectData() {
  
    this.projectData.emit(this.project);
  }


  setOfferValid() {
    //setea el campo offer_valid de la cotización 30 días después de la fecha de la cotización
    let date = new Date(this.project.date);
    date.setDate(date.getDate() + 45);
    this.project.offer_valid = date.toISOString().split('T')[0];
    this.changeProjectData();
    
  }

 
}
