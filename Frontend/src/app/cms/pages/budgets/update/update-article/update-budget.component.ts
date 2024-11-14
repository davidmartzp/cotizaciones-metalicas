import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalSearchComponent } from '../../../../components/modal-search/modal-search.component';
import { Product } from '../../../../interfaces/product';
import { Client } from '../../../../interfaces/client';
import { BudgetsService } from '../../../../services/budgets.service';
import { Observation } from '../../../../interfaces/observation';
import { ClientComponent } from '../../forms/client/client.component';
import { DetailComponent } from "../../forms/detail/detail.component";
import { ObservationsComponent } from "../../forms/observations/observations.component";
import { ProductsComponent } from "../../forms/products/products.component";
import { ServicesComponent } from "../../forms/services/services.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-budget',
  standalone: true,
  imports: [
    FormsModule,
    ModalSearchComponent,
    CommonModule,
    ClientComponent,
    DetailComponent,
    ObservationsComponent,
    ProductsComponent,
    ServicesComponent
  ],
  templateUrl: './update-budget.component.html',
  styleUrls: ['./update-budget.component.css'],
})
export class UpdateBudgetComponent implements OnInit {

  currency: number = 1;
  total_supplies: any = 0;
  total_services: any = 0;
  total_budget: any = 0;

  client: any;
  project: any;
  observation: any;
  observationList: Observation[] = [];
  products: any[] = [];
  services: any[] = [];

  //Otras variables
  delivery_cost: any = 0;
  suppliesIva: any = 0;
  advance_payment_percentage: number = 0;
  advance_payment_value: number = 0;
  services_iva: any = 0;
  
  AIU: any = {
    adminPercentage: 0,
    adminValue:  0,
    unforeseenPercentage: 0,
    unforeseenValue: 0,
    profitPercentage:  0,
    profitValue: 0
  };

  budgetId: any | null = null;

