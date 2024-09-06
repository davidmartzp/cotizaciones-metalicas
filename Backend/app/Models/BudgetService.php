<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetService extends Model
{
    

    protected $fillable = [
        'budget_id',
        'description',
        'unit',
        'adminPercentage',
        'adminValue',
        'price',
        'unforeseenPercentage',
        'unforeseenValue',
        'quantity',
        'profitPercentage',
        'profitValue',
        'subtotal',
        'iva',
        'total',
        'confirmed',
    ];

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }
}
