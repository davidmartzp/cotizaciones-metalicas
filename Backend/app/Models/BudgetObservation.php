<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class BudgetObservation extends Model
{
    use HasFactory;
    protected $fillable = [
        'budget_id',
        'observation_id',
        'value'
    ];

    //without updated_at and created_at
    public $timestamps = false;

    public function observation()
    {
        return $this->belongsTo(observation::class);
    }

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }
}