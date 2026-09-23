<?php

namespace App\Controllers;

use App\Database;
use MongoDB\BSON\ObjectId;

class MenuController
{
    private static function collection()
    {
        return Database::get()->selectCollection('menu_items');
    }

    private static function toArray($doc): array
    {
        $arr = (array) $doc;
        $arr['_id'] = (string) $arr['_id'];
        $arr['tags'] = isset($arr['tags']) ? (array) $arr['tags'] : [];
        return $arr;
    }

    public static function index(): void
    {
        $cursor = self::collection()->find([], ['sort' => ['category' => 1, 'name' => 1]]);
        $items = [];
        foreach ($cursor as $doc) {
            $items[] = self::toArray($doc);
        }
        echo json_encode($items);
    }

    public static function create(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $doc = self::sanitize($body);

        if (empty($doc['name']) || empty($doc['category'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Name and category are required.']);
            return;
        }

        $result = self::collection()->insertOne($doc);
        $doc['_id'] = (string) $result->getInsertedId();
        echo json_encode($doc);
    }

    public static function update(string $id): void
    {
        if (!self::validId($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid item id.']);
            return;
        }
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $doc = self::sanitize($body);

        self::collection()->updateOne(
            ['_id' => new ObjectId($id)],
            ['$set' => $doc]
        );

        $doc['_id'] = $id;
        echo json_encode($doc);
    }

    public static function delete(string $id): void
    {
        if (!self::validId($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid item id.']);
            return;
        }
        self::collection()->deleteOne(['_id' => new ObjectId($id)]);
        echo json_encode(['success' => true]);
    }

    private static function validId(string $id): bool
    {
        return (bool) preg_match('/^[a-f0-9]{24}$/i', $id);
    }

    /** Keep only known fields and coerce types, so bad input can't corrupt documents. */
    private static function sanitize(array $body): array
    {
        return [
            'name' => (string) ($body['name'] ?? ''),
            'urdu' => (string) ($body['urdu'] ?? ''),
            'category' => (string) ($body['category'] ?? ''),
            'description' => (string) ($body['description'] ?? ''),
            'price' => (float) ($body['price'] ?? 0),
            'tags' => array_values(array_filter((array) ($body['tags'] ?? []), 'is_string')),
            'image' => (string) ($body['image'] ?? ''),
        ];
    }
}
