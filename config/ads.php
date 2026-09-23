<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Sponsor slot
    |--------------------------------------------------------------------------
    |
    | A single banner at the foot of the page. Deliberately not sticky, not an
    | interstitial, and never shown above the content.
    |
    | Two ways to fill it:
    |
    |  1. A sponsor you sell directly. Set the fields below. The image is served
    |     from this app, so it costs no third-party request, needs no consent
    |     banner, and still renders when the visitor is offline.
    |
    |  2. A network such as AdSense. Put its snippet in AdSlot.jsx where the
    |     comment marks it. Note AdSense will not approve a *.onrender.com
    |     address — it requires a domain you own.
    |
    | Leave `enabled` false and nothing renders at all: no gap, no placeholder.
    |
    */

    'enabled' => env('ADS_ENABLED', false),

    'sponsor' => [
        'label' => env('ADS_SPONSOR_LABEL'),   // e.g. "Kota Beach Resort"
        'image' => env('ADS_SPONSOR_IMAGE'),   // e.g. "/sponsors/kota.png"
        'url' => env('ADS_SPONSOR_URL'),       // where the banner links
        'alt' => env('ADS_SPONSOR_ALT'),       // describes the banner for screen readers
    ],

];
