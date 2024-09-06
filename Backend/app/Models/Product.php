<?php

// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'code_iva', 'system_name', 'feature_cnc', 'feature_plain', 'material',
        'caliber', 'type_structure', 'unit_sale','price','price_1', 'price_2', 'discount',
        'dolar_price', 'image', 'created_at', 'updated_at', 'category_id'
    ];
}
