<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/new', HomeController::class)->name('new');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('resumes', [DocumentController::class, 'resumes'])->name('resumes.index');
    Route::get('coverletters', [DocumentController::class, 'coverLetters'])->name('coverletters.index');
    Route::apiResource('documents', DocumentController::class);
    Route::get('documents/{document}/export', [DocumentController::class, 'export'])
        ->name('documents.export');
});

require __DIR__.'/settings.php';
