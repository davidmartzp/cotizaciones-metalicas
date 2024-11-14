<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $primaryKey = 'id'; 
    protected $fillable = [
        'client_name',
        'client_numid',
        'client_city',
        'client_company',
        'client_address',
        'client_phone',
        'client_email',
        'project_name',
        'project_date',
        'manufacture_delivery_time',
        'installation_delivery_time',
        'warranty',
        'payment_methods_notes',
        'delivery_address',
        'offer_valid',
        'observation_1',
        'observation_2',
        'observation_3',
        'observation_4',
        'total',
        'currency',
        'total_supplies',
        'total_services',
        'code',
        'user_id',
        'delivery_cost',
        'observation',
        'advance_payment_percentage',
        'advance_payment_value',
        'suppliesIva',
        'servicesIva',
        'adminPercentage',
        'adminValue',
        'profitPercentage',
        'profitValue',
        'unforeseenPercentage',
        'unforeseenValue',
        'status',
        'deleted'
        
    ];

    protected $casts = [
        'advance_payment_percentage' => 'float',
        'advance_payment_value' => 'float',
        'suppliesIva' => 'float',
        'servicesIva' => 'float',
        'adminPercentage' => 'float',
        'adminValue' => 'float',
        'profitPercentage' => 'float',
        'profitValue' => 'float',
        'unforeseenPercentage' => 'float',
        'unforeseenValue' => 'float',
        'total' => 'float',
        'total_supplies' => 'float',
        'total_services' => 'float',
        'delivery_cost' => 'float'
    ];

    public function budgetProducts()
    {
        return $this->hasMany(BudgetProduct::class);
    }

    public function servicesBudget()
    {
        return $this->hasMany(ServiceBudget::class);
    }

    public function observationsBudget()
    {
        return $this->hasMany(BudgetObservation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
