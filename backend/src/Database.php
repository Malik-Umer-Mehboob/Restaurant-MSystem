<?php

namespace App;

use MongoDB\Client;
use MongoDB\Database as MongoDatabase;

class Database
{
    private static ?MongoDatabase $db = null;

    public static function get(): MongoDatabase
    {
        if (self::$db === null) {
            $uri = $_ENV['MONGODB_URI'] ?? 'mongodb://127.0.0.1:27017';
            $dbName = $_ENV['MONGODB_DB'] ?? 'shahi_angaar';
            $client = new Client($uri);
            self::$db = $client->selectDatabase($dbName);
        }
        return self::$db;
    }
}
