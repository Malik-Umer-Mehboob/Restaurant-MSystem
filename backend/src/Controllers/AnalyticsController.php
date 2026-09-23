<?php

namespace App\Controllers;

use App\Database;
use MongoDB\BSON\UTCDateTime;

class AnalyticsController
{
    /** GET /analytics/summary — admin only. */
    public static function summary(): void
    {
        $orders = Database::get()->selectCollection('orders');

        $totalOrders = $orders->countDocuments();
        $revenueAgg = $orders->aggregate([
            ['$match' => ['status' => ['$ne' => 'cancelled']]],
            ['$group' => ['_id' => null, 'total' => ['$sum' => '$total']]],
        ]);
        $totalRevenue = 0;
        foreach ($revenueAgg as $row) { $totalRevenue = $row['total']; }

        // Orders placed today (server timezone).
        $startOfDay = new UTCDateTime(strtotime('today midnight') * 1000);
        $todayCount = $orders->countDocuments(['createdAt' => ['$gte' => $startOfDay]]);

        // Orders grouped by status.
        $statusAgg = $orders->aggregate([
            ['$group' => ['_id' => '$status', 'count' => ['$sum' => 1]]],
        ]);
        $byStatus = [];
        foreach ($statusAgg as $row) { $byStatus[$row['_id']] = $row['count']; }

        // Best-selling items by quantity across all orders.
        $topItemsAgg = $orders->aggregate([
            ['$unwind' => '$items'],
            ['$group' => [
                '_id' => '$items.name',
                'qty' => ['$sum' => '$items.qty'],
                'revenue' => ['$sum' => ['$multiply' => ['$items.qty', '$items.price']]],
            ]],
            ['$sort' => ['qty' => -1]],
            ['$limit' => 5],
        ]);
        $topItems = [];
        foreach ($topItemsAgg as $row) {
            $topItems[] = ['name' => $row['_id'], 'qty' => $row['qty'], 'revenue' => $row['revenue']];
        }

        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 0) : 0;

        echo json_encode([
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'todayOrders' => $todayCount,
            'avgOrderValue' => $avgOrderValue,
            'byStatus' => $byStatus,
            'topItems' => $topItems,
        ]);
    }
}
