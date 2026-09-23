<?php
// Run once after setup: php seed.php
// Safe to re-run — it won't duplicate items or reset an admin password
// that has already been changed.

require __DIR__ . '/vendor/autoload.php';

use App\Database;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

$db = Database::get();

// ---- 1. Admin user ----
$users = $db->selectCollection('users');
$adminUsername = $_ENV['ADMIN_USERNAME'] ?? 'admin';
$adminPassword = $_ENV['ADMIN_PASSWORD'] ?? 'Angaar@2026';

$existing = $users->findOne(['username' => $adminUsername]);
if (!$existing) {
    $users->insertOne([
        'username' => $adminUsername,
        'passwordHash' => password_hash($adminPassword, PASSWORD_BCRYPT),
    ]);
    echo "Created admin user '$adminUsername'.\n";
} else {
    echo "Admin user '$adminUsername' already exists — left untouched.\n";
}

// ---- 2. Menu items ----
$menuItems = $db->selectCollection('menu_items');
$count = $menuItems->countDocuments();

if ($count === 0) {
    $data = json_decode(file_get_contents(__DIR__ . '/seed_data/menu.json'), true);
    foreach ($data as &$item) {
        unset($item['id']); // Mongo will generate its own _id
    }
    $menuItems->insertMany($data);
    echo 'Imported ' . count($data) . " starting menu items.\n";
} else {
    echo "menu_items already has $count documents — skipped import (delete the collection first if you want to re-import).\n";
}

echo "Done.\n";
