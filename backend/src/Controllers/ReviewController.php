<?php

namespace App\Controllers;

use App\Database;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

class ReviewController
{
    private static function collection()
    {
        return Database::get()->selectCollection('reviews');
    }

    /** GET /menu/{itemId}/reviews — all reviews for one dish, newest first. */
    public static function index(string $itemId): void
    {
        $cursor = self::collection()->find(
            ['itemId' => $itemId],
            ['sort' => ['createdAt' => -1]]
        );
        $out = [];
        foreach ($cursor as $doc) {
            $arr = (array) $doc;
            $arr['_id'] = (string) $arr['_id'];
            $arr['createdAt'] = isset($arr['createdAt']) ? $arr['createdAt']->toDateTime()->format(DATE_ATOM) : null;
            $out[] = $arr;
        }
        echo json_encode($out);
    }

    /** POST /menu/{itemId}/reviews — a customer submits a rating (1-5) and optional comment. No login needed. */
    public static function create(string $itemId): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $rating = (int) ($body['rating'] ?? 0);
        $name = trim((string) ($body['name'] ?? 'Anonymous'));
        $comment = trim((string) ($body['comment'] ?? ''));

        if ($rating < 1 || $rating > 5) {
            http_response_code(422);
            echo json_encode(['error' => 'Rating must be between 1 and 5.']);
            return;
        }

        $doc = [
            'itemId' => $itemId,
            'name' => $name !== '' ? $name : 'Anonymous',
            'rating' => $rating,
            'comment' => $comment,
            'createdAt' => new UTCDateTime(),
        ];
        $result = self::collection()->insertOne($doc);
        $doc['_id'] = (string) $result->getInsertedId();
        $doc['createdAt'] = $doc['createdAt']->toDateTime()->format(DATE_ATOM);
        echo json_encode($doc);
    }

    /** GET /reviews/summary — {itemId: {avg, count}} for every dish that has reviews. */
    public static function summary(): void
    {
        $pipeline = [
            ['$group' => [
                '_id' => '$itemId',
                'avg' => ['$avg' => '$rating'],
                'count' => ['$sum' => 1],
            ]],
        ];
        $result = self::collection()->aggregate($pipeline);
        $out = [];
        foreach ($result as $row) {
            $out[$row['_id']] = [
                'avg' => round($row['avg'], 1),
                'count' => $row['count'],
            ];
        }
        echo json_encode($out);
    }
}