  constructor(
    private budgetService: BudgetsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.budgetId = params.get('id');
      if (this.budgetId) {
        this.loadBudgetData(this.budgetId);
      }
    });
  }

 
  ngOnChanges(changes: SimpleChanges){
    console.log(changes)
    if(changes['project']){
      console.log('changes', changes);
      this.project = changes['project'].currentValue;

    }
  }



  private loadBudgetData(id: string) {
    this.budgetService.getBudgetById(id).subscribe((response: any) => {
      // Asumiendo que la respuesta es el presupuesto con la misma estructura que la enviada
      const budget = response;

      this.client = budget.client;
      this.project = budget.project;
      this.observation = budget.observation;
      this.products = budget.products;
      this.services = budget.services;
      this.total_supplies = budget.total_supplies;
      this.total_services = budget.total_services;
      this.total_budget = budget.total;
      this.currency = budget.currency;
      this.observationList = budget.observations;

      //otras variables
      this.suppliesIva = budget.project.suppliesIva;
      this.delivery_cost = budget.project.delivery_cost;
      this.advance_payment_percentage = budget.project.advance_payment_percentage;
      this.advance_payment_value = budget.project.advance_payment_value;
      this.services_iva = budget.project.servicesIva;
      


      this.AIU = {
        adminPercentage: budget.project.adminPercentage,
        adminValue: budget.project.adminValue,
        unforeseenPercentage: budget.project.unforeseenPercentage,
        unforeseenValue: budget.project.unforeseenValue,
        profitPercentage: budget.project.profitPercentage,
        profitValue: budget.project.profitValue
      }

      this.calculateTotalBudget();
    });
  }

  calculateTotalBudget() {
    setTimeout(() => {
      if (this.currency === 1) {
        this.total_budget = parseFloat(this.total_supplies) + parseFloat(this.total_services);
      } else {
        this.total_budget = this.total_supplies ;
      }
  
      this.total_budget = parseFloat(this.total_budget).toFixed(2);
      this.calculateAdvancePayment()
    },  0);
  }

  calculateAdvancePayment() {
    this.advance_payment_value = (this.total_budget * this.advance_payment_percentage) / 100;
  }

  receiveTotalSupplies($event: any) {
    this.total_supplies = $event;
    this.calculateTotalBudget();
  }

  receiveTotalServices($event: any) {
    this.total_services = $event;
    this.calculateTotalBudget();
  }

  changeCurrency() {
    this.calculateTotalBudget();
  }

  receiveClient($event: any) {
    this.client = $event;
  }

  receiveProject($event: any) {
    this.project = $event;
  }

  receiveObservation($event: any) {
    this.observation = $event;
    console.log('Observation', this.observation);
  }

  receiveObservations($event: any) {
    this.observationList = $event;
  }

  receiveProducts($event: any) {
    this.products = $event;
  }

  receiveServices($event: any) {
    this.services = $event;
  }

  receiveTotalIva($event: any) {
    this.suppliesIva = $event;
    this.calculateTotalBudget();
  }

  receiveDeliveryCost($event: any) {
    this.delivery_cost = $event;
    this.calculateTotalBudget();
  }

  receiveAIU($event: any) {
    this.AIU = $event;
    this.calculateTotalBudget();
  }

  receiveServicesIva($event: any) {
    this.services_iva = $event;
    this.calculateTotalBudget();
  }


  updateBudget() {
    if (this.budgetId) {
      // Debemos validar la existencia de algunos campos 
      //client
      if (!this.client?.name || this.client?.name == '') {
        Swal.fire('El nombre del cliente es requerido');
        return;
      }

      if (!this.client?.numid || this.client?.numid == '') {
        Swal.fire('El numero de identificación del cliente es requerido');
        return;
      }

      if (!this.client?.company || this.client?.company == '') {
        Swal.fire('La empresa del cliente es requerida');
        return;
      }

      if (!this.client?.email || this.client?.email == '') {
        Swal.fire('El correo del cliente es requerido');
        return;
      }

      //valida formato de correo
      const email = this.client?.email;
      const regex = /\S+@\S+\.\S+/;
      if (!regex.test(email)) {
        Swal.fire('El correo del cliente no tiene un formato válido');
        return;
      }

      //project
      if (!this.project.name || this.project.name == '') {
        Swal.fire('El nombre del proyecto es requerido');
        return;
      }

      if (!this.project.date || this.project.date == '') {
        Swal.fire('La fecha de la cotización es requerida');
        return;
      }

      if (!this.project.offer_valid || this.project.offer_valid == '') {
        Swal.fire('La fecha de validez de la cotización es requerida');
        return;
      }

      //Tiempo de entrega de la fabricación
      if (!this.project.manufacture_delivery_time || this.project.manufacture_delivery_time == '') {
        Swal.fire('El tiempo de entrega de la fabricación es requerido');
        return;
      }

      // garantía 
      if (!this.project.warranty || this.project.warranty == '') {
        Swal.fire('La garantía es requerida');
        return;
      }

      //Validamos los campos internos de cada producto
      if (this.products.length == 0) {
        Swal.fire('Debe agregar al menos un producto');
        return;
      }

      //Validamos los campos internos de cada producto 
      for (let i = 0; i < this.products.length; i++) {
        const product = this.products[i];

        if (!product.description || product.description == '') {
          Swal.fire('La descripción del producto es requerida');
          return;
        }

        if (!product.quantity || product.quantity == 0) {
          Swal.fire('La cantidad del producto ' + product.description + ' es requerida');
          return;
        }

        if (!product.price || product.price == 0) {
          Swal.fire('El precio del producto ' + product.description + ' es requerido');
          return;
        }

        //si está checado otro descuento , debe tener un valor
        if (product.apply_other_discount && (!product.other_discount || product.other_discount == 0)) {
          //si producto no es especial no se valida
          if (!product.is_special) {
            Swal.fire('Ha seleccionado aplicar otro porcentaje de descuento en uno de los productos, El porcentaje de descuento de producto es requerido, debe notificar al área comercial si el descuento que quiere aplicar es superior a: ' + product.discount + '%');

          } else {
            Swal.fire('Ha seleccionado aplicar otro porcentaje de descuento en uno de los productos, El porcentaje de descuento de producto es requerido');
          }
          return;
        }
        
      }

      //Los servicios son opcionales , pero si vienen tambien hay que validarlos
      if (this.services.length > 0) {
        for (let i = 0; i < this.services.length; i++) {
          const service = this.services[i];

          if (!service.description || service.description == '') {
            Swal.fire('La descripción del servicio es requerida');
            return;
          }

          if (!service.price || service.price == 0) {
            Swal.fire('El precio del servicio ' + service.description + ' es requerido');
            return;
          }

          if (!service.quantity || service.quantity == 0) {
            Swal.fire('La cantidad del servicio ' + service.description + ' es requerida');
            return;
          }
        }
      }

      this.project.delivery_cost = this.delivery_cost;
      this.project.suppliesIva = this.suppliesIva;
      this.project.advance_payment_percentage = this.advance_payment_percentage;
      this.project.advance_payment_value = this.advance_payment_value;
      this.project.servicesIva = this.services_iva;
      this.project.adminPercentage = this.AIU.adminPercentage;
      this.project.adminValue = this.AIU.adminValue;
      this.project.unforeseenPercentage = this.AIU.unforeseenPercentage;
      this.project.unforeseenValue = this.AIU.unforeseenValue;
      this.project.profitPercentage = this.AIU.profitPercentage;
      this.project.profitValue = this.AIU.profitValue;
   
      let budget = {
        client: this.client,
        project: this.project,
        observation: this.observation,
        products: this.products,
        services: this.services,
        total: this.total_budget,
        currency: this.currency,
        total_supplies: this.total_supplies,
        total_services: this.total_services,
        observations: this.observationList
      };

      this.budgetService.updateBudget(this.budgetId, budget).subscribe((response: any) => {
        //mensaje de sweet alert2

          Swal.fire({
            icon: 'success',
            title: 'Cotización actualizada correctamente',
            showConfirmButton: false,
            timer: 1500
          });

      });
    }
  }

  deleteBudget(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar esta cotización? <br>',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.budgetService.deleteBudget(id).subscribe(
          () => {
            Swal.fire('Eliminado', 'La cotización ha sido eliminada.', 'success');
            this.router.navigate(['/cotizaciones-listar']);
          },
          (error: any) => {
            console.error('Error deleting budget', error);
            Swal.fire('Error', 'Hubo un problema al eliminar la cotización.', 'error');
          }
        );
      }
    });
  }

  cloneBudget(id: number): void {
    Swal.fire({
      title: 'Se realizará una copia de esta cotización.',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, clonar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.budgetService.cloneBudget(id).subscribe(
          () => {
            Swal.fire('Clonado', 'La cotización ha sido clonada.', 'success');
            this.router.navigate(['/cotizaciones-listar']);
          },
          (error: any) => {
            console.error('Error cloning budget', error);
            Swal.fire('Error', 'Hubo un problema al clonar la cotización.', 'error');
          }
        );
      }
    });
  }
}
