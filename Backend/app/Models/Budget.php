<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
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
        'advance_payment_value'
        
    ];

    public function budgetProducts()
    {
        return $this->hasMany(BudgetProduct::class);
    }

    public function servicesBudget()
    {
        return $this->hasMany(ServiceBudget::class);
    }
}
