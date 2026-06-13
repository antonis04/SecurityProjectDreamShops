import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { ToastService } from './core/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <footer class="footer">
      <div class="container">
        <span>Dream Shops</span>
        <span class="muted">Built with Angular · Spring Boot</span>
      </div>
    </footer>

    <div class="toast-wrap">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class.success]="t.type === 'success'" [class.error]="t.type === 'error'">
          {{ t.text }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      main {
        min-height: calc(100vh - 64px - 70px);
      }
      .footer {
        border-top: 1px solid var(--border);
        background: var(--surface);
        padding: 24px 0;
      }
      .footer .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }
    `,
  ],
})
export class App {
  protected readonly toast = inject(ToastService);
}
