<?php

namespace App\Controllers;

class UploadController
{
    private const ALLOWED = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    private const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

    public static function upload(): void
    {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid image file was received.']);
            return;
        }

        $file = $_FILES['image'];

        if ($file['size'] > self::MAX_BYTES) {
            http_response_code(413);
            echo json_encode(['error' => 'Image is too large (max 5MB).']);
            return;
        }

        $mime = mime_content_type($file['tmp_name']);
        if (!isset(self::ALLOWED[$mime])) {
            http_response_code(415);
            echo json_encode(['error' => 'Only JPG, PNG or WEBP images are allowed.']);
            return;
        }

        $ext = self::ALLOWED[$mime];
        $filename = bin2hex(random_bytes(10)) . '.' . $ext;
        $uploadDir = __DIR__ . '/../../public/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $destination = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not save the uploaded image.']);
            return;
        }

        // Public URL path — served directly by the web server / PHP dev server
        // since it lives inside the `public/` document root.
        echo json_encode(['path' => '/uploads/' . $filename]);
    }
}
