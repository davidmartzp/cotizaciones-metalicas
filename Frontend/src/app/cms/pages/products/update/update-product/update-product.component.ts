import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../services/products.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-update-Product',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent {
  productId: string | null = null;
  product = {
    code_iva: '',
    category_id: '',
    system_name: '',
    material: '',
    caliber: '',
    price_1: null,
    feature_cnc: "",
    feature_plain: "" ,
    type_structure: 'NO',
    unit_sale: '',
    discount: null,
    dolar_price: null
  };


  cnc : boolean = false;
  plain : boolean = false;
  type_structure : boolean = false;
  angle_hanger : boolean = false;


  constructor(private productService: ProductsService,     private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    //Obtener el producto por parametro de la url 
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProductData(this.productId);
      }
    });
    
      
  }

  loadProductData(id: string) {
    let productId = parseInt(id);
    this.productService.getProduct(productId).subscribe((response) => {
      console.log('Producto obtenido', response);
      this.product = response;
      //Si el producto tiene feature_cnc el valor es 1
      if(this.product.feature_cnc == "1"){
        this.cnc = true;
      }
      //Si el producto tiene feature_plain el valor es 2
      if(this.product.feature_plain == "2"){
        this.plain = true;
      }
      //Si el producto tiene type_structure el valor es SI
      if(this.product.type_structure == "SI" && this.product.category_id !== "3"){
        this.type_structure = true;
      }
      //Si el category es 3 y el producto tiene type_structure el valor de angle_hanger es SI
      if(this.product.type_structure == "SI" && this.product.category_id == "3"){
        this.angle_hanger = true;
      }

      //formatea los numeros 
      this.product.price_1 = this.formatNumber(this.product.price_1);
      this.product.dolar_price = this.formatNumber(this.product.dolar_price);
      this.product.discount = this.formatNumber(this.product.discount);
      this.product.caliber = this.formatNumber(this.product.caliber);
      

      console.log('Producto obtenido', this.product);
    }, (error) => {
      console.error('Error al obtener el producto', error
      );
    }
    );
  }

  //Si se checkea feature_cnc el valor es 2 si no es ""
  change_feature_cnc(){
    //solo puede ser cnc o plain

    if(this.cnc == true){
      this.plain = false;
      this.product.feature_cnc = "1";
    }else{
      this.product.feature_cnc = "";
    }
  }

  change_feature_plain(){
    if(this.plain == true){
      this.cnc = false;
      this.product.feature_plain = "2";
    }else{
      this.product.feature_plain = "";
    }
  }

  change_type_structure(){
    if(this.type_structure == true){
      this.product.type_structure = "SI";
    }else{
      this.product.type_structure = "NO";
    }
  }

  change_angle_hanger(){
    if(this.angle_hanger == true){
      this.product.type_structure = "SI";
    }else{
      this.product.type_structure = "NO";
    }
  }

  //cambia la , por punto 
  formatNumber(number: any) {
    //contar el numero de , antes de formatear el numero por que esta puede ser el separador de miles
    let count = (number.match(/,/g) || []).length;

    let num = number.replace(',', '.');
    return num;
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

    if (this.product.material == '') {
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

    if (this.product.feature_cnc == "" && this.product.feature_plain == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe escoger un tipo de corte',
      });
      return;
    }



    console.log('Producto enviado', this.product);

    this.productService.updateProduct(this.product).subscribe((response) => {
      console.log('Respuesta del servidor', response);
      Swal.fire({
      icon: 'success',
      title: 'Producto actualizado',
      text: 'El producto ha sido actualizado con éxito',
      });
    }, (error) => {
      console.error('Error al actualizar el producto', error);
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ha ocurrido un error al actualizar el producto',
      });
    });
  }

  returnToList() {
    this.router.navigate([`/productos-listar`]);
  }
}
