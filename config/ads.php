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

    /*
    | Shown when no sponsor is configured, so the slot earns something rather
    | than sitting empty. Not labelled "Sponsored" — it is a request, not an ad.
    |
    | The number is published to everyone who opens the app, so use one you are
    | happy to have public.
    */

    'support' => [
        'name' => env('ADS_SUPPORT_NAME'),       // the GCash account name
        'number' => env('ADS_SUPPORT_NUMBER'),   // e.g. "0917 123 4567"
        // Keep under ~25 characters: the bar is one line and truncates at
        // 360px, which is a common Android width.
        'note' => env('ADS_SUPPORT_NOTE'),
    ],

];
