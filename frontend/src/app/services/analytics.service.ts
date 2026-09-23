import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

export interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  avgOrderValue: number;
  byStatus: Record<string, number>;
  topItems: { name: string; qty: number; revenue: number }[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${API_BASE_URL}/analytics/summary`);
  }
}
