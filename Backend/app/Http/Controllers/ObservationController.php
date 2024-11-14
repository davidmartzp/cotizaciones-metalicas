<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Observation;
use App\Models\BudgetObservation;

class ObservationController extends Controller
{
    //Rutas api para manejo de observaciones, retorna json
    public function getObservations()
    {
        $observations = Observation::all();
        return response()->json($observations);
    }

}