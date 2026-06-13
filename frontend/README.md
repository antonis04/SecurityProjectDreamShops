# Dream Shops — Frontend

An Angular 21 storefront for the Dream Shops Spring Boot API.

## Features

- Product catalogue with search and category filtering
- Product detail pages with quantity selector
- JWT authentication (login / register) with auto-attached bearer token
- Shopping cart: add, update quantity, remove, clear
- Checkout (place order) and order history
- Responsive, themed UI with toast notifications

## Prerequisites

- Node 20+ and npm
- The backend running on `http://localhost:9191` (CORS is configured for `http://localhost:4200`)

## Run

```bash
npm install      # first time only
npm start        # serves on http://localhost:4200
```

## Demo accounts (seeded by the backend)

| Email             | Password | Role  |
| ----------------- | -------- | ----- |
| user0@email.com   | 123456   | USER  |
| admin0@email.com  | 123456   | ADMIN |

## Configuration

The API base URL lives in `src/app/core/api.ts`. Change `API_BASE` if your
backend runs on a different host/port.

## Structure

```
src/app/
  core/        services, models, interceptor, guard
  components/  navbar, product-card
  pages/       home, product-detail, cart, orders, login, register
```
