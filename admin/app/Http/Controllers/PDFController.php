<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\Dompdf;
use Dompdf\Options; // Importa la clase
use App\Models\Budget;
use App\Models\BudgetProduct;
use App\Models\BudgetService;
use App\Models\User;


class PDFController extends Controller
{
    public function generatePDF($budget_id)
    {

        // Obtener la cotización por ID
        $budget = Budget::where('code', $budget_id)->first();

        // Verificar si la cotización existe
        if (!$budget) {
            return response()->json(['error' => 'Budget not found'], 404);
        }

        // Obtener los productos relacionados con la cotización
        $products = BudgetProduct::where('budget_id', $budget->id)->get();

        // Obtener los servicios relacionados con la cotización
        $services = BudgetService::where('budget_id', $budget->id)->get();


        // Obtener la información de usuario de la cotización 
        $user =  User::find($budget->user_id);

        //Lógica para determinar el precio de los productos que se muestra 

        foreach ($products as $product) {
            if ($product->apply_max_discount) {
                $product->price = $product->price - $product->max_discount_value;
            }
            if ($product->apply_other_discount) {
                $product->price = $product->price - $product->other_discount_value;
            }
        }
        
        //Subtotal de productos
        $subtotal_products = 0;
        foreach ($products as $product) {
            $subtotal_products += $product->subtotal;
        }

        //subtotales de servicios
        $subtotal_services = 0;
        foreach ($services as $service) {
            $subtotal_services += $service->subtotal;
        }
 
        // Construir los datos para la vista
        $data = [
            'budget' => $budget,
            'products' => $products,
            'services' => $services,
            'user' => $user,
            'subtotal_products' => $subtotal_products + $budget->delivery_cost,
            'subtotal_services' => $subtotal_services 
        ];

      $options = new Options();
      $options->set('isHtml5ParserEnabled', true);
      $options->set('isPhpEnabled', true); // Habilitar PHP si es necesario
      $options->set('isRemoteEnabled', true); // Habilitar recursos remotos

      $dompdf = new Dompdf($options);
      $dompdf->loadHtml(view('pdf.table', $data)->render());
      $dompdf->setPaper('A4', 'portrait');
      $dompdf->render();
      $dompdf->stream($budget->project_name.'.pdf');

       //return view('pdf.table', $data);
    }

      public function updateTable()
    {
        DB::statement("ALTER TABLE `metalicas`.`budget_products` 
                       CHANGE COLUMN `quantity` `quantity` DECIMAL(15,2) NOT NULL;");
        
        return "La columna `quantity` ha sido actualizada con éxito.";
    }
}
