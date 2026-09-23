import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

export interface Review {
  _id?: string;
  itemId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface RatingSummary {
  avg: number;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  // {itemId: {avg, count}} for every dish that has at least one review.
  getSummary(): Observable<Record<string, RatingSummary>> {
    return this.http.get<Record<string, RatingSummary>>(`${API_BASE_URL}/reviews/summary`);
  }

  getReviews(itemId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_BASE_URL}/menu/${itemId}/reviews`);
  }

  submitReview(itemId: string, review: { name: string; rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${API_BASE_URL}/menu/${itemId}/reviews`, review);
  }
}
