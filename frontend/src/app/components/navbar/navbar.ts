import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <div class="container nav-inner">
        <a routerLink="/" class="brand">
          <span class="logo">◆</span> Dream<span>Shops</span>
        </a>

        <nav class="links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
            >Shop</a
          >
          @if (auth.isLoggedIn()) {
            <a routerLink="/orders" routerLinkActive="active">Orders</a>
          }
        </nav>

        <div class="actions">
          <a routerLink="/cart" class="cart-btn" aria-label="Cart">
            🛒
            @if (cart.count() > 0) {
              <span class="badge">{{ cart.count() }}</span>
            }
          </a>

          @if (auth.isLoggedIn()) {
            <span class="user-chip">{{ auth.email() }}</span>
            <button class="btn btn-ghost" (click)="logout()">Logout</button>
          } @else {
            <a routerLink="/login" class="btn btn-ghost">Sign in</a>
            <a routerLink="/register" class="btn btn-primary">Sign up</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .nav {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border);
      }
      .nav-inner {
        height: 64px;
        display: flex;
        align-items: center;
        gap: 28px;
      }
      .brand {
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .brand span {
        color: var(--primary);
      }
      .brand .logo {
        color: var(--accent);
        font-size: 1.1rem;
      }
      .links {
        display: flex;
        gap: 20px;
      }
      .links a {
        font-weight: 600;
        color: var(--text-soft);
        padding: 6px 0;
        border-bottom: 2px solid transparent;
      }
      .links a:hover,
      .links a.active {
        color: var(--text);
        border-color: var(--primary);
      }
      .actions {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .cart-btn {
        position: relative;
        font-size: 1.3rem;
        line-height: 1;
        padding: 4px;
      }
      .cart-btn .badge {
        position: absolute;
        top: -4px;
        right: -8px;
      }
      .user-chip {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-soft);
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      @media (max-width: 640px) {
        .user-chip {
          display: none;
        }
        .nav-inner {
          gap: 16px;
        }
      }
    `,
  ],
})
export class Navbar implements OnInit {
  protected auth = inject(AuthService);
  protected cart = inject(CartService);
  private toast = inject(ToastService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.cart.loadCart().subscribe({ error: () => {} });
    }
  }

  logout(): void {
    this.auth.logout();
    this.cart.reset();
    this.toast.show('Signed out');
    this.router.navigate(['/']);
  }
}
