import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { Category, Product } from '../../core/models';
import { ProductCard } from '../../components/product-card';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ProductCard],
  template: `
    <section class="hero">
      <div class="container hero-inner">
        <div>
          <p class="eyebrow">New season · Curated picks</p>
          <h1>Everything you need,<br />in one dreamy shop.</h1>
          <p class="lede muted">
            Browse our catalogue, fill your cart and check out in seconds.
          </p>
          <a href="#catalogue" class="btn btn-primary btn-lg">Start shopping</a>
        </div>
        <div class="hero-art">🛍️</div>
      </div>
    </section>

    <div class="container page" id="catalogue">
      <div class="section-head">
        <div>
          <h1>Catalogue</h1>
          <p class="muted">{{ filtered().length }} products available</p>
        </div>
        <input
          class="input search"
          type="search"
          placeholder="Search products or brands…"
          [(ngModel)]="search"
        />
      </div>

      @if (categories().length) {
        <div class="chips">
          <button class="chip" [class.active]="!activeCategory()" (click)="activeCategory.set(null)">
            All
          </button>
          @for (c of categories(); track c.id) {
            <button
              class="chip"
              [class.active]="activeCategory() === c.name"
              (click)="activeCategory.set(c.name)"
            >
              {{ c.name }}
            </button>
          }
        </div>
      }

      @if (loading()) {
        <div class="spinner"></div>
      } @else if (filtered().length === 0) {
        <div class="empty-state">
          <div class="icon">📦</div>
          <h3>No products found</h3>
          <p>Try a different search or category.</p>
        </div>
      } @else {
        <div class="grid">
          @for (p of filtered(); track p.id) {
            <app-product-card [product]="p" (add)="addToCart(p)" />
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .hero {
        background: linear-gradient(135deg, #5b5bd6 0%, #7c5ce0 60%, #9d6ce0 100%);
        color: #fff;
      }
      .hero-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 56px 20px;
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.78rem;
        font-weight: 700;
        opacity: 0.85;
        margin: 0 0 10px;
      }
      .hero h1 {
        font-size: 2.6rem;
        line-height: 1.1;
        margin-bottom: 14px;
      }
      .lede {
        color: rgba(255, 255, 255, 0.85) !important;
        max-width: 420px;
        margin-bottom: 24px;
      }
      .hero .btn-primary {
        background: #fff;
        color: var(--primary-dark);
      }
      .hero .btn-primary:hover {
        background: #f1f1ff;
      }
      .hero-art {
        font-size: 9rem;
        filter: drop-shadow(0 14px 30px rgba(0, 0, 0, 0.25));
      }
      .search {
        max-width: 320px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 28px;
      }
      @media (max-width: 720px) {
        .hero-art {
          display: none;
        }
        .hero h1 {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  protected products = signal<Product[]>([]);
  protected categories = signal<Category[]>([]);
  protected loading = signal(true);
  protected search = signal('');
  protected activeCategory = signal<string | null>(null);

  protected filtered = computed(() => {
    const term = this.search().toLowerCase().trim();
    const cat = this.activeCategory();
    return this.products().filter((p) => {
      const matchesCat = !cat || p.category?.name === cat;
      const matchesTerm =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term);
      return matchesCat && matchesTerm;
    });
  });

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (p) => {
        this.products.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.productService.getCategories().subscribe({
      next: (c) => this.categories.set(c),
      error: () => {},
    });
  }

  addToCart(p: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please sign in to add items to your cart');
      return;
    }
    this.cart.addToCart(p.id, 1).subscribe({
      next: () => this.toast.success(`${p.name} added to cart`),
      error: (e) => this.toast.error(e?.error?.message ?? 'Could not add to cart'),
    });
  }
}
