import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { API_BASE } from './api';
import { ApiResponse, Cart, UserDto } from './models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  readonly cart = signal<Cart | null>(null);
  readonly count = computed(() =>
    (this.cart()?.items ?? []).reduce((sum, i) => sum + i.quantity, 0),
  );

  cartId(): number | undefined {
    const c = this.cart();
    return c?.cartId ?? c?.id;
  }

  /** Loads the authenticated user's cart from the user resource. */
  loadCart(): Observable<Cart | null> {
    const userId = this.auth.userId();
    if (!userId) {
      this.cart.set(null);
      return of(null);
    }
    return this.http
      .get<ApiResponse<UserDto>>(`${API_BASE}/users/${userId}/user`)
      .pipe(
        map((r) => r.data?.cart ?? null),
        tap((cart) => this.cart.set(cart)),
      );
  }

  addToCart(productId: number, quantity: number): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('productId', productId)
      .set('quantity', quantity);
    return this.http
      .post<ApiResponse>(`${API_BASE}/cartItems/item/add`, null, { params })
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  updateQuantity(productId: number, quantity: number): Observable<ApiResponse> {
    const cartId = this.cartId();
    const params = new HttpParams().set('quantity', quantity);
    return this.http
      .put<ApiResponse>(
        `${API_BASE}/cartItems/${cartId}/item/${productId}/update`,
        null,
        { params },
      )
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  removeItem(itemId: number): Observable<ApiResponse> {
    const cartId = this.cartId();
    return this.http
      .delete<ApiResponse>(`${API_BASE}/cartItems/${cartId}/item/${itemId}/remove`)
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  clear(): Observable<ApiResponse> {
    const cartId = this.cartId();
    return this.http
      .delete<ApiResponse>(`${API_BASE}/carts/${cartId}/clear`)
      .pipe(tap(() => this.cart.set(null)));
  }

  reset(): void {
    this.cart.set(null);
  }
}
