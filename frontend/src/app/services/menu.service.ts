import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

export interface MenuItem {
  _id?: string;
  name: string;
  urdu: string;
  category: string;
  description: string;
  price: number;
  tags: string[];       // e.g. ['hot'], ['spicy'], ['hot','spicy']
  image?: string;        // relative path returned by the upload endpoint, e.g. /uploads/abc.jpg
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) {}

  // Public: anyone can read the menu, no login required.
  getMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${API_BASE_URL}/menu`);
  }

  // Admin-only endpoints below (the backend checks the Authorization header).
  createItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${API_BASE_URL}/menu`, item);
  }

  updateItem(id: string, item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${API_BASE_URL}/menu/${id}`, item);
  }

  deleteItem(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${API_BASE_URL}/menu/${id}`);
  }

  uploadImage(file: File): Observable<{ path: string }> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ path: string }>(`${API_BASE_URL}/upload`, form);
  }
}
