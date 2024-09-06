import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalSearchComponent } from '../../../../components/modal-search/modal-search.component';
import { Product } from '../../../../interfaces/product';
import { Client } from '../../../../interfaces/client';
import { BudgetsService } from '../../../../services/budgets.service';

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
  products: any[] = [];
  services: any[] = [];

  delivery_cost: any = 0;
  total_iva: any = 0;

  private budgetId: string | null = null;

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


      this.calculateTotalBudget();
    });
  }

  calculateTotalBudget() {
    setTimeout(() => {
      if (this.currency === 1) {
        this.total_budget = parseFloat(this.total_supplies) + parseFloat(this.total_services)+ parseFloat(this.total_iva) + parseFloat(this.delivery_cost);
      } else {
        this.total_budget = this.total_supplies + this.delivery_cost;
      }
  
      this.total_budget = parseFloat(this.total_budget).toFixed(2);
    },  0);
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
  }

  receiveProducts($event: any) {
    this.products = $event;
  }

  receiveServices($event: any) {
    this.services = $event;
  }

  receiveTotalIva($event: any) {
    console.log('iva', $event);
    this.total_iva = $event;
    this.calculateTotalBudget();
  }

  receiveDeliveryCost($event: any) {
    console.log('delivery cost', $event);
    this.delivery_cost = $event;
    this.calculateTotalBudget();
  }


  updateBudget() {
    if (this.budgetId) {
      // Debemos validar la existencia de algunos campos 
      //client
      if (!this.client?.name || this.client?.name == '') {
        alert('El nombre del cliente es requerido');
        return;
      }

      if (!this.client?.numid || this.client?.numid == '') {
        alert('El numero de identificación del cliente es requerido');
        return;
      }

      if (!this.client?.company || this.client?.company == '') {
        alert('La empresa del cliente es requerida');
        return;
      }

      if (!this.client?.email || this.client?.email == '') {
        alert('El correo del cliente es requerido');
        return;
      }

      //valida formato de correo
      const email = this.client?.email;
      const regex = /\S+@\S+\.\S+/;
      if (!regex.test(email)) {
        alert('El correo del cliente no tiene un formato válido');
        return;
      }

      //project
      if (!this.project.name || this.project.name == '') {
        alert('El nombre del proyecto es requerido');
        return;
      }

      if (!this.project.date || this.project.date == '') {
        alert('La fecha de la cotización es requerida');
        return;
      }

      if (!this.project.offer_valid || this.project.offer_valid == '') {
        alert('La fecha de validez de la cotización es requerida');
        return;
      }

      //Tiempo de entrega de la fabricación
      if (!this.project.manufacture_delivery_time || this.project.manufacture_delivery_time == '') {
        alert('El tiempo de entrega de la fabricación es requerido');
        return;
      }

      // garantía 
      if (!this.project.warranty || this.project.warranty == '') {
        alert('La garantía es requerida');
        return;
      }

      //Validamos los campos internos de cada producto
      if (this.products.length == 0) {
        alert('Debe agregar al menos un producto');
        return;
      }

      //Validamos los campos internos de cada producto 
      for (let i = 0; i < this.products.length; i++) {
        const product = this.products[i];

        if (!product.description || product.description == '') {
          alert('La descripción del producto es requerida');
          return;
        }

        if (!product.quantity || product.quantity == 0) {
          alert('La cantidad del producto ' + product.description + ' es requerida');
          return;
        }

        if (!product.price || product.price == 0) {
          alert('El precio del producto ' + product.description + ' es requerido');
          return;
        }

        //si está checado otro descuento , debe tener un valor
        if (product.apply_other_discount && (!product.other_discount || product.other_discount == 0)) {
          //si producto no es especial no se valida
          if (!product.is_special) {
            alert('Ha seleccionado aplicar otro porcentaje de descuento en uno de los productos, El porcentaje de descuento de producto es requerido, debe notificar al área comercial si el descuento que quiere aplicar es superior a: ' + product.discount + '%');

          } else {
            alert('Ha seleccionado aplicar otro porcentaje de descuento en uno de los productos, El porcentaje de descuento de producto es requerido');
          }
          return;
        }
        
      }

      //Los servicios son opcionales , pero si vienen tambien hay que validarlos
      if (this.services.length > 0) {
        for (let i = 0; i < this.services.length; i++) {
          const service = this.services[i];

          if (!service.description || service.description == '') {
            alert('La descripción del servicio es requerida');
            return;
          }

          if (!service.price || service.price == 0) {
            alert('El precio del servicio ' + service.description + ' es requerido');
            return;
          }

          if (!service.quantity || service.quantity == 0) {
            alert('La cantidad del servicio ' + service.description + ' es requerida');
            return;
          }
        }
      }

      this.project.delivery_cost = this.delivery_cost;


      let budget = {
        client: this.client,
        project: this.project,
        observation: this.observation,
        products: this.products,
        services: this.services,
        total: this.total_budget,
        currency: this.currency,
        total_supplies: this.total_supplies,
        total_services: this.total_services
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
}
