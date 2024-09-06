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
        $product->feature_cnc = $request->input('feature_cnc');
        $product->feature_plain = $request->input('feature_plain');
        $product->material = $request->input('material');
        $product->caliber = $request->input('caliber');
        $product->type_structure = $request->input('type_structure');
        $product->unit_sale = $request->input('unit_sale');
        $product->price_1 = $request->input('price_1');
        $product->price_2 = $request->input('price_1') * ($request->input('discount') / 100);
        $product->discount = $request->input('discount');
        $product->dolar_price = $request->input('dolar_price');
        $product->category_id = $request->input('category_id');
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
        $product->price_2 = $request->input('price_2');
        $product->discount = $request->input('discount');
        $product->dolar_price = $request->input('dolar_price');
        $product->category_id = $request->input('category_id');
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


    
}
