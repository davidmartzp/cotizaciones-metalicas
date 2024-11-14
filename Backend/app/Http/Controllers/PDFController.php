<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Models\Budget;
use App\Models\BudgetProduct;
use App\Models\BudgetService;
use App\Models\BudgetObservation;
use App\Models\Observation;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\Spreadsheet; // Asegúrate de que esta línea está presente
use PhpOffice\PhpSpreadsheet\Writer\Xlsx; 
use PhpOffice\PhpSpreadsheet\Style\Fill; // Asegúrate de tener esta línea

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

        // Obtener los productos y servicios relacionados con la cotización
        $products = BudgetProduct::where('budget_id', $budget->id)->get();
        $services = BudgetService::where('budget_id', $budget->id)->get();

        // Obtener la información del usuario
        $user = User::find($budget->user_id);

        // Obtener las descripciones de las observaciones
        $observations = Observation::whereNotNull('value')
                       ->join('budget_observations', 'observations.id', '=', 'budget_observations.observation_id')
                       ->where('budget_observations.budget_id', $budget->id)
                       ->select('observations.description', 'budget_observations.value')
                       ->orderBy('observations.id')
                       ->get();

        // Lógica para determinar el precio de los productos
        foreach ($products as $product) {
            if ($product->apply_max_discount) {
                $product->price = $product->price - $product->max_discount_value;
            }
            if ($product->apply_other_discount) {
                $product->price = $product->price - $product->other_discount_value;
            }
        }

        // Calcular subtotales
        $subtotal_products = $products->sum('subtotal') + $budget->delivery_cost;
        $subtotal_services = $services->sum('subtotal');

        // Construir los datos para la vista
        $data = [
            'budget' => $budget,
            'observations' => $observations,
            'products' => $products,
            'services' => $services,
            'user' => $user,
            'subtotal_products' => $subtotal_products,
            'subtotal_services' => $subtotal_services,
        ];

        // Generar el PDF
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml(view('pdf.table', $data)->render());
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $dompdf->stream($budget->code . ' - ' . $budget->project_name . '.pdf');
    }
    
    // Nuevo método para generar el reporte por estado en Excel
    public function generateReportByStatus($start_date, $end_date, $user_id, $status)
    {
        // Filtrar cotizaciones por fechas y usuario
        if ($user_id == 0) {
            $user_id = null;
        }
    
        if ($status == 0) {
            $status = null;
        }
    
        $budgets = Budget::whereBetween('created_at', [$start_date, $end_date])
            ->when($user_id, function ($query, $user_id) {
                return $query->where('user_id', $user_id);
            })
            ->when($status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->where('deleted', 0)
            ->with('user') // Obtener también la información del usuario
            ->get();
    
        // Definir los estados y sus colores/descripciones
        $statuses = [
            1 => ['color' => 'grey', 'description' => 'Borrador'],
            2 => ['color' => '#2196F3', 'description' => 'Aceptada'],
            3 => ['color' => '#FF5722', 'description' => 'Rechazada'],
            4 => ['color' => '#FFC107', 'description' => 'En revisión'],
            5 => ['color' => '#4CAF50', 'description' => 'Completada'],
            6 => ['color' => '#F44336', 'description' => 'Cancelada'],
        ];
    
        // Agrupar y totalizar por estado
        $totalsByStatus = $budgets->groupBy('status')->map(function ($row) {
            return [
                'total_usd' => $row->where('currency', '2')->sum('total'),
                'total_cop' => $row->where('currency', '1')->sum('total'),
            ];
        });
    
        // Crear el nuevo archivo de Excel
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
    
        // Establecer encabezados
        $sheet->setCellValue('A1', 'Reporte de Cotizaciones por Estado');
        $sheet->setCellValue('A2', 'Fecha de reporte: ' . \Carbon\Carbon::now()->format('d/m/Y'));
        $sheet->setCellValue('A3', 'Rango de fechas: ' . \Carbon\Carbon::parse($start_date)->format('d/m/Y') . ' - ' . \Carbon\Carbon::parse($end_date)->format('d/m/Y'));
    
        // Totales por Estado
        $sheet->setCellValue('A5', 'Totales por Estado');
        $sheet->setCellValue('A6', 'Estado');
        $sheet->setCellValue('B6', 'Total Pesos');
        $sheet->setCellValue('C6', 'Total Dólares');
    
        $row = 7;
        foreach ($statuses as $status => $info) {
            $sheet->setCellValue('A' . $row, $info['description']);
            $sheet->setCellValue('B' . $row, number_format($totalsByStatus->get($status)['total_cop'] ?? 0, 2));
            $sheet->setCellValue('C' . $row, number_format($totalsByStatus->get($status)['total_usd'] ?? 0, 2));
    
            // Aplicar el color de fondo según el estado
            $sheet->getStyle('A' . $row)->getFill()->setFillType(Fill::FILL_SOLID);
            $sheet->getStyle('A' . $row)->getFill()->getStartColor()->setARGB($info['color']);
            $sheet->getStyle('B' . $row)->getFill()->setFillType(Fill::FILL_SOLID);
            $sheet->getStyle('B' . $row)->getFill()->getStartColor()->setARGB($info['color']);
            $sheet->getStyle('C' . $row)->getFill()->setFillType(Fill::FILL_SOLID);
            $sheet->getStyle('C' . $row)->getFill()->getStartColor()->setARGB($info['color']);
    
            $row++;
        }
    
        // Detalles de Cotizaciones
        $sheet->setCellValue('A' . $row, 'Detalles de Cotizaciones');
        $row++;
        $sheet->setCellValue('A' . $row, '#');
        $sheet->setCellValue('B' . $row, 'Código');
        $sheet->setCellValue('C' . $row, 'Cliente');
        $sheet->setCellValue('D' . $row, 'Proyecto');
        $sheet->setCellValue('E' . $row, 'Vendedor');
        $sheet->setCellValue('F' . $row, 'Fecha');
        $sheet->setCellValue('G' . $row, 'Total Pesos');
        $sheet->setCellValue('H' . $row, 'Total Dólares');
        $sheet->setCellValue('I' . $row, 'Estado');
        $row++;
    
        if ($budgets->isNotEmpty()) {
            foreach ($budgets as $budget) {
                $sheet->setCellValue('A' . $row, $row - 1);
                $sheet->setCellValue('B' . $row, $budget->code);
                $sheet->setCellValue('C' . $row, $budget->client_name);
                $sheet->setCellValue('D' . $row, $budget->project_name);
                $sheet->setCellValue('E' . $row, $budget->user->name);
                $sheet->setCellValue('F' . $row, \Carbon\Carbon::parse($budget->project_date)->format('d/m/Y'));
                $sheet->setCellValue('G' . $row, $budget->currency == 1 ? number_format($budget->total, 2) : '$0.00');
                $sheet->setCellValue('H' . $row, $budget->currency == 2 ? number_format($budget->total, 2) : '$0.00');
                $sheet->setCellValue('I' . $row, $statuses[$budget->status]['description']);
    
                // Aplicar el color de fondo según el estado de la cotización
                $sheet->getStyle('I' . $row)->getFill()->setFillType(Fill::FILL_SOLID);
                $sheet->getStyle('I' . $row)->getFill()->getStartColor()->setARGB($statuses[$budget->status]['color']);
    
                $row++;
            }
        } else {
            $sheet->setCellValue('A' . $row, 'No hay resultados');
        }
    
        // Escribir el archivo Excel
        $writer = new Xlsx($spreadsheet);
        $fileName = 'reporte_cotizaciones_estados.xlsx';
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        $writer->save('php://output');
    }
    
    
    
}
