<?php

namespace App\Controllers;

use App\Database;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

class OrderController
{
    private const STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

    private static function collection()
    {
        return Database::get()->selectCollection('orders');
    }

    private static function toArray($doc): array
    {
        $arr = (array) $doc;
        $arr['_id'] = (string) $arr['_id'];
        $arr['items'] = isset($arr['items']) ? array_map(fn($i) => (array) $i, (array) $arr['items']) : [];
        $arr['createdAt'] = isset($arr['createdAt']) ? $arr['createdAt']->toDateTime()->format(DATE_ATOM) : null;
        return $arr;
    }

    /** POST /orders — called right when the customer taps "Send order on WhatsApp". */
    public static function create(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $items = (array) ($body['items'] ?? []);
        $customerName = trim((string) ($body['customerName'] ?? ''));
        $customerPhone = trim((string) ($body['customerPhone'] ?? ''));

        if (empty($items) || $customerPhone === '') {
            http_response_code(422);
            echo json_encode(['error' => 'A phone number and at least one item are required.']);
            return;
        }

        $total = 0;
        $cleanItems = [];
        foreach ($items as $it) {
            $qty = max(1, (int) ($it['qty'] ?? 1));
            $price = (float) ($it['price'] ?? 0);
            $total += $qty * $price;
            $cleanItems[] = [
                'name' => (string) ($it['name'] ?? ''),
                'price' => $price,
                'qty' => $qty,
            ];
        }

        $doc = [
            'customerName' => $customerName !== '' ? $customerName : 'Guest',
            'customerPhone' => $customerPhone,
            'items' => $cleanItems,
            'total' => $total,
            'status' => 'pending',
            'createdAt' => new UTCDateTime(),
        ];

        $result = self::collection()->insertOne($doc);
        $doc['_id'] = (string) $result->getInsertedId();
        $doc['createdAt'] = $doc['createdAt']->toDateTime()->format(DATE_ATOM);
        echo json_encode($doc);
    }

    /** GET /orders/track?phone=03xx — public: a customer looks up their own orders. */
    public static function track(): void
    {
        $phone = trim((string) ($_GET['phone'] ?? ''));
        if ($phone === '') {
            http_response_code(422);
            echo json_encode(['error' => 'Phone number is required.']);
            return;
        }
        $cursor = self::collection()->find(
            ['customerPhone' => $phone],
            ['sort' => ['createdAt' => -1]]
        );
        $out = [];
        foreach ($cursor as $doc) {
            $out[] = self::toArray($doc);
        }
        echo json_encode($out);
    }

    /** GET /orders — admin only: every order, newest first. */
    public static function index(): void
    {
        $cursor = self::collection()->find([], ['sort' => ['createdAt' => -1]]);
        $out = [];
        foreach ($cursor as $doc) {
            $out[] = self::toArray($doc);
        }
        echo json_encode($out);
    }

    /** PUT /orders/{id}/status — admin only: move an order to a new status. */
    public static function updateStatus(string $id): void
    {
        if (!preg_match('/^[a-f0-9]{24}$/i', $id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid order id.']);
            return;
        }
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = (string) ($body['status'] ?? '');
        if (!in_array($status, self::STATUSES, true)) {
            http_response_code(422);
            echo json_encode(['error' => 'Invalid status.']);
            return;
        }
        self::collection()->updateOne(
            ['_id' => new ObjectId($id)],
            ['$set' => ['status' => $status]]
        );
        echo json_encode(['success' => true, 'status' => $status]);
    }
}
