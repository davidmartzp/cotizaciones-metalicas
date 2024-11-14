<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    # Ahora vamos a hacer los endpoints para la API
    // GET /api/product
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // GET /api/product/{id}
    public function show($id)
    {
        $product = Product::find($id);
        return response()->json($product);
    }

    // POST /api/product
    public function store(Request $request)
    {
        $product = new Product();
        $product->code_iva = $request->input('code_iva');
        $product->system_name = $request->input('system_name');
        $product->unit_sale = $request->input('unit_sale');
        $product->price_1 = $request->input('price_1');
        $product->discount = $request->input('discount');
        $product->dolar_price = $request->input('dolar_price');
        $product->category_id = $request->input('category_id');

        $product->material = $request->input('material');
        $product->caliber = $request->input('caliber');
        $product->type_structure = $request->input('type_structure');
        $product->feature_cnc = $request->input('feature_cnc');
        $product->feature_plain = $request->input('feature_plain');

        //si la categoria es 4 material, calibre , type_structure, feature_cnc, feature_plain son nulos
        if ($product->category_id == 4) {
            $product->material = null;
            $product->caliber = null;
            $product->type_structure = null;
            $product->feature_cnc = null;
            $product->feature_plain = null;
        }
        $product->save();

        return response()->json($product);

    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $product->code_iva = $request->input('code_iva');
        $product->system_name = $request->input('system_name');
        $product->feature_cnc = $request->input('feature_cnc');
        $product->feature_plain = $request->input('feature_plain');
        $product->material = $request->input('material');
        $product->caliber = $request->input('caliber');
        $product->type_structure = $request->input('type_structure');
        $product->unit_sale = $request->input('unit_sale');
        $product->price_1 = $request->input('price_1');
        $product->discount = $request->input('discount');
        $product->dolar_price = $request->input('dolar_price');
        $product->category_id = $request->input('category_id');

        //si la categoria es 4 material, calibre , type_structure, feature_cnc, feature_plain son nulos
        if ($product->category_id == 4) {
            $product->material = null;
            $product->caliber = null;
            $product->type_structure = null;
            $product->feature_cnc = null;
            $product->feature_plain = null;
        }

        $product->save();

        return response()->json($product);
    }



    public function searchProduct(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $query->where('category_id', $request->input('category'));
        }

        if ($request->has('system_name')) {
            $query->where('system_name', $request->input('system_name'));
        }

        if ($request->has('material')) {
            
            $query->where('material', $request->input('material'));
        }


        if ($request->input('cutTypeCnc') > 0 || $request->input('cutTypePlain') > 0) {
            $query->where(function ($query) use ($request) {
            if ($request->input('cutTypeCnc') > 0) {
                $query->orWhere('feature_cnc', "1");
            }
            if ($request->input('cutTypePlain') > 0) {
                $query->orWhere('feature_plain', "2");
            }
            });
        }

        if ($request->has('unit')) {
            
            $query->where('unit_sale', $request->input('unit'));
        }

        if ($request->has('structure')) {
            $query->where('type_structure', $request->input('structure'));
        }


        $products = $query->orderBy('system_name')->get();

        //Devolver tambien la cantidad
        $quantity = $products->count();

        return response()->json($products);
    }

    public function importExcel(Request $request)
    {
        try {
            // Verificar qué datos se están enviando
            \Log::info('Request data:', $request->all());
    
            // Validar que el archivo Base64 esté presente
            $request->validate([
                'file' => 'required',
                'fileName' => 'required|string'
            ]);
    
            // Obtener la cadena Base64 del archivo y su nombre
            $base64File = $request->input('file');
            $fileName = $request->input('fileName');
    
            // Comprobar que el base64 no esté vacío
            if (empty($base64File)) {
                return response()->json(['error' => 'El archivo Base64 está vacío.'], 422);
            }
    
            // Decodificar la cadena Base64
            $fileData = explode(',', $base64File);
            $decodedFile = base64_decode($fileData[1] ?? '');
    
            // Validar la decodificación
            if ($decodedFile === false) {
                return response()->json(['error' => 'Error al decodificar el archivo Base64.'], 422);
            }
    
            // Crear un archivo temporal para procesar el Excel
            $tempFilePath = sys_get_temp_dir() . '/' . $fileName;
            file_put_contents($tempFilePath, $decodedFile);
    
            // Abrir el archivo temporal y procesar el Excel
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($tempFilePath);
            $sheet = $spreadsheet->getActiveSheet();
    
            // Obtener todas las filas, pero omitir la primera fila (cabeceras)
            $rows = $sheet->toArray(null, true, true, true);
            array_shift($rows); // Omitir la primera fila
    
            $errors = []; // Array para almacenar errores
    
            foreach ($rows as $rowIndex => $row) {
                // Obtener el ID y verificar que esté presente
                $productId = $row['A']; // Suponiendo que la columna A es el ID
    
                // Preparar el data array
                $productData = [
                    'code_iva' => $row['B'],
                    'system_name' => $row['C'],
                    'feature_cnc' => $row['D'],
                    'feature_plain' => $row['E'],
                    'material' => $row['F'],
                    'caliber' => $row['G'],
                    'type_structure' => $row['H'],
                    'unit_sale' => $row['I'],
                    'price_1' => $row['J'],
                    'discount' => $row['K'],
                    'dolar_price' => $row['L'],
                    'category_id' => $row['M'],
                ];
    
                // Validaciones
    
                if (empty($productData['system_name'])) {
                    return response()->json([
                        'error' => 'El nombre del sistema no puede estar vacío.',
                        'row' => $rowIndex + 2,
                        'column' => 'Nombre del sistema'
                    ], 422);
                }

                // Sólo se admite el valor 1 y null o blanco en corte cnc
                if ($productData['feature_cnc'] !== '1' && !empty($productData['feature_cnc'])) {
                    return response()->json([
                        'error' => 'El valor de corte CNC debe ser 1 o estar vacío.',
                        'row' => $rowIndex + 2,
                        'column' => 'D'
                    ], 422);
                }

                //los únicos valores admitidos para material son EN MAYUSCULAS GALVANIZADO, ALUMINIO , INOXIDABLE, CR O null o blanco
                if ($productData['material'] !== 'GALVANIZADO' && $productData['material'] !== 'ALUMINIO' && $productData['material'] !== 'INOXIDABLE' && $productData['material'] !== 'CR' && !empty($productData['material'])) {
                    return response()->json([
                        'error' => 'El material debe ser GALVANIZADO, ALUMINIO, INOXIDABLE, CR o estar vacío.',
                        'row' => $rowIndex + 2,
                        'column' => 'F'
                    ], 422);
                }

                //Calibre debe ser numero o estar vacío
                if (!is_numeric($productData['caliber']) && !empty($productData['caliber'])) {
                    return response()->json([
                        'error' => 'El calibre debe ser un número.',
                        'row' => $rowIndex + 2,
                        'column' => 'G'
                    ], 422);
                }

                //los únicos valores disponibles para type_structure son SI , NO o null o blanco
                if ($productData['type_structure'] !== 'SI' && $productData['type_structure'] !== 'NO' && !empty($productData['type_structure'])) {
                    return response()->json([
                        'error' => 'El tipo de estructura debe ser SI, NO o estar vacío.',
                        'row' => $rowIndex + 2,
                        'column' => 'H'
                    ], 422);
                }

                // Sólo se admite el valor 2 y null o blanco en corte plain
                if ($productData['feature_plain'] !== '2' && !empty($productData['feature_plain'])) {
                    return response()->json([
                        'error' => 'El valor de corte Liso debe ser 2 o estar vacío.',
                        'row' => $rowIndex + 2,
                        'column' => 'E'
                    ], 422);
                }
    
                // Asegúrate de que 'price_1', 'discount' y 'dolar_price' sean números
                if (!is_numeric($productData['price_1'])) {
                    return response()->json([
                        'error' => 'El precio debe ser un número.',
                        'row' => $rowIndex + 2,
                        'column' => 'J'
                    ], 422);
                }

                
    
                if (!is_numeric($productData['discount'])) {
                    return response()->json([
                        'error' => 'El descuento debe ser un número.',
                        'row' => $rowIndex + 2,
                        'column' => 'K'
                    ], 422);
                }
    
                //el descuento debe ser un número entre 0 y 99
                if ($productData['discount'] < 0 || $productData['discount'] > 99) {
                    return response()->json([
                        'error' => 'El descuento debe ser un número entre 0 y 99.',
                        'row' => $rowIndex + 2,
                        'column' => 'K'
                    ], 422);
                }

                if (!is_numeric($productData['dolar_price'])) {
                    return response()->json([
                        'error' => 'El precio en dólares debe ser un número.',
                        'row' => $rowIndex + 2,
                        'column' => 'L'
                    ], 422);
                }

                // Las categorías válidas son 1, 2, 3 y 4
                if (!in_array($productData['category_id'], [1, 2, 3, 4])) {
                    return response()->json([
                        'error' => 'La categoría debe ser 1, 2, 3 o 4.',
                        'row' => $rowIndex + 2,
                        'column' => 'M'
                    ], 422);
                }
                
    
                // Comprobar si el ID ya existe en la base de datos
                if (!empty($productId) && Product::find($productId)) {
                    // Si el ID existe, actualizar el producto
                    Product::where('id', $productId)->update($productData);
                } else {
                    // Si el ID no existe, crear un nuevo producto
                    Product::create(array_merge(['id' => $productId], $productData));
                }
            }
    
            // Eliminar el archivo temporal
            unlink($tempFilePath);
    
            return response()->json(['message' => 'Productos importados correctamente.'], 200);
        } catch (\Exception $e) {
            // Manejar la excepción y retornar un error 500
            \Log::error('Error al importar productos: ' . $e->getMessage()); // Loguear el error
            return response()->json(['error' => 'Ocurrió un error al procesar la solicitud.'], 500);
        }
    }
    
    
}
