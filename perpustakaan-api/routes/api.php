<?php

// File: routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BukuController;
use App\Http\Controllers\Api\AnggotaController;
use App\Http\Controllers\Api\PeminjamanController;

// Resource Routes — otomatis membuat 5 endpoint CRUD
Route::apiResource('bukus', BukuController::class);
Route::apiResource('anggotas', AnggotaController::class);
Route::apiResource('peminjamans', PeminjamanController::class);
