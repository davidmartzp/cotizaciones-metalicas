import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../services/products.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-Product',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})

export class CreateProductComponent {
  product = {
    code_iva: '',
    category_id: '',
    system_name: '',
    material: '',
    caliber: '',
    price_1: null,
    feature_cnc: "",
    feature_plain: "",
    type_structure: 'NO',
    unit_sale: '',
    discount: null,
    dolar_price: null
  };


  cnc: boolean = false;
  plain: boolean = false;
  type_structure: boolean = false;
  angle_hanger: boolean = false;

  


  constructor(private productService: ProductsService, private router: Router) { }

  //Si se checkea feature_cnc el valor es 2 si no es ""
  change_feature_cnc() {
    if (this.cnc == true) {
      this.plain = false;
      this.product.feature_cnc = "1";
    } else {
      this.product.feature_cnc = "";
    }
  }

  change_feature_plain() {
    if (this.plain == true) {
      this.cnc = false;
      this.product.feature_plain = "2";
    } else {
      this.product.feature_plain = "";
    }
  }

  change_type_structure() {
    if (this.type_structure == true) {
      this.product.type_structure = "SI";
    } else {
      this.product.type_structure = "NO";
    }
  }

  change_angle_hanger() {
    if (this.angle_hanger == true) {
      this.product.type_structure = "SI";
    } else {
      this.product.type_structure = "NO";
    }
  }



  onSubmit(form: any) {
    // Validamos cada campo del formulario con sweetalert2

    if (this.product.category_id == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo tipo de sistema no puede estar vacío',
      });
      return;
    }

    if (this.product.system_name == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo nombre del sistema no puede estar vacío',
      });
      return;
    }

    if (this.product.material == '' && this.product.category_id != '4') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo material no puede estar vacío',
      });
      return;
    }

    if (this.product.price_1 == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo precio no puede estar vacío',
      });
      return;
    }


    if (this.product.unit_sale == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo unidad de venta no puede estar vacío',
      });
      return;
    }

    if (this.product.discount == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo porcentaje de descuento no puede estar vacío',
      });
      return;
    }

    // Porcentaje de descuento no puede ser mayor a 99
    if (this.product.discount > 99) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El porcentaje de descuento no puede ser mayor a 99%',
      });
      return;
    }

    if (this.product.dolar_price == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo precio en dólares no puede estar vacío',
      });
      return;
    }

    // Debe escoger entre feature_cnc o feature_plain

    if (this.product.feature_cnc == "" && this.product.feature_plain == "" && this.product.category_id != '4') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe escoger un tipo de corte',
      });
      return;
    }

    this.productService.storeProduct(this.product).subscribe((response) => {
      console.log('Respuesta del servidor', response);
      Swal.fire({
        icon: 'success',
        title: 'Producto creado',
        text: 'El producto ha sido creado con éxito',
      });

      //Setea producto a vacío
      this.product = {
        code_iva: '',
        category_id: '',
        system_name: '',
        material: '',
        caliber: '',
        price_1: null,
        feature_cnc: "",
        feature_plain: "",
        type_structure: 'NO',
        unit_sale: '',
        discount: null,
        dolar_price: null
      };

      //setea los checkbox a false
      this.cnc = false;
      this.plain = false;
      this.type_structure = false;
      this.angle_hanger = false;
      
    }, (error) => {
      console.error('Error al crear el producto', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ha ocurrido un error al crear el producto',
      });
    });



  }

  //retorna a la lista con router 
  returnToList() {
    this.router.navigate([`/productos-listar`]);
  }


}
