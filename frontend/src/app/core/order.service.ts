import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE } from './api';
import { ApiResponse, Order } from './models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  placeOrder(userId: number): Observable<Order> {
    const params = new HttpParams().set('userId', userId);
    return this.http
      .post<ApiResponse<Order>>(`${API_BASE}/orders/order`, null, { params })
      .pipe(map((r) => r.data));
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http
      .get<ApiResponse<Order[]>>(`${API_BASE}/orders/${userId}/orders`)
      .pipe(map((r) => r.data ?? []));
  }
}
