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
    offer_valid: '',
    advance_payment_percentage: 0,
    advance_payment_value: 0
  };

  @Output() projectData = new EventEmitter<Project>();

  @Input() total_budget : number = 0

  ngOnInit() {
    this.changeProjectData();
  }

  ngOnChanges(changes: SimpleChanges){
    //recalcula el valor  calculatePay si hay cambio en total_budget con simplechange

    if(changes['total_budget']){
      this.total_budget = changes['total_budget'].currentValue;
      this.calculatePay();
      this.changeProjectData();
    }

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

  calculatePay(){
   
    //calcularemos el valor del anticipo dependiendo del valor ingresado en porcentaje
    if(this.project?.advance_payment_percentage){
      this.project.advance_payment_value = this.total_budget*(this.project.advance_payment_percentage /100)
    }
    
  }

}
