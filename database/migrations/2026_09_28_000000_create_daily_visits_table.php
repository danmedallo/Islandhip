<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * One row per Manila day, bumped in place by CountVisit, so the table
     * stays at a few hundred rows a year instead of one row per request.
     */
    public function up(): void
    {
        Schema::create('daily_visits', function (Blueprint $table) {
            $table->date('visited_on')->primary();
            $table->unsignedInteger('page_views')->default(0);
            $table->unsignedInteger('visitors')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_visits');
    }
};
