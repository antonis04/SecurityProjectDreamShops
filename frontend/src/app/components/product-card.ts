import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models';
import { imageUrl } from '../core/api';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <article class="card product">
      <a [routerLink]="['/product', product().id]" class="thumb">
        @if (img()) {
          <img [src]="img()" [alt]="product().name" />
        } @else {
          <div class="placeholder" [style.background]="gradient()">
            {{ product().name.charAt(0) }}
          </div>
        }
        @if (product().inventory <= 0) {
          <span class="sold-out">Sold out</span>
        }
      </a>
      <div class="body">
        <span class="brand">{{ product().brand }}</span>
        <a [routerLink]="['/product', product().id]" class="name">{{ product().name }}</a>
        <div class="foot">
          <span class="price">{{ product().price | currency }}</span>
          <button
            class="btn btn-primary add"
            [disabled]="product().inventory <= 0"
            (click)="add.emit()"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      .product {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .product:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow);
      }
      .thumb {
        position: relative;
        display: block;
        aspect-ratio: 4 / 3;
        background: var(--surface-2);
      }
      .thumb img {
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
        font-size: 3rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.9);
      }
      .sold-out {
        position: absolute;
        top: 10px;
        left: 10px;
        background: var(--danger);
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 999px;
      }
      .body {
        padding: 14px 16px 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }
      .brand {
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 700;
        color: var(--text-soft);
      }
      .name {
        font-weight: 600;
        font-size: 1rem;
        line-height: 1.3;
        min-height: 2.6em;
      }
      .name:hover {
        color: var(--primary);
      }
      .foot {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
      }
      .price {
        font-size: 1.1rem;
      }
      .add {
        padding: 7px 16px;
      }
    `,
  ],
})
export class ProductCard {
  product = input.required<Product>();
  add = output<void>();

  img(): string | null {
    return imageUrl(this.product().images?.[0]?.downloadUrl);
  }

  gradient(): string {
    const palettes = [
      'linear-gradient(135deg,#5b5bd6,#9d6ce0)',
      'linear-gradient(135deg,#ff7a59,#ffb36b)',
      'linear-gradient(135deg,#16a34a,#5be0a0)',
      'linear-gradient(135deg,#0ea5e9,#6cc5e0)',
      'linear-gradient(135deg,#d946ef,#f0abfc)',
    ];
    const n = this.product().name.charCodeAt(0) % palettes.length;
    return palettes[n];
  }
}
