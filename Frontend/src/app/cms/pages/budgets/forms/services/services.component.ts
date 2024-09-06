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
  @Input() total_services: any = 0;

  @Input() total_supplies: any = 0;
  @Input() total_budget: any = 0
  @Input() currency: number = 0;

  //para emitir
  @Output() totalServices = new EventEmitter<any>();
  @Output() totalBudget = new EventEmitter<any>();

  @Input() services: any[] = [];

  @Output() servicesData = new EventEmitter<any>();

  ngOnInit(): void {
    this.servicesData.emit(this.services);
    this.calculateTotalServices();
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
  }

  calculateTotalS(service: any) {
    service.subtotal = service.price * service.quantity;
    
    this.calculateAdminValue(service);
    this.calculateUnforeseenValue(service);
    this.calculateProfitValue(service);

    // El IVA se calcula sobre el profitValue
    service.iva =  parseFloat(service.profitValue.toFixed(2)) * 0.19;

    // la sumatoria de todos los valores
    service.total = service.subtotal + service.iva + service.adminValue + service.unforeseenValue + service.profitValue;

    this.calculateTotalServices()
    this.sendServices()
  }

  calculateAdminValue(service: any) {
    service.adminValue = (service.subtotal * service.adminPercentage) / 100;
    return (service.subtotal * service.adminPercentage) / 100;
  }

  calculateUnforeseenValue(service: any) {
    service.unforeseenValue = (service.subtotal * service.unforeseenPercentage) / 100;
    return (service.subtotal * service.unforeseenPercentage) / 100;
  }

  calculateProfitValue(service: any) {
    service.profitValue = (service.subtotal * service.profitPercentage) / 100;
    return (service.subtotal * service.profitPercentage) / 100;
  }

  removeService(index: number) {
    this.services.splice(index, 1);
    this.calculateTotalServices();   
  }

  calculateTotalServices() {
    let total = 0;
    this.services.forEach(service => {
      total += service.total;
    });

    this.total_services = parseFloat(total.toFixed(2));
    this.calculateTotalBudget()
  }


  calculateTotalBudget() {
    this.total_budget = parseFloat(this.total_supplies) + parseFloat(this.total_services);   
    this.total_budget = parseFloat(this.total_budget.toFixed(2));
    this.totalServices.emit(this.total_services);
    this.totalBudget.emit(this.total_budget);
  }

  sendServices() {
    this.servicesData.emit(this.services);
  }

}
