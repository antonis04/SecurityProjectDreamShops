import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { OrderService } from '../../core/order.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { CartItem } from '../../core/models';
import { imageUrl } from '../../core/api';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="container page">
      <div class="section-head">
        <h1>Your Cart</h1>
      </div>

      @if (loading()) {
        <div class="spinner"></div>
      } @else if (items().length === 0) {
        <div class="empty-state">
          <div class="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <a routerLink="/" class="btn btn-primary">Browse products</a>
        </div>
      } @else {
        <div class="layout">
          <div class="items">
            @for (item of items(); track itemId(item)) {
              <div class="card row">
                <div class="thumb">
                  @if (img(item); as src) {
                    <img [src]="src" [alt]="item.product.name" />
                  } @else {
                    <div class="ph">{{ item.product.name.charAt(0) }}</div>
                  }
                </div>
                <div class="meta">
                  <a [routerLink]="['/product', item.product.id]" class="name">{{
                    item.product.name
                  }}</a>
                  <span class="muted">{{ item.product.brand }}</span>
                  <span class="unit muted">{{ item.unitPrice | currency }} each</span>
                </div>
                <div class="qty">
                  <button (click)="changeQty(item, item.quantity - 1)" [disabled]="item.quantity <= 1">
                    −
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="changeQty(item, item.quantity + 1)">+</button>
                </div>
                <div class="line price">{{ item.unitPrice * item.quantity | currency }}</div>
                <button class="btn btn-danger remove" (click)="remove(item)">✕</button>
              </div>
            }
          </div>

          <aside class="summary card">
            <h3>Order summary</h3>
            <div class="line-item">
              <span class="muted">Items ({{ cart.count() }})</span>
              <span>{{ total() | currency }}</span>
            </div>
            <div class="line-item">
              <span class="muted">Shipping</span>
              <span>Free</span>
            </div>
            <div class="divider"></div>
            <div class="line-item total">
              <span>Total</span>
              <span class="price">{{ total() | currency }}</span>
            </div>
            <button class="btn btn-primary btn-block btn-lg" [disabled]="placing()" (click)="checkout()">
              {{ placing() ? 'Placing order…' : 'Checkout' }}
            </button>
            <button class="btn btn-ghost btn-block" (click)="clear()">Clear cart</button>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 28px;
        align-items: start;
      }
      .items {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .row {
        display: grid;
        grid-template-columns: 72px 1fr auto auto auto;
        align-items: center;
        gap: 16px;
        padding: 14px;
      }
      .thumb {
        width: 72px;
        height: 72px;
        border-radius: var(--radius-sm);
        overflow: hidden;
        background: var(--surface-2);
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .ph {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        font-weight: 800;
        color: #fff;
        background: linear-gradient(135deg, #5b5bd6, #9d6ce0);
      }
      .meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .meta .name {
        font-weight: 600;
      }
      .meta .name:hover {
        color: var(--primary);
      }
      .unit {
        font-size: 0.82rem;
      }
      .qty {
        display: flex;
        align-items: center;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        overflow: hidden;
      }
      .qty button {
        width: 32px;
        height: 36px;
        border: none;
        background: var(--surface);
        cursor: pointer;
        font-size: 1.1rem;
      }
      .qty button:hover:not(:disabled) {
        background: var(--surface-2);
      }
      .qty button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .qty span {
        width: 34px;
        text-align: center;
        font-weight: 700;
      }
      .line {
        min-width: 80px;
        text-align: right;
        font-size: 1rem;
      }
      .remove {
        padding: 6px 10px;
        font-size: 0.9rem;
      }
      .summary {
        padding: 22px;
        position: sticky;
        top: 84px;
      }
      .summary h3 {
        margin-bottom: 18px;
      }
      .line-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 0.95rem;
      }
      .line-item.total {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 4px 0 18px;
      }
      .divider {
        height: 1px;
        background: var(--border);
        margin: 8px 0 14px;
      }
      .summary .btn {
        margin-top: 8px;
      }
      @media (max-width: 820px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .row {
          grid-template-columns: 60px 1fr auto;
          grid-row-gap: 10px;
        }
        .thumb {
          width: 60px;
          height: 60px;
        }
        .line {
          grid-column: 2 / 3;
          text-align: left;
        }
        .remove {
          grid-column: 3;
        }
      }
    `,
  ],
})
export class CartPage implements OnInit {
  protected cart = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  protected loading = signal(true);
  protected placing = signal(false);

  protected items = computed(() => this.cart.cart()?.items ?? []);
  protected total = computed(() =>
    this.items().reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  );

  ngOnInit(): void {
    this.cart.loadCart().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  itemId(item: CartItem): number {
    return (item.itemId ?? item.id)!;
  }

  img(item: CartItem): string | null {
    return imageUrl(item.product.images?.[0]?.downloadUrl);
  }

  changeQty(item: CartItem, qty: number): void {
    if (qty < 1) return;
    this.cart.updateQuantity(item.product.id, qty).subscribe({
      error: (e) => this.toast.error(e?.error?.message ?? 'Could not update quantity'),
    });
  }

  remove(item: CartItem): void {
    this.cart.removeItem(this.itemId(item)).subscribe({
      next: () => this.toast.show('Item removed'),
      error: (e) => this.toast.error(e?.error?.message ?? 'Could not remove item'),
    });
  }

  clear(): void {
    this.cart.clear().subscribe({
      next: () => this.toast.show('Cart cleared'),
      error: (e) => this.toast.error(e?.error?.message ?? 'Could not clear cart'),
    });
  }

  checkout(): void {
    const userId = this.auth.userId();
    if (!userId) return;
    this.placing.set(true);
    this.orderService.placeOrder(userId).subscribe({
      next: () => {
        this.placing.set(false);
        this.cart.reset();
        this.toast.success('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (e) => {
        this.placing.set(false);
        this.toast.error(e?.error?.message ?? 'Could not place order');
      },
    });
  }
}
