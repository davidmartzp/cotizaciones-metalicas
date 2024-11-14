import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../../../services/products.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  products: any[] = [];
  page: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 1;
  filterText: string = ''; // Propiedad para el filtro de texto
  isProduction: boolean = environment.production;

  selectedCategory: string = "1";
  selectedMaterial: string = "";
  selectedUnit: string = "";
  cutTypes = {
    CNC: false,
    Liso: false
  };
  structure: string = "";
  withoutProducts: boolean = true;

  constructor(private productService: ProductsService, private router: Router) {


  }

  ngOnInit(): void {

  }

  editProduct(id: number): void {
    this.router.navigate([`/productos-actualizar/${id}`]);
  }

  addProduct(): void {
    this.router.navigate([`/productos-crear`]);
  }

  /*deleteProducts(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      this.productService.deleteProducts(id).subscribe(
        () => this.loadProducts(),
        (error: any) => console.error('Error deleting product', error)
      );
    }
  }*/

  loadAllProducts(): void {
    // se suscribe al servicio getProducts y se reasigna el valor de products , tambien la paginacion
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      this.withoutProducts = false;
    });
  }

  onSubmit(form: any) {

    let dataSearch = {
      category: this.selectedCategory,
      material: this.selectedMaterial,
      unit: this.selectedUnit,
      cutTypeCnc: this.cutTypes.CNC ? 1 : 0,
      cutTypePlain: this.cutTypes.Liso ? 1 : 0,
      structure: this.structure
    };

    //si la categoía es 4 sólo se envía la categoría
    if (this.selectedCategory == "4") {
      dataSearch.category = this.selectedCategory
    } else {
      //valida los campos con sweet alert
      if (this.selectedCategory == "0" || this.selectedMaterial == "" || this.selectedUnit == "" || !this.cutTypes.CNC && !this.cutTypes.Liso || this.structure == "") {
        Swal.fire({
          title: '',
          text: 'Debes seleccionar todos los filtros para realizar la búsqueda',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
    }



    // Consultar productos suscribiendo al servicio getProducts
    this.productService.searchProducts(dataSearch).subscribe((data: any) => {

      //si hay datos en la respuesta se muestra la tabla  
      if (data.length > 0) {
        this.withoutProducts = false;
        this.products = data;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      } else {
        this.withoutProducts = true;
        //Mensaje de error con sweetalert2
        Swal.fire({
          title: '',
          text: 'No se encontraron productos con los filtros seleccionados',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });

  }

  // Propiedad calculada para obtener presupuestos filtrados
  get filteredProducts(): any[] {
    if (!this.filterText.trim()) {
      return this.products;
    }
    const filter = this.filterText.toLowerCase();
    return this.products.filter(product =>
      product.system_name.toLowerCase().includes(filter)
    );
  }
}
