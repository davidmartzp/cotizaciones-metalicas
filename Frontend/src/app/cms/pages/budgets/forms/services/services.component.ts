import { Component, Input, Output , EventEmitter, SimpleChanges} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  @Input() total_services: any = 0; //Total de los servicios

  @Input() total_supplies: any = 0; //Total de los insumos
  @Input() total_budget: any = 0 //Total de la cotización
  @Input() currency: number = 0;

  //para emitir
  @Output() totalServices = new EventEmitter<any>();
  @Output() totalBudget = new EventEmitter<any>();

  @Input() services: any[] = [];

  @Output() servicesData = new EventEmitter<any>();

  @Output() AIUFields = new EventEmitter<any>();
  @Input() AIU: any = {
    adminPercentage: 0,
    adminValue: 0,
    unforeseenPercentage: 0,
    unforeseenValue: 0,
    profitPercentage: 0,
    profitValue: 0,
  };

  @Output() servicesIva = new EventEmitter<any>();  
  @Input() services_iva: any = 0;

  hideFields: boolean = true;  


  ngOnInit(): void {
    this.servicesData.emit(this.services);
    this.calculateTotalServices();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['services']) {
      //muestra campos si hay servicios
      if (this.services.length > 0) {
        this.hideFields = false;
      }
    }
  }


  addNewService() {
    this.services.push({
      description: '',
      unit: '',
      adminPercentage: 0,
      adminValue: 0,
      price: 0,
      unforeseenPercentage: 0,
      unforeseenValue: 0,
      quantity: 0,
      profitPercentage: 0,
      profitValue: 0,
      subtotal: 0,
      iva: 0,
      total: 0,
      confirmed: 0
    });

    this.hideFields = false;
  }

  //calcula los subtotales de los servicios
  calculateTotalS(service: any) {
    service.subtotal = service.price * service.quantity;

    this.calculatePercentageValue()
    this.calculateTotalServices();
    this.calculateTotalBudget();
    
    
  }

  calculatePercentageValue() {
    let total = 0;
    
    this.services.forEach(service => {
      if(typeof service.subtotal === 'string') {
        service.subtotal = parseFloat(service.subtotal);
      }
      total += service.subtotal;
    });
    //calcula los valores de los campos de porcentaje AIU dependiendo de el total de los servicios

    this.AIU.adminValue = parseFloat((total * this.AIU.adminPercentage / 100).toFixed(2));
    this.AIU.unforeseenValue = parseFloat((total * this.AIU.unforeseenPercentage / 100).toFixed(2));  
    this.AIU.profitValue = parseFloat((total * this.AIU.profitPercentage / 100).toFixed(2));

    this.calculateIva();
    this.calculateTotalServices();
    this.calculateTotalBudget();
  }

  calculateIva() {
    //El IVA ES UNO SOLO se calcula sobre el valor de las utilidades AIU.profitValue
    this.services_iva = 0;
    this.services_iva = (this.AIU.profitValue * 0.19).toFixed(2);
  }

  removeService(index: number) {
    this.services.splice(index, 1);
    
    this.calculatePercentageValue();
    this.calculateTotalServices();   
    this.calculateTotalBudget();

    if (this.services.length == 0) {
      this.hideFields = true;
    }
  }

  calculateTotalServices() {
    let subtotal = 0;
    //suma los subtotales de los servicios
    this.services.forEach(service => {
      subtotal += service.subtotal;
    });

    //sumatoria de los valores de los campos de porcentaje AIU
    let totalAIU = this.AIU.adminValue + this.AIU.unforeseenValue + this.AIU.profitValue;

    //suma el total de los servicios con los valores de AIU + IVA
    this.total_services = subtotal + totalAIU + parseFloat(this.services_iva);

  }


  calculateTotalBudget() {
    this.total_budget = parseFloat(this.total_supplies) + parseFloat(this.total_services);   
    this.total_budget = parseFloat(this.total_budget.toFixed(2));
    this.totalServices.emit(this.total_services);
    this.totalBudget.emit(this.total_budget);
    this.sendServices()
  }

  sendServices() {
    this.servicesData.emit(this.services);
    this.AIUFields.emit(this.AIU);
    this.servicesIva.emit(this.services_iva);
  }



 
}
