import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="card auth-card">
        <h1>Welcome back</h1>
        <p class="muted sub">Sign in to continue shopping.</p>

        <form (ngSubmit)="submit()">
          <div class="field">
            <label for="email">Email</label>
            <input id="email" class="input" type="email" name="email" [(ngModel)]="email" required />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              class="input"
              type="password"
              name="password"
              [(ngModel)]="password"
              required
            />
          </div>
          <button class="btn btn-primary btn-block btn-lg" type="submit" [disabled]="loading()">
            {{ loading() ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="alt muted">
          New here? <a routerLink="/register">Create an account</a>
        </p>
        <p class="hint muted">Demo: user0&#64;email.com / 123456</p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-wrap {
        display: flex;
        justify-content: center;
        padding: 60px 20px;
      }
      .auth-card {
        width: 100%;
        max-width: 400px;
        padding: 36px;
      }
      .auth-card h1 {
        font-size: 1.7rem;
      }
      .sub {
        margin: 0 0 24px;
      }
      .alt {
        text-align: center;
        margin-top: 20px;
        font-size: 0.92rem;
      }
      .alt a {
        color: var(--primary);
        font-weight: 600;
      }
      .hint {
        text-align: center;
        font-size: 0.8rem;
        margin-top: 8px;
      }
    `,
  ],
})
export class Login {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected email = signal('');
  protected password = signal('');
  protected loading = signal(false);

  submit(): void {
    if (!this.email() || !this.password()) return;
    this.loading.set(true);
    this.auth.login(this.email(), this.password()).subscribe({
      next: () => {
        this.cart.loadCart().subscribe({ error: () => {} });
        this.toast.success('Signed in');
        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/';
        this.router.navigateByUrl(redirect);
      },
      error: (e) => {
        this.loading.set(false);
        this.toast.error(e?.error?.message ?? 'Invalid email or password');
      },
    });
  }
}
