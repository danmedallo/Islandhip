<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Schedule source
    |--------------------------------------------------------------------------
    |
    | islandshipping.com.ph is a React front end backed by Supabase, and it
    | fetches its timetable from the PostgREST endpoint below. Reading the same
    | endpoint directly gives identical data without driving a headless browser,
    | which is why this app needs neither Chrome nor Node at runtime.
    |
    | The key is the site's public anon key — the one its own JavaScript ships
    | to every visitor — so it is not a secret. It lives here so a rotation
    | needs an env change rather than a deploy.
    |
    */

    'endpoint' => env('SCHEDULE_API_URL', 'https://mrmlvfmhynbrogxitiap.supabase.co/rest/v1/recurring_schedules'),

    'key' => env('SCHEDULE_API_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybWx2Zm1oeW5icm9neGl0aWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzYxMjIsImV4cCI6MjA4ODQ1MjEyMn0.hKVFeWYzJ47VWo6txBab03Psddld61rmsj-TyKkoTko'),

    'select' => 'id,days_of_week,departure_time,duration_minutes,routes!inner(origin_port:ports!routes_origin_port_id_fkey(name),destination_port:ports!routes_destination_port_id_fkey(name)),vessels!inner(name)',

    /*
    | Token required by the HTTP refresh trigger. Unset disables the endpoint.
    */
    'refresh_token' => env('SCHEDULE_REFRESH_TOKEN'),

];
