import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/order.service';
import { AuthService } from '../../core/auth.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: `
    <div class="container page">
      <div class="section-head">
        <h1>Your Orders</h1>
      </div>

      @if (loading()) {
        <div class="spinner"></div>
      } @else if (orders().length === 0) {
        <div class="empty-state">
          <div class="icon">🧾</div>
          <h3>No orders yet</h3>
          <p>When you place an order it will show up here.</p>
          <a routerLink="/" class="btn btn-primary">Start shopping</a>
        </div>
      } @else {
        <div class="orders">
          @for (order of orders(); track orderId(order)) {
            <div class="card order">
              <div class="head">
                <div>
                  <span class="muted label">Order</span>
                  <strong>#{{ orderId(order) }}</strong>
                </div>
                <div>
                  <span class="muted label">Date</span>
                  <strong>{{ order.orderDate | date: 'mediumDate' }}</strong>
                </div>
                <div>
                  <span class="muted label">Status</span>
                  <span class="pill" [class]="statusClass(order.status)">{{ order.status }}</span>
                </div>
                <div class="total">
                  <span class="muted label">Total</span>
                  <span class="price">{{ order.totalAmount | currency }}</span>
                </div>
              </div>
              <div class="lines">
                @for (item of order.items; track item.productId) {
                  <div class="line">
                    <span class="qty-tag">{{ item.quantity }}×</span>
                    <span class="pname">{{ item.productName }}</span>
                    <span class="muted">{{ item.productBrand }}</span>
                    <span class="lp">{{ item.price * item.quantity | currency }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .orders {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .order {
        padding: 0;
        overflow: hidden;
      }
      .head {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
        align-items: center;
        padding: 18px 22px;
        background: var(--surface-2);
        border-bottom: 1px solid var(--border);
      }
      .head .label {
        display: block;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 2px;
      }
      .head .total {
        margin-left: auto;
        text-align: right;
      }
      .head .price {
        font-size: 1.2rem;
      }
      .lines {
        padding: 8px 22px 14px;
      }
      .line {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px dashed var(--border);
      }
      .line:last-child {
        border-bottom: none;
      }
      .qty-tag {
        font-weight: 700;
        color: var(--primary);
        min-width: 32px;
      }
      .pname {
        font-weight: 600;
      }
      .lp {
        margin-left: auto;
        font-weight: 600;
      }
    `,
  ],
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);

  protected orders = signal<Order[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    const userId = this.auth.userId();
    if (!userId) {
      this.loading.set(false);
      return;
    }
    this.orderService.getUserOrders(userId).subscribe({
      next: (o) => {
        this.orders.set(o.sort((a, b) => this.orderId(b) - this.orderId(a)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  orderId(o: Order): number {
    return (o.id ?? o.orderId)!;
  }

  statusClass(status: string): string {
    return status?.toUpperCase() === 'PENDING' ? 'pill-pending' : 'pill-success';
  }
}
