<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Auth;
use App\Controllers\AnalyticsController;
use App\Controllers\AuthController;
use App\Controllers\MenuController;
use App\Controllers\OrderController;
use App\Controllers\ReviewController;
use App\Controllers\UploadController;

if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

// ---- CORS ----
$origin = $_ENV['CORS_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Routing ----
// Strip query string and a leading /api so this works whether the API is
// served at the domain root or under a /api path on shared hosting.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);
$path = rtrim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($path === '/menu' && $method === 'GET') {
        MenuController::index();
    } elseif ($path === '/menu' && $method === 'POST') {
        Auth::requireAuth();
        MenuController::create();
    } elseif (preg_match('#^/menu/([a-f0-9]{24})$#i', $path, $m) && $method === 'PUT') {
        Auth::requireAuth();
        MenuController::update($m[1]);
    } elseif (preg_match('#^/menu/([a-f0-9]{24})$#i', $path, $m) && $method === 'DELETE') {
        Auth::requireAuth();
        MenuController::delete($m[1]);
    } elseif ($path === '/login' && $method === 'POST') {
        AuthController::login();
    } elseif ($path === '/upload' && $method === 'POST') {
        Auth::requireAuth();
        UploadController::upload();
    } elseif ($path === '/reviews/summary' && $method === 'GET') {
        ReviewController::summary();
    } elseif (preg_match('#^/menu/([a-f0-9]{24})/reviews$#i', $path, $m) && $method === 'GET') {
        ReviewController::index($m[1]);
    } elseif (preg_match('#^/menu/([a-f0-9]{24})/reviews$#i', $path, $m) && $method === 'POST') {
        ReviewController::create($m[1]);
    } elseif ($path === '/orders' && $method === 'POST') {
        OrderController::create();
    } elseif ($path === '/orders/track' && $method === 'GET') {
        OrderController::track();
    } elseif ($path === '/orders' && $method === 'GET') {
        Auth::requireAuth();
        OrderController::index();
    } elseif (preg_match('#^/orders/([a-f0-9]{24})/status$#i', $path, $m) && $method === 'PUT') {
        Auth::requireAuth();
        OrderController::updateStatus($m[1]);
    } elseif ($path === '/analytics/summary' && $method === 'GET') {
        Auth::requireAuth();
        AnalyticsController::summary();
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found.']);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
