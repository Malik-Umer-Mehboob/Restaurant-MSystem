import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

export interface OrderLine { name: string; price: number; qty: number; }

export interface Order {
  _id?: string;
  customerName: string;
  customerPhone: string;
  items: OrderLine[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  create(order: { customerName: string; customerPhone: string; items: OrderLine[] }): Observable<Order> {
    return this.http.post<Order>(`${API_BASE_URL}/orders`, order);
  }

  track(phone: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_BASE_URL}/orders/track`, { params: { phone } });
  }

  // Admin only (token attached automatically by the auth interceptor).
  listAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_BASE_URL}/orders`);
  }

  updateStatus(id: string, status: Order['status']): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${API_BASE_URL}/orders/${id}/status`, { status });
  }
}
