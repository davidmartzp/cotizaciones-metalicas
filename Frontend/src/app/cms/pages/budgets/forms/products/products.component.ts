import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalSearchComponent } from '../../../../components/modal-search/modal-search.component';
import { Product } from '../../../../interfaces/product';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ModalSearchComponent,
    CommonModule,],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  total_supplies: any = 0;
  

  @Input() products: Product[] = [];

  @Input() total_services: any = 0;
  @Input() total_budget: any = 0;

  @Input() currency: number = 0;

  // el o las imagenes seleccionadas
  selectedFile: any;

  //para emitir 
  @Output() totalSupplies = new EventEmitter<any>();
  @Output() totalBudget = new EventEmitter<any>();
  @Output() productsData = new EventEmitter<any>();
  
  @Input() suppliesIva: any = 0;
  @Output() totalIva = new EventEmitter<any>();

  @Input() delivery_cost: any = 0;
  @Output() deliveryCost = new EventEmitter<any>();
  
  hideFields: boolean = true;  


  ngOnInit(): void {
    this.productsData.emit(this.products);
    this.calculateTotalSupplies();
  }


  // Remueve un producto de la lista y  recalcula  
  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.calculateTotalSupplies();

    if (this.products.length === 0) {
      this.hideFields = true;
    }
  }

  getProductSelected(product: any): void {

    // Agrega el producto seleccionado a la lista de productos haciendo match por los campos que necesita 

    //Si el tipo de las variables de precio es string se reemplaza , por . y se convierte a float
    if (typeof product.dolar_price === 'string') {
      product.dolar_price = parseFloat(product.dolar_price.replace(",", "."));
    }

    if (typeof product.price_1 === 'string') {
      product.price_1 = parseFloat(product.price_1.replace(",", "."));
    }

    if (typeof product.price === 'string') {
      product.price = parseFloat(product.price.replace(",", "."));
    }
    
    this.products.push({
      iva_code: product.code_iva,
      description: product.description,
      product_id: product.id,
      dolar_price: product.dolar_price,
      price: this.currency === 1 ? product.price_1 : product.dolar_price,
      price_1: product.price_1,
      unit: product.unit_sale,
      apply_max_discount: false,
      max_discount: product.discount,
      max_discount_value: 0,
      apply_other_discount: false,
      other_discount: 0,
      other_discount_value: 0,
      quantity: 0,
      subtotal: 0,
      is_special: product.is_special,
     
      
      // Opcionales
      category_id: product.category_id,
      code_iva: product.code_iva,
      discount: product.discount,
      feature_cnc: product.feature_cnc,
      feature_plain: product.feature_plain,
      image: product.image,
      material: product.material,
      system_name: product.system_name,
      type_structure: product.type_structure,
      created_at: product.created_at,
      updated_at: product.updated_at
    });

    this.hideFields = false;
  }

  // Calcular Subtotal , Iva Y Total de acuerdo a la cantidad de productos
  calculateTotalP(product: Product) {

    let price = this.currency === 1 ? product.price_1 : product.dolar_price;

    // si producto es especial el precio es el ingresado en price
    if (product.is_special) {
      price = product.price;
    }
  
    // Si viene descuento máximo se calcula el descuento sobre el precio unitario del producto
    product.max_discount_value = 0;
    if (product.apply_max_discount) {
      product.max_discount_value = price * parseFloat(product.max_discount.replace(",", ".")) / 100;
      product.max_discount_value = parseFloat(product.max_discount_value.toFixed(2));
    }

    // Si viene otro descuento se calcula el descuento sobre el precio unitario del producto
    product.other_discount_value = 0;
    if (product.apply_other_discount) {
      product.other_discount_value = price * product.other_discount / 100;
    }

    // Calcula el subtotal
    if(typeof product.quantity === 'string'){
      product.quantity = parseFloat(product.quantity);
    }

    product.subtotal = (price - product.max_discount_value - product.other_discount_value) * product.quantity;
    product.subtotal = parseFloat(product.subtotal.toFixed(2));
    //se calcula el IVA
    this.calculateTotalIva();

    //Se calculan todos los suministros
    this.calculateTotalSupplies();
    this.sendProducts();
    
  }

  calculateTotalIva() {
   
    //sumatoria de subtotales de productos
    let total = 0;
    this.products.forEach(product => {
      total += product.subtotal;
    });

    //determinar el tipo de dato
    if (typeof total === 'string') {
      total = parseFloat(total);
    }

    if (typeof this.delivery_cost === 'string') {
      this.delivery_cost = parseFloat(this.delivery_cost);
    }

    let iva = (total + this.delivery_cost) * 0.19;
    this.suppliesIva = iva;

    //SI LAMONEDA ES DOLAR el iva es 0
    if (this.currency === 2) {
      this.suppliesIva = 0;
    }

  }



  // Calcular el total de los productos
  calculateTotalSupplies() {
   

    this.calculateTotalIva();
    this.total_supplies = 0;
    this.products.forEach(product => {
      this.total_supplies += product.subtotal;
    });

    if(typeof this.delivery_cost === 'string'){
      this.delivery_cost = parseFloat(this.delivery_cost);
    }

    if(typeof this.suppliesIva === 'string'){
      this.suppliesIva = parseFloat(this.suppliesIva);
    }

    if(typeof this.total_supplies === 'string'){
      this.total_supplies = parseFloat(this.total_supplies);
    }

    this.total_supplies += this.suppliesIva + this.delivery_cost;

    this.total_supplies = this.total_supplies.toFixed(2);
    this.calculateTotalBudget()
  }

  // No se pueden seleccionar dos descuentos
  applyMaxDiscount(product: Product) {
    // Determina si el cambio es a true o false si es falso , el valor de descuento se hace 0
    if (product.apply_other_discount) {
      product.apply_other_discount = false;
      product.other_discount = 0;
      product.other_discount_value = 0;
    }

    this.calculateTotalP(product);
  }


  // No se pueden seleccionar dos descuentos
  applyOtherDiscount(product: Product) {
    // Determina si el cambio es a true o false si es falso , el valor de descuento se hace 0
    if (product.apply_max_discount) {
      product.apply_max_discount = false;
      product.max_discount_value = 0;
    }

    this.calculateTotalP(product);
  }


  calculateTotalBudget() {
    this.total_budget = this.total_supplies + this.total_services;

    if(typeof this.total_budget === 'string'){
      this.total_budget = parseFloat(this.total_budget);
    }

    this.total_budget = this.total_budget.toFixed(2);

    //emitir 
   
    this.totalSupplies.emit(this.total_supplies || 0);
    this.totalBudget.emit(this.total_budget || 0);
    this.deliveryCost.emit(this.delivery_cost || 0);
    this.totalIva.emit(this.suppliesIva);

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if(changes['currency']){
        let currency = changes['currency'].currentValue;
        this.currency = parseInt(currency);
        
        setTimeout(() => {
          //cambia el valor de price por el valor de price_1 si es en pesos si no por dolar_price
          this.products.forEach(product => {
            let price = this.currency === 1 ? product.price_1 : product.dolar_price;
            // si producto es especial el precio es el ingresado en price
            if (product.is_special){
              price = product.price
            }
          
            product.price = price;
          });
          
          this.products.forEach(product => {
            this.calculateTotalP(product);
          });
        },  1000);
      }
      // si hay al menos un producto
      if(changes['products']){
        if(this.products.length > 0){
          this.hideFields = false;
        }
      }


    }
  }

  sendProducts() {
    this.productsData.emit(this.products);
  }

  // Para manejar las imágenes seleccionadas por producto
  onFileSelected(event: any, product: Product) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
    
      reader.onload = () => {
        // El resultado será la imagen en Base64
        product.image = reader.result as string;
        this.sendProducts();
      };
      reader.readAsDataURL(file); // Convierte la imagen a Base64
    }
  }

  removeImage(product: Product) {
    product.image = null;
    this.sendProducts();
  }

  

}
