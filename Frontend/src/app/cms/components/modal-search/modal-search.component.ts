// src/app/components/modal-search/modal-search.component.ts
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.css'], // Cambia 'styleUrl' a 'styleUrls'
  encapsulation: ViewEncapsulation.None
})
export class ModalSearchComponent {
  filterText: string = "";
  filteredProducts: any = []; 

  selectedCategory: string = "1";
  selectedMaterial: string = "";
  selectedUnit: string = "";
  cutTypes = {
    CNC: false,
    Liso: false
  };
  structure: string = "";
  
  products: any = [];

  hideTable: boolean = true

  @Output() productSelected = new EventEmitter<any>();

  @Input() currency: number = 1;

  isCarpentry: boolean = false;

  constructor(private productService: ProductsService) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['currency']) {
      this.currency = changes['currency'].currentValue;
      
    }
  }

  onSubmit(form: any) {
    if (this.selectedCategory == "0" || this.selectedMaterial == "" || this.selectedUnit == "" || !this.cutTypes.CNC && !this.cutTypes.Liso || this.structure == "") {
      Swal.fire({
        title: '',
        text: 'Debes seleccionar todos los filtros para realizar la búsqueda',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    let dataSearch = {
      category: this.selectedCategory,
      material: this.selectedMaterial,
      unit: this.selectedUnit,
      cutTypeCnc: this.cutTypes.CNC ? '1' : '',
      cutTypePlain: this.cutTypes.Liso ? '2' : '',
      structure: this.structure
    };

    // Consultar productos suscribiendo al servicio getProducts
    this.productService.searchProducts(dataSearch).subscribe((data: any) => {
      //si no hay productos muestra mensaje
      if (data.length == 0) {
        Swal.fire({
          title: '',
          text: 'No se encontraron productos con los filtros seleccionados',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      this.products = data;
      this.filteredProducts = data;
      this.hideTable = false;
    });

  }

  change_category() {
    if (this.selectedCategory == '4') {
      this.isCarpentry = true;
    } else {
      this.isCarpentry = false;
    }
  }

  searchCarpentry() {
    
    let dataSearch = {
      category: this.selectedCategory,
    };

    // Consultar productos suscribiendo al servicio getProducts
    this.productService.searchProducts(dataSearch).subscribe((data: any) => {
      //si no hay productos muestra mensaje
      if (data.length == 0) {
        Swal.fire({
          title: '',
          text: 'No se encontraron productos con los filtros seleccionados',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      
      this.products = data;
      this.filteredProducts = data;
      this.hideTable = false;
    });

  }

  addProduct(product: any) {
    console.log(product);
    product.is_special = false;
    this.setDescription(product);
    this.setPrice(product);
    console.log(product.price);
    this.productSelected.emit(product);
    const btnClose = document.querySelector('.btn-close') as HTMLElement;
    if (btnClose) {
      btnClose.click();
    }
  }

  addSpecialProduct() {
    let product: Product = {
      iva_code: "0",
      description: "",
      product_id: "0",
      price: 0,
      price_1: 0,
      dolar_price: 0,
      unit: "",
      apply_max_discount: false,
      max_discount: "0",
      max_discount_value: 0,
      apply_other_discount: false,
      other_discount: 0,
      other_discount_value: 0,
      quantity: 0,
      subtotal: 0,
      is_special: true,
      image: null,
      category_id: "",
    };


    this.productSelected.emit(product); // Emitir el producto seleccionado
    //cerrar el modal de búsqueda , ubica el .btn-close y dale click
    const btnClose = document.querySelector('.btn-close') as HTMLElement;
    if (btnClose) {
      btnClose.click();
    }
  }

  setDescription(product: any) {
    let structure_1 = " ESTRUCTURA TUBERIA 40X40C16"
    let structure_2 = " ANGULO DE CUELGA 20CM"
    let structure = ""

    //si category_id es 3 la estructura es structure_2
    if (product.category_id == "3") {
      structure = structure_2;
    } else {
      structure = structure_1;
    }

    product.description = product.system_name + ' ' + this.selectedMaterial + ' ' + (product.feature_cnc ? 'CNC' : '') + ' ' + (product.feature_plain ? 'Liso' : '') + ' calibre: ' + product.caliber + (product.type_structure == "SI" ? structure : '');
    //mayusculas
    product.description = product.description.toUpperCase();
  }

  setPrice(product: any) {
    //si está seteado dolares como moneda el precio es el dolar_price
    product.price = this.currency === 1 ? product.price_1 : product.dolar_price
    //si el precio es string se reemplaza , por . y se convierte a float
    if (typeof product.price === 'string') {
      product.price = parseFloat(product.price.replace(",", "."));
    }

  }
  
  // No se puden seleccionar los dos cuttype a la vez
  selectCNCType() {
    if (this.cutTypes.CNC) {
      this.cutTypes.Liso = false;
    }
  }

  selectPlainType() {
    if (this.cutTypes.Liso) {
      this.cutTypes.CNC = false;
    }
  }

 //dependiendo del valor del modelo filterText, se filtra la tabla de productos encontrados
  filterProducts() {
    const filterWords = this.filterText.toLowerCase().split(' ');
    this.filteredProducts = this.products.filter((product: any) => {
      return filterWords.every(word => product.system_name.toLowerCase().includes(word));
    });
  }
}
