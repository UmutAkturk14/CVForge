<?php
// app/Http/Controllers/HomeController.php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController
{
    public function __invoke(): Response
    {
        return Inertia::render('home', [
            'headline' => 'Build resumes fast',
            'cta' => ['label' => 'Start now', 'url' => '/signup'],
        ]);
    }
}
