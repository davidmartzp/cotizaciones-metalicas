<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetProduct extends Model
{
    use HasFactory;

    protected $table = 'budget_products'; // Nombre de la tabla en la base de datos

    // Campos que son asignables en masa
    protected $fillable = [
        'budget_id',
        'description',
        'unit',
        'quantity',
        'subtotal',
        'iva',
        'total',
        'apply_max_discount',
        'apply_other_discount',
        'category_id',
        'code_iva',
        'feature_cnc',
        'feature_plain',
        'image',
        'is_special',
        'iva_code',
        'material',
        'discount',
        'max_discount',
        'max_discount_value',
        'other_discount',
        'other_discount_value',
        'price',
        'price_1',
        'product_id',
        'system_name',
        'type_structure',
        'unit_sale',
        'dolar_price',
        'caliber'
    ];

    // Campos que deben ser ocultados para la serialización
    protected $hidden = [
        'created_at',
        'updated_at'
    ];
}
