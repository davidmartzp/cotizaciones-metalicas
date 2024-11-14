import { Component } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule], // Importa los pipes
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'] // Corrige 'styleUrl' a 'styleUrls'
})
export class ImportComponent {
  selectedFile: File | null = null;
  base64File: string = ''; // Almacenar archivo en Base64
  previewData: any[] = []; // Almacenar datos del archivo para la vista previa
  loading = false;

  constructor(private productsService: ProductsService) { }

  // Evento para manejar el archivo seleccionado
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.convertFileToBase64(file);
    }
  }

  // Convertir el archivo Excel a Base64
  convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64File = reader.result as string;
      this.readExcelData(file); // Leer datos del archivo Excel
    };
    reader.onerror = error => {
      console.error('Error al convertir archivo a Base64:', error);
    };
  }

  // Método ajustado para leer y parsear el archivo Excel
  readExcelData(file: File) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      // Obtener datos como arreglo y omitir la primera fila (cabeceras)
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      this.previewData = jsonData.slice(1); // Omitir la primera fila
    };
    reader.onerror = error => {
      console.error('Error al leer el archivo Excel:', error);
    };
  }


  // Enviar el archivo al backend como Base64
  onSubmit() {
    this.loading = true;
    if (this.base64File) {
      const payload = {
        file: this.base64File,
        fileName: this.selectedFile?.name
      };

      console.log(payload);
      this.productsService.importProducts(payload).subscribe(
        (response) => {
          Swal.fire('¡Éxito!', 'Productos importados exitosamente.', 'success');
          setTimeout(() => {
            window.location.reload();
          } , 3000);
        },
        (error) => {
          console.error('Error al enviar archivo:', error.error.error);
          let row = error.error.row;
          let message = error.error.error;

          Swal.fire({
            title: '¡Error!',
            html: 'Error al importar archivo. <br><hr>' + message + "<br>Fila: " + row,
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Reintentar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
          this.loading = false;
        }
      );
    } else {
      console.error('No se ha seleccionado ningún archivo.');
      Swal.fire('¡Error!', 'No se ha seleccionado ningún archivo.', 'error');
      this.loading = false;
    }
  }

  // Al darle click genera un archivo de excel de ejemplo con los productos de la base de datos
  downloadExample() {
    this.productsService.getProducts().subscribe((response: any[]) => {
      //columnas que debe tener el archivo de excel
      const modifiedResponse = response.map((product) => {
        return {
          'ID': product.id,
          'Código IVA': product.code_iva,
          'Nombre del sistema': product.system_name,
          'Corte CNC': product.feature_cnc,
          'Corte Liso': product.feature_plain,
          'Material': product.material,
          'Calibre': product.caliber,
          'Estructura': product.type_structure,
          'Unidad de venta': product.unit_sale,
          'Precio': product.price_1,
          'Descuento': product.discount,
          'Precio en Dólares': product.dolar_price,
          'Categoría': product.category_id

        };
      });

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedResponse);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos-ejemplo.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
