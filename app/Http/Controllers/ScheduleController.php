<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedules;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;

class ScheduleController extends Controller
{
     public function welcome(Request $request)
    {
        $query = Schedules::query();

        $date = $request->date
            ? Carbon::parse($request->date)->toDateString()
            : today()->toDateString();

        $query->whereDate('trip_date', $date);

        if ($request->from) {
            $query->where('origin', $request->from);
        }

        if ($request->to) {
            $query->where('destination', $request->to);
        }

        $isToday = $date === today()->toDateString();

        $trips = $query->get()
            ->filter(function ($trip) use ($isToday) {

                if (!$isToday) {
                    return true;
                }

                return Carbon::createFromFormat('h:i A', $trip->time)
                    ->greaterThanOrEqualTo(now());
            })
            ->sortBy(function ($trip) {
                return Carbon::createFromFormat('h:i A', $trip->time);
            })
            ->values();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
            'todaysTrip' => $trips,
        ]);
    }

    public function schedules(Request $request){
        $query = Schedules::query();

        // Only apply date filter IF user selected a date
        if ($request->date) {
            $query->whereDate('trip_date', Carbon::parse($request->date)->toDateString());
        }

        if ($request->from) {
            $query->where('origin', $request->from);
        }

        if ($request->to) {
            $query->where('destination', $request->to);
        }

        $schedules = $query->get()
        ->sortBy(function ($s) {
            return Carbon::createFromFormat('h:i A', $s->time);
        })
        ->values();

        return Inertia::render('Schedule', [
            'schedules' => $schedules,
        ]);
    }
}
