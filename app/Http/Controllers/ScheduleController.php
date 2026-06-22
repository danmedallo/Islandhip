<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedules;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Pagination\LengthAwarePaginator;

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

    public function schedules(Request $request)
    {
        $query = Schedules::query(); // ← make sure model name is correct

        if ($request->filled('from')) {
            $query->where('origin', $request->from);
        }

        if ($request->filled('to')) {
            $query->where('destination', $request->to);
        }

        if ($request->filled('date')) {
            $query->whereDate('trip_date', Carbon::parse($request->date)->toDateString());
        }

        // Sort by time correctly
        $sorted = $query->get()
            ->sortBy(function ($s) {
                try {
                    return Carbon::createFromFormat('g:i A', trim($s->time));
                } catch (\Exception $e) {
                    return Carbon::createFromFormat('h:i A', trim($s->time));
                }
            })
            ->values();

        $perPage     = 15;
        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        $paged = $sorted->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $schedules = new LengthAwarePaginator($paged, $sorted->count(), $perPage, $currentPage, [
            'path'  => $request->url(),
            'query' => $request->query(),
        ]);

        return Inertia::render('Schedule', [
            'schedules' => $schedules,
            'filters'   => $request->only(['from', 'to', 'date']),
        ]);
    }

    public function scheduleDetails(Request $request)
    {
        $schedule = Schedules::find($request->id);

        if (!$schedule) {
            abort(404, 'Schedule not found');
        }

        return Inertia::render('ScheduleDetails', [
            'schedule' => $schedule,
        ]);
    }
}
