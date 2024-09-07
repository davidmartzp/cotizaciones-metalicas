import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalSearchComponent } from '../../../../components/modal-search/modal-search.component';
import { Product } from '../../../../interfaces/product';

import { ClientComponent } from '../../forms/client/client.component';
import { DetailComponent } from "../../forms/detail/detail.component";
import { ObservationsComponent } from "../../forms/observations/observations.component";
import { ProductsComponent } from "../../forms/products/products.component";
import { ServicesComponent } from "../../forms/services/services.component";
import { Client } from '../../../../interfaces/client';
import { BudgetsService } from '../../../../services/budgets.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-create-budget',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ModalSearchComponent,
    CommonModule,
    ClientComponent,
    DetailComponent,
    ObservationsComponent,
    ProductsComponent,
    ServicesComponent
  ],
  templateUrl: './create-budget.component.html',
  styleUrl: './create-budget.component.css',
})
export class CreateBudgetComponent {

  currency: number = 1;
  total_supplies: number = 0;
  total_services: number = 0;

  total_budget: number = 0;
  sending: boolean = false;


  client?: Client;
  project: any;
  observation: any;
  products: Product[] = [];
  services: any[] = [];

  //Obtiene el id del usuario logueado desde localstorage
  user_id = localStorage.getItem('metalicas-id');

  delivery_cost: any = 0;
  suppliesIva: any = 0;
  advance_payment_percentage: number = 0;
  advance_payment_value: number = 0;

  AIU: any = {
    adminPercentage: 0,
    adminValue:  0,
    unforeseenPercentage: 0,
    unforeseenValue: 0,
    profitPercentage:  0,
    profitValue: 0
  };
  services_iva: any = 0;


  constructor(private budgetService: BudgetsService, private route: ActivatedRoute,
    private router: Router) { }

  calculateTotalBudget() {
    if (typeof this.total_supplies == 'string') {
      this.total_supplies = parseFloat(this.total_supplies);
    }

    if (typeof this.total_services == 'string') {
      this.total_services = parseFloat(this.total_services);
    }


    if (this.currency == 1) {
      this.total_budget = this.total_supplies + this.total_services;
    } else {
      this.total_budget = this.total_supplies + this.delivery_cost;
    }
    this.total_budget = parseFloat(this.total_budget.toFixed(2));
    this.calculateAdvancePayment()

  }

  calculateAdvancePayment() {
    this.advance_payment_value = (this.total_budget * this.advance_payment_percentage) / 100;
  }

  //Recibe los eventos emitidos y recalcula 
  receiveTotalSupplies($event: any) {
    this.total_supplies = $event;
    this.calculateTotalBudget();
  }

  receiveTotalServices($event: any) {
    this.total_services = $event;
    this.calculateTotalBudget();
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

  //Acciones cuando se cambia la moneda 
  changeCurrency() {
    //Recalcular los valores de los productos
    this.calculateTotalBudget();
  }


  //Recibe el cliente del formulario de cliente 
  receiveClient($event: any) {
    this.client = $event;
  }

  //Recibe los productos del formulario de proyectos
  receiveProject($event: any) {
    this.project = $event;
  }

  receiveObservation($event: any) {
    this.observation = $event;
  }

  receiveProducts($event: any) {
    this.products = $event;
  }

  receiveServices($event: any) {
    this.services = $event;
  }


  sendBudget() {

    this.sending = true;
    // Debemos validar la existencia de algunos campos 
    //client
    if (!this.client?.name || this.client?.name == '') {
      Swal.fire('El nombre del cliente es requerido');
      this.sending = false;
      return;
    }

    if (!this.client?.numid || this.client?.numid == '') {
      Swal.fire('El numero de identificación del cliente es requerido');
      this.sending = false;

      return;
    }

    if (!this.client?.company || this.client?.company == '') {
      Swal.fire('La empresa del cliente es requerida');
      this.sending = false;

      return;
    }

    if (!this.client?.email || this.client?.email == '') {
      Swal.fire('El correo del cliente es requerido');
      this.sending = false;

      return;
    }

    //valida formato de correo
    const email = this.client?.email;
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      Swal.fire('El correo del cliente no tiene un formato válido');
      this.sending = false;

      return;
    }

    //project
    if (!this.project.name || this.project.name == '') {
      Swal.fire('El nombre del proyecto es requerido');
      this.sending = false;

      return;
    }

    if (!this.project.date || this.project.date == '') {
      Swal.fire('La fecha de la cotización es requerida');
      this.sending = false;

      return;
    }

    if (!this.project.offer_valid || this.project.offer_valid == '') {
      Swal.fire('La fecha de validez de la cotización es requerida');
      this.sending = false;

      return;
    }

    //Tiempo de entrega de la fabricación
    if (!this.project.manufacture_delivery_time || this.project.manufacture_delivery_time == '') {
      Swal.fire('El tiempo de entrega de la fabricación es requerido');
      this.sending = false;

      return;
    }

    // garantía 
    if (!this.project.warranty || this.project.warranty == '') {
      Swal.fire('La garantía es requerida');
      this.sending = false;

      return;
    }

    //Validamos los campos internos de cada producto
    if (this.products.length == 0) {
      Swal.fire('Debe agregar al menos un producto');
      this.sending = false;

      return;
    }

    //Validamos los campos internos de cada producto 
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];

      if (!product.description || product.description == '') {
        Swal.fire('La descripción del producto es requerida');
        this.sending = false;

        return;
      }

      if (!product.quantity || product.quantity == 0) {
        Swal.fire('La cantidad del producto ' + product.description + ' es requerida');
        this.sending = false;

        return;
      }

      if (!product.price || product.price == 0) {
        Swal.fire('El precio del producto ' + product.description + ' es requerido');
        this.sending = false;

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
        this.sending = false;
        return;
      }
    }

    //Los servicios son opcionales , pero si vienen tambien hay que validarlos
    if (this.services.length > 0) {
      for (let i = 0; i < this.services.length; i++) {
        const service = this.services[i];

        if (!service.description || service.description == '') {
          Swal.fire('La descripción del servicio es requerida');
          this.sending = false;

          return;
        }

        if (!service.price || service.price == 0) {
          Swal.fire('El precio del servicio ' + service.description + ' es requerido');
          this.sending = false;

          return;
        }

        if (!service.quantity || service.quantity == 0) {
          Swal.fire('La cantidad del servicio ' + service.description + ' es requerida');
          this.sending = false;

          return;
        }
      }
    }

    //delivery cost dentro de project.delivery_cost
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
      user_id: this.user_id

    };

    this.budgetService.storeBudget(budget).subscribe((response: any) => {
      //Mensaje de éxito con sweetalert2
      Swal.fire({
        title: 'Cotización creada',
        text: 'La cotización se ha creado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      this.sending = true;


      //Redirecciona al editar la cotización recien creada 
      this.router.navigate(['/cotizaciones-actualizar/' + response.budget_id]); // Navega a la lista de presupuestos o a otra página

    });
  }

  returnToList() {
    this.router.navigate([`/cotizaciones-listar`]);
  }


}
