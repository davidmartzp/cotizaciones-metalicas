<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Budget;
use App\Models\Project;
use App\Models\User;
use App\Models\Product;
use App\Models\BudgetProduct;
use App\Models\BudgetService;
use App\Models\ProductHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BudgetController extends Controller
{



    # Lista de presupuestos

    public function getBudgets()
    {
        //obtener el usuario de auth 
        $user = auth()->user();
        
        // si role es 1 (admin) mostrar todos los presupuestos si no se filtra por el id de usuario
        if ($user->role == 1) {
            $budgets = Budget::orderBy('created_at', 'desc')->get();
        } else {
            $budgets = Budget::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        }

    
        return response()->json($budgets);
    }

    
    public function storeBudget(Request $request)
    {
        
        // Crear un nuevo presupuesto
        DB::beginTransaction();

        //try {


            //consultamos el usuario por el id
            $user = User::find($request->input('user_id'));



            // Necesitamos generes un código para la cotización , sería inicialaes del usuario+consecutivo hasta 5 digitos llena con ceros a la izquierda+ año YY
            $code = $user->initials . str_pad($user->budgets_count + 1, 5, '0', STR_PAD_LEFT) . date('y');

    
            // Actualizar el contador de cotizaciones del usuario
            $user->budgets_count++;
            $user->save();


            $budget = Budget::create([
            'code'=>$code,
            'user_id' => $request->input('user_id', ''),
            'client_name' => $request->input('client.name', ''),
            'client_numid' => $request->input('client.numid', ''),
            'client_city' => $request->input('client.city', ''),
            'client_company' => $request->input('client.company', ''),
            'client_address' => $request->input('client.address', ''),
            'client_phone' => $request->input('client.phone', ''),
            'client_email' => $request->input('client.email', ''),

            'project_name' => $request->input('project.name', ''),
            'project_date' => $request->input('project.date', ''),
            'manufacture_delivery_time' => $request->input('project.manufacture_delivery_time', ''),
            'installation_delivery_time' => $request->input('project.installation_delivery_time', ''),
            'warranty' => $request->input('project.warranty', ''),
            'payment_methods_notes' => $request->input('project.payment_methods_notes', ''),
            'delivery_address' => $request->input('project.delivery_address', ''),
            'offer_valid' => $request->input('project.offer_valid', ''),

            'observation' => $request->input('observation.observation', ''),
            'observation_1' => $request->input('observation.observation_1', ''),
            'observation_2' => $request->input('observation.observation_2', ''),
            'observation_3' => $request->input('observation.observation_3', ''),
            'observation_4' => $request->input('observation.observation_4', ''),

            'total' => $request->input('total', 0),
            'currency' => $request->input('currency', 1),
            'total_supplies' => $request->input('total_supplies', 0),
            'total_services' => $request->input('total_services', 0),
            
            'delivery_cost' => $request->input('project.delivery_cost', 0),
            'advance_payment_percentage' => $request->input('project.advance_payment_percentage', 0),   
            'advance_payment_value' => $request->input('project.advance_payment_value', 0),
            'suppliesIva' => $request->input('project.suppliesIva', 0), 
            'servicesIva' => $request->input('project.servicesIva', 0),
            'adminPercentage' => $request->input('project.adminPercentage', 0),
            'adminValue' => $request->input('project.adminValue', 0),
            'profitPercentage' => $request->input('project.profitPercentage', 0),
            'profitValue' => $request->input('project.profitValue', 0),
            'unforeseenPercentage' => $request->input('project.unforeseenPercentage', 0),
            'unforeseenValue' => $request->input('project.unforeseenValue', 0)

            ]);

            // Crear productos
            $productsData = $request->input('products', []);

            foreach ($productsData as $productData) {
            
            
            // Decodificar la imagen Base64
            $imageName = null;
            if ($productData['image'] !== null) {
                $image = $productData['image']; // Obtener el Base64
                $image = str_replace('data:image/png;base64,', '', $image);
                $image = str_replace('data:image/jpeg;base64,', '', $image); // Add this line to handle JPEG images
                $image = str_replace(' ', '+', $image);
                $imageName = uniqid() . '.png';
                 // Define the directory where the image will be saved
    $imageDirectory = public_path('images/');

    // Ensure the directory exists
    if (!file_exists($imageDirectory)) {
        mkdir($imageDirectory, 0755, true);
    }

    // Save the decoded image content to the specified directory
    file_put_contents($imageDirectory . $imageName, base64_decode($image));


                // Guardar el nombre o la ruta de la imagen en la base de datos
                $request->merge(['image' => 'images/' . $imageName]);
            }
            
            BudgetProduct::create([
                'budget_id' => $budget->id,
                'description' => $productData['description'] ?? '',
                'unit' => $productData['unit'] ?? '',
                'quantity' => $productData['quantity'] ?? 0,
                'subtotal' => $productData['subtotal'] ?? 0,
                'iva' => $productData['iva'] ?? 0,
                'total' => $productData['total'] ?? 0,
                'apply_max_discount' => $productData['apply_max_discount'] ?? false,
                'apply_other_discount' => $productData['apply_other_discount'] ?? false,
                'category_id' => $productData['category_id'] ?? null,
                'code_iva' => $productData['code_iva'] ?? '',
                'feature_cnc' => $productData['feature_cnc'] ?? '',
                'feature_plain' => $productData['feature_plain'] ?? '',
                'image' =>  $imageName,
                'is_special' => $productData['is_special'] ?? null,
                'iva_code' => $productData['iva_code'] ?? '',
                'material' => $productData['material'] ?? '',
                'max_discount' => $productData['max_discount'] ?? '',
                'max_discount_value' => $productData['max_discount_value'] ?? 0,
                'other_discount' => $productData['other_discount'] ?? 0,
                'other_discount_value' => $productData['other_discount_value'] ?? 0,
                'price' => $productData['price'] ?? '',
                'price_1' => $productData['price_1'] ?? '',
                'price_2' => $productData['price_2'] ?? '',
                'dolar_price' => $productData['dolar_price'] ?? '',
                'product_id' => $productData['product_id'] ?? 0,
                'quantity' => $productData['quantity'] ?? 0,
                'subtotal' => $productData['subtotal'] ?? 0,
                'system_name' => $productData['system_name'] ?? '',
                'total' => $productData['total'] ?? 0,
                'type_structure' => $productData['type_structure'] ?? '',
                'unit' => $productData['unit'] ?? '',
                'unit_sale' => $productData['unit_sale'] ?? ''
            ]);
            }

            // Crear servicios
            $servicesData = $request->input('services', []);
            foreach ($servicesData as $serviceData) {
            BudgetService::create([
                'budget_id' => $budget->id,
                'price' => $serviceData['price'] ?? 0,
                'description' => $serviceData['description'] ?? '',
                'unit' => $serviceData['unit'] ?? '',
                'adminPercentage' => $serviceData['adminPercentage'] ?? 0,
                'adminValue' => $serviceData['adminValue'] ?? 0,
                'unforeseenPercentage' => $serviceData['unforeseenPercentage'] ?? 0,
                'unforeseenValue' => $serviceData['unforeseenValue'] ?? 0,
                'quantity' => $serviceData['quantity'] ?? 0,
                'profitPercentage' => $serviceData['profitPercentage'] ?? 0,
                'profitValue' => $serviceData['profitValue'] ?? 0,
                'subtotal' => $serviceData['subtotal'] ?? 0,
                'iva' => $serviceData['iva'] ?? 0,
                'total' => $serviceData['total'] ?? 0,
                'confirmed' => $serviceData['confirmed'] ?? 0
            ]);
            }

            DB::commit();

            // Retornar el ID del presupuesto creado
            return response()->json(['budget_id' => $budget->id], 201);
      /*  } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'An error occurred while creating the budget'], 500);
        }*/
    }

    public function updateBudget(Request $request, $id)
    {
        // Buscar el presupuesto por su ID
        $budget = Budget::find($id);

        // Verificar si el presupuesto existe
        if (!$budget) {
            return response()->json(['error' => 'Budget not found'], 404);
        }

        
        // Actualizar el presupuesto
        $budget->update([
            'client_name' => $request->input('client.name', $budget->client_name),
            'client_numid' => $request->input('client.numid', $budget->client_id),
            'client_city' => $request->input('client.city', $budget->client_city),
            'client_company' => $request->input('client.company', $budget->client_company),
            'client_address' => $request->input('client.address', $budget->client_address),
            'client_phone' => $request->input('client.phone', $budget->client_phone),
            'client_email' => $request->input('client.email', $budget->client_email),

            'project_name' => $request->input('project.name', $budget->project_name),
            'project_date' => $request->input('project.date', $budget->project_date),
            'manufacture_delivery_time' => $request->input('project.manufacture_delivery_time', $budget->manufacture_delivery_time),
            'installation_delivery_time' => $request->input('project.installation_delivery_time', $budget->installation_delivery_time),
            'warranty' => $request->input('project.warranty', $budget->warranty),
            'payment_methods_notes' => $request->input('project.payment_methods_notes', $budget->payment_methods_notes),
            'delivery_address' => $request->input('project.delivery_address', $budget->delivery_address),
            'offer_valid' => $request->input('project.offer_valid', $budget->offer_valid),

            'observation' => $request->input('observation.observation', $budget->observation),
            'observation_1' => $request->input('observation.observation_1', $budget->observation_1),
            'observation_2' => $request->input('observation.observation_2', $budget->observation_2),
            'observation_3' => $request->input('observation.observation_3', $budget->observation_3),
            'observation_4' => $request->input('observation.observation_4', $budget->observation_4),

            'total' => $request->input('total', $budget->total),
            'currency' => $request->input('currency', $budget->currency),
            'total_supplies' => $request->input('total_supplies', $budget->total_supplies),
            'total_services' => $request->input('total_services', $budget->total_services),

            'advance_payment_percentage' => $request->input('project.advance_payment_percentage', $budget->advance_payment_percentage),
            'advance_payment_value' => $request->input('project.advance_payment_value', $budget->advance_payment_value),
            'delivery_cost' => $request->input('project.delivery_cost', $budget->delivery_cost),
            'suppliesIva' => $request->input('project.suppliesIva', $budget->suppliesIva),
            'servicesIva' => $request->input('project.servicesIva', $budget->servicesIva),
            'adminPercentage' => $request->input('project.adminPercentage', $budget->adminPercentage),
            'adminValue' => $request->input('project.adminValue', $budget->adminValue),
            'profitPercentage' => $request->input('project.profitPercentage', $budget->profitPercentage),
            'profitValue' => $request->input('project.profitValue', $budget->profitValue),
            'unforeseenPercentage' => $request->input('project.unforeseenPercentage', $budget->unforeseenPercentage),
            'unforeseenValue' => $request->input('project.unforeseenValue', $budget->unforeseenValue)

        ]);

        // Eliminar productos existentes
        BudgetProduct::where('budget_id', $id)->delete();

        // Crear productos nuevos
        $productsData = $request->input('products', []);
        foreach ($productsData as $productData) {
        
        
        // Decodificar la imagen Base64
        $imageName = null;
        if ($productData['image']) {
            $image = $productData['image']; // Obtener el Base64

            //Si la imagen es una URL, sólo pasamos la ultima parte de la URL
            if (strpos($image, 'http') !== false) {
                $imageName = explode('/', $image);
                $imageName = end($imageName);                
           
            } else {
                //si una imagen es substituida, eliminamos la anterior
                if ($productData['image'] !== $budget->image) {
                    Storage::disk('public')->delete('images/' . $budget->image);
                }

                $image = str_replace('data:image/png;base64,', '', $image);
                $image = str_replace('data:image/jpeg;base64,', '', $image); // Add this line to handle JPEG images
                $image = str_replace(' ', '+', $image);
                $imageName = uniqid() . '.png';

                 // Define the directory where the image will be saved
    $imageDirectory = public_path('images/');

    // Ensure the directory exists
    if (!file_exists($imageDirectory)) {
        mkdir($imageDirectory, 0755, true);
    }

    // Save the decoded image content to the specified directory
    file_put_contents($imageDirectory . $imageName, base64_decode($image));


                
            } 
        
        }
                        
            BudgetProduct::create([
                'budget_id' => $budget->id,
                'description' => $productData['description'] ?? '',
                'unit' => $productData['unit'] ?? '',
                'price' => $productData['price'] ?? 0,
                'quantity' => $productData['quantity'] ?? 0,
                'subtotal' => $productData['subtotal'] ?? 0,
                'iva' => $productData['iva'] ?? 0,
                'total' => $productData['total'] ?? 0,
                'apply_max_discount' => $productData['apply_max_discount'] ?? false,
                'apply_other_discount' => $productData['apply_other_discount'] ?? false,
                'category_id' => $productData['category_id'] ?? null,
                'code_iva' => $productData['code_iva'] ?? '',
                'created_at' => $productData['created_at'] ?? null,
                'discount' => $productData['discount'] ?? '',
                'dolar_price' => $productData['dolar_price'] ?? '',
                'feature_cnc' => $productData['feature_cnc'] ?? '',
                'feature_plain' => $productData['feature_plain'] ?? '',
                'image' => $imageName,
                'is_special' => $productData['is_special'] ?? null,
                'iva' => $productData['iva'] ?? 0,
                'iva_code' => $productData['iva_code'] ?? '',
                'material' => $productData['material'] ?? '',
                'max_discount' => $productData['max_discount'] ?? '',
                'max_discount_value' => $productData['max_discount_value'] ?? 0,
                'other_discount' => $productData['other_discount'] ?? 0,
                'other_discount_value' => $productData['other_discount_value'] ?? 0,
                'price' => $productData['price'] ?? '',
                'price_1' => $productData['price_1'] ?? '',
                'price_2' => $productData['price_2'] ?? '',
                'product_id' => $productData['product_id'] ?? null,
                'quantity' => $productData['quantity'] ?? 0,
                'subtotal' => $productData['subtotal'] ?? 0,
                'system_name' => $productData['system_name'] ?? '',
                'total' => $productData['total'] ?? 0,
                'type_structure' => $productData['type_structure'] ?? '',
                'unit' => $productData['unit'] ?? '',
                'unit_sale' => $productData['unit_sale'] ?? '',
                'updated_at' => $productData['updated_at'] ?? null,
            ]);
        }

        // Eliminar servicios existentes si hay datos de servicios en la solicitud
        if ($request->has('services')) {
            BudgetService::where('budget_id', $id)->delete();

            // Crear servicios nuevos
            $servicesData = $request->input('services', []);
            foreach ($servicesData as $serviceData) {
                BudgetService::create([
                    'budget_id' => $budget->id,
                    'description' => $serviceData['description'] ?? '',
                    'unit' => $serviceData['unit'] ?? '',
                    'adminPercentage' => $serviceData['adminPercentage'] ?? 0,
                    'adminValue' => $serviceData['adminValue'] ?? 0,
                    'price' => $serviceData['price'] ?? 0,
                    'unforeseenPercentage' => $serviceData['unforeseenPercentage'] ?? 0,
                    'unforeseenValue' => $serviceData['unforeseenValue'] ?? 0,
                    'quantity' => $serviceData['quantity'] ?? 0,
                    'profitPercentage' => $serviceData['profitPercentage'] ?? 0,
                    'profitValue' => $serviceData['profitValue'] ?? 0,
                    'subtotal' => $serviceData['subtotal'] ?? 0,
                    'iva' => $serviceData['iva'] ?? 0,
                    'total' => $serviceData['total'] ?? 0,
                    'confirmed' => $serviceData['confirmed'] ?? 0,
                ]);
            }
        } else {
            // Si no hay servicios, simplemente aseguramos que se eliminen si existían antes
            BudgetService::where('budget_id', $id)->delete();
        }

        // Devolver la respuesta con el presupuesto actualizado
        return response()->json([
            'message' => 'Budget updated successfully',
            'budget' => $budget
        ]);
    }

    public function getBudgetById($id)
    {
        // Obtener el presupuesto por ID
        $budget = Budget::find($id);

        // Verificar si el presupuesto existe
        if (!$budget) {
            return response()->json(['error' => 'Budget not found'], 404);
        }

        // Obtener los productos relacionados con el presupuesto
        $products = BudgetProduct::where('budget_id', $id)->get();

        // Obtener los servicios relacionados con el presupuesto
        $services = BudgetService::where('budget_id', $id)->get();

       

        // Construir la respuesta con la estructura requerida
        $response = [
            'client' => [
                'name' => $budget->client_name,
                'numid' => $budget->client_numid,
                'city' => $budget->client_city,
                'company' => $budget->client_company,
                'address' => $budget->client_address,
                'phone' => $budget->client_phone,
                'email' => $budget->client_email,
            ],
            'project' => [
                'name' => $budget->project_name,
                'date' => $budget->project_date,
                'manufacture_delivery_time' => $budget->manufacture_delivery_time,
                'installation_delivery_time' => $budget->installation_delivery_time,
                'warranty' => $budget->warranty,
                'payment_methods_notes' => $budget->payment_methods_notes,
                'delivery_address' => $budget->delivery_address,
                'offer_valid' => $budget->offer_valid,
                'delivery_cost' => $budget->delivery_cost,
                'advance_payment_percentage' => $budget->advance_payment_percentage,
                'advance_payment_value' => $budget->advance_payment_value,
                'suppliesIva' => $budget->suppliesIva,
                'servicesIva' => $budget->servicesIva,
                'adminPercentage' => $budget->adminPercentage,
                'adminValue' => $budget->adminValue,
                'profitPercentage' => $budget->profitPercentage,
                'profitValue' => $budget->profitValue,
                'unforeseenPercentage' => $budget->unforeseenPercentage,
                'unforeseenValue' => $budget->unforeseenValue,
            ],
            'observation' => [
                'observation' => $budget->observation,
                'observation_1' => $budget->observation_1,
                'observation_2' => $budget->observation_2,
                'observation_3' => $budget->observation_3,
                'observation_4' => $budget->observation_4,
            ],
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
            'description' => $product->description,
            'unit' => $product->unit,
            'quantity' => $product->quantity,
            'subtotal' => $product->subtotal,
            'iva' => $product->iva,
            'total' => $product->total,
            'apply_max_discount' => $product->apply_max_discount,
            'apply_other_discount' => $product->apply_other_discount,
            'category_id' => $product->category_id,
            'code_iva' => $product->code_iva,
            'created_at' => $product->created_at,
            'discount' => $product->discount,
            'dolar_price' => $product->dolar_price,
            'feature_cnc' => $product->feature_cnc,
            'feature_plain' => $product->feature_plain,
            'image' => $product->image ? asset('/public/images/' . $product->image) : null,
            'is_special' => $product->is_special,
            'iva' => $product->iva,
            'iva_code' => $product->iva_code,
            'material' => $product->material,
            'max_discount' => $product->max_discount,
            'max_discount_value' => $product->max_discount_value,
            'other_discount' => $product->other_discount,
            'other_discount_value' => $product->other_discount_value,
            'price' => $product->price,
            'price_1' => $product->price_1,
            'price_2' => $product->price_2,
            'product_id' => $product->product_id,
            'quantity' => $product->quantity,
            'subtotal' => $product->subtotal,
            'system_name' => $product->system_name,
            'total' => $product->total,
            'type_structure' => $product->type_structure,
            'unit' => $product->unit,
            'unit_sale' => $product->unit_sale,
            'updated_at' => $product->updated_at,
                ];
            }),
            'services' => $services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'description' => $service->description,
                    'price' => $service->price,
                    'unit' => $service->unit,
                    'adminPercentage' => $service->adminPercentage,
                    'adminValue' => $service->adminValue,
                    'unforeseenPercentage' => $service->unforeseenPercentage,
                    'unforeseenValue' => $service->unforeseenValue,
                    'quantity' => $service->quantity,
                    'profitPercentage' => $service->profitPercentage,
                    'profitValue' => $service->profitValue,
                    'subtotal' => $service->subtotal,
                    'iva' => $service->iva,
                    'total' => $service->total,
                    'confirmed' => $service->confirmed,
                ];
            }),
            'total' => $budget->total,
            'currency' => $budget->currency,
            'total_supplies' => $budget->total_supplies,
            'total_services' => $budget->total_services,
        ];

        return response()->json($response);
    }


}
