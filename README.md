<div align="center">

# 🛍️ Dream Shops

**A full-stack e-commerce application — Spring Boot REST API + Angular storefront.**

![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?logo=springboot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

</div>

---

## Overview

Dream Shops is a shopping platform with a secure REST backend and a modern single-page
frontend. Customers can browse a product catalogue, manage a cart, and place orders;
administrators can manage products and categories. Authentication is stateless, based on
JSON Web Tokens.

```
┌──────────────────────┐        HTTP + JWT        ┌──────────────────────────┐
│   Angular 21 (SPA)   │  ───────────────────────▶ │   Spring Boot REST API   │
│   localhost:4200     │ ◀───────────────────────  │   localhost:9191/api/v1  │
└──────────────────────┘        JSON               └────────────┬─────────────┘
                                                                 │ JPA / Hibernate
                                                                 ▼
                                                          ┌────────────┐
                                                          │   MySQL    │
                                                          └────────────┘
```

## Features

- 🔐 **JWT authentication & authorization** — stateless login, role-based access (`ROLE_USER`, `ROLE_ADMIN`)
- 🛒 **Cart** — add, update quantity, remove items, clear
- 📦 **Orders** — checkout from cart, automatic inventory deduction, order history
- 🗂️ **Catalogue** — products, categories, brand/name/category search
- 🖼️ **Images** — upload & download product images (stored as BLOBs)
- 🎨 **Responsive Angular storefront** — search, filtering, toasts, themed UI
- 🌱 **Seed data** — default users, roles and demo products created on first run

## Tech Stack

| Layer    | Technologies                                                       |
| -------- | ----------------------------------------------------------------- |
| Backend  | Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA, Hibernate |
| Auth     | JJWT (JSON Web Tokens), BCrypt password hashing                    |
| Database | MySQL 8                                                            |
| Mapping  | ModelMapper, Lombok                                                |
| Frontend | Angular 21 (standalone components, signals), TypeScript, SCSS, RxJS |

## Project Structure

```
dream-shops/
├── src/main/java/com/dailycodework/dreamshops/
│   ├── controllers/   REST endpoints
│   ├── service/       business logic (product, cart, order, user, image, category)
│   ├── repository/    Spring Data JPA repositories
│   ├── model/         JPA entities
│   ├── dto/           response DTOs
│   ├── request/       request payloads
│   ├── security/      JWT filter, config, user details
│   └── data/          DataInitializer (seed data)
├── src/main/resources/application.properties
├── frontend/          Angular storefront (see frontend/README.md)
└── pom.xml
```

## Getting Started

### Prerequisites

- JDK 17+
- Maven (or use the bundled `./mvnw` wrapper)
- MySQL 8 running locally
- Node 20+ and npm (for the frontend)

### 1. Database

Create the database (Hibernate creates the tables automatically via `ddl-auto=update`):

```sql
CREATE DATABASE dream_shops_db;
```

Update credentials in `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dream_shops_db
spring.datasource.username=root
spring.datasource.password=admin
```

> **Security note:** `auth.token.jwtSecret` in `application.properties` is a development
> secret. For production, override it (and the DB password) via environment variables and
> never commit real secrets.

### 2. Backend

```bash
./mvnw spring-boot:run
```

The API starts on **http://localhost:9191** with base path `/api/v1`.
On first launch it seeds default roles, users and demo products.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The storefront runs on **http://localhost:4200** (CORS is preconfigured for this origin).

## Demo Accounts

| Email              | Password | Role  |
| ------------------ | -------- | ----- |
| `user0@email.com`  | `123456` | USER  |
| `admin0@email.com` | `123456` | ADMIN |

(Users `user0..4`, admins `admin0..1` are seeded — all with password `123456`.)

## API Reference

Base URL: `http://localhost:9191/api/v1`

### Auth & Users

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| POST   | `/auth/login`         | —    | Log in, returns JWT      |
| POST   | `/users/add`          | —    | Register a new user      |
| GET    | `/users/{id}/user`    | —    | Get user (incl. cart)    |
| PUT    | `/users/{id}/update`  | —    | Update user              |
| DELETE | `/users/{id}/delete`  | —    | Delete user              |

### Products & Categories

| Method | Endpoint                                  | Auth  | Description             |
| ------ | ----------------------------------------- | ----- | ----------------------- |
| GET    | `/products/all`                           | —     | List all products       |
| GET    | `/products/product/{id}/product`          | —     | Get product by id       |
| POST   | `/products/add`                           | ADMIN | Add product             |
| PUT    | `/products/product/{id}/update`           | ADMIN | Update product          |
| DELETE | `/products/product/{id}/delete`           | ADMIN | Delete product          |
| GET    | `/products/products/{name}/products`      | —     | Search by name          |
| GET    | `/categories/all`                         | —     | List categories         |

### Cart & Orders

| Method | Endpoint                                          | Auth | Description           |
| ------ | ------------------------------------------------- | ---- | --------------------- |
| POST   | `/cartItems/item/add?productId=&quantity=`        | USER | Add item to cart      |
| PUT    | `/cartItems/{cartId}/item/{productId}/update`      | USER | Update item quantity  |
| DELETE | `/cartItems/{cartId}/item/{itemId}/remove`        | USER | Remove cart item      |
| GET    | `/carts/{cartId}/my-cart`                         | USER | Get cart              |
| DELETE | `/carts/{cartId}/clear`                           | USER | Clear cart            |
| POST   | `/orders/order?userId=`                           | USER | Place order           |
| GET    | `/orders/{userId}/orders`                         | USER | List user's orders    |

### Example: login

```bash
curl -X POST http://localhost:9191/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user0@email.com","password":"123456"}'
```

```jsonc
{
  "message": "Login successful",
  "data": { "id": 2, "token": "<jwt>" }
}
```

Use the token on protected calls: `Authorization: Bearer <jwt>`.

## Build

```bash
./mvnw clean package      # backend → target/dream-shops-*.jar
cd frontend && npm run build   # frontend → frontend/dist/
```

## License

This project is for learning/demonstration purposes.
