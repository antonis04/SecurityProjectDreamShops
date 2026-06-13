import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { Product } from '../../core/models';
import { imageUrl } from '../../core/api';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="container page">
      <a routerLink="/" class="back muted">← Back to shop</a>

      @if (loading()) {
        <div class="spinner"></div>
      } @else if (product(); as p) {
        <div class="detail">
          <div class="media card">
            @if (img(p); as src) {
              <img [src]="src" [alt]="p.name" />
            } @else {
              <div class="placeholder">{{ p.name.charAt(0) }}</div>
            }
          </div>

          <div class="info">
            <span class="brand">{{ p.brand }}</span>
            <h1>{{ p.name }}</h1>
            @if (p.category) {
              <span class="pill pill-success">{{ p.category.name }}</span>
            }
            <p class="price">{{ p.price | currency }}</p>
            <p class="desc">{{ p.description || 'No description provided for this product.' }}</p>

            <p class="stock" [class.out]="p.inventory <= 0">
              @if (p.inventory > 0) {
                ● {{ p.inventory }} in stock
              } @else {
                ● Currently out of stock
              }
            </p>

            <div class="buy">
              <div class="qty">
                <button (click)="dec()" [disabled]="qty() <= 1">−</button>
                <span>{{ qty() }}</span>
                <button (click)="inc()" [disabled]="qty() >= p.inventory">+</button>
              </div>
              <button
                class="btn btn-primary btn-lg"
                [disabled]="p.inventory <= 0"
                (click)="addToCart(p)"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <div class="icon">🔍</div>
          <h3>Product not found</h3>
          <a routerLink="/" class="btn btn-ghost">Return to shop</a>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .back {
        display: inline-block;
        margin-bottom: 20px;
        font-weight: 600;
      }
      .detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
      }
      .media {
        overflow: hidden;
        aspect-ratio: 1;
        background: var(--surface-2);
      }
      .media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8rem;
        font-weight: 800;
        color: #fff;
        background: linear-gradient(135deg, #5b5bd6, #9d6ce0);
      }
      .info .brand {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
        font-size: 0.8rem;
        color: var(--text-soft);
      }
      .info h1 {
        font-size: 2rem;
        margin: 6px 0 12px;
      }
      .info .price {
        font-size: 1.8rem;
        margin: 18px 0;
      }
      .desc {
        color: var(--text-soft);
        line-height: 1.7;
      }
      .stock {
        font-weight: 600;
        color: var(--success);
        margin: 16px 0 24px;
      }
      .stock.out {
        color: var(--danger);
      }
      .buy {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .qty {
        display: flex;
        align-items: center;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        overflow: hidden;
      }
      .qty button {
        width: 42px;
        height: 46px;
        border: none;
        background: var(--surface);
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text);
      }
      .qty button:hover:not(:disabled) {
        background: var(--surface-2);
      }
      .qty button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .qty span {
        width: 44px;
        text-align: center;
        font-weight: 700;
      }
      @media (max-width: 760px) {
        .detail {
          grid-template-columns: 1fr;
          gap: 24px;
        }
      }
    `,
  ],
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  protected product = signal<Product | null>(null);
  protected loading = signal(true);
  protected qty = signal(1);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  img(p: Product): string | null {
    return imageUrl(p.images?.[0]?.downloadUrl);
  }

  inc(): void {
    this.qty.update((q) => q + 1);
  }
  dec(): void {
    this.qty.update((q) => Math.max(1, q - 1));
  }

  addToCart(p: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please sign in to add items to your cart');
      return;
    }
    this.cart.addToCart(p.id, this.qty()).subscribe({
      next: () => this.toast.success(`${this.qty()} × ${p.name} added to cart`),
      error: (e) => this.toast.error(e?.error?.message ?? 'Could not add to cart'),
    });
  }
}
