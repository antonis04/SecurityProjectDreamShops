import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE } from './api';
import { ApiResponse, Category, Product } from './models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${API_BASE}/products/all`)
      .pipe(map((r) => r.data ?? []));
  }

  getById(id: number): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${API_BASE}/products/product/${id}/product`)
      .pipe(map((r) => r.data));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<ApiResponse<Category[]>>(`${API_BASE}/categories/all`)
      .pipe(map((r) => r.data ?? []));
  }
}
