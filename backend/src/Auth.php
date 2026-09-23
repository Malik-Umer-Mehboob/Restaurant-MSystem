<?php

namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    private static function secret(): string
    {
        return $_ENV['JWT_SECRET'] ?? 'insecure-default-change-me';
    }

    public static function issueToken(string $username): string
    {
        $payload = [
            'sub' => $username,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 12), // 12 hour session
        ];
        return JWT::encode($payload, self::secret(), 'HS256');
    }

    /** Returns the decoded payload array, or null if the token is missing/invalid/expired. */
    public static function verifyToken(?string $authHeader): ?array
    {
        if (!$authHeader || stripos($authHeader, 'Bearer ') !== 0) {
            return null;
        }
        $token = trim(substr($authHeader, 7));
        try {
            $decoded = JWT::decode($token, new Key(self::secret(), 'HS256'));
            return (array) $decoded;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public static function requireAuth(): void
    {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? null);
        $payload = self::verifyToken($authHeader);
        if ($payload === null) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized. Please log in again.']);
            exit;
        }
    }
}
