<?php

namespace App\Controllers;

use App\Auth;
use App\Database;

class AuthController
{
    public static function login(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $username = trim((string) ($body['username'] ?? ''));
        $password = (string) ($body['password'] ?? '');

        $user = Database::get()->selectCollection('users')->findOne(['username' => $username]);

        if (!$user || !password_verify($password, $user['passwordHash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid username or password.']);
            return;
        }

        echo json_encode(['token' => Auth::issueToken($username)]);
    }
}
