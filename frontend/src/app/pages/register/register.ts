import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="card auth-card">
        <h1>Create your account</h1>
        <p class="muted sub">Join Dream Shops in a few seconds.</p>

        <form (ngSubmit)="submit()">
          <div class="two">
            <div class="field">
              <label for="first">First name</label>
              <input id="first" class="input" name="first" [(ngModel)]="firstName" required />
            </div>
            <div class="field">
              <label for="last">Last name</label>
              <input id="last" class="input" name="last" [(ngModel)]="lastName" required />
            </div>
          </div>
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
            {{ loading() ? 'Creating…' : 'Create account' }}
          </button>
        </form>

        <p class="alt muted">Already have an account? <a routerLink="/login">Sign in</a></p>
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
        max-width: 440px;
        padding: 36px;
      }
      .auth-card h1 {
        font-size: 1.7rem;
      }
      .sub {
        margin: 0 0 24px;
      }
      .two {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
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
    `,
  ],
})
export class Register {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  protected firstName = signal('');
  protected lastName = signal('');
  protected email = signal('');
  protected password = signal('');
  protected loading = signal(false);

  submit(): void {
    if (!this.firstName() || !this.lastName() || !this.email() || !this.password()) return;
    this.loading.set(true);
    this.auth
      .register({
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          this.toast.success('Account created — please sign in');
          this.router.navigate(['/login']);
        },
        error: (e) => {
          this.loading.set(false);
          this.toast.error(e?.error?.message ?? 'Could not create account');
        },
      });
  }
}
