<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedules extends Model
{
     protected $fillable = [
        'origin',
        'destination',
        'time',
        'vessel',
        'duration',
        'trip_date',
    ];

    protected $casts = [
        'trip_date' => 'date',
    ];
}
